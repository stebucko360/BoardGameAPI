const express = require('express');
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } = require('./error_handling');
const apiRouter = require('./routers/api.router');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;