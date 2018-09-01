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

// Logout Page
app.get('/logout',function(req,res)
{
	// if logged in, send page
	// else send 403
	res.sendFile(__dirname + "/www/logout/logout.html");
});

// Dashboard Page
app.get('/dashboard',function(req,res)
{
	res.sendFile(__dirname+"/www/dashboard/dashboard.html");
});

// Page Actions (post)

app.post('/group',function(req,res)
{
	const name = req.body.name;
	const group = req.body.group;
	
	var response = 
	{
		
	};
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
	
	for(var i = 0; i < users.length; i++)
	{
		if(users[i]["name"] == name)
		{
			response['groups'] = users[i]['groups'];
			break;
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
const groupJSON = (group) =>
{
	json = 
	{
		"group":group,
		"admins":[],
		"rooms":[]
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
	for(var i=0; i<users.length;i++)
	{
		//console.log(users[i]);
		if(users[i]["name"] == name)
		{
			console.log("Member already exists with name!");
			return false;
		}
		
		if(users[i]["mail"] == mail)
		{
			console.log("Member already exists with email!");
			return false;
		}
	}
	
	users.push(userJSON(name,mail,pass));
	
	writeJSON(userDIR,users);
	
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
	for(var i = 0; i < superadmins.length; i++)
	{
		if (superadmins[i]["name"] == user)
		{
			return false;
		}
	}
	
	writeJSON(superadminDIR,superadmins);
	
	return true;
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
	var allowed = false;

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
	
	writeJSON(groupadminDIR,groups);
	
	return true;
};

const demoteGroupAdmin = (caller,user,group) =>
{
	for(var i = 0; i < groupadmins.length; i++)
	{
		if (groupadmins[i]["name"] == user && groupadmins[i]["group"] == group)
		{
			groupadmins.splice(i,1);
			
			writeJSON(groupadminDIR,groupadmins);
			
			return true;
		}
	}
	return false;
};

// Group Handling

const createGroup = (group) =>
{
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

// Room Handling

const createRoom = (room,group) =>
{
	for(var i = 0; i < groups.length; i++)
	{
		if(groups[i]["name"]==group)
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
	for(var i = 0; i < rooms.length; i++)
	{
		if (rooms[i]["group"] == group && rooms[i]["room"] == room)
		{
			rooms.splice(i,1);
			
			writeJSON(roomDIR,rooms);
			
			return true;
		}
	}
	return false;
};

// Main Process
