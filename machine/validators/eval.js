function evaluateSafety(test_data, timeout) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = test_data.split('').reverse().join('');
            resolve(result);
        }, timeout);
    });
}

async function evalProcess(job, timeout) {
    const output = await evaluateSafety(job.data.input, timeout);
    const date_out = new Date().toISOString().slice(0, 19).replace('T', ' ');
    return {
        id: job.data.id,
        input: job.data.input,
        output: output,
        date_in: job.data.date_in,
        date_out: date_out
    };
}

module.exports = evalProcess;
