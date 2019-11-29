/* eslint-disable no-console */
import express from 'express';
import chalk from 'chalk';
import socket from 'socket.io';
import http from 'http';

import constants from './config/constants';
import middlewaresConfig from './config/middleware';
import ApiRoutes from './routes';

const app = express();
const server = http.Server(app);
const io = socket(server);

middlewaresConfig(app, io);

app.use('/', ApiRoutes);

server.listen(constants.PORT, err => {
	if (err) {
		throw err;
	} else {
		console.log(
			chalk.green.bold(`Server started. Listen on port: ${constants.PORT}.`)
		);
	}
});
