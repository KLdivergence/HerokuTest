const sql = require('mssql');

let table = process.env.TABLE;

let config = {
	user: process.env.UNAME,
	password: process.env.PASS,
	server: process.env.SERVER,
	database: process.env.DATABASE,
    stream: true,
	requestTimeout: 1200000,
	connectionTimeout: 500000, 
    pool: {
        max: 50,
        min: 0,
        idleTimeoutMillis: 50000 
    },
	options: {
		encrypt: true
	}
};

let cPool = new sql.ConnectionPool(config);

const poolPromise = cPool.connect().then(pool => {
	console.log('Connected to MSSQL');
	return pool;
}).catch(err => console.log('Database Connection Failed: ', err));

let sendQuery = async (query, fail, success) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(query);
		return success(result.recordset);
	} catch (err) {
		return fail(err);
	}
}

let createBasicStatement = (username, serial, section, setting, value, before, after) => {
	let where = "";
	let params = {};
	let names = [];
	let types = [];
	var anyQueriesYet = false;

	let parseField = (field, fieldName, fieldParamName, comparator, type) => {
		if(field){
			if(anyQueriesYet){
				where += " AND";
			}
			where += " " + fieldName + comparator + "@" + fieldParamName;
			params[fieldParamName] = field;
			names.push(fieldParamName);
			types.push(type);
			anyQueriesYet = true;
		}
	}

	if(username || serial || section || setting || value || before || after){
		where += " WHERE (";
		parseField(username, "Username", "Username_Input", "=", sql.NVarChar);
		parseField(serial, "Serial", "Serial_Input", "=", sql.NVarChar);
		parseField(section, "Section", "Section_Input", "=", sql.NVarChar);
		parseField(setting, "Setting", "Setting_Input", "=", sql.NVarChar);
		parseField(value, "Value", "Value_Input", "=", sql.NVarChar, false);
		if(before){
			if(anyQueriesYet){
				where += " AND";
			}
			let beforeDate = new Date(before);
			where += " " + "LastChanged<@Before_Input";
			params["Before_Input"] = beforeDate;
			names.push("Before_Input");
			types.push(sql.DateTime);
			anyQueriesYet = true;
		}
		if(after){
			if(anyQueriesYet){
				where += " AND";
			}
			let afterDate = new Date(after);
			where += " " + "LastChanged>@After_Input";
			params["After_Input"] = afterDate;
			names.push("After_Input");
			types.push(sql.DateTime);
			anyQueriesYet = true;
		}
		where += ")";
    }
    let page = " ORDER BY LastChanged DESC;";
    let statement = "SELECT Username, Serial, Section, Setting, Value, LastChanged FROM " 
    statement += table + (where.length > 0 ? where : "") + page;
	return [{statement: statement, params: params, names: names, types: types}];
}


let sendPreparedStatement = (statement, params, names, types, success = () => {}, fail = () => {}) => {
	console.log('Preparing query');
	const ps = new sql.PreparedStatement(cPool);
	if (names.length != types.length) {
		return;
	}
	for (let i = 0; i < names.length; i++) {
		ps.input(names[i], types[i]);
    }
	ps.prepare(statement, err => {
		if (err) {
			console.log("Error with preparing statement: " + err);
			console.log("Problematic statement is as follows: " + statement);
		}else{
			console.log('Sending query');
			ps.execute(params, (err, result) => {
				if (err) {
					console.log("Error with executing statement: " + err);
					fail(err);
					ps.unprepare(err => {
						if (err) {
							console.log("Error with unpreparing statement: " + err);
						}
						return [];
					});
				} else {
					console.log('Unpreparing query');
					ps.unprepare(err => {
						if (err) {
							console.log("Error with unpreparing statement: " + err);
						}
						console.log('Receiving query');
						success(result);
						return result;
					});
				}

			});
		}
	});
}

var gethistory = (request, Response)=>{
    let data = request.body;
	let username = data.username;
	let serial = data.serial;
	let section = data.section;
	let setting = data.setting;
	let value = data.value;
	let before = data.endDate;
	let after = data.startDate;
	let [{
		statement,
		params,
		names,
		types}] = createBasicStatement(username, serial, section, 
			setting, value, before, after);
	
    let success = (results) => {
		const used = process.memoryUsage().heapUsed / 1024 / 1024;
		console.log(`The script uses approximately ${used} MB`);
		Response.send(results.recordset);
	};
	let fail = (err) => {
		console.log(err);
		Response.send([]);
	};
    sendPreparedStatement(statement, params, names, types, success, fail);
}

module.exports={
    gethistory: gethistory
};