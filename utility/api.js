'use strict';

var parse = {
      success: (raw_text, parsed_text, date = null) => {
            if (date == null) date = (new Date).getTime();
            return {
                  raw_text,
                  parsed_text,
                  date
            };
      },
      error: (raw_obj, error, date = null) => {
            if (date == null) date = (new Date).getTime();
            return {
                  raw_obj,
                  error,
                  date
            };
      }
};

var auth = {
      success: (token, expires, uid, date = null) => {
            if (date == null) date = (new Date).getTime();
            return {
                  token,
                  expires,
                  uid,
                  date
            };
      },
      error: (uid, error, date = null) => {
            if (date == null) date = (new Date).getTime();
            return {
                  uid,
                  error,
                  date
            };
      }
};

var contact = (first_name, last_name, company, email, phone, notes) => {
      return {
            first_name,
            last_name,
            company,
            email,
            phone,
            notes
      };
}

module.exports = {
      parse, auth, contact
};
