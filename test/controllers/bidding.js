
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { Bidding } = require('../../models/biddingModel');
const { Supplier } = require('../../models/supplierModel');
const { Company } = require('../../models/companyModel');
const Helpers = require('../../utils/helpers');
const { Quote } = require('../../models/quoteModel');
const { QuoteItem } = require('../../models/quoteItemModel');
const { Group } = require('../../models/groupsModel');

let server;
describe('/api/biddings', () => {
    beforeEach(() => {
        server = require('../../server');
    });
    
    afterEach(async () => {
        await Supplier.destroy({ where: {} });

        await Bidding.destroy({ where: {} });
        await QuoteItem.destroy({ where: {} });
        await Quote.destroy({ where: {} });

        await Group.destroy({ where: {} });
        await Company.destroy({ where: {} });

        server.close();
    });

    describe('POST /', () => {
        let token;
        let bid;

        const exec = async () => {
            return await request(server)
                .post('/api/biddings')
                .set('authorization', 'Bearer ' + token)
                .send(bid)
        };

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const supplier = await Supplier.create({ firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123', companyId: company.dataValues.companyId });
            token = Helpers.generateAuthToken({ userId: supplier.dataValues.supplierId, email: 'a@gmail.com', company: false });

            const group = await Group.create({ name: 'test', companyId: company.dataValues.companyId })
            const quote = await Quote.create({ name: 'abc', startDate: new Date(), endDate: new Date(), companyId: company.dataValues.companyId })
            const quoteItem = await QuoteItem.create({ name: 'abc', price: 10, quantity: 10, quoteId: quote.dataValues.quoteId, groupId: group.dataValues.groupId })
            
            bid = { price: 10, amount: 10, deliveryTime: new Date(), deliveryTimeUnit: 'Days', itemId: quoteItem.dataValues.itemId };
        });

        it('should return 401 if user is NOT logged in', async () => {   
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 if price is not provided', async () => {
            bid.price = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if amount is not provided', async () => {
            bid.amount = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if deliveryTime is not provided', async () => {
            bid.deliveryTime = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should return 400 if item Id is not provided', async () => {
            bid.itemId = null;

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should save bid if it is valid', async () => {
            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
            expect(res.body.data.bid).property('price', bid.price);
        });

        it('should set no price if supplier ignore bid', async () => {
            bid.isBidIgnored = true;

            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
            expect(res.body.data.bid).property('price', -1);
        });
    });
});