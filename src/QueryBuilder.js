const ObjectBuilder = require("./ObjectBuilder");
const { processMetric, processDimension } = require("./MetricDimensionProcessor");

initQueryBuilder = function({ client, objectBuilder = null}) {

	let QueryBuilder = {};

	QueryBuilder.value = function() {
		return objectBuilder.value();
	};

	QueryBuilder.clone = function() {
		return initQueryBuilder({ client, objectBuilder: objectBuilder.clone() });
	};

	// This is now a thenable class
	// It means that the query builder can be used to construct the object,
	// and when done constructing, you can use .then() or await to call this function
	QueryBuilder.then = function(resolve, _reject) {
		resolve(QueryBuilder.value());
	};

	return QueryBuilder;
};

module.exports = function(client, config={}) {
	const objectBuilder = new ObjectBuilder();
	objectBuilder.set("metrics", []);
	objectBuilder.set("dimensions", []);
	objectBuilder.set("dateRanges", []);
	if(config.viewId) {
		objectBuilder.set("viewId", config.viewId);
	}
	return initQueryBuilder({ client, objectBuilder });
};