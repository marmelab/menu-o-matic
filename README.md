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
# or using node's serve module
$ serve -p 4000
```

Then, browse to [http://localhost:4000](http://localhost:4000) and start building your menu.
