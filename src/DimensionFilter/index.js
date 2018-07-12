// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets

var DimensionFilter = function() {
	this.filter = {};
};

DimensionFilter.prototype.dimension = function(name) {
	this.filter.dimensionName = `ga:${name}`;
	return this;
};

DimensionFilter.prototype.not = function() {
	this.filter.not = true;
	return this;
};

DimensionFilter.prototype.inverse = function() {
	return this.not();
};

DimensionFilter.prototype.matchRegex = function(regex) {
	this.filter.operator = "REGEXP";
	this.filter.expressions = [regex.toString()];
	return this;
};

DimensionFilter.prototype.beginsWith = function(value) {
	this.filter.operator = "BEGINS_WITH";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.endsWith = function(value) {
	this.filter.operator = "ENDS_WITH";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.contains = function(value) {
	this.filter.operator = "PARTIAL";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.is = function(value) {
	this.filter.operator = "EXACT";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.matches = function(value) {
	this.filter.operator = "EXACT";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.equalsTo = function(value) {
	this.filter.operator = "NUMERIC_EQUAL";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilter.prototype.eq = function(value) {
	return this.equalsTo(value);
};

DimensionFilter.prototype.greaterThan = function(value) {
	this.filter.operator = "NUMERIC_GREATER_THAN";
	this.filter.expressions = [value.toString()];
	return this;
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
	this.filter.operator = "NUMERIC_LESS_THAN";
	this.filter.expressions = [value.toString()];
	return this;
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
	this.filter.operator = "IN_LIST";
	this.filter.expressions = value;
	return this;
};

DimensionFilter.prototype.caseSensitive = function() {
	this.filter.caseSensitive = true;
	return this;
};

DimensionFilter.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.filter));
};

module.exports = DimensionFilter;
