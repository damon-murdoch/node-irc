# node-irc

NodeJS IRC server for 2811ICT Assignment One\

Developer: Damon Murdoch\

Date Written: 3/09/2018\

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

4. 
Name: Rooms\
Description: Stores the information for each room in the system\
Fields:

5. 
Name: Messages\
Description: Stores the data for messages sent in a room\
Fields:

# Rest API

# Angular Architecture
