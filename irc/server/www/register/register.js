$(document).ready(function () 
{
	var name,mail,pass;
	
	$("#submit").click(function () 
	{
		document.getElementById('errordiv').innerHTML = "";
		
		name = $("#name").val();
		mail = $("#mail").val();
		pass = $("#pass").val();

		$.post("http://127.0.0.1:1337/regpost", 
		{
			"name": name,
			"mail": mail,
			"pass": pass,
		},
		function (data)
		{
			if(data.success)
			{
				document.getElementById('errordiv').innerHTML = "Registered user "+name+"successfully!"+
																"<a href = '/'> Log In </a>";
			}
			else
			{
				document.getElementById('errordiv').innerHTML = data.err;
			}
		});
	});
});