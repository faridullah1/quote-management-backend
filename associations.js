const { Bidding } = require("./models/biddingModel");
const { Company } = require("./models/companyModel");
const { Group } = require("./models/groupsModel");
const { QuoteItem } = require("./models/quoteItemModel");
const { Quote } = require("./models/quoteModel");
const { SupplierGroupDetail } = require("./models/supplierGroupDetailModel");
const { Supplier } = require("./models/supplierModel");

module.exports = function() {
    // A company user can register many suppliers
	Company.hasMany(Supplier, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'companyId' });
    // A supplier belongs to a single company
    Supplier.belongsTo(Company, { foreignKey: 'companyId' });


    // A company can create many groups
    Company.hasMany(Group, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'companyId' });
    // A group belongs to a single company
    Group.belongsTo(Company, { foreignKey: 'companyId' });


    // A Supplier can be inside many groups
    Supplier.belongsToMany(Group, { through: SupplierGroupDetail, foreignKey: 'supplierId' });
    // A Group can have many different suppliers
    Group.belongsToMany(Supplier, { through: SupplierGroupDetail, foreignKey: 'groupId' });


    Supplier.hasMany(SupplierGroupDetail, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'supplierId' });
    SupplierGroupDetail.belongsTo(Supplier, { foreignKey: 'supplierId' });

    
    // A quote can have multiple quote items
    Quote.hasMany(QuoteItem, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'quoteId' });
    // A quote item belongs to a single quote
    QuoteItem.belongsTo(Quote, { foreignKey: 'quoteId' });


    // A group can be linked to many quote items
    Group.hasMany(QuoteItem, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'groupId' });
    // A quote item can be associated to one supplier group at a time
    QuoteItem.belongsTo(Group, { foreignKey: 'groupId' });

    // A supplier can bid on many items
    Supplier.hasMany(Bidding, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'supplierId' });
    // bid is only associated with a single supplier;
    Bidding.belongsTo(Supplier, { foreignKey: 'supplierId' });

    // A group can be linked to many quote items
    QuoteItem.hasMany(Bidding, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'itemId' });
    // A quote item can be associated to one supplier group at a time
    Bidding.belongsTo(QuoteItem, { foreignKey: 'itemId' });
}