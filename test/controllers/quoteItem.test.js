
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const Helpers = require('../../utils/helpers');
const { Company } = require('../../models/companyModel');
const { QuoteItem } = require('../../models/quoteItemModel');
const { Group } = require('../../models/groupsModel');
const { Quote } = require('../../models/quoteModel');

let server;
describe('/api/quoteItems', () => {
    beforeEach(() => {
        server = require('../../server');
    });
    
    afterEach(async () => {
        await QuoteItem.destroy({ where: {} });
        await Quote.destroy({ where: {} });
        await Group.destroy({ where: {} });
        await Company.destroy({ where: {} });
        server.close();
    });

    describe('POST /', () => {
        let token;
        let quoteItem;

        const exec = async () => {
            return await request(server)
                .post('/api/quoteItems')
                .set('authorization', 'Bearer ' + token)
                .send(quoteItem)
        };

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const quote = await request(server)
                .post('/api/quotes')
                .set('authorization', 'Bearer ' + token)
                .send({ name: 'abc', startDate: new Date(), endDate: new Date()});

            const group = await Group.create({ name: 'abc', companyId: company.dataValues.companyId });
            
            quoteItem = { name: 'abc', price: 10, quantity: 1, quoteId: quote.body.data.quote.quoteId, groupId: group.dataValues.groupId };
        });

        it('should return 401 if user is NOT logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 if item name is not provided', async () => {
            quoteItem.name = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if quantity is not provided', async () => {
            quoteItem.quantity = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if price is not provided', async () => {
            quoteItem.price = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if quote Id is not provided', async () => {
            quoteItem.quoteId = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if quote Id is not provided', async () => {
            quoteItem.groupId = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should save quote item if it is valid', async () => {
            const res = await exec();
            
            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
            expect(res.body.data.item).property('name', 'abc');
        });
    });
});