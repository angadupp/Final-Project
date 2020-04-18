const Cookies = require("cookies");
const crypto = require("crypto");



function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}

function base64urlencode(arg) {
  var s = arg.toString('base64');
  return s;
}

function base64urldecode(arg) {
  var s = arg;
  return new Buffer(s, 'base64'); // Standard base64 decoder
}

function forceBuffer(binaryOrBuffer) {
  if (Buffer.isBuffer(binaryOrBuffer)) {
    return binaryOrBuffer;
  } else {
    return new Buffer(binaryOrBuffer, 'binary');
  }
}

function setupKeys(opts) {
  if (!opts.encryptionKey) {
    opts.encryptionKey = deriveKey(opts.secret, KDF_ENC);
  }

  if (!opts.signatureKey) {
    opts.signatureKey = deriveKey(opts.secret, KDF_MAC);
  }

  if (!opts.signatureAlgorithm) {
    opts.signatureAlgorithm = DEFAULT_SIGNATURE_ALGO;
  }

  if (!opts.encryptionAlgorithm) {
    opts.encryptionAlgorithm = DEFAULT_ENCRYPTION_ALGO;
  }
}

function keyConstraints(opts) {
  if (!Buffer.isBuffer(opts.encryptionKey)) {
    throw new Error('encryptionKey must be a Buffer');
  }
  if (!Buffer.isBuffer(opts.signatureKey)) {
    throw new Error('signatureKey must be a Buffer');
  }

  if (constantTimeEquals(opts.encryptionKey, opts.signatureKey)) {
    throw new Error('Encryption and Signature keys must be different');
  }

  var sigAlgo = opts.signatureAlgorithm;
  var minimum = SIGNATURE_ALGORITHMS[sigAlgo];
  if (opts.signatureKey.length < minimum) {
    throw new Error(
      'Encryption Key for '+sigAlgo+' must be at least '+minimum+' bytes '+
      '('+(minimum*8)+' bits)'
    );
  }
}

function constantTimeEquals(a, b) {
  if (a.length !== b.length) {
    return false;
  }
  var ret = 0;
  for (var i = 0; i < a.length; i++) {
    ret |= a.readUInt8(i) ^ b.readUInt8(i);
  }
  return ret === 0;
}

function zeroBuffer(buf) {
  for (var i = 0; i < buf.length; i++) {
    buf[i] = 0;
  }
  return buf;
}

  setupKeys(opts);

  duration = duration || 24*60*60*1000;
  createdAt = createdAt || new Date().getTime();

  var iv = crypto.randomBytes(16);

  var plaintext = new Buffer(
    opts.cookieName + COOKIE_NAME_SEP + JSON.stringify(content),
    'utf8'
  );

  var cipher = crypto.createCipheriv(
    opts.encryptionAlgorithm,
    opts.encryptionKey,
    iv
  );

  // stop at any time if there's an issue
  var components = content.split(".");
  if (components.length !== 5) {
    return;
  }

  setupKeys(opts);

  var iv;
  var ciphertext;
  var hmac;

  try {
    iv = base64urldecode(components[0]);
    ciphertext = base64urldecode(components[1]);
    hmac = base64urldecode(components[4]);
  } catch (ignored) {
    cleanup();
    return;
  }

  var createdAt = parseInt(components[2], 10);
  var duration = parseInt(components[3], 10);

  // make sure IV is right length
  if (iv.length !== 16) {
    cleanup();
    return;
  }

  var expectedHmac = computeHmac(opts, iv, ciphertext, duration, createdAt);

  if (!constantTimeEquals(hmac, expectedHmac)) {
    cleanup();
    return;
  }
  var cipher = crypto.createDecipheriv(
    opts.encryptionAlgorithm,
    opts.encryptionKey,
    iv
  );
  var plaintext = cipher.update(ciphertext, 'binary', 'utf8');
  plaintext += cipher.final('utf8');

  var cookieName = plaintext.substring(0, plaintext.indexOf(COOKIE_NAME_SEP));
  if (cookieName !== opts.cookieName) {
    cleanup();
    return;
  }

  var result;
  try {
    result = {
      content: JSON.parse(
        plaintext.substring(plaintext.indexOf(COOKIE_NAME_SEP) + 1)
      ),
      createdAt: createdAt,
      duration: duration
    };
  } catch (ignored) {
  }

  cleanup();
  return result;


/*
 * Session object
 *
 * this should be implemented with proxies at some point
 */
function Session(req, res, cookies, opts) {
  this.req = req;
  this.res = res;
  this.cookies = cookies;
  this.opts = opts;
  if (opts.cookie.ephemeral && opts.cookie.maxAge) {
    throw new Error("you cannot have an ephemeral cookie with a maxAge.");
  }


  // here, we check that the security bits are set correctly
  var secure = (res.socket && res.socket.encrypted) ||
      (req.connection && req.connection.proxySecure);
  if (opts.cookie.secure && !secure) {
    throw new Error("you cannot have a secure cookie unless the socket is " +
        " secure or you declare req.connection.proxySecure to be true.");
  }
}

    // take the content and do the encrypt-and-sign
  // boxing builds in the concept of createdAt
  
  
    Object.defineProperty(req, propertyName, {
      get: function getSession() {
        return rawSession.content;
      },
      set: function setSession(value) {
        if (isObject(value)) {
          rawSession.content = value;
        } else {
          throw new TypeError("cannot set client-session to non-object");
        }
      }
    });


    var writeHead = res.writeHead;
    res.writeHead = function () {
      rawSession.updateCookie();
      return writeHead.apply(res, arguments);
    };

    next();

module.exports = clientSessionFactory;