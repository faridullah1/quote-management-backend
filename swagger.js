const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: "1.0.0",
        title: 'Quotes Management System API',
        description: 'It is a web application used by companies and suppliers. Company create quotes with different quote items. Supplier can then bid on quote items once quote is released. Company can then see all bids performed on the quotes and responds accordingly.',
    },
    host: 'localhost:3000',
    schemes: ['http'],
    tags: [
        {
            name: "Auth",
            description: "Endpoints"
        },
        {
            name: "Company",
            description: "Endpoints"
        },
        {
            name: "Supplier",
            description: "Endpoints"
        },
        {
            name: "Supplier Group",
            description: "Endpoints"
        },
        {
            name: "Quote",
            description: "Endpoints"
        },
        {
            name: "Quote Item",
            description: "Endpoints"
        },
        {
            name: "Bidding",
            description: "Endpoints"
        }
    ],
    definitions: {
        Company: {
            email: "company@gmail.com",
            password: "tester123",
        },
        AddCompany: {
            $email: "company@gmail.com",
            $password: "tester123",
        },
        Supplier: {
            firstName: "Farid",
            lastName: "Ullah",
            email: "faridullah996@gmail.com",
            password: "tester123",
            status: "New",
            companyId: 1
        },
        AddSupplier: {
            $firstName: "Farid",
            $lastName: "Ullah",
            $email: "faridullah996@gmail.com",
            $password: "tester123",
            status: "New",
            $companyId: 1
        },
        SupplierGroup: {
            name: 'Group 1',
            companyId: 1
        },
        AddSupplierGroup: {
            $name: 'Group 1',
            $companyId: 1
        },
        Quote: {
            name: "Quote 1",
            startDate: "3/2/2023",
            endDate: "3/2/2023",
            status: "Draft",
            companyId: 1
        },
        AddQuote: {
            $name: "Quote 1",
            $startDate: "3/2/2023",
            $endDate: "3/2/2023",
            status: "Draft",
            $companyId: 1
        },
        QuoteItem: {
            name: "Item 1",
            price: 10,
            quantity: 100,
            quoteId: 1,
            groupId: 1
        },
        AddQuoteItem: {
            $name: "Item 1",
            $price: 10,
            $quantity: 100,
            $quoteId: 1,
            $groupId: 1
        },
        Bidding: {
            price: 10,
            amount: 100,
            deliveryTime: new Date(),
            deliveryTimeUnit: 'Days',
            isBidIgnored: false,
            comments: 'Testing',
            supplierId: 1,
            itemId: 1
        },
        PostBidding: {
            $price: 10,
            $amount: 100,
            $deliveryTime: new Date(),
            $deliveryTimeUnit: 'Days',
            isBidIgnored: false,
            comments: 'Testing',
            $supplierId: 1,
            $sitemId: 1
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./server');
})