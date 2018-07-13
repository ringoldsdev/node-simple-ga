const should = require('chai').should();
const fs = require("fs");

const Client = require("../src/Client");

describe("Client", function(){
	it("should create a client from key file", function(done){
		var cl = Client.createFromKeyFile("./key.json");
		cl.constructor.name.should.equal("JWT");
		done();
	});
	it("should create a client from key", function(done){
		var key = JSON.parse(fs.readFileSync("./key.json", "utf8"))
		var cl = Client.createFromKey(key);
		cl.constructor.name.should.equal("JWT");
		done();
	});
	it("should create a client from params", function(done){
		var key = JSON.parse(fs.readFileSync("./key.json", "utf8"))
		var cl = Client.createFromParams({
			email: key.client_email,
			privateKey: key.private_key
		});
		cl.constructor.name.should.equal("JWT");
		done();
	});
});