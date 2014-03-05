(function(jQuery){
  'use strict';

  jQuery.hotkeys = {
    version: '0.2.5',

    replacements: {
      /* sets that make up all keyboard keys when combined together */
      'a-z': 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
      'A-Z': 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
      'a-Z': 'a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z',
      'shifted': '~ ! @ # $ % ^ & * ( ) _ + { } | : " < > ? shift+~ shift+! shift+@ shift+# shift+$ shift+% shift+^ shift+& shift+* shift+( shift+) shift+_ shift++ shift+{ shift+} shift+| shift+: shift+" shift+< shift+> shift+?',
      'nonshifted': '` 1 2 3 4 5 6 7 8 9 0 - = [ ] \\ ; \' , . /',
      'arrow': 'left up right down',
      'special': 'backspace tab return shift ctrl alt pause capslock esc space pageup pagedown end home insert delete del numlock scroll meta',
      'function': 'f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11 f12',
      /* special sets */
      '0-9': '1 2 3 4 5 6 7 8 9 0',
      'numpad': '1 2 3 4 5 6 7 8 9 0 / * - + return .',
      'undo': 'ctrl+z meta+z',
      'cut': 'ctrl+x meta+x',
      'copy': 'ctrl+c meta+c',
      'paste': 'ctrl+v meta+v',
      'operators': '= + - * / % < >',
    },

    /* jshint ignore:start */
    specialKeys: {
      // '=' can be either 107 or 187 depending on it's location on the keyboard
      8: 'backspace', 9: 'tab', 13: 'return', 16: 'shift', 17: 'ctrl', 18: 'alt', 19: 'pause',
      20: 'capslock', 27: 'esc', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home',
      37: 'left', 38: 'up', 39: 'right', 40: 'down', 45: 'insert', 46: 'del', 48: '0', 59: ';',
      96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7',
      104: '8', 105: '9', 106: '*', 107: '+', 109: '-', 110: '.', 111 : '/', 112: 'f1', 113: 'f2',
      114: 'f3', 115: 'f4', 116: 'f5', 117: 'f6', 118: 'f7', 119: 'f8', 120: 'f9', 121: 'f10',
      122: 'f11', 123: 'f12', 144: 'numlock', 145: 'scroll', 173: '-', 186: ';', 187: '=', 188: ',',
      189: '-', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\', 221: ']', 222: '\'', 224: 'meta'
    },

    shiftNums: {
      '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%', '6': '^', '7': '&',
      '8': '*', '9': '(', '0': ')', '-': '_', '=': '+', ';': ':', '\'': '"', ',': '<',
      '.': '>',  '/': '?',  '\\': '|', '[': '{', ']': '}'
    },
    /* jshint ignore:end */

    combos: {
      'ctrl+x': 'cut',
      'ctrl+c': 'copy',
      'ctrl+v': 'paste',
      'ctrl+z': 'undo',
      'meta+x': 'cut',
      'meta+c': 'copy',
      'meta+v': 'paste',
      'meta+z': 'undo'
    }
  };

  function keyHandler( handleObj ) {
    if ( isString(handleObj.data) ) {
      handleObj.data = { keys: handleObj.data };
    } else if ( isArray(handleObj.data) ) {
      handleObj.data = { keys: expandReplacements(handleObj.data) };
    }

    // Only care when a possible input has been specified
    if ( !handleObj.data || !handleObj.data.keys || !isString(handleObj.data.keys) ) {
      return;
    }

    var origHandler = handleObj.handler,
      keys = handleObj.data.keys.toLowerCase().split(' '),
      textAcceptingInputTypes = ['text', 'password', 'number', 'email', 'url', 'range', 'date', 'month', 'week', 'time', 'datetime', 'datetime-local', 'search', 'color', 'tel'];
    handleObj.handler = function( event ) {
      // Don't fire in text-accepting inputs that we didn't directly bind to
      if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
        jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
        return;
      }

      // Keypress represents characters, not special keys
      var special = jQuery.hotkeys.specialKeys[ event.which ],
        character = event.type !== 'keypress' && String.fromCharCode( event.which ).toLowerCase(),
        modif = '', possible = {};

      // check combinations (alt|ctrl|shift+anything)
      if ( event.altKey && special !== 'alt' ) {
        modif += 'alt+';
      }

      if ( event.ctrlKey && special !== 'ctrl' ) {
        modif += 'ctrl+';
      }

      // TODO: Need to make sure this works consistently across platforms
      if ( event.metaKey && !event.ctrlKey && special !== 'meta' ) {
        modif += 'meta+';
      }

      if ( event.shiftKey && special !== 'shift' ) {
        modif += 'shift+';
      }

      if ( special ) {
        if ( modif === 'shift+' ) {
          special = jQuery.hotkeys.shiftNums[ special ];
        }
        possible[ modif + special ] = true;
        arguments[0].normalized = special;
      } else if ( character ) {
        possible[ modif + character ] = true;
        possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;
        arguments[0].normalized = character;
        // '$' can be triggered as 'Shift+4' or 'Shift+$' or just '$'
        if ( modif === 'shift+' ) {
          possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
          arguments[0].normalized = jQuery.hotkeys.shiftNums[ character ];
        } else if ( jQuery.hotkeys.combos[modif + character] ) {
          arguments[0].normalized = jQuery.hotkeys.combos[modif + character];
        }
      }

      for ( var i = 0, l = keys.length; i < l; i++ ) {
        if ( possible[ keys[i] ] ) {
          return origHandler.apply( this, arguments );
        }
      }
    };
  }

  function isFunction(input)  { return (Object.prototype.toString.call(input) === '[object Function]' ); }
  function isArray(input)     { return (Object.prototype.toString.call(input) === '[object Array]'    ); }
  function isBoolean(input)   { return (Object.prototype.toString.call(input) === '[object Boolean]'  ); }
  function isObject(input)    { return (Object.prototype.toString.call(input) === '[object Object]'   ); }
  function isInteger(input)   { return (Object.prototype.toString.call(input) === '[object Integer]'  ); }
  function isUndefined(input) { return (Object.prototype.toString.call(input) === '[object Undefined]'); }
  function isString(input)    { return (Object.prototype.toString.call(input) === '[object String]'   ); }
  function unique(list) {
    var result = [];
    $.each(list, function(key, value) {
      if ($.inArray(value, result) === -1) {
        result.push(value);
      }
    });
    return result;
  }
  function expandReplacements(input) {
    var expansion = [];
    $.each(input, function (key, value) {
      expansion.push( jQuery.hotkeys.replacements[value] ? jQuery.hotkeys.replacements[value] : value );
    });
    return unique(expansion).join(' ');
  }

  jQuery.each([ 'keydown', 'keyup', 'keypress' ], function() {
    jQuery.event.special[ this ] = { add: keyHandler };
  });

})( this.jQuery );
