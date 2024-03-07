const evalProcess = require('./validators/eval.js');
const axios = require('axios');
const Bull = require('bull');
const REDIS_PORT = 6379;

if (process.argv.length < 3) {
    console.error('Please specify the file to run.');
    process.exit(1);
} else if (process.argv.length > 4) {
    console.error(`Not recognized ${process.argv.slice(5)}.`);
    process.exit(1);
}

if (process.argv[2] !== 'queue1' && process.argv[2] !== 'queue2') {
    console.error(`Queue not recognized ${process.argv[2]}. Please specify queue1 or queue2 only.`);
    process.exit(1);
}

const queue = process.argv[2];
let timeout = 1000;
if (process.argv.length === 4) {
    if (typeof(Number(process.argv[3])) !== 'number') {
        console.error(`Please specify timeout using a numeric value to indicate number of seconds.`);
        process.exit(1);
    } else {
        timeout *= Number(process.argv[3]);
    }
}

class QueueHandler {
    redis = { redis: { port: REDIS_PORT, host: '127.0.0.1' } };
    inspectionInterval;
    constructor() {
        this.queue = new Bull(queue, this.redis);
        this.dequeued = new Bull('dequeued', this.redis);
    }

    async inspect() {
        try {
            const jobs = await this.queue.getWaiting();
            const memoryResponse = await axios.get('http://localhost:3001/memory');
            const { memory } = memoryResponse.data;
            if (jobs.length && jobs[0].data && memory > jobs[0].data.input.length) {
                await axios.post('http://localhost:3001/memory', { value: -jobs[0].data.input.length })
                    .then((response) => {
                        this.queue.process(async (job) => {
                            const output = await evalProcess(job, timeout);
                            this.dequeued.add(output, {});
                            console.log(queue, output);
                        });
                    })
                    .catch((error) => {
                        console.error('Error updating memory:', error);
                    })
                    .finally(async () => {
                        await axios.post('http://localhost:3001/memory', { value: jobs[0].data.input.length });
                    });
            }
        } catch (error) {
            console.error('Error peeking at next job:', error);
        }
    }

    startInspection(interval) {
        console.log(`Starting inspection on ${queue} ...`);
        this.inspectionInterval = setInterval(() => {
            this.inspect();
        }, interval);
    }

    async stopInspection() {
        console.log(`Stopping inspection on ${queue} ...`);
        clearInterval(this.inspectionInterval);
    }
}

const queueHandler = new QueueHandler();
queueHandler.startInspection(1000);

process.on('SIGINT', () => queueHandler.stopInspection().then(() => process.exit(0)));
process.on('SIGTERM', () => queueHandler.stopInspection().then(() => process.exit(0)));
