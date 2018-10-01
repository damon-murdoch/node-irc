# node-irc

NodeJS IRC server for 2811ICT Assignment One (Updated For Assignment Two)

Developer: Damon Murdoch

First Written: 3/09/2018\
Updated: 1/10/2018

# Test Instructions

To test the program, simply run 'npm test' in the server directory of the project when all dependencies are installed. 

# Git Architecture

All of the files for this project are situated in the 'irc' folder, which is the Angular project root directory.\
The 'dist' folder contains the compiled version of the angular project, which is referenced by the Node backend software \
in the 'server' folder. All of the source code for the angular front end software is within the 'src' folder.

# Data Structures (MongoDB Tables)

The data structures used in this project will be defined below.\

1. Users\
_id: name of user\
name: name of user (for compatibility reasons)\
mail: user email address\
pass: sha256 encrypted password

2. Groups

_id: name of group\
rooms: string[] of room names

3. Rooms

_id: {'group':group,'room':room} - unique identifier for group,room\
group: group name\
room: room name\
log: Object[], message log , format: {name:name, time:time,, msg:msg}

4. groupAdmins

_id: name of user

5. superAdmins

_id: name of user

6. userGroups

_id: {name:name,group:group}, unique identifier for user, group\
rooms: [], list of rooms in group user can see

# Rest API

A comprehensive list of post calls within the server are documented below.

1.
Target: /api/deluser\
Arguments: \
name: string, name of user to delete\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Deletes the user with the name 'name' from the database, if it exists and returns an error if it does not.

2.
Target: /api/register\
Arguments: \
name: string, name of user\
mail: string, email of user\
pass: string, password of user\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Inserts the user with the given details in the database assuming no duplicates

3.
Target: /api/rmadd\
Arguments:\
name: string, Name of user to add to room\
group: string, Group room is in\
room: string, Room to add to\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Adds the room to the user's visible rooms as long as the user, group and room all exist and the user is not
already added to the room, else sends error

4.
Target: /api/rmrmv
Arguments:\
name: string, Name of user to remove from room\
group: string, Group room is in\
room: string, Room to remove from\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Removes the room from the user's visible rooms as long as the user, group and room all exist and the user 
is in the room, else sends error

5.
Target: /api/group
Arguments:\
name: string, \
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result:

6.
Target: /api/superpromote
Arguments:\
name: string, name of user to promote\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Promotes user assuming user exists and user is not a super admin, else sends error

7.
Target: /api/superdemote
Arguments:\
name: string, name of user to demote\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Demotes user assuming user exists and user is a super admin, else sends error


8.
Target: /api/grouppromote
Arguments:\
name: string, name of user to promote\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Promotes user assuming user exists and user is not a group admin, else sends error

9.
Target: /api/groupdemote
Arguments:\
name: string, name of user to demote\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Demotes user assuming user exists and user is a group admin, else sends error


10.
Target: /api/creategroup\
Arguments:\
group: string, name of group\
owner: string, owner of group\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Creates a new group with name 'group' and adds the owner to it if it does not already exist, else throws an error

11.
Target: /api/deletegroup\
Arguments:\
group: string, name of group\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Deletes the group with the name 'group' if it exists, else throws an error

12.
Target: /api/createroom\
Arguments:\
group: string, name of group\
room: string, name of room\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Creates a new room with name 'room' in group 'group' assuming the group exists and the room doesn't, else sends error

13.
Target: /api/deleteroom\
Arguments:\
group: string, name of group\
room: string, name of room\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Deletes the room with name 'room' in group 'group' assuming both exist, else sends error

14.
Target: /api/room\
Arguments:\
group: string, name of group\
room: string, name of room\
Return:\
log: Message[], chatlog of chat\
Result: Returns the chatlog of the requested chatroom 'room' in group 'group'.

15.
Target: /api/data\
Arguments:\
name: string, name of user to retrieve data of
Return:\
rank: string, the rank of the user. can be standard, super or group.
groups: string[], list of groups the user has been added to.
Result: Returns the group rank, or role of the user and all groups they are associated with.  If user is group or super admin or group admin, all groups are returned.

16. 
Target: /api/login\
Arguments:\
name: string, name of user to log in\
pass: string, password of user\
Return:\
loggedIn: boolean , If login succeeded or not\
err: string , Error Message if error\
Result: Checks if a requested username-password combination exists in the file system and if so, approves the login. else, sends an e rror message.

17.
Target: /api/groupadd\
Arguments:\
name: string, name of user to add to group\
group: string, name of group to add user to\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Adds user 'name' to group 'group' if both exist and user is not already in group, else sends error

18. 
Target: /api/grouprmv\
Arguments:\
name: string, user to remove from group\
group: string, name of group to remove user from\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Removes user 'name' from group 'group' if both exist and user is already in group, else sends error

# Angular Architecture

1. Components

a. Dashboard

Data:

name: string, Name of logged in user\
rank: string, Role of logged in user\
selectedgroup: string, name of current group selection\
selectedgroupbool: boolean, false if no group has been selected yet\
rooms: string[], array of room names in group 'selectedgroup' that are visible to user\
selectedroom: string, name of currently selected room\
selectedroombool: boolean, false if no room has been selected yet\
messages: string[], list of messages in the history of 'room'

Functions:

getGroupData(group: string): void\
getRoomData(room: string): void\
ngOnInit(void): void

b. GroupAdminToolbar

Data:

hidemsg: String, message displayed when hiding / unhiding group admin toolbar\
errormsg: String, message displayed as notification of function call\

Functions:

createUser(name: string,mail:string,pass:string,salt:string): void\
promoteGroupAdmin(name: string): void\
demoteGroupAdmin(name: string): void\
createGroup(group: string): void\
deleteGroup(group: string): void\
createRoom(group: string, room: string): void\
deleteRoom(group: string, room: string): void\
addUserToGroup(name: string, group: string): void\
rmvUserFromGroup(name: string, group: string): void\
addUserToRoom(name: string, group: string, room: string): void\
rmvUserFromRoom(name: string, group: string, room: string): void\
hideToggle(void): void\
ngOnInit(void): void

c. Login

Data:\
Functions:\
loginUser(name: string, pass: string): void\
ngOnInit(void): void

d. Register

Data:\
Functions:\
createUser(name: string, mail: string, pass: string, salt: string): void\
ngOnInit(void): void

e. Super Admin Toolbar

Data:\

hide: boolean,\
hidemsg: string,\
errormsg: string,

Functions:\

promoteUser(name: string): void\
demoteUser(name: string): void\
deleteUser(name: string): void\
hideToggle(void): void\
ngOnInit(void): void

2. Models

a. User

Fields:\
name: string,\
mail: string,\
pass: string,\
salt: string

3. Services

a. Data
Data:\
Functions:\
addUserToGroup(data: JSON{name: string, group: string});\
rmvUserFromGroup(data: JSON{name: string, group: string});\
addUserToRoom(data: JSON{name: string, group: string, room: string});\
rmvUserFromRoom(data: JSON{name: string, group: string, room: string}):\
getData(data: JSON{name: string});\
getGroupData(data: JSON{name: string, group: string});\
getRoomData(data: JSON{name: string, group: string, room: string});\
createGroup(data: JSON{group: string});\
deleteGroup(data: JSON{group: string});\
createRoom(data: JSON{group: string, room: string});\
deleteRoom(data: JSON{group: string, room: string});

b. User\
Data:\
Functions:\
setLocalStorage(name: string, pass: string): void\
loginUser(user: JSON{name:string, pass:string}): void\
deleteUser(user: JSON{name:string}): void\
createUser(user: JSON{name: string, email: string, pass: string, salt: string}): void\
promoteSuperAdmin(user: JSON{name:string}): void\
demoteSuperAdmin(user: JSON{name:string}): void\
promoteGroupAdmin(user: JSON{name:string}): void\
demoteGroupAdmin(user: JSON{name:string}): void
