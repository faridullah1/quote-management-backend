
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { Quote } = require('../models/quoteModel');
const Helpers = require('../utils/helpers');
const { Company } = require('../models/companyModel');

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
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/quotes')

            expect(res.status).to.equal(401);
        });

        it('should return all quotes', async () => {
            const rec = { email: 'a@gmail.com', password: 'tester123' };
            const company = await Company.create(rec);

            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const res = await request(server)
                .get('/api/quotes')
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(200);
        });
    });
});