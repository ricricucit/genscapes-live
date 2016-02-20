- - -
#[node+HTML5+JS] GenScapes Live 
- - -
- - -

##Concept
This is an application that generates landscapes from a line-in audio input and allow numerous _Public Clients_, 1 _Stage Client_ and 1 _Projector Client_ to actively or passively interact with the graphics. 

Its main aim is to be used during live bands shows.


##Type of Clients (definitions)
1. **Public Client**: _mobile phone browser / desktop browser_
2. **Stage Client**: _desktop browser on stage_
3. **Projection Client**: _desktop browser attached to projector_

##Schema
![System Schema](http://i.imgur.com/SdVoYhg.png "System Schema")


##Local Installation
1. If not yet installed: **Install _nodejs_** ([installer link](https://nodejs.org/en/))
2. **Checkout** this repo and move to its main folder via _Terminal_
3. Run the command `npm install` to install all project's dependencies coming from _package.json_


##Run the Application (Development)
1. Run `gulp dev` to start a watch on modified dev files that needs a check
2. Open a new terminal window and run `node index.js` to start a nodejs server to run the app
3. With a _decent browser_ go to [**http://localhost:3000/**](http://localhost:3000/) to act as **Public Client**
4. With a _decent browser_ go to [**http://localhost:3000/stage/**](http://localhost:3000/stage/) to act as **Stage Client**
5. **_[TODO]_** With a _decent browser_ go to [**http://localhost:3000/live/**](http://localhost:3000/live/) to act as **Projection Client** **_[/TODO]_**

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
1. For **adding/removing packages & libraries**, (eg. threeJS, helper scripts for node or JS, etc.) the application comes with 2 package managers: [**_Bower_**](http://bower.io/) & [**_NPM_**](http://npmjs.com/), so use these for –respectively– Client and Server side third party script implementation.

- - -
- - - 