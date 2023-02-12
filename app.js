const env = require('dotenv');
const express = require('express');
const app = express();

env.config({
    path: './config.env'
});

const globalErrorHandler = require('./controllers/errorController');

const sequelize = require('./db');
const companiesRouter = require('./routes/companyRoutes');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to quote management system');
});

app.use('/api/companies', companiesRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

sequelize.sync().then(() => 
{
	const port = process.env.PORT || 3000;
	app.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
		console.log(`Connected to database ${process.env.DATABASE}`);
	});
});