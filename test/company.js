
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
        it('should return 404 if invalid id is passed.', async () => {
            const res = await request(server).get('/api/companies/44');

            expect(res.status).to.equal(404);
        });

        it('should return company if valid id is passed.', async () => {
            const rec = { email: 'a@gmail.com', password: 'tester123' };
            const company = await Company.create(rec);

            const res = await request(server).get('/api/companies/' + company.dataValues.companyId);

            expect(res.status).to.equal(200);
            expect(res.body.data.company).to.property('email', 'a@gmail.com');
        });
    });

    describe('POST /', () => {
        let company;

        const exec = async () => {
            return await request(server)
                .post('/api/companies')
                .send(company)
        }

        beforeEach(() => {
            company = { email: 'a@gmail.com', password: 'tester123' };
        });

        it('should return 400 if invalid email is passed', async () => {
            company.email = 'abc.com';

            const res = await exec();
            
            expect(res.status).to.equal(400);
        });

        it('should return 400 if email is not provided', async () => {
            company.email = '';

            const res = await exec();
            
            expect(res.status).to.equal(400);
        });

        it('should return 400 if password is not provided', async () => {
            company.password = '';

            const res = await exec();
            
            expect(res.status).to.equal(400);
        });

        it('should return 400 if password is less than 8 characters', async () => {
            company.password = 'abc';

            const res = await exec();
            
            expect(res.status).to.equal(400);
        });

        it('should return 400 if password is more than 50 characters', async () => {
            company.password = new Array(52).join('a');

            const res = await exec();
            
            expect(res.status).to.equal(400);
        });

        it('should save company if it is valid', async () => {
            const res = await exec();
            
            expect(res.status).to.equal(201);

            expect(res).not.equal(null);
        });
    });
});