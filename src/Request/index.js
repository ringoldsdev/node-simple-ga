// https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet
// https://developers.google.com/analytics/devguides/reporting/core/dimsmets
const cloneDeep = require("clone-deep");

var Request = function() {
	this.request = {};
};

Request.prototype.reset = function() {
	this.request = {};
	return this;
};

Request.prototype.set = function(key, value) {
	if (value == null) {
		return this.clear(key);
	}

	this.request[key] = value;
	return this;
}

Request.prototype.append = function(key, value) {
	if(!this.request[key]) {
		this.request[key] = [];
	}
	this.request[key].push(value);
	return this;
}

Request.prototype.getValues = function(values, fn=null) {

	if(!values) {
		return [];
	}
	if(values.length === 0) {
		return [];
	}

	if(values.length === 1 && Array.isArray(values[0])) {
		values = values[0]
	};

	if(!fn) {
		return values;
	}

	return values.map(function(value){
		return fn(value);
	});
}

Request.prototype.appendMultiple = function(key, values) {
	var that = this;
	values.forEach(
		function(value) {
			that.append(key, value);
		}
	);
	return this;
}

Request.prototype.remove = function(key, param, value) {
	if (!this.request[key]) {
		return this;
	}

	this.request[key] = this.request[key].filter(function(entry) {
		return entry[param] !== value;
	});

	if (this.request[key].length == 0) {
		this.clear(key);
	}

	return this;
}

Request.prototype.removeMultiple = function(key, param, values) {
	values.forEach(function(value){
		this.remove(value)
	}.bind(this));

	return this;
}

Request.prototype.clear = function(key) {
	if(!key) {
		return this.reset();
	}

	delete this.request[key];
	return this;
}

Request.prototype.make = function() {
	return JSON.parse(JSON.stringify(this.request));
};

Request.prototype.clone = function(type, filter) {
	return cloneDeep(this);
};

const generateApiName = function(name) {
	return `ga:${name}`;
}

const generateApiNames = function(names) {
	return names.map(function(name){
		return generateApiName(name);
	});
}

Request.prototype.view = function(view) {
	return this.set("viewId",generateApiName(view));
};

Request.prototype.pageSize = function(size) {
	return this.set("pageSize",size);
};

Request.prototype.results = function(count) {
	return this.pageSize(count);
}

Request.prototype.pageToken = function(token) {
	return this.set("pageToken",token);
};

Request.prototype.removePageToken = function(token) {
	return this.pageToken(null);
};

Request.prototype.offset = function(value) {
	return this.pageToken(value);
};

Request.prototype.removeOffset = function(value) {
	return this.pageToken(null);
};

Request.prototype.sample = function(size) {
	return this.set("samplingLevel",size.toUpperCase());
};

Request.prototype.fast = function() {
	return this.sample("SMALL");
};

Request.prototype.precise = function() {
	return this.sample("LARGE");
};

// Date functions

Request.prototype.dateRange = function(params) {
	var dateRange = {};
	if (params.from) {
		dateRange.startDate = params.from;
	}
	if (params.to) {
		dateRange.endDate = params.to;
	}
	// For now only 1 date range is permitted
	return this.set("dateRanges",[dateRange]);
};

const makeDimensionObject = function(name, histogramBuckets = null) {
	var obj = { name };
	if(histogramBuckets) {
		obj.histogramBuckets = histogramBuckets;
	}
	return obj;
}

Request.prototype.dimension = function(dimension) {
	return this.append("dimensions", makeDimensionObject(generateApiName(dimension)));
};

Request.prototype.histogram = function(dimension, histogramBuckets = null) {
	histogramBuckets = histogramBuckets.forEach(function(bucket) {
		return bucket.toString();
	});
	return this.set("dimensions", [makeDimensionObject(generateApiName(dimension), histogramBuckets)]);
};

Request.prototype.dimensions = function(...values) {
	values = this.getValues(values, generateApiName);
	values = values.map(function(value){
		return makeDimensionObject(value);
	});
	return this.appendMultiple("dimensions",values);
};

Request.prototype.clearDimensions = function() {
	return this.clear("dimensions");
};

Request.prototype.removeDimension = function(name) {
	return this.remove("dimensions", "name", generateApiName(name));
};

Request.prototype.removeDimensions = function(...values) {
	values = this.getValues(values, generateApiName);
	return this.removeMultiple("dimensions", "name", values);
};

const makeMetricObject = function(name, type = "INTEGER") {
	return {
		expression:  name,
		formattingType: type ? type : "INTEGER"
	}
}

Request.prototype.metric = function(name, type) {
	return this.append("metrics", makeMetricObject(generateApiName(name)));
};

Request.prototype.metrics = function(...values) {
	values = this.getValues(values, generateApiName);
	values = values.map(function(value){
		return makeDimensionObject(value);
	});
	return this.appendMultiple("metrics", values);
};

Request.prototype.metricInt = function(name) {
	return this.metric(name, "INTEGER");
};

Request.prototype.nameFloat = function(name) {
	return this.metric(name, "FLOAT");
};

Request.prototype.nameCurrency = function(name) {
	return this.metric(name, "CURRENCY");
};

Request.prototype.namePercent = function(name) {
	return this.metric(name, "PERCENT");
};

Request.prototype.nameTime = function(name) {
	return this.metric(name, "TIME");
};

Request.prototype.clearMetrics = function() {
	return this.clear("metrics");
};

Request.prototype.removeMetric = function(name) {
	return this.remove("metrics", "expression", generateApiName(name));
};

Request.prototype.removeMetrics = function(...values) {
	values = this.getValues(values, generateApiName);
	return this.removeMultiple("dimensions", "name", values);
};

Request.prototype.filtersExpression = function(expression) {
	return this.set("filtersExpression", expression);
};

Request.prototype.orderBy = function(params) {
	return this.append("orderBys", {
		fieldName: generateApiName(params.name),
		orderType: params.type ? params.type : "VALUE",
		sortOrder: params.order ? params.order : "DESCENDING"
	});
};

Request.prototype.orderAsc = function(name) {
	return this.orderBy({
		name: name,
		order: "ASCENDING"
	});
};

Request.prototype.orderDesc = function(name) {
	return this.orderBy({
		name: name
	});
};

Request.prototype.orderHistogram = function(name) {
	return this.orderBy({
		name: name,
		type: "HISTOGRAM_BUCKET"
	});
};

Request.prototype.removeOrder = function(name) {
	return this.remove("orderBys", "fieldName", generateApiName(name));
};

Request.prototype.removeOrders = function(...values) {
	values = this.getValues(values, generateApiName);
	return this.removeMultiple("orderBys", "fieldName", values);
};

Request.prototype.metricOrFilters = function(filters) {
	return this.filters("metricFilterClauses", filters, "OR");
};

Request.prototype.metricFilters = function(filters, operator = "AND") {
	return this.filters("metricFilterClauses", filters);
};

Request.prototype.metricFilter = function(filter) {
	return this.filter("metricFilterClauses", filter);
};

Request.prototype.dimensionOrFilters = function(filters) {
	return this.filters("dimensionFilterClauses", filters, "OR");
};

Request.prototype.dimensionFilters = function(filters, operator = "AND") {
	return this.filters("dimensionFilterClauses", filters);
};

Request.prototype.dimensionFilter = function(filter) {
	return this.filter("dimensionFilterClauses", filter);
};

const makeFiltersObject = function(filters, operator = "OR") {
	return {
		operator,
		filters: filters.map(function(filter) {
			return filter.make();
		})
	}
}

Request.prototype.filters = function(type, filters) {
	return this.append(type, makeFiltersObject(filters));
};

Request.prototype.andFilters = function(type, filters) {
	return this.append(type, makeFiltersObject(filters, "AND"));
};

Request.prototype.filter = function(type, filter) {
	return this.filters(type, [filter]);
};

module.exports = Request;
