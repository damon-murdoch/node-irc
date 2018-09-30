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

io.on('connection',(socket)=>
{
  console.log('New user connected!');
})

io.on('disconnect',(socket)=>
{
  console.log('User disconnected!');
})

io.on('add-message',(message)=>
{
  console.log('message sent:');
  console.log(message);
  io.emit('message',{type:'message',text:message});
})

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

			const users = db.collection('users');
			const superAdmins = db.collection('superAdmins');

			users.insertOne({'_id':'super','name':'super',mail:'super@chatserver.net',pass:sha256('super')},function(err,result)
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

			superAdmins.insertOne({'_id':'super'},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
				}
				else
				{
					console.log(result);
				}
			})
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
			collection.deleteOne({'_id':name},function(err,result)
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
			collection.insertOne({'_id':name, 'name':name, mail:mail,pass: sha256(pass)}, function(err,result)
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

  console.log(req.body);

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
			collection.updateOne({'_id':{'name':name,'group':group}},{$push: {rooms: room}},function(err,result)
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
			collection.updateOne({'_id':{'name':name,'group':group}},{$pull: {rooms: room}},function(err,result)
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
	    console.log(err);
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
      		res.send({"err":err});
      	}
        else if(result.length > 0)
        {
          //groups.distinct('rooms',{'_id':group},function(err,docs)//.toArray(function(err,docs)
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
      				res.send({"err":err});
      			}
      			else if(result.length > 0)
      			{
      				rooms.distinct('room',{'group':group},function(err,docs)//.toArray(function(err,docs)
      				{
      					console.log(docs);
      					res.send({"admin":false,rooms:docs})
      				});
      			}
      			else
      			{
      				userGroups.distinct('rooms',{'name':name,'group':group},function(err,docs)//.toArray(function(err,docs)
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
			collection.insertOne({'_id':name},function(err,result)
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
			collection.deleteOne({'_id':name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
			collection.insertOne({'_id':name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
			collection.deleteOne({'_id':name},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
				}
			});
	  }
	});
});

app.post('/api/creategroup',function(req,res)
{

	console.log("request to /api/creategroup");

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
			collection.insertOne({'_id':group,'rooms':[]},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
			collection.deleteOne({'_id':group},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
			collection.insertOne({'_id': {'group':group, 'room':room}, 'group':group, 'room':room, 'log':[]},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
	    const collection = client.db('chatserver').collection('rooms');
			collection.deleteOne({'_id': {'group':group, 'room':room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
				}
			});
	  }
	});
});

app.post('/api/room',function(req,res)
{
	console.log("request to /api/room");

  console.log(req.body);

	const group = req.body.group;
	const room = req.body.room;

	mc.connect(mongoaddr,{useNewUrlParser: true}, function(err,client)
	{
	  if(err != null)
	  {
	    console.log(err);
      res.send({'success':false,'err':err});
	  }
	  else
	  {
	    const collection = client.db('chatserver').collection('rooms');
			collection.distinct('log',{'_id': {'group':group,'room':room}},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'data':result});
				}
			});
	  }
	});
});

app.post('/api/msg',function(req,res)
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
	    console.log(err);
      res.send({'err':err});
	  }
	  else
	  {
      const collection = client.db('chatserver').collection('rooms');
      collection.updateOne({_id: {group: group, room:room}},{$push : {'log':{'name':name,'time':moment().format('YYYY-MM-DD:hh:mm:ss'), 'msg':msg}}},function(err,result)
      {
        if(err != null)
        {
          console.log(err);
          res.send({'err':err})
        }
        else
        {
          console.log(result);
          res.send({'err':result});
        }
      });
    }
  })
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
      const userGroups = client.db('chatserver').collection('userGroups');

			superAdmins.find({'_id':name}).toArray(function(err,result)//function(err,result)
			{
				if(err != null)
				{
					res.send({"err":err});
				}
				else if(result.length > 0)
				{
					groups.distinct('_id',{},function(err,docs)//.toArray(function(err,docs)
					{
						console.log(docs);
            console.log("super admin");
						res.send({'rank':'super',groups:docs});
					});
				}
				else
				{
					groupAdmins.find({'_id':name}).toArray(function(err,result)
					{
						if(err != null)
						{
							res.send({"err":err});
						}
						else if(result.length > 0)
						{
							groups.distinct('_id',{},function(err,docs)//.toArray(function(err,docs)
							{
								console.log(docs);
								res.send({'rank':'group',groups:docs})
							});
						}
						else
						{
							userGroups.distinct('group',{'name':name},function(err,docs)//.toArray(function(err,docs)
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
			collection.find({'_id':name, pass: sha256(pass)}).toArray(function(err,result)
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
	    const collection = client.db('chatserver').collection('userGroups');
			collection.insertOne({'_id': {'name':name, 'group':group},'name':name, 'group':group, 'rooms' : []},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
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
	    const collection = client.db('chatserver').collection('userGroups');
			collection.deleteOne({'name':name, 'group':group},function(err,result)
			{
				if(err != null)
				{
					console.log(err);
					res.send({'success':false,'err':err.errmsg});
				}
				else
				{
					console.log(result);
					res.send({'sucesss':true,'err':""});
				}
			});
	  }
	});
});
