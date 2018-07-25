var ObjectBuilder = require("../ObjectBuilder");
var ApiHelper = require("../ApiHelper");

var MetricFilter = function() {};

MetricFilter.prototype = Object.create(new ObjectBuilder());

MetricFilter.prototype.metric = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.set("metricName", name);
};

MetricFilter.prototype.condition = function(operator = "EQUAL", value) {
	this.set("operator", operator);
	return this.set("comparisonValue", value.toString());
};

MetricFilter.prototype.not = function() {
	return this.set("not", true);
};

module.exports = MetricFilter;