var MetricFilter = function() {
	this.filter = {};
};

MetricFilter.prototype.metric = function(name) {
	this.filter.metricName = `ga:${name}`;
	return this;
};

MetricFilter.prototype.greaterThan = function(value) {
	this.filter.operator = "GREATER_THAN";
	this.filter.comparisonValue = value.toString();
	return this;
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
	this.filter.operator = "LESS_THAN";
	this.filter.comparisonValue = value.toString();
	return this;
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
	this.filter.comparisonValue = value.toString();
	return this;
};

MetricFilter.prototype.equals = function(value) {
	return this.equalTo(value);
};

MetricFilter.prototype.not = function() {
	this.filter.not = true;
	return this;
};

MetricFilter.prototype.inverse = function() {
	return this.not();
};


MetricFilter.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.filter));
};

module.exports = MetricFilter;
