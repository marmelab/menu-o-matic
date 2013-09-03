var wd = require('wd');
var assert = require('assert');
var config = require('config');
var async = require('async');
var browser = wd.remote();

process.env.NODE_ENV = 'test';
var applicationUrl = config.application.url;

describe('Simple menu creation', function() {

    before(function(done) {
        browser.init({
            browserName: config.test.browser
        }, done);
    });

    it('Should show the menu builder page', function(done) {
        browser.get(applicationUrl, function() {
            browser.title(function(err, title) {
                if (err) {
                    return done(err);
                }

                assert.equal(title, 'Gestion du menu principal');
                done();
            });
        });
    });

    it('Should add a new item when cling on the "+" button', function(done) {
        async.waterfall([
            // Retrieve create menu button
            function(next) {
                browser.elementByCss('.menubar .add_button', function(err, el) {
                    if (err) {
                        return done(err);
                    }

                    next(null, el);
                });
            },

            // Click on create button
            function(createButton, next) {
                browser.clickElement(createButton, function(err) {
                    if (err) {
                        return done(err);
                    }

                    next();
                });
            },

            // Check that a new item is displayed
            function(next) {
                var items = browser.elementsByCss('.menus .item', function(err, items) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(1, items.length);
                    next(null, items);
                });
            },

            function(items, next) {
                items[0].text(function(err, value) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal('Nouveau menu', value);

                    done();
                });
            }
        ], done);
    });

    it('Should add another menu when clicking a second time on the "+" button', function(done) {
        async.waterfall([
            // Retrieve create menu button
            function(next) {
                browser.elementByCss('.menubar .add_button', function(err, el) {
                    if (err) {
                        return done(err);
                    }

                    next(null, el);
                });
            },

            // Click on create button
            function(createButton, next) {
                browser.clickElement(createButton, function(err) {
                    if (err) {
                        return done(err);
                    }

                    next();
                });
            },

            // Check that a new item is displayed
            function(next) {
                var items = browser.elementsByCss('.menus .item', function(err, items) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(2, items.length);
                    done();
                });
            }
        ], done);
    });

    it('Should reorder items with a drag & drop', function(done) {
        async.waterfall([
            // Retrieve first menu
            function(next) {
                browser.elementByCss('.menubar .item:nth-child(1)', function(err, el) {
                    if (err) {
                        return done(err);
                    }

                    //console.log(el);

                    next(null, el);
                });
            },

            // Retrieve second menu
            function(firstMenu, next) {
                browser.elementByCss('.menubar .item:nth-child(2)', function(err, el) {
                    if (err) {
                        return done(err);
                    }

                    //console.log(el);

                    next(null, firstMenu, el);
                });
            },

            // Retrieve element location
            function (firstMenu, secondMenu, next) {
                browser.moveTo(firstMenu, 150, 150, function(err){
                    if (err) {
                        return done(err);
                    }

                    next(null, firstMenu, secondMenu);
                })
            },


            // Drag
            function(firstMenu, secondMenu, next) {

                browser.buttonDown(function(err){
                    if (err) {
                        return done(err);
                    }

                    next(null, firstMenu, secondMenu);
                })
            },

            // Drop
            function(firstMenu, secondMenu, next) {
                browser.moveTo(secondMenu, 30, 150, function(err){
                    if (err) {
                        return done(err);
                    }

                    next(null, firstMenu, secondMenu);
                });
            },

            function(firstMenu, secondMenu, next) {
                browser.buttonUp(function(err){
                    if (err) {
                        return done(err);
                    }

                    next();
                })
            },

            // Check that the menus are re-ordered
            function(next) {
                browser.elementsByCss('.menubar .item', function(err, elements) {
                    if (err) {
                        return done(err);
                    }

                    assert.equal(2, elements.length);
                    next(null, elements)
                });
            },

            function(elements, next) {
                var i = 2;
                async.each(elements, function(element, cb){
                    element.getAttribute('tabindex', function(err, tabIndex){
                        if (err) {
                            return done(err);
                        }

                        assert.equal(i--, tabIndex);
                        cb();
                    });
                }, done);
            }
        ]);
    });

    after(function(done) {
        browser.quit(done);
    });
});
