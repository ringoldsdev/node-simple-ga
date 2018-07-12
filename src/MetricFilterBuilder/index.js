// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets

var MetricFilterBuilder = function() {
	this.filter = {};
};

MetricFilterBuilder.prototype.metric = function(name) {
	this.filter.metricName = `ga:${name}`;
	return this;
};

MetricFilterBuilder.prototype.greaterThan = function(value) {
	this.filter.operator = "GREATER_THAN";
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilterBuilder.prototype.lessThan = function(value) {
	this.filter.operator = "LESS_THAN";
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilterBuilder.prototype.equalTo = function(value) {
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilterBuilder.prototype.inverse = function() {
	this.filter.not = true;
	return this;
};

MetricFilterBuilder.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.filter));
};

module.exports = MetricFilterBuilder;
