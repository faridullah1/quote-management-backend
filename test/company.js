
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { Company } = require('../models/companyModel');

let server;
describe('/api/companies', () => {
    beforeEach(() => {
        server = require('../server');
    });
    
    afterEach(async () => {
        await Company.destroy({ where: {} });
        server.close();
    });

    describe('GET /', () => {
        it('should return all companies', async () => {
            await Company.bulkCreate([
                { email: 'a@gmail.com', password: 'tester123'},
                { email: 'b@gmail.com', password: 'tester123'},
            ]);

            const res = await request(server).get('/api/companies');
            const { companies } = res.body.data;

            expect(res.statusCode).to.equal(200);
            expect(companies.length).to.equal(2);
            expect(companies.some(c => c.email === 'a@gmail.com')).to.be.true;
            expect(companies.some(c => c.email === 'b@gmail.com')).to.be.true;
        });
    });

    describe('GET /:id', () => {
        it('should return company if valid id is passed.', async () => {
            const rec = { email: 'a@gmail.com', password: 'tester123' };
            const company = await Company.create(rec);

            const res = await request(server).get('/api/companies/' + company.dataValues.companyId);

            expect(res.status).to.equal(200);
            expect(res.body.data.company).to.property('email', 'a@gmail.com');
        });

        it('should return 404 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/companies/44');

            expect(res.status).to.equal(404);
        });
    });

    describe('POST /', () => {
        it('should return 400 if invalid email is passed.', async () => {
            const company = { email: 'a', password: 'tester123' };

            const res = await request(server)
                .post('/api/companies')
                .send(company)

            expect(res.status).to.equal(400);
        });
    });
});