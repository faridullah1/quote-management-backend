
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

    describe("GET /", function() {
        it("should return all companies", async () => {
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
});