module.exports = {
	cleanKeys: function(columns) {
		return columns.map(function(column) {
			return column.replace(/^ga:/,"");
		});
	},
	castValue: function(value) {
		var newValue = Number(value);

		if(isNaN(newValue)) {
			return value;
		}

		return newValue;
	},
	mergeKeyValueArrays: function(keys, values) {
		var that = this;
		return Object.assign.apply(
			{},
			keys.map((v, i) => ({
				[v]: that.castValue(values[i])
			}))
		);
	}
};