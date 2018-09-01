// Includes
const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");
const dateTime = require('node-datetime');

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

// File Directories
app.use(express.static(__dirname+'/www'));
app.use(express.static(__dirname+'/www/img'));

app.use(express.static(__dirname+'/www/login'));
app.use(express.static(__dirname+'/www/logout'));
app.use(express.static(__dirname+'/www/register'));
app.use(express.static(__dirname+'/www/dashboard'));

// Bodyparser setup
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const http = require('http').Server(app);

// Server Connection Information
const host = '127.0.0.1';

const port = 1337;

// Start Server
const server = http.listen(port,host,function()
{
	console.log('Server is listening on ' + host + ':' + port);
});

// Function Declarations

// Page Actions (get)

// Index - Login Page
app.get('/',function(req,res)
{
	res.sendFile(__dirname + "/www/login/login.html");
});

// Dashboard Page
app.get('/dashboard',function(req,res)
{
	res.sendFile(__dirname+"/www/dashboard/dashboard.html");
});

// Register Page
app.get('/register',function(req,res)
{
	res.sendFile(__dirname+"/www/register/register.html");
});

// Page Actions (post)

app.post('/regpost',function(req,res)
{
	var response = {
		"success":false,
		"err":""
	};
	
	const name = req.body.name;
	const mail = req.body.mail;
	const pass = req.body.pass;
	
	if(register(name,mail,pass))
	{
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "User with this name / email already exists!";
		res.send(response);
	}
});

app.post('/group',function(req,res)
{
	const name = req.body.name;
	const group = req.body.group;
	
	var response = 
	{
		"admin":false,
		"rooms":[]
	};
	
	for(var i = 0; i < superadmins.length; i++)
	{
		if (superadmins[i].name == name)
		{
			response.admin = true;
		}
	}
	
	for(var i = 0; i < groups.length; i++)
	{
		if (groups[i]["group"]==group)
		{
			if(!response.admin)
			{
				for(var j = 0; j < groups[i].admins.length; j++)
				{
					if (groups[i]["group"].admins[j] == name)
					{
						response.admin = true;
						break;
					}
				}
			}
			response.rooms = groups[i].rooms;
		}
	}
	res.send(response);
});

app.post('/superpromote',function(req,res)
{
	const name = req.body.name;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(promoteSuperAdmin(name))
	{
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "User '"+name+"' does not exist or is already super admin.";
		res.send(response);
	}
});

app.post('/superdemote',function(req,res)
{
	const name = req.body.name;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(demoteSuperAdmin(name))
	{
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "User '"+name+"' does not exist or is not super admin.";
		res.send(response);
	}
});

app.post('/creategroup',function(req,res)
{
	const group = req.body.group;
	const owner = req.body.name;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(createGroup(group,owner))
	{
		for(var i = 0; i < users.length; i++)
		{
			if(users[i].name == owner)
			{
				users[i].groups.push(group);
			}
		}
		writeJSON(userDIR,users);
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "Group '"+group+"' already exists.";
		res.send(response);
	}	
});

app.post('/deletegroup',function(req,res)
{
	const group = req.body.group;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(deleteGroup(group))
	{
		for(var i = 0; i < users.length; i++)
		{
			for(var j = 0; j < users[i].groups.length; j++)
			{
				if (users[i].groups[j] == group)
				{
					users[i].groups.splice(j,1);
				}
			}
		}
		writeJSON(userDIR,users);
		
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "Group '"+group+"' does not exist.";
		res.send(response);
	}
});

app.post('/createroom',function(req,res)
{
	const group = req.body.group;
	const room = req.body.room;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(createRoom(room,group))
	{
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "Group '"+group+"' already exists.";
		res.send(response);
	}	
});

app.post('/deleteroom',function(req,res)
{
	const group = req.body.group;
	const room = req.body.room;
	
	response = {
		"success":false,
		"err":""
	};
	
	if(deleteRoom(room,group))
	{
		response.success = true;
		res.send(response);
	}
	else
	{
		response.err = "Group '"+group+"' does not exist.";
		res.send(response);
	}
});

app.post('/room',function(req,res)
{
	const name = req.body.name;
	const group = req.body.group;
	const room = req.body.room;
	
	var response = 
	{
		"log":[]
	}
	
	for(var i = 0; i < groups.length; i++)
	{
		if (groups[i]["group"]==group)
		{
			for(var j = 0; j < groups[i].rooms.length; j++)
			{
				if(groups[i].rooms[j].log);
			}
		}
	}
	res.send(response);
});

app.post('/data',function(req,res)
{
	const name = req.body.name;
	
	var response = 
	{
		'super':false,
		'groups':[]
	};
	
	for(var i = 0; i < superadmins.length; i++)
	{
		if(superadmins[i]["name"] == name)
		{
			response["super"] = true;
			break;
		}
	}
	
	if(response.super)
	{
		for(var i = 0; i < groups.length; i++)
		{
			response.groups.push(groups[i].group);
		}
	}
	else
	{
		for(var i = 0; i < users.length; i++)
		{
			if(users[i]["name"] == name)
			{
				response['groups'] = users[i]['groups'];
				break;
			}
		}
	}
	res.send(response);
});

app.post('/login', function(req, res)
{	
    const name = req.body.name;
    const pass = req.body.pass;

	for(var i=0;i<users.length;i++)
	{
		if (users[i]["name"] == name)
		{
			if(users[i]["pass"] == pass)
			{
				// logged in!
				result = {"loggedIn":true};
				res.send(result);
			}
			else
			{
				// wrong password
				result = {"loggedIn":false,"err":0};
				res.send(result);
			}
		}
	}
	
	// user not found
	result = {"loggedIn":false,"err":1};
	res.send(result);
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
		"groups":["lobby"]
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
const groupJSON = (group,owner) =>
{
	json = 
	{
		"group":group,
		"admins":[owner],
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
	if(name.indexOf(' ') > -1)
	{
		return false;
	}
	
	if(mail.indexOf(' ') > -1)
	{
		return false;
	}
	
	if(pass.indexOf(' ') > -1)
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

const promoteGroupAdmin = (user,group) =>
{
	for(var i = 0; i < groups.length; i++)
	{
		if (groups[i]["group"] == group)
		{
			for(var j = 0; j < groups[i].admins.length; j++)
			{
				if(groups[i].admins[j] == name)
				{
					return false;
				}
			}
			groups[i].admins.append(name);
			break;
		}
	}
	
	writeJSON(groupDIR,groups);
	
	return true;
};

const demoteGroupAdmin = (caller,user,group) =>
{
	for(var i = 0; i < groups.length; i++)
	{
		if (groups[i]["group"] == group)
		{
			for(var j = 0; j < groups[i].admins.length; j++)
			{
				if(groups[i].admins[j] == name)
				{
					groups[i].admins.splice(j,1);
					writeJSON(groupDIR,groups);
					return true;
				}
			}
			break;
		}
	}
	return false;
};

// Group Handling

const createGroup = (group,owner) =>
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
	
	groups.push(groupJSON(group,owner));
	
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
			for(var j = 0; j < rooms.length; j++)
			{
				if(groups[i]["rooms"][j] == room)
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

// Main Process
