const should = require('chai').should();
const fs = require("fs");

const Client = require("../src/Client");

describe("Client", function(){
	it("should create a client from key file", function(done){
		var cl = Client.createFromKeyFile("./key.json");
		cl.constructor.name.should.equal("JWT");
		done();
	});
	var key = JSON.parse(fs.readFileSync("./key.json", "utf8"));
	it("should create a client from key", function(done){
		var cl = Client.createFromKey(key);
		cl.constructor.name.should.equal("JWT");
		done();
	});
	it("should create a client from params", function(done){
		var cl = Client.createFromParams({
			email: key.client_email,
			privateKey: key.private_key,
			permissions: ["https://www.googleapis.com/auth/analytics.readonly"]
		});
		cl.constructor.name.should.equal("JWT");
		done();
	});
});