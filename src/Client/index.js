var { google } = require("googleapis");
var fs = require("fs");

module.exports = {
	createFromKeyFile: function(path) {
		return this.createFromKey(JSON.parse(fs.readFileSync(path, "utf8")));
	},
	createFromKey: function(key) {
		var params = {
			email: key.client_email,
			privateKey: key.private_key,
			permissions: ["https://www.googleapis.com/auth/analytics.readonly"]
		};
		return this.createFromParams(params);
	},
	createFromParams: function(params) {
		return new google.auth.JWT(params.email, null, params.privateKey, params.permissions, null);
	}
};
