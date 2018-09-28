// Includes
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const dateTime = require('node-datetime');
const cors = require('cors');

const mc = require('mongodb').MongoClient;
const mongoaddr = 'mongodb://localhost:27017';
const sha256 = require('js-sha256').sha256;

// JSON Files



const userDIR = './db/users.json';
const roomDIR = './db/rooms.json';
const groupDIR = './db/groups.json';
const superadminDIR = './db/superadmins.json';
const groupadminDIR = './db/groupadmins.json';

var users = require(userDIR);
var rooms = require(roomDIR);
var groups = require(groupDIR);
var superadmins = require(superadminDIR);
var groupadmins = require(groupadminDIR);



// Constants

// App Setup Data
const app = express();

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))

const http = require('http').Server(app);

// File Directories
app.use(express.static(__dirname+'/www'));
app.use(express.static(__dirname+'/www/img'));

app.use(express.static(path.join(__dirname,'../dist/irc')));

// Bodyparser setup
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Server Connection Information
const host = '127.0.0.1';

const port = 1337;

// Start Server
const server = http.listen(port,host,function()
{
	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
		if(err != null)
		{
			console.log(err);
		}
		else
		{
			const db = client.db('chatserver');

			db.createCollection('users');
			db.createCollection('groups');
			db.createCollection('rooms');
			db.createCollection('groupAdmins');
			db.createCollection('superAdmins');
			db.createCollection('userGroups');
		}
	});
	console.log('Server is listening on ' + host + ':' + port);
});

// Function Declarations

// Page Actions (get)

// Index - Login Page

app.get('/*',function(req,res)
{
	res.sendFile('index.html',{'root':'../dist/irc/'});
});

// Page Actions (post)

app.post('/api/deluser',function(req,res)
{
	console.log("request to /api/deluser");

	const name = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
		if(err != null)
		{
			console.log(err);
		}
		else
		{
			const collection = client.db('chatserver').collection('users');
			collection.deleteOne({_id:name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result);
				}
			});
		}
	});
	res.send({"success":true,"err":""})
});

app.post('/api/register',function(req,res)
{

	console.log("request to /api/register");

	var response = {
		"success":false,
		"err":""
	};

	const name = req.body.name;
	const mail = req.body.mail;
	const pass = req.body.pass;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('users');
			collection.insertOne({_id:name, name:name, mail:mail,pass: sha256(pass)}, function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result.ops);
				}
			});
	  }
	});

});

app.post('/api/rmadd',function(req,res)
{
	console.log("request to /api/rmadd");

	const name = req.body.name;
	const group = req.body.group;
	const room = req.body.room;

	var response =
	{
		"success":false,
		"err":""
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('userGroups');
			collection.update({_id:{name:name,group:group}},{$push: {rooms: room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result);
				}
			});
	  }
	});

	res.send(response);
});

app.post('/api/rmrmv',function(req,res)
{
	console.log("request to /api/rmrmv");

	const name = req.body.name;
	const group = req.body.group;
	const room = req.body.room;

	var response =
	{
		"success":false,
		"err":""
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('userGroups');
			collection.update({_id:{name:name,group:group}},{$pull: {rooms: room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result);
				}
			});
	  }
	});

	res.send(response);
});

app.post('/api/getgroup',function(req,res)
{

	console.log("request to /api/getgroup");

	const name = req.body.name;
	const group = req.body.group;

	var response =
	{
		"admin":false,
		"rooms":[]
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('userGroups');
			collection.find({_id: {name:name,group:group}}).toArray(function(err,docs)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					if (docs.length > 0)
					{
						data = docs[0].rooms;
						res.send({admin:false, rooms:data});
					}
					else
					{
						res.send({admin:false,rooms:[]})
					}
				}
			});
	  }
	});
});

app.post('/api/superpromote',function(req,res)
{

	console.log("request to /api/superpromote");

	const name = req.body.name;

	response = {
		"success":false,
		"err":""
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('superAdmins');
			collection.insertOne({_id:name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result);
				}
			});
	  }
	});
});

app.post('/api/superdemote',function(req,res)
{
	console.log("request to /api/superdemote");

	const name = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('superAdmins');
			collection.deleteOne({_id:name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/grouppromote',function(req,res)
{
	console.log("request to /api/grouppromote");

	const name = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groupAdmins');
			collection.insertOne({_id:name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/groupdemote',function(req,res)
{

	console.log("request to /api/groupdemote");

	const name = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groupAdmins');
			collection.deleteOne({_id:name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/creategroup',function(req,res)
{

	console.log("request to /api/creategroup");

	const group = req.body.group;
	const owner = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collections.insertOne({_id:group,owner:name,rooms:[]},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/deletegroup',function(req,res)
{
	console.log("request to /api/deletegroup");

	const group = req.body.group;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collections.deleteOne({_id:group},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/createroom',function(req,res)
{

	console.log("request to /api/createroom");

	const group = req.body.group;
	const room = req.body.room;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('rooms');
			collection.insertOne({_id: {group:group, room:room}, log:[]},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/deleteroom',function(req,res)
{

	console.log("request to /api/deleteroom");

	const group = req.body.group;
	const room = req.body.room;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collection.deleteOne({_id: {group:group, room:room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/room',function(req,res)
{
	console.log("request to /api/room");

	const group = req.body.group;
	const room = req.body.room;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collection.deleteOne({_id: {group:group, room:room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/data',function(req,res)
{
	console.log("request to /api/data");

	console.log(req.body);

	const name = req.body.name;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const users = client.db('chatserver').collection('users');
			const groups = client.db('chatserver').collection('groups');
			const superAdmins = client.db('chatserver').collection('superAdmins');
			const groupAdmins = client.db('chatserver').collection('groupAdmins');

			superAdmins.find({'_id':name},function(err,result)
			{
				if(err != null)
				{
					res.send({"err":err});
				}
				else if(result.length > 0)
				{
					groups.distinct(_id,{},function(err,docs)//.toArray(function(err,docs)
					{
						console.log(docs);
						res.send({'rank':'super',groups:docs});
					});
				}
				else
				{
					groupAdmins.find({_id:name},function(err,result)
					{
						if(err != null)
						{
							res.send({"err":err});
						}
						else if(result.length > 0)
						{
							groups.distinct(_id,{},function(err,docs)//.toArray(function(err,docs)
							{
								console.log(docs);
								res.send({'rank':'group',groups:docs})
							});
						}
						else
						{
							groups.distinct('_id',{id: {name:name,group: {$regex:".*"}}},function(err,docs)//.toArray(function(err,docs)
							{
								console.log(docs);
								res.send({'rank':'standard',groups:docs})
							});
						}
					});
				}
			});
	  }
	});
});

app.post('/api/login', function(req, res)
{
	console.log("request to /api/login");

  const name = req.body.name;
  const pass = req.body.pass;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('users');
			collection.find({_id:name, pass: sha256(pass)}, function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					if(result.length > 0)
					{
						res.send({"loggedIn":true,"err":0});
					}
					else
					{
						res.send({"loggedIn":false,"err":1});
					}
					console.log(result);
				}
			});
	  }
	});
});


app.post('/api/groupadd',function(req,res)
{
	console.log("request to /api/groupadd");

	const name = req.body.name;
	const group = req.body.group;

	response = {
		"success":false,
		"err":""
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collection.insertOne({_id: {name:name, group:group}},function()
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

app.post('/api/grouprmv',function(req,res)
{
	console.log("request to /api/grouprmv");

	const name = req.body.name;
	const group = req.body.group;

	response =
	{
		"success":false,
		"err":""
	};

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('groups');
			collection.deleteOne({_id: {name:name, group:group}},function()
			{
				if(err != null)
				{
					console.log(err);
					res.send({success:false,err:err});
				}
				else
				{
					console.log(result);
					res.send({sucesss:true,err:""});
				}
			});
	  }
	});
});

// JSON Functions

const writeJSON = (filepath,obj) =>
{
	const json = JSON.stringify(obj,null,2);

	fs.writeFile(filepath,json,'utf8',function(err)
	{
		if(err) throw err;
	});
}

// New User
const userJSON = (name,mail,pass) =>
{
	json =
	{
		"name":name,
		"mail":mail,
		"pass":pass,
		"salt":null,
		"groups":[{group:"lobby",rooms:['general']}]
	};

	return json;
};

// New Super Admin
const superadminJSON = (name) =>
{
	json =
	{
		"name":name
	};

	return json;
};

// New Group
const groupJSON = (group) =>
{
	json =
	{
		"group":group,
		"rooms":[roomJSON("general")]
	};

	return json;
};

// New Room
const roomJSON = (room) =>
{
	json =
	{
		"room":room,
		"log":[]
	};

	return json;
};

// New Message
const msgJSON = (user,msg) =>
{
	const dt = dateTime.create();

	json =
	{
		"user":user,
		"time":dt.format('Y-m-d H:M:S'),
		"msg":msg
	};

	return json;
};

// User Account Handling

const register = (name,mail,pass) =>
{
	if(!name || name.indexOf(' ') > -1)
	{
		return false;
	}

	if(!mail || mail.indexOf(' ') > -1)
	{
		return false;
	}

	if(!pass || pass.indexOf(' ') > -1)
	{
		return false;
	}

	for(var i=0; i<users.length;i++)
	{
		//console.log(users[i]);
		if(users[i]["name"] == name)
		{
			//console.log("Member already exists with name!");
			return false;
		}

		if(users[i]["mail"] == mail)
		{
			//console.log("Member already exists with email!");
			return false;
		}
	}

	users.push(userJSON(name,mail,pass));

	writeJSON(userDIR,users);

	return true;

};

const login = (name,pass) =>
{
	for(var i=0;i<users.length;i++)
	{
		if(users[i]["name"] == name && users[i]["pass"] == pass)
		{
			// login user
			return true;
		}
	}

	// block login
	return false;
};

const logout = (name) =>
{
	// logout user
};

// Promotion / Demotion Handling

// Super Admins

const promoteSuperAdmin = (user) =>
{
	var found = false;
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == user)
		{
			found = true;
			break;
		}
	}

	if(found)
	{
		for(var i = 0; i < superadmins.length; i++)
		{
			if (superadmins[i]["name"] == user)
			{
				return false;
			}
		}

		superadmins.push(superadminJSON(user));
		writeJSON(superadminDIR,superadmins);

		return true;
	}
	else
	{
		return false;
	}
};

const demoteSuperAdmin = (user) =>
{
	for(var i = 0; i < superadmins.length; i++)
	{
		if (superadmins[i]["name"] == user)
		{
			superadmins.splice(i,1);

			writeJSON(superadminDIR,superadmins);

			return true;
		}
	}
	return false;
};

// Group Admins

const promoteGroupAdmin = (user) =>
{
	for(var j = 0; j < groupadmins.length; j++)
	{
		if(groupadmins[j] == name)
		{
			return false;
		}
	}
	groupadmins.push(user);

	writeJSON(groupadminDIR,groupadmins);

	return true;
};

const demoteGroupAdmin = (user) =>
{
	for(var j = 0; j < groupadmins.length; j++)
	{
		if(groupadmins[j] == name)
		{
			groupadmins[i].splice(j,1);
			writeJSON(groupadminDIR,groupadmins);
			return true;
		}
	}
	return false;
};

// Group Handling

const createGroup = (group) =>
{
	if(group.indexOf(' ') > -1)
	{
		return false;
	}

	for(var i = 0;i<groups.length;i++)
	{
		if(groups[i]["group"] == group)
		{
			return false;
		}
	}

	groups.push(groupJSON(group));

	writeJSON(groupDIR,groups);

	return true;
};

const deleteGroup = (group) =>
{
	for(var i = 0; i < groups.length; i++)
	{
		if (groups[i]["group"] == group)
		{
			groups.splice(i,1);

			writeJSON(groupDIR,groups);

			return true;
		}
	}
	return false;
};

const addUserToGroup = (name,group) =>
{
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			for(var j = 0; j < users[i].groups.length; j++)
			{
				if(users[i].groups[j].group == group)
				{
					return false;
				}
			}
			data = {
				"group":group,
				"rooms":[]
			}
			users[i].groups.push(data);
			writeJSON(userDIR,users);
			return true;
		}
	}
};

const rmvUserFromGroup = (name,group) =>
{
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			for(var j = 0; j < users[i].groups.length; j++)
			{
				if(users[i].groups[j].group == group)
				{
					users[i].groups.splice(j,1);
					writeJSON(userDIR,users);
					return true;
				}
			}
			return false;
		}
	}
};

// Room Handling

const createRoom = (room,group) =>
{
	if(group.indexOf(' ') > -1)
	{
		return false;
	}

	if(room.indexOf(' ') > -1)
	{
		return false;
	}

	for(var i = 0; i < groups.length; i++)
	{
		if(groups[i]["group"]==group)
		{
			for(var j = 0; j < groups[i].rooms.length; j++)
			{
				if(groups[i]["rooms"][j].room == room)
				{
					return false;
				}
			}
			groups[i]["rooms"].push(roomJSON(room));
			break;
		}
	}

	writeJSON(groupDIR,groups);

	return true;
};

const deleteRoom = (room,group) =>
{
	for(var i = 0; i < groups.length; i++)
	{
		if(groups[i]["group"]==group)
		{
			for(var j = 0; j < groups[i].rooms.length; j++)
			{
				if(groups[i].rooms[j].room == room)
				{
					groups[i].rooms.splice(j,1);
					writeJSON(groupDIR,groups);
					return true;
				}
			}
			break;
		}
	}

	return false;
};

const addUserToRoom = (name,group,room) =>
{
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			for(var j = 0; j < users[i].groups.length; j++)
			{
				if(users[i].groups[j].group == group)
				{
					for(var k = 0; k < users[i].groups[j].rooms.length; k++)
					{
						if(users[i].groups[j].rooms[k] == room)
						{
							return false;
						}
					}
					users[i].groups[j].rooms.push(room);
					writeJSON(userDIR,users);
					return true;
				}
			}
		}
	}
};

const rmvUserFromRoom = (name,group,room) =>
{
	console.log(name);
	console.log(group);
	console.log(room);
	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			for(var j = 0; j < users[i].groups.length; j++)
			{
				if(users[i].groups[j].group == group)
				{
					for(var k = 0; k < users[i].groups[j].rooms.length; k++)
					{
						if(users[i].groups[j].rooms[k] == room)
						{
							users[i].groups[j].rooms.splice(k,1);
							writeJSON(userDIR,users);
							return true;
						}
					}
					return false;
				}
			}
		}
	}
};

const deleteUser = (name) =>
{
	for(var i = 0; i < superadmins.length; i++)
	{
		if(users[i].name == name)
		{
			superadmins.splice(i,1);
			writeJSON(superadminDIR,superadmins);
		}
	}

	for(var i = 0; i < groupadmins.length; i++)
	{
		if(users[i].name == name)
		{
			groupadmins.splice(i,1);
			writeJSON(groupadminDIR,groupadmins);
		}
	}


	for(var i = 0; i < users.length; i++)
	{
		if(users[i].name == name)
		{
			users.splice(i,1);
			writeJSON(userDIR,users);
			return true;
		}
	}

	return false;
};

// Main Process
