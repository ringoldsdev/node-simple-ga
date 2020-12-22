// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet

var ObjectBuilder = require("../ObjectBuilder");
var ApiHelper = require("../ApiHelper");

var DimensionFilter = function() {};

DimensionFilter.prototype = Object.create(new ObjectBuilder());

DimensionFilter.prototype.condition = function(operator = "EXACT", value) {
	this.set("operator", operator);
	return this.set("expressions", value);
};

DimensionFilter.prototype.dimension = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.set("dimensionName", name);
};

DimensionFilter.prototype.not = function() {
	return this.set("not", true);
};

module.exports = DimensionFilter;
