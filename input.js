const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const readline = require('readline');
const Bull = require('bull');


class InputService {
    // ports
    SERVER_PORT = 3000;
    REDIS_PORT = 6379;
    SQL_PORT = 5432;
    redis = { redis: { port: this.REDIS_PORT, host: '127.0.0.1' } };
    
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());

        // DB client handling for multiple queries
        this.pool = new Pool({
            user: 'Vic',
            host: 'localhost',
            database: 'hydrox',
            port: this.SQL_PORT
        });
        
        // Queues
        this.queue1 = new Bull('queue1', this.redis);
        this.queue2 = new Bull('queue2', this.redis);
        this.dequeued = new Bull('dequeued', this.redis);

        // Input and output handling
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    enqueueInput(input, id, date_in) {
        const inputData = { id: id, input: input, date_in: date_in };
        const queue = input.length <= 8 ? this.queue1 : this.queue2;
        queue.add(inputData, {});
    }

    inputPrompt() {
        this.rl.question('Enter test data: ', async (test_data) => {
            const date_in = new Date().toISOString().slice(0, 19).replace('T', ' ');
            this.pool.query('INSERT INTO evaluation (input, date_in) VALUES ($1, $2) RETURNING *', [test_data, date_in], (error, results) => {
                if (error) {
                    console.error('Error executing PostgreSQL query:', error);
                } else {
                    this.enqueueInput(test_data, results.rows[0].id, date_in);
                }
                this.inputPrompt();
            });
        });
    }

    // Start the server
    async startServer() {
        return new Promise((resolve) => {
            this.app.listen(this.SERVER_PORT, () => {
                console.log(`Input service listening at http://localhost:${this.SERVER_PORT}`);
                resolve();
            });
        });
    }

    async dequeue() {
        try {
            const jobs = await this.dequeued.getWaiting();
            if (jobs.length && jobs[0].data) {
                this.dequeued.process(async (job) => {
                    const result = job.data;
                    await this.pool.query(
                        'UPDATE evaluation SET output = $1, date_out = $2 WHERE id = $3 AND output IS NULL',
                        [result.output, result.date_out, result.id]
                    );
                });
            }
        } catch (error) {
            console.error('Error peeking at next job:', error);
        }
    }

    // Start the server and prompt the user for input
    async main() {
        await this.startServer();
        this.inputPrompt();
        setInterval(() => {
            this.dequeue();
        }, 1000);
    }
}

const inputService = new InputService();
inputService.main();

module.exports = InputService;
