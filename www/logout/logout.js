$(document).ready(function () 
{
	localStorage.name;
	
	//document.getElementById('errordiv').innerHTML += "Unknown error!";
	
	document.getElementById("logoutmsg").innerHTML = "Logging out " + localstorage.name + "...";
	
	if(localStorage["name"])
	{
		localStorage.removeItem("name");
	}
	
	if(localStorage["pass"])
	{
		localStorage.removeItem("pass");
	}
	
	$(location).attr('href','/')
});