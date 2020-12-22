const { expect } = require("chai");
const ObjectBuilder = require("../src/ObjectBuilder");

describe("ObjectBuilder", function() {
	describe("Initialization", function() {
		let objectBuilder = null;

		before(function() {
			objectBuilder = new ObjectBuilder();
		});

		it("should have a function called value", function() {
			expect(typeof objectBuilder.value).to.eq("function");
		});

		it("should have a function called clone", function() {
			expect(typeof objectBuilder.clone).to.eq("function");
		});

		it("should have a function called then", function() {
			expect(typeof objectBuilder.then).to.eq("function");
		});

		it("should have a function called clear", function() {
			expect(typeof objectBuilder.clear).to.eq("function");
		});

		it("should have a function called set", function() {
			expect(typeof objectBuilder.set).to.eq("function");
		});

		it("should have a function called append", function() {
			expect(typeof objectBuilder.append).to.eq("function");
		});

		it("should have a function called delete", function() {
			expect(typeof objectBuilder.delete).to.eq("function");
		});

		it("should have a function called remove", function() {
			expect(typeof objectBuilder.remove).to.eq("function");
		});
	});

	describe("Actions", function() {
		const key = "test";
		const nestedKey = "nested";
		let objectBuilder = null;

		beforeEach(function() {
			objectBuilder = new ObjectBuilder();
		});

		it(`should contain a key ${key}`, function() {
			let res = objectBuilder.set(key).value();
			expect(res).to.have.key(key);
		});

		it(`should contain a key ${key} with generaated value`, function() {
			let number = Date.now();
			let res = objectBuilder.set(key, number).value();
			expect(res[key]).to.eq(number);
		});

		it(`should delete key ${key}`, function() {
			let res = objectBuilder
				.set(key)
				.delete(key)
				.value();
			expect(res).to.not.have.key(key);
		});

		it(`should remove key ${key}`, function() {
			let res = objectBuilder
				.set(key)
				.remove(key)
				.value();
			expect(res).to.not.have.key(key);
		});

		it(`should create an array with 1 number`, function() {
			let number = Date.now();
			let res = objectBuilder.append(key, number).value();
			expect(res[key]).to.have.ordered.members([number]);
		});

		it(`should create an array with 2 numbers`, function() {
			let number = Date.now();
			let number2 = Date.now();
			let res = objectBuilder
				.append(key, number)
				.append(key, number2)
				.value();
			expect(res[key]).to.have.ordered.members([number, number2]);
		});

		it(`should create a concatenated array with 3 numbers`, function() {
			let number = Date.now();
			let number2 = Date.now();
			let number3 = Date.now();
			let res = objectBuilder
				.append(key, number)
				.append(key, [number2, number3])
				.value();
			expect(res[key]).to.have.ordered.members([number, number2, number3]);
		});

		it(`should contain a nested key ${nestedKey}.${key}`, function() {
			let res = objectBuilder.set(nestedKey + "." + key).value();
			expect(res[nestedKey]).to.have.key(key);
		});

		it(`should clear all actions`, function() {
			let res = objectBuilder.set("key","value").clear().value();
			expect(res).to.deep.eq({});
		});

		it(`should delete only second level value`, function() {
			let res = objectBuilder
				.set(nestedKey + "." + key, 5678)
				.set(key, 1234)
				.delete(nestedKey + "." + key)
				.value();
			expect(res).to.deep.eq({ [key]: 1234 });
		});

	});
});
