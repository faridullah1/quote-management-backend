const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { auth } = require('../../middlewares/auth');
const { Company } = require('../../models/companyModel');
const Helpers = require('../../utils/helpers');

describe('auth middleware', () => {
    let token;
    let server;

    beforeEach(async () => {
        server = require('../../server');

        const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
        token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });
    });

    afterEach(async () => {
        await Company.destroy({ where: {} });
        server.close();
    });

    const exec = () => {
        return request(server)
            .get('/api/quotes')
            .set('authorization', 'Bearer ' + token);
    }

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).to.equal(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).to.equal(401);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).to.equal(200);
    });
});