const InputService = require('./input');
const floodInput = require('./dummy-client');

const inputService = new InputService();
inputService.main();

floodInput(inputService);