import next from 'next';
import express from 'express';
import FHIRClient from './fhir/client';
import morgan from 'morgan';
import { patientRouter } from './routers';

const app = next({ dev: process.env.NODE_ENV === 'development' });
const requestHandler = app.getRequestHandler();

process.on('uncaughtException', console.error);

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.prepare().then(async () => {
	const server = express();

	server.next = app;
	server.fhirClient = new FHIRClient({
		userId: process.env.APP_USER_ID,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET
	});

	server.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

	server.use('/patients', patientRouter);

	server.get('/', (req, res) => {
		res.redirect('/patients');
	});

	server.all('*', requestHandler);

	server.use((err, req, res, next) => {
		console.error(err);
		res.sendStatus(500);
	});

	await server.fhirClient.authenticate();
	server.listen(process.env.SERVER_PORT, () => console.info(`listening on port ${process.env.SERVER_PORT}`));
});
