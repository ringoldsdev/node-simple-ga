const objectPath = require("object-path-immutable");

// Define all actions that can be called
const ACTIONS_SET = "set";
const ACTIONS_APPEND = "append";
const ACTIONS_DELETE = "delete";
const ACTIONS_REMOVE = "remove";

// Define all action handlers
// You can specify either a function or string to have an alias
const ACTION_HANDLERS = {
	[ACTIONS_SET]: function(projection, data) {
		return objectPath.set(projection, data.key, data.value);
	},
	[ACTIONS_DELETE]: function(projection, data) {
		return objectPath.del(projection, data.key);
	},
	[ACTIONS_APPEND]: function(projection, data) {
		if (!(data.key in projection)) {
			projection[data.key] = [];
		}
		if (!Array.isArray(projection[data.key])) {
			throw new Error(`Can't append to ${data.key}! It's not an array`);
		}

		if(!Array.isArray(data.value)) {
			return objectPath.push(projection, data.key, data.value);
		}

		data.value.forEach(function(value) {
			projection = objectPath.push(projection, data.key, value);
		});

		return projection;
	},
	[ACTIONS_REMOVE]: ACTIONS_DELETE
};

// Process handlers so that each action has a corresponding handler
const ACTIONS = Object.entries(ACTION_HANDLERS).reduce(function(map, action) {
	let name = action[0];
	let handler = action[1];
	switch (typeof handler) {
		case "function": {
			return { ...map, [name]: handler };
		}
		case "string": {
			if (!(handler in ACTION_HANDLERS)) {
				throw new Error(`Unknown action handler ${handler}`);
			}
			return { ...map, [name]: ACTION_HANDLERS[handler] };
		}
		default:
			throw new Error(`Invalid action type ${typeof handler} for action ${name}`);
	}
}, {});

const removeEmptyValues = function(obj) {
	return Object.keys(obj)
		.filter(function(key) {
			return obj[key] !== null;
		})
		.reduce(function(newObj, key) {
		// If key doesn't hold an object, skip it
		if(typeof obj[key] !== "object" || Array.isArray(obj[key])) {
			return {
				...newObj,
				[key]: obj[key]
			};
		} 
		// If it's an object, check if it contains any keys
		if(Object.keys(obj[key]).length > 0) {
			return {
				...newObj,
				[key]: removeEmptyValues(obj[key])
			}
		}
		// If there were no keys, nothing will happen
		return newObj;
	}, {});
}

const initObjectBuilder = function(initActions = []) {
	let actions = initActions;

	let ObjectBuilder = {};

	Object.entries(ACTIONS).forEach(function(entry) {
		ObjectBuilder[entry[0]] = function(key, value) {
			actions.push({ type: entry[0], data: { key, value } });
			return this;
		};
	});

	ObjectBuilder.value = function() {
		let res = actions.reduce(function(projection, action) {
			return ACTIONS[action.type](projection, action.data);
		}, {});
		res = removeEmptyValues(res);
		return res;
	};

	ObjectBuilder.clone = function() {
		return initObjectBuilder([...actions]);
	};

	ObjectBuilder.clear = function() {
		actions = [];
		return this;
	};

	// This is now a thenable class
	// It means that the query builder can be used to construct the object,
	// and when done constructing, you can use .then() or await to call this function
	ObjectBuilder.then = function(resolve, _reject) {
		resolve(ObjectBuilder.value());
	};

	return ObjectBuilder;
};

module.exports = function(initActions = []) {
	return initObjectBuilder(initActions);
};
