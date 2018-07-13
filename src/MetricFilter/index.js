var ObjectBuilder = require("../ObjectBuilder");
var ApiHelper = require("../ApiHelper");

var MetricFilter = function() {}

MetricFilter.prototype = Object.create(new ObjectBuilder());

MetricFilter.prototype.metric = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.set("metricName", name);
};

MetricFilter.prototype.condition = function(value, operator = "EQUAL") {
	this.set("operator", operator);
	return this.set("comparisonValue", value.toString());
}

MetricFilter.prototype.greaterThan = function(value) {
	return this.condition(value,"GREATER_THAN");
};

MetricFilter.prototype.gt = function(value) {
	return this.greaterThan(value);
};

MetricFilter.prototype.greaterThanEqualTo = function(value) {
	return this.greaterThan(value-1);
};

MetricFilter.prototype.gte = function(value) {
	return this.greaterThan(value-1);
};

MetricFilter.prototype.lessThan = function(value) {
	return this.condition(value,"LESS_THAN");
};

MetricFilter.prototype.lt = function(value) {
	return this.lessThan(value);
};


MetricFilter.prototype.lessThanEqualTo = function(value) {
	return this.lessThan(value+1);
};

MetricFilter.prototype.lte = function(value) {
	return this.lessThan(value+1);
};

MetricFilter.prototype.equalTo = function(value) {
	return this.condition(value);
};

MetricFilter.prototype.equals = function(value) {
	return this.equalTo(value);
};

MetricFilter.prototype.not = function() {
	return this.set("not", true);
};

MetricFilter.prototype.inverse = function() {
	return this.not();
};

module.exports = MetricFilter;