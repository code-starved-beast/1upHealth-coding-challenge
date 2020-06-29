const next = require('next');
const express = require('express');
const { asyncMiddlewareWrapper } = require('./util');
const FHIRClient = require('./fhir-client');

const app = next({ dev: process.env.NODE_ENV === 'development' });
const requestHandler = app.getRequestHandler();

process.on('uncaughtException', console.error);

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.prepare().then(async () => {
    const server = express();

    const fhirClient = new FHIRClient({
        userId: process.env.APP_USER_ID,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    await fhirClient.authenticate();
    server.fhirClient = fhirClient;

    server.get('/patients/:id', asyncMiddlewareWrapper(async (req, res) => {
        const patient = await req.app.fhirClient.getEverythingForPatient(req.params.id);
        res.send(patient)
    }));

    server.all('*', requestHandler);

    server.use((err, req, res, next) => {
        console.error(err);
        res.send(500);
    })

    server.listen(process.env.SERVER_PORT, () => console.log(`listening on port ${process.env.SERVER_PORT}`));
});
