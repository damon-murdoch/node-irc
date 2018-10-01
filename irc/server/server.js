// Includes
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require("fs");
const moment = require('moment');
const cors = require('cors');

const mc = require('mongodb').MongoClient;
const mongoaddr = 'mongodb://localhost:27017';
const sha256 = require('js-sha256').sha256;

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

const io = require('socket.io')(http);

// Client Connect - Create new socket connection
io.on('connection',(socket)=>
{
  console.log('New user connected!');
  io.emit('message',{type:'announcement',text:'New user connected!'});
  
  // Client Disconnect
  socket.on('disconnect',(socket)=>
  {
    console.log('User disconnected!');
  io.emit('message',{type:'announcement',text:'User disconnected!'});
  })

  // Recieve message from socket connection and broadcast it
  socket.on('add-message',(message)=>
  {
    console.log('message sent:');
    console.log(message);
    io.emit('message',{type:'message',text:message});
  })
})

module.exports = 
{
	listen: function()
	{
	  // Connect to MongoDB and create required database connections - also inserting super user if he does not already exist
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

		  const users = db.collection('users');
		  const superAdmins = db.collection('superAdmins');

		  users.insertOne({'_id':'super','name':'super',mail:'super@chatserver.net',pass:sha256('super')},function(err,result){});
		  superAdmins.insertOne({'_id':'super'},function(err,result){});
		}
	  });
	  console.log('Server is listening on ' + host + ':' + port);
	},
	
	getall: function(req,res)
	{
	  res.sendFile('index.html',{'root':'../dist/irc/'});
	},
	
	'deluser': function(req,res)
	{
	  console.log("request to /api/deluser");

	  const name = req.body.name;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('users');
		  collection.deleteOne({'_id':name},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':''});
			}
		  });
		}
	  });
	},
	
	register: function(req,res)
	{
	  console.log("request to /api/register");

	  var response = {
		"success":false,
		'err':""
	  };

	  const name = req.body.name;
	  const mail = req.body.mail;
	  const pass = req.body.pass;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('users');
		  collection.insertOne({'_id':name, 'name':name, mail:mail,pass: sha256(pass)}, function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result.ops})
			}
		  });
		}
	  });
	},
	
	rmadd: function(req,res)
	{
	  console.log("request to /api/rmadd");

	  const name = req.body.name;
	  const group = req.body.group;
	  const room = req.body.room;

	  console.log(req.body);

	  var response =
	  {
		"success":false,
		'err':""
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('userGroups');
		  collection.updateOne({'_id':{'name':name,'group':group}},{$push: {rooms: room}},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	rmrmv:function(req,res)
	{
	  console.log("request to /api/rmrmv");

	  const name = req.body.name;
	  const group = req.body.group;
	  const room = req.body.room;

	  var response =
	  {
		"success":false,
		'err':""
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('userGroups');
		collection.updateOne({'_id':{'name':name,'group':group}},{$pull: {rooms: room}},function(err,result)
		{
		  if(err != null)
		  {
		  res.send({'success':false,'err':err.errmsg});
		  }
		  else
		  {
		  res.send({'success':true,'err':result});
		  }
		});
		}
	  });
	},
	
	getgroup: function(req,res)
	{

	  console.log("request to /api/getgroup");

	  const name = req.body.name;
	  const group = req.body.group;

	  console.log(req.body);

	  var response =
	  {
		"admin":false,
		"rooms":[]
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const users = client.db('chatserver').collection('users');
		  const groups = client.db('chatserver').collection('groups');
		  const rooms = client.db('chatserver').collection('rooms');
		  const superAdmins = client.db('chatserver').collection('superAdmins');
		  const groupAdmins = client.db('chatserver').collection('groupAdmins');
		  const userGroups = client.db('chatserver').collection('userGroups');

		  superAdmins.find({'_id':name}).toArray(function(err,result)//function(err,result)
		  {
			if(err != null)
			{
			  res.send({'err':err});
			}
			else if(result.length > 0)
			{
				rooms.distinct('room',{'group':group},function(err,docs)
			  {
				console.log(docs);
				res.send({"admin":false,rooms:docs})
			  });
			}
			else
			{
			  groupAdmins.find({'_id':name}).toArray(function(err,result)
			  {
				if(err != null)
				{
				  res.send({'err':err});
				}
				else if(result.length > 0)
				{
				  rooms.distinct('room',{'group':group},function(err,docs)
				  {
					console.log(docs);
					res.send({"admin":false,rooms:docs})
				  });
				}
				else
				{
				  userGroups.distinct('rooms',{'name':name,'group':group},function(err,docs)
				  {
					console.log(docs);
					res.send({"admin":false,rooms:docs})
				  });
				}
			  });
			}
		  });
		}
	  });
	},
	
	superpromote: function(req,res)
	{

	  console.log("request to /api/superpromote");

	  const name = req.body.name;

	  response = {
		"success":false,
		'err':""
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('superAdmins');
		  collection.insertOne({'_id':name},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	superdemote: function(req,res)
	{
	  console.log("request to /api/superdemote");

	  const name = req.body.name;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('superAdmins');
		  collection.deleteOne({'_id':name},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	grouppromote: function(req,res)
	{
	  console.log("request to /api/grouppromote");

	  const name = req.body.name;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('groupAdmins');
		  collection.insertOne({'_id':name},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	groupdemote: function(req,res)
	{

	  console.log("request to /api/groupdemote");

	  const name = req.body.name;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('groupAdmins');
		  collection.deleteOne({'_id':name},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	creategroup: function(req,res)
	{

	  console.log("request to /api/creategroup");

	  const group = req.body.group;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('groups');
		  collection.insertOne({'_id':group,'rooms':[]},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	deletegroup: function(req,res)
	{
	  console.log("request to /api/deletegroup");

	  const group = req.body.group;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('groups');
		  collection.deleteOne({'_id':group},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'sucesss':true,'err':result});
			}
		  });
		}
	  });
	},
	
	createroom: function(req,res)
	{

	  console.log("request to /api/createroom");

	  const group = req.body.group;
	  const room = req.body.room;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('rooms');
		  collection.insertOne({'_id': {'group':group, 'room':room}, 'group':group, 'room':room, 'log':[]},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'sucesss':true,'err':result});
			}
		  });
		}
	  });
	},
	
	deleteroom: function(req,res)
	{

	  console.log("request to /api/deleteroom");

	  const group = req.body.group;
	  const room = req.body.room;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('rooms');
		  collection.deleteOne({'_id': {'group':group, 'room':room}},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  });
	},
	
	room: function(req,res)
	{
	  const compare = (a,b) => {
		if (a.time < b.time)
		return -1;
		if (a.time > b.time)
		return 1;
		return 0;
	  };
	  
	  console.log("request to /api/room");

	  console.log(req.body);

	  const group = req.body.group;
	  const room = req.body.room;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('rooms');
		  collection.distinct('log',{'_id': {'group':group,'room':room}},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  // sort by timestamp
			  result.sort(compare);
			  res.send({'sucesss':true,'data':result});
			}
		  });
		}
	  });
	},
	
	msg: function(req,res)
	{
	  console.log('request to /api/msg');

	  console.log(req.body);

	  const name = req.body.name;
	  const group = req.body.group;
	  const room = req.body.room;
	  const msg = req.body.msg;

	  mc.connect(mongoaddr,{useNewUrlParser: true},function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('rooms');
		  collection.updateOne({_id: {group: group, room:room}},{$push : {'log':{'name':name,'time':moment().format('YYYY-MM-DD:hh:mm:ss'), 'msg':msg}}},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'success':true,'err':result});
			}
		  });
		}
	  })
	},
	
	data: function(req,res)
	{
	  console.log("request to /api/data");

	  console.log(req.body);

	  const name = req.body.name;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const users = client.db('chatserver').collection('users');
		  const groups = client.db('chatserver').collection('groups');
		  const superAdmins = client.db('chatserver').collection('superAdmins');
		  const groupAdmins = client.db('chatserver').collection('groupAdmins');
		  const userGroups = client.db('chatserver').collection('userGroups');

		  superAdmins.find({'_id':name}).toArray(function(err,result)//function(err,result)
		  {
			if(err != null)
			{
			  res.send({'err':err});
			}
			else if(result.length > 0)
			{
			  groups.distinct('_id',{},function(err,docs)
			  {
				res.send({'rank':'super',groups:docs});
			  });
			}
			else
			{
			  groupAdmins.find({'_id':name}).toArray(function(err,result)
			  {
				if(err != null)
				{
				  res.send({'success':false,'err':err});
				}
				else if(result.length > 0)
				{
				  groups.distinct('_id',{},function(err,docs)
				  {
					res.send({'rank':'group',groups:docs})
				  });
				}
				else
				{
				  userGroups.distinct('group',{'name':name},function(err,docs)
				  {
					res.send({'rank':'standard',groups:docs})
				  });
				}
			  });
			}
		  });
		}
	  });
	},
	
	login: function(req, res)
	{
	  console.log("request to /api/login");

	  const name = req.body.name;
	  const pass = req.body.pass;

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('users');
		  collection.find({'_id':name, pass: sha256(pass)}).toArray(function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  if(result.length > 0)
			  {
				res.send({"loggedIn":true,'err':0});
			  }
			  else
			  {
				res.send({"loggedIn":false,'err':1});
			  }
			}
		  });
		}
	  });
	},
	
	groupadd: function(req,res)
	{
	  console.log("request to /api/groupadd");

	  const name = req.body.name;
	  const group = req.body.group;

	  response = {
		"success":false,
		'err':""
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('userGroups');
		  collection.insertOne({'_id': {'name':name, 'group':group},'name':name, 'group':group, 'rooms' : []},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'sucesss':true,'err':""});
			}
		  });
		}
	  });
	},
	
	grouprmv: function(req,res)
	{
	  console.log("request to /api/grouprmv");

	  const name = req.body.name;
	  const group = req.body.group;

	  response =
	  {
		"success":false,
		'err':""
	  };

	  mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	  {
		if(err != null)
		{
		  res.send({'success':false,'err':err.errmsg});
		}
		else
		{
		  const collection = client.db('chatserver').collection('userGroups');
		  collection.deleteOne({'name':name, 'group':group},function(err,result)
		  {
			if(err != null)
			{
			  res.send({'success':false,'err':err.errmsg});
			}
			else
			{
			  res.send({'sucesss':true,'err':""});
			}
		  });
		}
	  });
	}
};

// Start Server
const server = http.listen(port,host,module.exports.listen);

// Route Declarations

// If project is compiled, send the angular main page on any directory location

app.get('/*',module.exports.getall);

// Delete a user from the 'users' table

app.post('/api/deluser',module.exports.deluser);

// Register a new user in the users table

app.post('/api/register',module.exports.register);

// add a user to a given room in a given channel

app.post('/api/rmadd',module.exports.rmadd);

// remove a user from a given room in a given channel

app.post('/api/rmrmv',module.exports.rmrmv);

// sends the rooms visible to a given user within the requested group

app.post('/api/getgroup',module.exports.getgroup);

// promote given user to super admin

app.post('/api/superpromote',module.exports.superpromote);

// demote given user from super admin

app.post('/api/superdemote',module.exports.superdemote);

// promote given user to group admin

app.post('/api/grouppromote',module.exports.grouppromote);

// demote given user from group admin

app.post('/api/groupdemote',module.exports.groupdemote);

// create a new group with given name and no starting rooms

app.post('/api/creategroup',module.exports.creategroup);

// delete a group with given name

app.post('/api/deletegroup',module.exports.deletegroup);

// create a new room of given name within a given group

app.post('/api/createroom',module.exports.createroom);

// delete a room of given name within a given group

app.post('/api/deleteroom',module.exports.deleteroom);

// get data of room with given name inside given group

app.post('/api/room',module.exports.room);

// new message to insert into chatlog
app.post('/api/msg',module.exports.msg);

// executed on dashboard launch - loads all groups visible to user

app.post('/api/data',module.exports.data);

// logs user in

app.post('/api/login',module.exports.login);

// add user with given name to given group

app.post('/api/groupadd',module.exports.groupadd);

// remove user with given name from given group

app.post('/api/grouprmv',module.exports.grouprmv);

module.exports.app = app;