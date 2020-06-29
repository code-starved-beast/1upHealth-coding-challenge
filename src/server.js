const next = require('next');
const express = require('express');

const app = next({ dev: process.env.NODE_ENV === 'development' });
const requestHandler = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.all('*', requestHandler);

    server.listen(process.env.SERVER_PORT);
});
