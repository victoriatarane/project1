const { spawn } = require('child_process');
const p = require('./process.js');

if (process.argv.length < 3) {
    console.error('Please specify the file to run.');
    process.exit(1);
}

// Extract the file name from the command argument
const files = process.argv.slice(2).map(file => {
    return require(`./validators/${file}.js`);
})

function runProcess(filePath) {
    const process = spawn('node', filePath);

    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

runProcess(p);
files.forEach(filePath => {
    console.log(filePath);
    runProcess(filePath);
});
