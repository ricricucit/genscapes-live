- - -
#[node+HTML5+JS] GenScapes Live 
- - -
- - -

##Concept
This is an application that generates landscapes from a line-in audio input and allow numerous _Public Clients_, 1 _Stage Client_ and 1 _Live Client_ to actively or passively interact with the graphics. 

Its main aim is to be used during live bands shows.

##Type of Servers (definitions)
1. **Cloud Server**: _managing mobile / desktop **Public Clients**_
2. **Local Server**: _nodejs server managing **Stage Client** and **Live Client**_

##Type of Clients (definitions)
1. **Public Client**: _mobile phone browser / desktop browser connected to **Cloud Server**_
2. **Stage Client**: _browser app point-to-point connected to **Local Server**_
3. **Live Client**: _nodejs app + browser app managing graphics and sound connected to **Local Server**_


##Schema
![System Schema](http://i.imgur.com/lM5uvJK.png "System Schema")


##Local Installation
1. If not yet installed: **Install _nodejs_** ([installer link](https://nodejs.org/en/))
2. **Clone/Fork+Clone** this repo `git clone https://github.com/ricricucit/genscapes-live`
3. Run the command `sudo npm install` to install all project's dependencies coming from _package.json_

**!!!!!! NOTE:** You can avoid the following 2 steps if, at this point, you already know how to run **_Gulp_** and **_Bower_** otherwise, keep reading:

1. Install **Gulp** globally `sudo npm install -g gulp` 
2. Install **Bower** globally `sudo npm install -g bower`


##Run the Application (Development)
1. Run `gulp dev` to start a watch on modified dev files that needs a check or a task to run (eg. _SCSS files_)
2. Open a new terminal window and run `node index.js` to start a nodejs server to run the app
3. With a _decent browser_ go to [**http://localhost:3000/**](http://localhost:3000/) to act as **Public Client**
4. With a _decent browser_ go to [**http://localhost:3000/stage/**](http://localhost:3000/stage/) to act as **Stage Client**
5. ***[TODO]*** With a _decent browser_ go to [**http://localhost:3000/live/**](http://localhost:3000/live/) to act as **Projection Client** ***[/TODO]***

* Check _"node index,js Terminal window"_ to check for server for **_Server-side DEV help/log messages_**
* Check _"gulp watch Terminal window"_ to check for **_Client-side DEV help/log messages_**


##Run the Application (Production)
1. Run `gulp` to start production tasks
2. Move to the newly created _**/dist**_ folder
3. Run `node index.js` to start a nodejs server to run the app
4. With a _decent browser_ go to [**http://localhost:3000/**](http://localhost:3000/) to act as **Public Client**
5. With a _decent browser_ go to [**http://localhost:3000/stage/**](http://localhost:3000/stage/) to act as **Stage Client**
6. **_[TODO]_** With a _decent browser_ go to [**http://localhost:3000/live/**](http://localhost:3000/live/) to act as **Projection Client** **_[/TODO]_**
7. If everything is working, you are ready to publish the content of the _**/dist**_ folder on your _nodejs hosting_

**_Check Terminal for Server-side help/log messages_**


##Modify the Application
1. For **adding/removing packages & libraries**, (eg. threeJS, helper scripts for node or JS, etc.) the application comes with 2 package managers: [**_Bower_**](http://bower.io/) mainly for **web/client packages** and [**_NPM_**](http://npmjs.com/) mainly for **node/server packages**.
2. After **adding/removing packages & libraries**, modify the ***gulpfile.js*** array `scripts_to_compress` to update the _distribution script_.

- - -
- - - 