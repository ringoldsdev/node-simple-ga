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

MetricFilterBuilder.prototype.gt = function(value) {
	return this.greaterThan(value);
};

MetricFilterBuilder.prototype.greaterThanEqualTo = function(value) {
	return this.greaterThan(value-1);
};

MetricFilterBuilder.prototype.gte = function(value) {
	return this.greaterThan(value-1);
};

MetricFilterBuilder.prototype.lessThan = function(value) {
	this.filter.operator = "LESS_THAN";
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilterBuilder.prototype.lt = function(value) {
	return this.lessThan(value);
};


MetricFilterBuilder.prototype.lessThanEqualTo = function(value) {
	return this.lessThan(value+1);
};

MetricFilterBuilder.prototype.lte = function(value) {
	return this.lessThan(value+1);
};

MetricFilterBuilder.prototype.equalTo = function(value) {
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilterBuilder.prototype.equals = function(value) {
	return this.equalTo(value);
};

MetricFilterBuilder.prototype.not = function() {
	this.filter.not = true;
	return this;
};

MetricFilterBuilder.prototype.inverse = function() {
	return this.not();
};


MetricFilterBuilder.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.filter));
};

module.exports = MetricFilterBuilder;
