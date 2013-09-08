menu-o-matic
============

Create and manage menus using a WYSIWYG interface. Powered by [Packery](http://packery.metafizzy.co/) and [Backbone](backbonejs.org).

## Installation

Bower dependencies are committed in the repository, so you don't need to setup anything.

Just don't forget to commit them again each time you do a:

```sh
$ bower install
```

## Usage

Since the application uses RequireJS to manage dependencies, JavaScript files are loaded in AJAX and can't be served direclty from the filesystem (or the same origin policy fails). Therefore you need to run a server for the application to work, which in OS X is as simple as getting into the application directory and typing:

```sh
$ python -m SimpleHTTPServer 4000
# or using the built-in server
$ npm start
```

Then, browse to [http://localhost:4000](http://localhost:4000) and start building your menu.

##  Frontend tests

First, install dependencies and selenium executable:

```sh
$ npm install
$ curl https://selenium.googlecode.com/files/selenium-server-standalone-2.31.0.jar > selenium-server-standalone.jar
```

Next, start selenium with Firefox

```sh
$ java -jar selenium-server-standalone.jar
```

Finally, run tests using `mocha`, or the built-in `test` task:

```sh
$ npm test
```

### Running tests with Chrome

Firefox is included by default in the `selenium-server-standalone-2.21.0.jar`, if you want to use Chrome, download the chromedriver at https://code.google.com/p/chromedriver/downloads/list.

Then, start Selenium with Chrome:
```sh
$ java -jar selenium-server-standalone.jar -Dwebdriver.chrome.driver=/[path-to]/chromedriver
```

And start tests with the `TEST_BROWSER` environment variable set to `chrome`:

```sh
$ TEST_BROWSER=chrome npm test
```
