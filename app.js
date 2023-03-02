const env = require('dotenv');   
const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')

// Configuring enviroments related things
env.config({ 
    path: './config.env'
});

// Utils
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// All routes
const companiesRouter = require('./routes/companyRoutes');
const supplierRouter = require('./routes/supplierRoutes');
const supplierGroupRouter = require('./routes/supplierGroupsDetailRoutes');
const groupRouter = require('./routes/groupRoutes');
const quoteRouter = require('./routes/quoteRoutes');
const quoteItemRouter = require('./routes/quoteItemRoutes');
const biddingRouter = require('./routes/biddingRoutes');
const authRouter = require('./routes/authRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to quote management system');
});

// Route Handlers
app.use('/api/companies', companiesRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/groups', groupRouter);
app.use('/api/supplierGroups', supplierGroupRouter);
app.use('/api/quotes', quoteRouter);
app.use('/api/quoteItems', quoteItemRouter);
app.use('/api/biddings', biddingRouter);
app.use('/api/auth', authRouter);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Handling unhandled routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;