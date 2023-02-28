
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { Quote } = require('../models/quoteModel');
const Helpers = require('../utils/helpers');
const { Company } = require('../models/companyModel');
const { Group } = require('../models/groupsModel');

let server;
describe('/api/quotes', () => {
    beforeEach(() => {
        server = require('../server');
    });
    
    afterEach(async () => {
        await Quote.destroy({ where: {} });
        await Company.destroy({ where: {} });
        server.close();
    });

    describe('GET /', () => {
        let token;

        const exec = async () => {
            return await request(server)
            .get('/api/quotes')
            .set('authorization', 'Bearer ' + token);
        }

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });
        });

        it('should return 401 if user is NOT logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return NO quotes initialy', async () => {
            const res = await exec();

            expect(res.status).to.equal(200);
            expect(res.body.data.quotes.length).to.equal(0);
        });

        it('should return ALL quotes', async () => {
            await request(server)
                .post('/api/quotes')
                .send({ name: 'abc', startDate: new Date(), endDate: new Date() })
                .set('authorization', 'Bearer ' + token);
            
            const res = await exec();

            const { quotes } = res.body.data;

            expect(res.status).to.equal(200);
            expect(quotes.length).to.equal(1);
            expect(quotes.some(q => q.name === 'abc')).to.be.true;
        });
    });

    describe('GET /:id', () => {
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/quotes/1')

            expect(res.status).to.equal(401);
        });

        it('should return 404 if invalid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const res = await request(server)
                .get('/api/quotes/44')
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(404);
        });

        it('should return quote if user is Logged In and valid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            
            const quote = await Quote.create({ name: 'abc', startDate: new Date(), endDate: new Date(), companyId: company.dataValues.companyId });

            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const res = await request(server)
                .get('/api/quotes/' + quote.dataValues.quoteId)
                .set('authorization', 'Bearer ' + token);
            
            expect(res.status).to.equal(200);
            expect(res.body.data.quote).to.property('name', 'abc');
            expect(res.body.data.quote).to.property('quote_items');
        });
    });

    describe('POST /', () => {
        let token;
        let quote;

        const exec = async () => {
            return await request(server)
                .post('/api/quotes')
                .set('authorization', 'Bearer ' + token)
                .send(quote)
        };

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            quote = { name: 'abc', startDate: new Date(), endDate: new Date() };
        });

        it('should return 401 if user is NOT logged in', async () => {   
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 if name is not provided', async () => {
            quote.name = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if startDate is not provided', async () => {
            quote.startDate = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if endDate is not provided', async () => {
            quote.endDate = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should save quote if it is valid', async () => {
            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
            expect(res.body.data.quote).property('name', 'abc');
        });

        it('should save quote items if has been passed', async () => {
            const group = await request(server).post('/api/groups').set('authorization', 'Bearer ' + token).send({ name: 'abc' });

            quote.quote_items = [{ name: 'abc', quantity: 100, price: 10, groupId: group.body.data.group.groupId }]
            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
            expect(res.body.data.quote).property('name', 'abc');
        });
    });
});