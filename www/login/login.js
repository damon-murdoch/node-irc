$(document).ready(function () 
{
	var name,pass;
	
	$("#submit").click(function () 
	{
		
		document.getElementById('errordiv').innerHTML = "";
		
		name = $("#name").val();
		pass = $("#pass").val();

		$.post("http://127.0.0.1:1337/login", 
		{
			"name": name,
			"pass": pass,
		},
		function (data)
		{
			if(data.loggedIn)
			{
				console.log("Successfully logged in user " + name);
				localStorage.setItem("name",name);
				localStorage.setItem("pass",pass);
				
				console.log(localStorage);
				
				$(location).attr('href','/dashboard')
				
			}
			else
			{
				console.log("Login Failed! Reason:");
				document.getElementById('errordiv').innerHTML += "Login Failed! Reason: ";
				
				if(data["err"]==0)
				{
					console.log("Password was incorrect! Do you need to reset your password?");
					document.getElementById('errordiv').innerHTML += 
						"Password was incorrect! Do you need to reset your password?";
				}
				if(data["err"]==1)
				{
					console.log("User does not exist! Do you need to register?");
					document.getElementById('errordiv').innerHTML += 
						"User does not exist! Do you need to register?";
				}
				else
				{
					console.log("Unknown error!");
					document.getElementById('errordiv').innerHTML += "Unknown error!";
				}
			}
		});
	});
});