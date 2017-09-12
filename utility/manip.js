'use strict';
const logger = require('./logger.js');

var pad = (num, size = 5) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

var formatNumber = (number) => {
      if (number == null) return null;
      else if (number.indexOf('+1') == 0) number = number.substring(2);
      else if (number.indexOf('1') == 0) number = number.substring(1);
      var number2 = (""+number).replace(/\D/g, '');
      var m = number2.match(/^(\d{3})(\d{3})(\d{4})$/);
      return (!m) ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];
}

var unFormatNumber = (number) => {
      var number2 = (""+number).replace(/\D/g, '');
      var m = number2.match(/^(\d{3})(\d{3})(\d{4})$/);
      return (!m) ? null : m[1] + m[2] + m[3];
}

var rebuildTextWithout = (toRemove, text) => {
      if (toRemove === null) return text;

      var wordsToRemove = [];

      if (typeof toRemove === 'object') {
            Object.keys(toRemove).forEach((key) => {
                  wordsToRemove.push(toRemove[key]);
            });
      } else {
            wordsToRemove = toRemove.split(' ');
      }

      for (var i = 0; i < wordsToRemove.length; i++) {
            text = text.replace(wordsToRemove[i], '');
      }

      return text.trim();
}

var rebuildWithoutExtraSpaces = (text) => {
      if (text != null && text.length > 0) return text.replace(/ +(?= )/g,'');
      return "";
}

var removeTrailingPunc = (text) => {
      var lastChar = text.charAt(text.length-1);
      return !lastChar.match(/[a-z]/i) || isNaN(parseInt(lastChar)) ? text.substring(0, text.length - 1) : text;
}

module.exports = {
      pad, formatNumber, unFormatNumber, rebuildTextWithout, rebuildWithoutExtraSpaces, removeTrailingPunc
};
