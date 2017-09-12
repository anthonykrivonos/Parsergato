'use strict';
const nlp = require('compromise');
const human = require('humanparser');

const logger = require('./logger.js');
const manip = require('./manip.js');
const api = require('./api.js');

var parse = (text, contact = null) => {
      logger.info(`Starting parse: ${text}`);

      contact = contact || {};

      text = text.replace(/-/g, '') || null;
      logger.info(`Removed dashes: ${text}`);

      var phoneNumber = getPhoneNumber(text);
      text = manip.rebuildTextWithout(phoneNumber, text);
      logger.info(`Got phone number: ${phoneNumber}`);

      var emailAddress = getEmail(text);
      text = manip.rebuildTextWithout(emailAddress, text);
      logger.info(`Got email address: ${emailAddress}`);

      var fullNameObj = getName(text);
      text = manip.rebuildTextWithout(fullNameObj, text);
      logger.info(`Got full name: ${JSON.stringify(fullNameObj)}`);

      var companyName = getCompany(text);
      text = manip.rebuildTextWithout(companyName, text);
      logger.info(`Got company name: ${companyName}`);

      var notes = contact.notes || manip.rebuildWithoutExtraSpaces(text);

      return api.contact (
            contact.first_name || fullNameObj ? fullNameObj.firstName : null,
            contact.last_name || fullNameObj ? fullNameObj.lastName : null,
            contact.company || companyName || null,
            contact.email || emailAddress || null,
            contact.phone || manip.formatNumber(phoneNumber) || null,
            notes || null
      );
}

var getPhoneNumber = (text) => {
      try {
            var numbers = text.match(/\d+/g);

            if (numbers == null) return null;

            for (var i = 0; i < numbers.length; i++) {
                  if (numbers[i].length === 10) {
                        return numbers[i];
                  }
            }
      } catch(e) {};
      return null;
}

var getEmail = (text) => {
      try {
            if (!text.includes('@')) {
                  return null;
            }
            var textArr = text.split(' ');
            var email = null;
            for (var i = 0; i < textArr.length; i++) {
                  if (textArr[i].includes('@')) {
                        email = textArr[i];
                  }
            }
            return (email.includes('.')) ? manip.removeTrailingPunc(email.trim()) : null;
      } catch(e) {};
      return null;
}

var getName = (text) => {
      try {
            var name = nlp(text).people().out('text');
            return name != null && name != "" ? manip.removeTrailingPunc(human.parseName(name)) : null;
      } catch(e) {};
      return null;
}

var getCompany = (text) => {
      try {
            var company = nlp(text).topics().data();
            return manip.removeTrailingPunc(company[0].text.trim());
      } catch(e) {};
      return null;
}

module.exports = {
      parse, getPhoneNumber, getEmail, getName, getCompany
};
