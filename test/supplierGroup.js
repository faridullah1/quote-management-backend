
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env'} );

const { expect } = require('chai');
const request = require('supertest');
const { SupplierGroupDetail } = require('../models/supplierGroupDetailModel');
const Helpers = require('../utils/helpers');
const { Company } = require('../models/companyModel');
const { Supplier } = require('../models/supplierModel');
const { Group } = require('../models/groupsModel');

let server;
describe('/api/supplierGroups', () => {
    beforeEach(() => {
        server = require('../server');
    });
    
    afterEach(async () => {
        await SupplierGroupDetail.destroy({ where: {} });
        await Company.destroy({ where: {} });
        server.close();
    });

    describe('GET /', () => {
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/supplierGroups')

            expect(res.status).to.equal(401);
        });

        it('should return all supplier groups', async () => {
            // Prepare token   
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            // Prepare a supplier group;
            const group = await Group.create({ name: 'abc', companyId: company.dataValues.companyId });
            const supplier = await Supplier.create({ firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123', companyId: company.dataValues.companyId })
            await SupplierGroupDetail.create({ groupId: group.dataValues.groupId, supplierId: supplier.dataValues.supplierId })

            const resp = await request(server)
                .get('/api/supplierGroups')
                .set('authorization', 'Bearer ' + token)
            
            const { supplierGroups } = resp.body.data;
            expect(resp.statusCode).to.equal(200);
            expect(supplierGroups.length).to.equal(1);
            expect(supplierGroups[0]).to.property('groupName', 'abc');
            expect(supplierGroups[0]).to.haveOwnProperty('suppliers');
            expect(supplierGroups[0].suppliers.length).to.equal(1);
            expect(supplierGroups[0].suppliers[0].supplier).to.property('firstName', 'a');
        });
    });

    describe('GET /:id', () => {
        it('should return 401 if user is NOT logged in', async () => {            
            const res = await request(server).get('/api/supplierGroups/1')

            expect(res.status).to.equal(401);
        });

        it('should return 404 if invalid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            const res = await request(server)
                .get('/api/supplierGroups/44')
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(404);
        });

        it('should return supplier group if valid id is passed.', async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            const supplier = await Supplier.create({ firstName: 'a', lastName: 'b', email: 'a@gmail.com', password: 'tester123', companyId: company.dataValues.companyId },);

            const token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });
            const res = await request(server)
                .get('/api/suppliers/' + supplier.dataValues.supplierId)
                .set('authorization', 'Bearer ' + token);

            expect(res.status).to.equal(200);
            expect(res.body.data.supplier).to.property('email', 'a@gmail.com');
        });
    });

    describe('POST /', () => {
        let token;
        let supplierGroup;

        const exec = async () => {
            return await request(server)
                .post('/api/supplierGroups')
                .set('authorization', 'Bearer ' + token)
                .send(supplierGroup)
        };

        beforeEach(async () => {
            const company = await Company.create({ email: 'a@gmail.com', password: 'tester123' });
            token = Helpers.generateAuthToken({ userId: company.dataValues.companyId, email: 'a@gmail.com', company: true });

            supplierGroup = { name: 'group1' };
        });

        it('should return 401 if user is NOT logged in', async () => {   
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 if group name is not provided', async () => {
            supplierGroup.name = '';

            const res = await exec();

            expect(res.status).to.equal(400);
        });

        it('should save supplier group if it is valid', async () => {
            const res = await exec();

            expect(res.status).to.equal(201); 
            expect(res).not.equal(null);
        });
    });
});