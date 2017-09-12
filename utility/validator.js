'use strict';

var parse = (req) => {
      var text = (txt) => {
            var valid = txt != null && txt.length > 0;
            return {
                  valid,
                  error: valid ? null : 'Invalid text.'
            };
      }

      var valid = text(req.text).valid;
      return {
            valid,
            error: valid ? null : text(req.text).error
      }
}

var auth = (req) => {
      var uid = (uid) => {
            var valid = uid != null && uid.length > 0;
            return {
                  valid,
                  error: valid ? null : 'Invalid unique identifier.'
            };
      }

      var valid = uid(req.uid).valid;
      return {
            valid,
            error: valid ? null : uid(req.uid).error
      }
}

module.exports = {
      parse, auth
};
