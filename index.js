'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const xoauth2 = require('xoauth2');
const cors = require('cors');
const morgan  = require('morgan');
const jwt = require('jwt-simple');
const moment = require('moment');

const validator = require('./utility/validator.js');
const api = require('./utility/api.js');
const parser = require('./utility/parser.js');
const logger = require('./utility/logger.js');

const PORT = process.env.PORT || 3000;
const app = express();
const upload = multer();

const corsOptions = {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": true,
      "allowedHeaders":  'Content-Type,Authorization,X-Requested-With'
}

const STATUS = {
      OK: 200,
      CREATED: 201,
      NO_CONTENT: 204,
      NOT_MODIFIED: 304,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      SERVER_ERROR: 500
}

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('jwtTokenSecret', 'arigato_mobile_app');

app.get('/', function(req, res) {
      res.send(`Parsergato API hosted on port ${PORT}.`);
});

app.post('/auth', upload.array(), function (req, res, next) {
      try {
            var validation = validator.auth(req.body);
            if (validation.valid) {
                  let expires = moment().add('days', 7).valueOf();
                  let token = jwt.encode({
                        iss: req.body.uid,
                        exp: expires
                  }, app.get('jwtTokenSecret'));
                  res.status(STATUS.OK).jsonp(api.auth.success(token, expires, req.body.uid));
            }
            else {
                  res.status(STATUS.BAD_REQUEST).jsonp(api.auth.error(token, expires, req.body.uid));
                  logger.error(validation.error);
            }
      } catch (e) {
            res.status(STATUS.BAD_REQUEST).jsonp(api.auth.error(req.body.uid, 'Invalid UID.'));
            logger.error(e);
      }
});

app.post('/parse', upload.array(), function (req, res, next) {
      var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
      logger.info(`Token: ${token}`);
      if (token) {
            try {
                  var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
                  logger.info(`Decoded: ${token}`);
                  if (decoded.exp <= Date.now()) {
                        res.end('Access token has expired', 400);
                  } else {
                        try {
                              var validation = validator.parse(req.body);
                              if (validation.valid) res.status(STATUS.OK).jsonp(api.parse.success(req.body.text, parser.parse(req.body.text)))
                              else {
                                    res.status(STATUS.BAD_REQUEST).jsonp(api.parse.error(req.body, validation.error));
                                    logger.error(validation.error);
                              }
                        } catch (e) {
                              res.status(STATUS.BAD_REQUEST).jsonp(api.parse.error(req.body, `${JSON.stringify(e)}`));
                              logger.error(e);
                        }
                  }
            } catch (e) {
                  res.status(STATUS.BAD_REQUEST).jsonp(api.parse.error(req.body, JSON.stringify(e)));
                  logger.error(e);
            }
      } else {
            res.status(STATUS.BAD_REQUEST).jsonp(api.parse.error(req.body, 'Invalid token.'));
            logger.error('Invalid token.');
      }
});

app.listen(PORT, function () {
      logger.info(`Parsergato listening on port ${PORT}`);
});
