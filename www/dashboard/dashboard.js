function getGroup(groupname)
{
	$.post("http://127.0.0.1:1337/group",
	{
		"name":localstorage["name"],
		"group":groupname
	},
	function(data)
	{
		document.getElementById("grpname").innerHTML = "<p>"+groupname+"<\p>"
		
		if(data["rooms"])
		{
			for(var i = 0; i < data["rooms"].length; i++)
			{
				var roomname = data["rooms"][i];
				document.getElementById("rooms").innerHTML += "<a href=# onclick = getRoom('"+groupname+","+roomname+"');>"+roomname+"</a></br>";
			}
		}
	});
}

function getRoom(groupname,roomname)
{
	$.post("http://127.0.0.1:1337/room",
	{
		"name":localstorage["name"],
		"group":groupname,
		"room":roomname
	},
	function(data)
	{
		document.getElementById("rmname").innerHTML = "<p>"+roomname+"<\p>"
		
		if(data["history"])
		{
			for(var i = 0; i < data["history"].length; i++)
			{
				var msg = data["history"][i];
				document.getElementById("rmchat").innerHTML += "<p>" + msg["user"] + "[" + msg["time"] + "]:" + msg["msg"] + "</p></br>"				
			}
		}
	}
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
				document.getElementById("admin").innerHTML = "Admin Toolbar";
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