const billingModel = require('./../models/billingModel');
const factoryController = require('./factoryController');

exports.getAllBillings = factoryController.getAll(billingModel);
exports.insertBilling = factoryController.createOne(billingModel);
exports.getBillingById = factoryController.getOne(billingModel);
exports.updateBilling = factoryController.updateOne(billingModel);
exports.deleteBilling = factoryController.deleteOne(billingModel);
