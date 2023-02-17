const env = require('dotenv');
const express = require('express');
const app = express();

env.config({
    path: './config.env'
});

const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const sequelize = require('./db');
const companiesRouter = require('./routes/companyRoutes');
const supplierRouter = require('./routes/supplierRoutes');
const supplierGroupRouter = require('./routes/groupsRoutes');
const quoteRouter = require('./routes/quoteRoutes');
const quoteItemRouter = require('./routes/quoteItemRoutes');
const authRouter = require('./routes/authRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to quote management system');
});

app.use('/api/companies', companiesRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/supplierGroups', supplierGroupRouter);
app.use('/api/quotes', quoteRouter);
app.use('/api/quoteItems', quoteItemRouter);
app.use('/api/auth', authRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// configure tables relation ships
require('./table_relationships')();

sequelize.sync().then(() => 
{
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
		console.log(`Connected to database ${process.env.DATABASE}`);
	});
});