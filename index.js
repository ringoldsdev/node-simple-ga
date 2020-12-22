const QueryBuilder = require("./src/ObjectBuilder");

const qb = new QueryBuilder();

// console.log(qb);

let res = qb
	.set("test","value")
	.set("test2","value")
	.set("test3","value");

let res2 = res.clone()
	.delete("test2")
	.delete("test3")
	.set("nested.test1", 123)
	.set("nested.test2", 456)
	.set("nested.test3", 789);

let res3 = res2.clone()
	.delete("nested.test2");

(async function(){
	console.log("RES", await res);
	console.log("RES2", await res2);
	console.log("RES3", await res3);

})();
