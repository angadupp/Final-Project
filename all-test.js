
var vows = require("vows"),
    assert = require("assert"),
    cookieSessions = require("../lib/client-sessions"),
    express = require("express"),
    request = require("request");


  var app = express();
  app.use(middleware);

  // set up a second cookie storage middleware
  var secureStoreMiddleware = cookieSessions({
    cookieName: 'securestore',
    secret: 'yo',
    activeDuration: 0,
    cookie: {
      maxAge: 5000
    }
  });

  app.use(secureStoreMiddleware);

  return app;


function createBrowser(server) {
  var jar = request.jar();
  var browser = {
    get: function(url, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function');
      }
      // Ensure that server is ready to take connections
      if (server && !server.__listening) {
        (server.__deferred = server.__deferred || []).push([url, options, callback]);
        if (!server.__started) {
          server.__listener = server.listen(server.__port = ++startingPort, '127.0.0.1', function(){
            process.nextTick(function(){
              server.__deferred.forEach(function(args){
                browser.get.apply(browser, args);
              });
            });
            server.__listening = true;
          });
          server.__started = true;
        }
        return;
      }
      url = 'http://127.0.0.1:' + server.__port + url;
      options.uri = url;
      options.jar = jar;
      request.get(options, function(err, res, body) {
        if (err) console.error('ERR', err.stack);
        browser.cookies = jar.getCookies(url);
        callback(res, body);
      });

var suite = vows.describe('client-sessions');

suite.addBatch({
  "middleware" : {
    topic: function() {
      var self = this;
      var middleware = cookieSessions({
        cookieName: 'session',
        secret: 'yo',
        activeDuration: 0,
        cookie: {
          maxAge: 5000
        }
      });

      var req = {
        headers: {}
      };
      var res = {};
      
      assert.throws(function() {
        req.session = 'blah';
      }, TypeError);
    }
  }
});

suite.addBatch({
  "across two requests" : {
    topic: function() {
      var self = this;

      // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        req.session.reset();
        req.session.foo = 'foobar';
        req.session.bar = [1, 2, 3];
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.get("/bar", function(res, $) {
          browser.done();
        });
      });
    },
    }
});

      app.get("/foo", function(req, res) {
        req.session.reset();
        req.session.foo = 'foobar';
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.get("/bar", function(res, $) {
          browser.done();
        });
      });
    },
  }
};
     // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        req.session.reset();
        req.session.foo = 'foobar';
        req.session.bar = 'foobar2';
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        delete req.session.bar;
        res.send("bar");
      });

      app.get("/baz", function(req, res) {
        self.callback(null, req);
        res.send("baz");
      });

      // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        req.session.reset();
        req.session.foo = 'foobar';
        req.session.bar = { a: 'b' };
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        req.session.bar.c = 'd';
        res.send("bar");
      });

      app.get("/baz", function(req, res) {
        self.callback(null, req);
        res.send("baz");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.get("/bar", function(res, $) {
          browser.get("/baz", function(res, $) {
            browser.done();
          });
        });
      });
suite.addBatch({
  "reading from an existing session" : {
    topic: function() {
      var self = this;

      // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        req.session.foo = 'foobar';
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        res.send(req.session.foo);
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.get("/bar", function(res, $) {
          browser.done();
          // observe the response to the second request
          self.callback(null, res);
        });
      });
    },
    "does not set a cookie": function(err, res) {
      assert.isUndefined(res.headers['set-cookie']);
    }
  },
  "reading from a non-existing session" : {
    topic: function() {
      var self = this;

      // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        // this should send undefined, not null
        res.send(req.session.foo);
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.done();
        self.callback(null, res, $);
      });
    },
    "does not set a cookie": function(err, res, body) {
      assert.isUndefined(res.headers['set-cookie']);
      assert.equal(body, ''); // undefined becomes an empty string
    }
  }
});

suite.addBatch({
  "writing to a session" : {
    topic: function() {
      var self = this;

      // simple app
      var app = create_app();

      app.get("/foo", function(req, res) {
        req.session.foo = 'foobar';
        res.send("foo");
      });

      app.get("/bar", function(req, res) {
        req.session.reset();
        req.session.reset();
        req.session.bar = 'bar';
        req.session.baz = 'baz';
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.get("/bar", function(res, $) {
          browser.done();
          // observe the response to the second request
          self.callback(null, res);
        });
      });
    },
    "sets a cookie": function(err, res) {
      assert.isArray(res.headers['set-cookie']);
    },
    "and only one cookie": function(err, res) {
      assert.equal(res.headers['set-cookie'].length, 1);
    }
  }
});

function create_app_with_duration() {
  // simple app
  var app = express();
  app.use(cookieSessions({
    cookieName: 'session',
    secret: 'yo',
    activeDuration: 0,
    duration: 500 // 0.5 seconds
  }));

  app.get("/foo", function(req, res) {
    req.session.reset();
    req.session.foo = 'foobar';
    res.send("foo");
  });

  return app;
}

suite.addBatch({
  "querying within duration" : {
    topic: function() {
      var self = this;

      var app = create_app_with_duration();
      app.get("/bar", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        setTimeout(function () {
          browser.get("/bar", function(res, $) {
            browser.done();
          });
        }, 200);
      });
    },
    "session still has state": function(err, req) {
      assert.equal(req.session.foo, 'foobar');
    }
  }
});


      var browser = createBrowser(app);
      // first query resets the session to full duration
      browser.get("/foo", function(res, $) {
        setTimeout(function () {
          // this query should NOT reset the session
          browser.get("/bar", function(res, $) {
            setTimeout(function () {
              // so the session should still be valid
              browser.get("/bar2", function(res, $) {
                browser.done();
              });
            }, 200);
          });
        }, 200);
      });

function create_app_with_duration_modification() {
  // simple app
  var app = express();

  app.use(cookieSessions({
    cookieName: 'session',
    secret: 'yobaby',
    activeDuration: 0,
    duration: 5000 // 5.0 seconds
  }));

  app.get("/create", function(req, res) {
    req.session.foo = "foo";
    res.send("created");
  });

  app.get("/augment", function(req, res) {
    req.session.bar = "bar";
    res.send("augmented");
  });

  // invoking this will change the session duration to 500ms
  app.get("/change", function(req, res) {
    req.session.setDuration(500);
    res.send("duration changed");
  });

  return app;
}

      var app = create_app_with_duration_modification();
      app.get("/set_then_duration", function(req, res) {
        req.session.baz = "baz";
        req.session.setDuration(500);
        res.send("did it");
      });


      app.get("/complete", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/create", function(res, $) {
        browser.get("/set_then_duration", function(res, $) {
          browser.get("/complete", function(res, $) {
            browser.done();
          });
        });
      });
   

      app.get("/complete", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/create", function(res, $) {
        browser.get("/set_then_duration", function(res, $) {
          browser.get("/complete", function(res, $) {
            browser.done();
          });
        });
      });
  
suite.addBatch({
  "setting new variables then invoking setDuration": {
    topic: function() {
      var self = this;

      var app = create_app_with_duration_modification();
      app.get("/complete", function(req, res) {
        self.callback(null, req);
        res.send("bar");
      });

      var browser = createBrowser(app);
      browser.get("/create", function(res, $) {
        browser.get("/change", function(res, $) {
          browser.get("/augment", function(res, $) {
            browser.get("/complete", function(res, $) {
              browser.done();
            });
          });
        });
      });
    },
    "both variables are visible": function(err, req) {
      assert.equal(req.session.foo, "foo");
      assert.equal(req.session.bar, "bar");
    }
  }
});


suite.addBatch({
  "public encode and decode util methods" : {
    topic: function() {
      var self = this;

      var app = create_app();
      app.get("/foo", function(req, res) {
        self.callback(null, req);
        res.send("hello");
      });



      createBrowser(app).get('/foo', function(res, $){
        var cookies = res.headers['set-cookie'];
        var firstCookie = cookies[0];
        var secondCookie = cookies[1];

        function getCookieName(cookieHeader) {
          return cookieHeader.substring(0, cookieHeader.indexOf('='));
        }

        function getCookieValue(cookieHeader) {
          return cookieHeader.substring(cookieHeader.indexOf('='), cookieHeader.indexOf(';'));
        }

        var firstHijack = getCookieName(firstCookie) + getCookieValue(secondCookie);
        var secondHijack = getCookieName(secondCookie) + getCookieValue(firstCookie);

        var browser = createBrowser(app);
        browser.get('/bar', {
            headers: { 'Cookie': firstHijack + '; ' + secondHijack } 
        }, function(res, $){
          browser.done();
        });

      });
    },
    }
});

suite.addBatch({
  "missing cookie maxAge": {
    topic: function() {
      var self = this;

      var app = express();
      app.use(cookieSessions({
        cookieName: 'session',
        duration: 50000,
        activeDuration: 0,
        secret: 'yo'
      }));

      app.get("/foo", function(req, res) {
        req.session.foo = 'foobar';
        res.send("hello");
      });

      var browser = createBrowser(app);
      browser.get("/foo", function(res, $) {
        browser.done();
        self.callback(null, res);
      });
    },
  },
        },
    "updates the cookie expiry": function(err, res) {
      var expiryValue = res.headers['set-cookie'][0].replace(/^.*expires=([^;]+);.*$/, "$1");
      var expiryDate = new Date(expiryValue);
      var cookieDuration = expiryDate.getTime() - Date.now();
      assert(Math.abs(cookieDuration - 5000) < 1000, "expiry is pretty far from the specified duration");
  },
  "active user with session close to expiration": {
    topic: function() {
      var app = express();
      var self = this;
      app.use(cookieSessions({
        cookieName: 'session',
        duration: 300,
        activeDuration: 500,
        secret: 'yo'
      }));

      app.get("/foo", function(req, res) {
        req.session.foo = 'foobar';
        res.send("hello");
      });

      app.get("/bar", function(req, res) {
        req.session.bar = 'baz';
        res.send('hi');
      });

      app.get("/baz", function(req, res) {
        res.json({ "msg": req.session.foo + req.session.bar });
      });

      var browser = createBrowser(app);
      browser.get("/foo", function() {
        browser.get("/bar", function() {
          setTimeout(function () {
            browser.get("/baz", {json: true}, function(res, first) {
              setTimeout(function() {
                browser.get('/baz', {json: true}, function(res, second) {
                  browser.done();
                  self.callback(null, first, second);
                });
              }, 1000);
            });
          }, 400);
        });
      });

    },
});

var shared_browser1;
var shared_browser2;

suite.addBatch({
  "non-ephemeral cookie": {
    topic: function() {
      var self = this;

      var app = express();
      app.use(cookieSessions({
        cookieName: 'session',
        duration: 5000,
        secret: 'yo',
        cookie: {
          ephemeral: false
        }
      }));

      app.get("/foo", function(req, res) {
        req.session.foo = 'foobar';
        res.send("hello");
      });

      app.get("/bar", function(req, res) {
        req.session.setDuration(6000, true);
        res.send("hello");
      });

      shared_browser1 = createBrowser(app);
      shared_browser1.get("/foo", function(res, $) {
        self.callback(null, res);
      });
    },
     
      "gains an expires attribute": function(err, res) {
        assert.match(res.headers['set-cookie'][0], /expires/, "cookie is a session cookie");
      }
    }
});

function testHmac(algo) {
  var block = {};
  block.topic = function() {
    var opts = {
      signatureAlgorithm: algo,
      signatureKey: sixtyFourByteKey
    };
    var iv = new Buffer('01234567890abcdef','binary'); // 128-bits
    var ciphertext = new Buffer('0123456789abcdef0123','binary');
    var duration = 876543210;
    var createdAt = 1234567890;

    return cookieSessions.util.computeHmac(
      opts, iv, ciphertext, duration, createdAt
    ).toString('base64');
  };

  block['equals test vector'] = function(val) {
    assert.equal(val, HMAC_EXPECT[algo]);
  };

  return block;
}
