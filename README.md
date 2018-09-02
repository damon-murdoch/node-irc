# node-irc

NodeJS IRC server for 2811ICT Assignment One

Developer: Damon Murdoch

Date Written: 3/09/2018

# Git Architecture

All of the files for this project are situated in the 'irc' folder, which is the Angular project root directory.\
The 'dist' folder contains the compiled version of the angular project, which is referenced by the Node backend software \
in the 'server' folder. All of the source code for the angular front end software is within the 'src' folder.

# Data Structures

The data structures used in this project will be defined below.

1. 
Name: Users\
Description: Stores the information related to all of the users in the system.\
Fields:\
name: string, User's name\
mail: string, User's email address\
pass: string, User's password\
salt: string, Security salt value (null for testing purposes atm)\
groups: UserGroup[], Stores the groups (and related rooms) a user is permitted to view

2. 
Name: UserGroup\
Descriptions: Stores the name of the group and all channels within it the user is able to see\
Fields: \
group: string, Group name\
rooms: string[], names of rooms user can see

3. 
Name: Groups\
Description: Stores the data for each group object in the system\
Fields:
group: string, Group name\
rooms: Room[], list of rooms

4. 
Name: Rooms\
Description: Stores the information for each room in the system\
Fields:\
room: string, Room name\
log: Message[], room message history

5. 
Name: Messages\
Description: Stores the data for messages sent in a room\
Fields:\
user: string, Username of user who sent the message\
time: string, Time message was sent\
msg: string, contents of sent message

# Rest API

A comprehensive list of post calls within the server are documented below.

1.
Target: /api/deluser\
Arguments: \
name: string, name of user to delete\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Deletes the user with the name 'name' from the file system, if it exists and returns an error if it does not.

2.
Target: /api/register\
Arguments: \
name: string, name of user\
mail: string, email of user\
pass: string, password of user\
Return:\
succes: boolean , If update succeeded or not\
err: string , Error Message if error\
Result: Inserts the user with the given details in the file system as long as their username / email / password contains
at least one letter, spaces are not used and the name is not already taken.

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
Result: Returns the chatlog of the requested chatroom 'room' in group 'group'. This route isn't used by the current 
application so has not been proofed yet.

15.
Target: /api/data\
Arguments:\
name: string, name of user to retrieve data of
Return:\
rank: string, the rank of the user. can be standard, super or group.
groups: string[], list of groups the user has been added to.
Result: Returns the group rank, or role of the user and all groups they are associated with.  If user is group or super admin, all groups are returned.

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
