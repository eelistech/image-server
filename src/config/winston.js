import winston from 'winston';

const logger = new winston.createLogger({
	transports: [new winston.transports.Console()],
});

export default logger;
