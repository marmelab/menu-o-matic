var wd = require('wd');
var assert = require('assert');
var browser = wd.remote();

process.env.NODE_ENV = 'test';

describe('Simple menu creation', function() {

    before(function(done){
        browser.init({
            browserName:'chrome'
        }, done);
    });

    it('Should show the menu builder page', function(done){
        browser.get("http://localhost:4000", function() {
            browser.title(function(err, title) {
                if (err) {
                    return done(err);
                }

                assert.equal(title, 'Gestion du menu principal');
                done();
            });
        });
    });

    it('Should add a new item when cling on the "+" button', function(done){
        browser.elementById('add', function(err, el) {
            if (err) {
                return done(err);
            }

            browser.clickElement(el, function(err) {
                if (err) {
                    return done(err);
                }

                // Check that a new item is displayed
                var items = browser.elementsByCss('.menus .item', function(err, items){
                    if (err) {
                        return done(err);
                    }

                    assert.equal(1, items.length);
                    items[0].text(function(err, value){
                        if (err) {
                            return done(err);
                        }
                        
                        assert.equal('Nouveau menu', value);

                        done();
                    });
                });
            });
        });
    });

    after(function(done) {
        browser.quit(done);
    });
});
