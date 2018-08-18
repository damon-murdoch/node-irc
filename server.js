// Includes
const express = require('express');
const bodyParser = require('body-parser');

const fs = require("fs");

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
app.use(express.static(__dirname+'/img'));

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

// Page Actions

// Index - Login Page
app.get('/',function(req,res)
{
	res.sendFile(__dirname + "/www/login.html");
});

// Logout Page
app.get('/',function(req,res)
{
	// if logged in, send page
	// else send 403
	res.sendFile(__dirname + "/www/logout.html");
});

// Dashboard Page
app.get('/',function(req,res)
{
	// if logged in, send page
	// else send 403
	res.sendFile(__dirname + "/www/dashboard.html");
});

app.get('/groups/:groupno?',function(req,res)
{
	// if user is in group, view group page
	// else send 403
	res.send("You're on the " + req.params.groupno + " group!");
});

app.get('/groups/:group?/:room?',function(req,res)
{
	// if user is in group, view group page
	// else send 403
	res.send("You're in the '" + req.params.room + "' room in the '" + req.params.group + "' group!");
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
		"salt":null
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

// New Group Admin
const groupadminJSON = (name,group) =>
{
	json = 
	{
		"name":name,
		"group":group
	};
	
	return json;
};

// New Group
const groupJSON = (group) =>
{
	json = 
	{
		"group":group
	};
	
	return json;
};

// New Room
const roomJSON = (room,group) =>
{
	json = 
	{
		"room":room,
		"group":group
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
	for(var i = 0; i < groupadmins.length; i++)
	{
		if (groupadmins[i]["name"] == user && groupadmins[i]["group"] == group)
		{
			return false;
		}
	}
	
	writeJSON(groupadminDIR,groupadmins);
	
	return true;
};

const demoteGroupAdmin = (user,group) =>
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
	for(var i = 0;i<rooms.length;i++)
	{
		if(rooms[i]["group"] == group && rooms[i]["room"] == room)
		{
			return false;
		}
	}
	
	rooms.push(roomJSON(room,group));
	
	writeJSON(roomDIR,rooms);
	
	returntrue;
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
