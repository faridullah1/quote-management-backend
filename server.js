const app = require('./app');

// configure tables relation ships
require('./associations')();

const sequelize = require('./db');
await = sequelize.sync();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
	console.log(`Connected to database`);
});

module.exports = server;