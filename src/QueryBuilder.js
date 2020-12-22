const ObjectBuilder = require("./ObjectBuilder");

initQueryBuilder = function({ client, objectBuilder = null}) {

	let QueryBuilder = {};

	QueryBuilder.toJson = function() {
		return actions.reduce(function(projection, action) {
			return ACTIONS[action.type](projection, action.data);
		}, {});
	};

	QueryBuilder.clone = function() {
		return initQueryBuilder({ client, objectBuilder: objectBuilder.clone() });
	};

	// This is now a thenable class
	// It means that the query builder can be used to construct the object,
	// and when done constructing, you can use .then() or await to call this function
	QueryBuilder.then = function(resolve, _reject) {
		resolve(QueryBuilder.toJson());
	};

	return QueryBuilder;
};

module.exports = function(client) {
	const objectBuilder = new ObjectBuilder();
	return initQueryBuilder({ client, objectBuilder });
};