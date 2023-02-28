
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { Supplier } = require('../models/supplierModel');
const { Company } = require('../models/companyModel');
const Helpers = require('../utils/helpers');

let server;
describe('/api/suppliers', () => {
    beforeEach(() => {
        server = require('../server');
    });
    
    afterEach(async () => {
        await Supplier.destroy({ where: {} });
        await Company.destroy({ where: {} });
        server.close();
    });

    describe('GET /', () => {
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/suppliers')

            expect(res.status).to.equal(401);
        });

        it('should return all suppliers', async () => {
            // Each supplier belongs to a company     
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });

            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            await Supplier.bulkCreate([
                { firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123', companyId: company.dataValues.companyId },
                { firstName: 'c', lastName: 'd', email: 'b@gmail.com', password: 'tester123', companyId: company.dataValues.companyId },
            ]);

            const res = await request(server)
                .get('/api/suppliers')
                .set('authorization', 'Bearer ' + token);

            const { rows, count } = res.body.data.suppliers;
            
            expect(res.statusCode).to.equal(200);
            expect(count).to.equal(2);
            expect(rows.some(c => c.email === 'a@gmail.com')).to.be.true;
            expect(rows.some(c => c.email === 'b@gmail.com')).to.be.true;
        });
    });

    describe('GET /:id', () => {
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/suppliers/1')

            expect(res.status).to.equal(401);
        });

        it('should return supplier if user is Logged In and valid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const supplier = await Supplier.create({ firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123', companyId: company.dataValues.companyId },);

            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });
            const res = await request(server)
                .get('/api/suppliers/' + supplier.dataValues.supplierId)
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(200);
            expect(res.body.data.supplier).to.property('email', 'a@gmail.com');
        });

        it('should return 404 if invalid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const res = await request(server)
                .get('/api/suppliers/44')
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(404);
        });
    });

    describe('POST /', () => {
        let token;
        let supplier;

        const exec = async () => {
            return await request(server)
                .post('/api/suppliers')
                .set('authorization', 'Bearer ' + token)
                .send(supplier)
        };

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            supplier = { firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123' };
        });

        it('should return 401 if user is NOT logged in', async () => {   
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 if firstName is not provided', async () => {
            supplier.firstName = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if lastName is not provided', async () => {
            supplier.lastName = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if email is not provided', async () => {
            supplier.email = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if invalid email is provided', async () => {
            supplier.email = 'a.com';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if password is not provided', async () => {
            supplier.password = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should save supplier if it is valid', async () => {
            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
        });
    });
});