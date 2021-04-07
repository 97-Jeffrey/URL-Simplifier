# URL Simplifier

This is a full stack web application built with Node and Express that allows users to shorten long URLs and naivigate to website using given url;

# ScreenShots of the app

A new user need to register/login before using key functionality of the app.

![](https://github.com/97-Jeffrey/URL-Simplifier/blob/master/doc/Screen%20Shot%202021-04-02%20at%202.57.37%20PM.png?raw=true)

After register/login, the user can generate simplified version url by entering the url they want to simplify.

![](https://github.com/97-Jeffrey/URL-Simplifier/blob/master/doc/Screen%20Shot%202021-04-02%20at%202.58.13%20PM.png?raw=true)

The creator of the URL can navigate to show page for each url and edit and change the original url they entered:

![](https://github.com/97-Jeffrey/URL-Simplifier/blob/master/doc/Screen%20Shot%202021-04-02%20at%202.58.29%20PM.png?raw=true)

Users can view their created url in `/urls` page. please be noted that users can only see url list they created, but everyone can use simplified url to navigate to corresponding website through `/u/shortUrl`.
![](https://github.com/97-Jeffrey/URL-Simplifier/blob/master/doc/Screen%20Shot%202021-04-02%20at%202.59.27%20PM.png?raw=true)

# Dependency:

- Node.js
- Express.js
- EJS
- body-parser

# Get started:

## Install all dependencies using `npm install` or install them one by one:

- install express: npm install express;

- install ejs: npm install ejs

- install bcrypt: npm install -E bcrypt@2.0.0(recommended)

- install body-parser : npm install body-parser

## To run the app:

- Run the development web server using the `node index.js` command.

- After Nodemon is installed, use `npm start` to run.

- Please navigate to [localhost:3000](http://localhost:3000/) to view the app.
