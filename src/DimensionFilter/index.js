// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet

var ObjectBuilder = require("../ObjectBuilder");
var ApiHelper = require("../ApiHelper");

var DimensionFilter = function() {}

DimensionFilter.prototype = Object.create(new ObjectBuilder());

DimensionFilter.prototype.condition = function(expression, operator = "EXACT") {
	this.set("operator", operator);
	return this.set("expressions", [expression.toString()]);
}

DimensionFilter.prototype.dimension = function(name) {
	name = ApiHelper.generateApiName(name);
	return this.set("dimensionName", name);
};

DimensionFilter.prototype.not = function() {
	return this.set("not", true);
};

DimensionFilter.prototype.inverse = function() {
	return this.not();
};

DimensionFilter.prototype.matchRegex = function(value) {
	return this.condition(value, "REGEXP");
};

DimensionFilter.prototype.beginsWith = function(value) {
	return this.condition(value, "BEGINS_WITH");
};

DimensionFilter.prototype.endsWith = function(value) {
	return this.condition(value, "ENDS_WITH");
};

DimensionFilter.prototype.contains = function(value) {
	return this.condition(value, "PARTIAL");
};

DimensionFilter.prototype.is = function(value) {
	return this.condition(value);
};

DimensionFilter.prototype.matches = function(value) {
	return this.is(value);
};

DimensionFilter.prototype.equalsTo = function(value) {
	return this.condition(value, "NUMERIC_EQUAL");
};

DimensionFilter.prototype.eq = function(value) {
	return this.equalsTo(value);
};

DimensionFilter.prototype.greaterThan = function(value) {
	return this.condition(value, "NUMERIC_GREATER_THAN");
};

DimensionFilter.prototype.gt = function(value) {
	return this.greaterThan(value);
};

DimensionFilter.prototype.greaterThanEqualTo = function(value) {
	return this.greaterThan(value-1);
};

DimensionFilter.prototype.gte = function(value) {
	return this.greaterThan(value-1);
};

DimensionFilter.prototype.lessThan = function(value) {
	return this.condition(value, "NUMERIC_LESS_THAN");
};

DimensionFilter.prototype.lt = function(value) {
	return this.lessThan(value);
};

DimensionFilter.prototype.lessThanEqualTo = function(value) {
	return this.lessThan(value+1);
};

DimensionFilter.prototype.lte = function(value) {
	return this.lessThan(value+1);
};

DimensionFilter.prototype.inList = function(value) {
	this.set("operator", "IN_LIST");
	return this.set("expressions", value);
};

DimensionFilter.prototype.caseSensitive = function() {
	return this.set("caseSensitive", true);
};

module.exports = DimensionFilter;