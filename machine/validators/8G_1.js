let { memory, updateMemory } = require('../process');
const Bull = require('bull');

const REDIS_PORT = 6379;

class QueueHandler {
    redis = { redis: { port: REDIS_PORT, host: '127.0.0.1' } };
    constructor() {
        this.queue1 = new Bull('queue1', this.redis);
        this.dequeued = new Bull('dequeued', this.redis);
    }

    async inspect() {
        try {
            const jobs = await this.queue1.getWaiting();
            if (jobs.length && jobs[0].data && memory > jobs[0].data.input.length && 8 > jobs[0].data.input.length) {
                updateMemory(-8);
                this.queue1.process(async (job) => {
                    const output = await this.evalProcess(job);
                    this.dequeued.add(output, {});
                    console.log(output);
                    updateMemory(8);
                });
            }
        } catch (error) {
            console.error('Error peeking at next job:', error);
        }
    }

    evaluateSafety(test_data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = test_data.split('').reverse().join('');
                resolve(result);
            }, 4000); // 4 seconds
        });
    }

    async evalProcess(job) {
        const output = await this.evaluateSafety(job.data.input);
        const date_out = new Date().toISOString().slice(0, 19).replace('T', ' ');
        return {
            id: job.data.id,
            input: job.data.input,
            output: output,
            date_in: job.data.date_in,
            date_out: date_out
        };
    }

    startInspection(interval) {
        setInterval(() => {
            this.inspect();
        }, interval);
    }
}


const queueHandler = new QueueHandler();
queueHandler.startInspection(2000); 