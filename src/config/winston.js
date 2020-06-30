import winston from 'winston';
import './env';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
	  winston.format.colorize(),
	  winston.format.json()
  )
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
	format: winston.format.simple(),
  }));
}

export default logger;
