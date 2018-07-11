var { google } = require("googleapis");
var fs = require("fs");

module.exports = {
	createFromKeyFile: function(path) {
		return this.createFromKey(JSON.parse(fs.readFileSync(path, "utf8")));
	},
	createFromKey: function(key) {
		var params = {
			email: key.client_email,
			privateKey: key.private_key
		};
		return this.createFromParams(params);
	},
	createFromParams: function(params) {
		var jwtClient = new google.auth.JWT(
			params.email, // For authenticating and permissions
			null,
			params.privateKey,
			params.permissions
				? params.permissions
				: ["https://www.googleapis.com/auth/analytics.readonly"],
			null
		);
		jwtClient.authorize(function(err, tokens) {
			if (err) {
				console.log(err);
				process.exit(1);
			}
		});

		return jwtClient;
	}
};
