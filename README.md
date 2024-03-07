# This project is a demonstration of a System Design architecture

In order to successfully run this application, following installations are required:
1. ```node```
2. ```psql```
3. ```redis```
   
After downloading this project to a local machine

```gh repo clone victoriatarane/HydroX```

it is necessary to install dependencies

``` npm install ```

Additionally, this project requires a PostgreSQL database setup:

```CREATE DATABASE hydrox;```

Username: Vic

Password: ''

```CREATE TABLE evaluation (   id BIGSERIAL NOT NULL PRIMARY KEY,   input VARCHAR(50) NOT NULL,   output VARCHAR(50),   date_in TIMESTAMP NOT NULL,   date_out TIMESTAMP   );```

To run this project you will need to open at least 3 terminals and run the following in each of them:

1. ```node input.js```;
2. ```node ./machine/process.js```
3. ```node ./machine/run-validators.js queue1 1```

Third command contains 2 input arguments indicating the name of queue we want to access (`queue1` for strings up to 8 characters long and `queue2` for strings between 8 and 32 characters long) and the desired delay simulation for the given evaluation simulation. We can open additional terminals running different combinations of command #3 simultaniously. Maximum capacity of the machine is 62 characters, ensuring that full capacity is never met. Timeout parameter is optional, if not passed it will default to 1 second delay.

Once the program is running you can input a string below 32 characters long into the first terminal and observe a simulation of a time consuming evaluation queue being distributed across four processors with limited capacity ensuring we don't reach the maximum capacity.
