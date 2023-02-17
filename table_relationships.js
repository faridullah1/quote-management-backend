const { Company } = require("./models/companyModel");
const { Group } = require("./models/groupsModel");
const { QuoteItem } = require("./models/quoteItemModel");
const { Quote } = require("./models/quoteModel");
const { SupplierGroupDetail } = require("./models/supplierGroupDetailModel");
const { Supplier } = require("./models/supplierModel");

module.exports = function() {
	Company.hasMany(Supplier, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'companyId' });
    Supplier.belongsTo(Company, { foreignKey: 'companyId' });

    Company.hasMany(Group, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'companyId' });
    Group.belongsTo(Company, { foreignKey: 'companyId' });

    Supplier.belongsToMany(Group, { through: SupplierGroupDetail, foreignKey: 'supplierId' });
    Group.belongsToMany(Supplier, { through: SupplierGroupDetail, foreignKey: 'groupId' });

    SupplierGroupDetail.hasOne(Supplier, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'supplierId' });
    Supplier.belongsTo(SupplierGroupDetail, { foreignKey: 'supplierId' });

    Quote.hasMany(QuoteItem, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'quoteId' });
    QuoteItem.belongsTo(Quote, { foreignKey: 'quoteId' });
}