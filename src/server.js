import next from 'next';
import express from 'express';
import FHIRClient from './fhir/client';
import logger from './config/winston';
import { patientRouter } from './routers';

const app = next({ dev: process.env.NODE_ENV === 'development' });
const requestHandler = app.getRequestHandler();

process.on('uncaughtException', logger.error);

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.prepare().then(async () => {
	const server = express();

	server.next = app;
	server.fhirClient = new FHIRClient({
		userId: process.env.APP_USER_ID,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET
	});

	server.use('/patients', patientRouter);

	server.get('/', (req, res) => {
		res.redirect('/patients');
	});

	server.all('*', requestHandler);

	server.use((err, req, res, next) => {
		logger.error(err);
		res.sendStatus(500);
	});

	await server.fhirClient.authenticate();
	server.listen(process.env.SERVER_PORT, () => logger.info(`listening on port ${process.env.SERVER_PORT}`));
}).catch(err => {
	logger.error('Failed to start server');
	logger.error(err);
});
