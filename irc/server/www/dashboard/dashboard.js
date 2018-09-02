function promoteUser()
{
	const name = prompt("Please name a user to promote","");
	$.post("http://127.0.0.1:1337/superpromote",
	{
		"name":name
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("adminmsg").innerHTML = "<p> User "+name+" promoted successfully.</p>";
		}
		else
		{
			document.getElementById("adminmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
	});
}

function demoteUser()
{
	const name = prompt("Please name a user to demote","");
	$.post("http://127.0.0.1:1337/superdemote",
	{
		"name":name
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("adminmsg").innerHTML = "<p> User "+name+" demoted successfully.</p>";
		}
		else
		{
			document.getElementById("adminmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
	});
}

function getGroup(groupname)
{
	$.post("http://127.0.0.1:1337/group",
	{
		"name":localStorage["name"],
		"group":groupname
	},
	function(data)
	{
		var admin = data.admin;
		
		document.getElementById("grpname").innerHTML = "<p>Now in group '"+groupname+"'.<\p>";
		document.getElementById("grproom").innerHTML ="";
		
		if(admin)
		{
			document.getElementById("grpadmin").innerHTML = "<p> Group Admin Toolbar </p>"+
															"<div id='grptoolbar'>"+
																"<a href=# onclick=promoteGroupUser('" + groupname + "') > Promote User </a>"+
																"<a href=# onclick=demoteGroupUser('" + groupname + "') > Demote User </a>"+
																"<a href=# onclick=inviteGroupUser('" + groupname + "') > Invite User </a>"+
																"<a href=# onclick=deleteGroup('" + groupname + "') > Delete Group </a>"+
																"<a href=# onclick=createRoom('" + groupname + "') > Create Room </a>"+
															"</div>";
		}
		
		if(data["rooms"])
		{
			document.getElementById("rooms").innerHTML = "Rooms: " + data["rooms"].length;
			for(var i = 0; i < data["rooms"].length; i++)
			{
				var roomname = data.rooms[i].room;
				document.getElementById("grproom").innerHTML += "<a href=# onclick = getRoom('"+groupname+"','"+roomname+"','"+admin+"');>"+roomname+"</a></br>";
			}
		}
	});
}

function createGroup()
{
	const group = prompt("Please enter a group name","");
	$.post("http://127.0.0.1:1337/creategroup",
	{
		"name":localStorage["name"],
		"group":group
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("adminmsg").innerHTML = "<p> Group "+group+" created successfully.</p>";
		}
		else
		{
			document.getElementById("adminmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
		location.reload();
	});
}

function deleteGroup(group)
{
	$.post("http://127.0.0.1:1337/deletegroup",
	{
		"group":group
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("adminmsg").innerHTML = "<p> Group "+group+" deleted successfully.</p>";
		}
		else
		{
			document.getElementById("adminmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
		location.reload();
	});
}

function promoteGroupUser()
{
	
}

function demoteGroupUser()
{
	
}

function inviteGroupUser()
{
	
}

function getRoom(groupname,roomname,admin)
{
	$.post("http://127.0.0.1:1337/room",
	{
		"name":localStorage["name"],
		"group":groupname,
		"room":roomname
	},
	function(data)
	{
		document.getElementById("rmname").innerHTML = "<p>Now in room '"+roomname+"'.<\p>"
		
		if(admin)
		{
			document.getElementById("rmadmin").innerHTML = "<p> Room Admin Toolbar </p>"+
															"<div id='rmtoolbar'>"+
																"<a href=# onclick=deleteRoom('" + groupname + "','" + roomname + "') > Delete Room </a>"+
															"</div>";
		}
		
		if(data["log"])
		{
			for(var i = 0; i < data["log"].length; i++)
			{
				var msg = data["log"][i];
				document.getElementById("rmchat").innerHTML += "<p>" + msg["user"] + "[" + msg["time"] + "]:" + msg["msg"] + "</p></br>"				
			}
		}
	});
}

function createRoom(group)
{
	const room = prompt("Please enter a room name","");
	$.post("http://127.0.0.1:1337/createroom",
	{
		"group":group,
		"room":room
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("rmmsg").innerHTML = "<p> Room "+room+" created successfully.</p>";
		}
		else
		{
			document.getElementById("rmmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
		getGroup(group);
	});
}

function deleteRoom(group,room)
{
	console.log(group);
	console.log(room);
	$.post("http://127.0.0.1:1337/deleteroom",
	{
		"group":group,
		"room":room
	},
	function(data)
	{
		if(data.success)
		{
			document.getElementById("rmmsg").innerHTML = "<p> Room "+room+" deleted successfully.</p>";
		}
		else
		{
			document.getElementById("rmmsg").innerHTML = "<p>Error: "+data.err+"</p>";
		}
		
		document.getElementById("rmname").innerHTML="";
		
		getGroup(group);
	});
}

function logout()
{
	localStorage.name;
	
	document.getElementById("logoutmsg").innerHTML = "Logging out " + localStorage.name + "...";

	localStorage.removeItem("name");

	localStorage.removeItem("pass");
	
	$(location).attr('href','/')
}

$(document).ready(function () 
{
	if(localStorage["name"])
	{
		var name = localStorage["name"];
		
		document.getElementById("hellodiv").innerHTML += name + "!";
		
		$.post("http://127.0.0.1:1337/data",
		{
			"name": name
		},
		function(data)
		{
			if (data["super"])
			{
				document.getElementById("admin").innerHTML = "<p> Super Admin Toolbar </p>"+
															 "<div id='admintoolbar'>"+
																"<a href=# onclick=promoteUser() > Promote User </a>"+
																"<a href=# onclick=demoteUser() > Demote User </a>"+
																"<a href=# onclick=createGroup() > Create Group </a>"+
															 "</div>";
			}
			
			if (data["groups"])
			{
				document.getElementById("groups").innerHTML = "Groups: "+data["groups"].length;
				document.getElementById("groups").innerHTML += "</br>"
				
				for(var i = 0; i < data["groups"].length; i++)
				{
					var groupname = data["groups"][i];
					document.getElementById("groups").innerHTML += "<a href=# onclick = getGroup('"+groupname+"');>"+groupname+"</a></br>";
				}
			}
		});
	}
	else
	{
		$(location).attr('href','/');
	}
});