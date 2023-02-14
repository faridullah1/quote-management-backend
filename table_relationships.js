const { Company } = require("./models/companyModel");
const { Supplier } = require("./models/supplierModel");

module.exports = function() {
	Company.hasMany(Supplier, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'companyId' });
    Supplier.belongsTo(Company, { foreignKey: 'companyId' });
}