// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets

var DimensionFilterBuilder = function() {
	this.filter = defaultFilter;
};

DimensionFilterBuilder.prototype.dimension = function(name) {
	this.filter.dimensionName = `ga:${name}`;
	return this;
};

DimensionFilterBuilder.prototype.inverse = function() {
	this.filter.not = true;
	return this;
};

DimensionFilterBuilder.prototype.matchRegex = function(regex) {
	this.filter.operator = "REGEXP";
	this.filter.expressions = [regex.toString()];
	return this;
};

DimensionFilterBuilder.prototype.beginsWith = function(value) {
	this.filter.operator = "BEGINS_WITH";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.endsWith = function(value) {
	this.filter.operator = "ENDS_WITH";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.contains = function(value) {
	this.filter.operator = "PARTIAL";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.is = function(value) {
	this.filter.operator = "EXACT";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.matches = function(value) {
	this.filter.operator = "EXACT";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.equalsTo = function(value) {
	this.filter.operator = "NUMERIC_EQUAL";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.greaterThan = function(value) {
	this.filter.operator = "NUMERIC_GREATER_THAN";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.lessThan = function(value) {
	this.filter.operator = "NUMERIC_LESS_THAN";
	this.filter.expressions = [value.toString()];
	return this;
};

DimensionFilterBuilder.prototype.inList = function(value) {
	this.filter.operator = "IN_LIST";
	this.filter.expressions = value;
	return this;
};

DimensionFilterBuilder.prototype.caseSensitive = function() {
	this.filter.caseSensitive = true;
	return this;
};

DimensionFilterBuilder.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.filter));
};

module.exports = DimensionFilterBuilder;
