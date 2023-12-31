# Guide to start
First of all, you must to clone the repository.

The following setions are steps to check the environment. 

## Install nvm

We use nvm to have the capability to manage several versions for node and npm.

The nvm for windows could be installed follonwing this documentation: https://github.com/coreybutler/nvm-windows
For Linux and mac you need to to follow: https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/

``` Linux
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
source ~/.bashrc
```

We use the node version 18.18.0 (latest stable version)

```
nvm install 18.18.0 (the first time)
nvm use 18.18.0 
```
In windows you could use the script "nvm_use.cmd" which do the 
same effect that in linux "nvm use". 


Some useful commands
```
nvm current -> your current version

nvm list -> available installed versions 

nvm unistall <version>

nvm install <version>

// check version
node -v || node --version

// list locally installed versions of node
nvm ls

// list remove available versions of node
nvm ls-remote // not available for windows version you can use: nvm list available

// install specific version of node
nvm install 18.16.1

// set default version of node
nvm alias default 18.16.1

// switch version of node
nvm use 20.5.1

// install latest LTS version of node (Long Term Support)
nvm install --lts

// install latest stable version of node
nvm install stable
```

NOTE: for windows you have available a script "nvm_use.cmd" which has the same effect than "nvm use" command in Linux.

## Install dependencies

Install the dependencies with:
```
npm install
```
## Run the tests

You will need to run the tests. You can do it also with the test explorer in Visual Studio code.
```
npm tests
```

## Coverage

For coverage you will need to execute:
```
npm run coverage
```
An report in the screen will be showed and a report in html in the folder "coverage"

## Visual Studio Code and Live Server

You should use Visual Studio Code with the extension "Live Server". We have some script related to localization and you will need
to use this plugin which creates a little server to render the website.

From Visual Studio you should choose the html file to open and choose "Open with live server"
## Configuring Visual Studio Code

Run->Add configurations -> Power shell (or whatever)

and copy this.

``` json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [

        {
            "type": "node-terminal",
            "request": "launch",
            "name": "Run Tests",
           "command": "npm test",
        }
    ]
}
```
# Localization in html5 and js - static website

We are using html5 and js which is deployed in a S3 or a static website. So, for the localization we have a simple solution by javascript and i18n.js.

The library i18n.js is in the file js/i18n.js.

In addition, we have several functions which help to translate the texts by identifying the tags of the elements.

In the folder lang, you have the text in 3 languages: English, Spanish and Portugese.

For the integration, you will need to use the parameter "lang" to use the form. For example
``` 
    ./index.html?lang=en&course=<id of the course> // for english
    ./index.html?lang=es&course=<id of the course> // for spanish
    ./index.html?lang=pt&course=<id of the course> // for portugese
```

# Testing strategy in the UI

In our decisions, we start with a HTML5/Js front without using any framework. The motivations are that we think this applications is
enough small  (a form) to not need some framework as for example vue.

This front was growing and maybe in this point where we have multilanguage we could have start to think about to include a framework 
for the development, but at the end we prefer to continue with HTML5/JS and include some test to have the capabitity to make changes
safety.

We have decide to use:
- Jest and Jest-domjs because it allows us to double the dom. We need it because we have a multipage website and we need to catch for
  example the storage changes and location changes. Other frameworks don't allows us easily to do it because the are more focused on
  catch the changes which are observed by the user.

- Combine with Teslibrary. We need to evaluate if we would need this framework. Maybe for asynchronous testing with the render. (Not done, it is a suggestion to evolute the testing strategy)

## Installing jest and dom
You don't need to do it, but it is some information about the libraries we have used.

With the package.json you only need to execute "npm install"

```
Directly you only need to execute: npm install

But if you want to install without the package.json:
npm install jest
npm install jest-environment-jsdom
npm install jest-environment-jsdom-global //when we need to use the global jsdom (usuarlly to mock the dom)
npm install fs
npm install path
npm install @babel/core @babel/preset-env babel-jest // solve problems with the keyworkd import in jest
npm install @testing-library/jest-dom / we use testing library for async calls
npm install @testing-library/dom / we use testing library for async calls
```
