/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery){

	jQuery.hotkeys = {
		version: "0.8",

		replacements: {
			'0-9': '1 2 3 4 5 6 7 8 9 0',
			'a-z': 'a b c d e f g h i j k l m n o p q r s t u v w x y z',
			'numpad': '1 2 3 4 5 6 7 8 9 0 / * - + return .',
			'arrow': 'left up right down',
			'ccpu': 'ctrl+x ctrl+c ctrl+v ctrl+z meta+x meta+c meta+v meta+z'
		},

		specialKeys: {
			// '=' can be either 107 or 187 depending on it's location on the keyboard
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 48: "0", 59: ";",
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 112: "f1", 113: "f2",
			114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 120: "f9", 121: "f10",
			122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 186: ";", 187: "=", 188: ",",
			189: "-", 190: ".", 191: "/", 219: "[", 220: "\\", 221: "]", 222: "'", 224: "meta"
		},

		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": "\"", ",": "<",
			".": ">",  "/": "?",  "\\": "|", "[": "{", "]": "}"
		},

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
		if ( !handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string" ) {
			return;
		}

		var origHandler = handleObj.handler,
			keys = handleObj.data.keys.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color", "tel"];
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
				return;
			}

			// Keypress represents characters, not special keys
			var special = jQuery.hotkeys.specialKeys[ event.which ],
				character = event.type !== "keypress" && String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}

			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				if ( modif === "shift+" ) {
					special = jQuery.hotkeys.shiftNums[ special ];
				}
				possible[ modif + special ] = true;
				arguments[0].normalized = special;
			} else if ( character ) {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;
				arguments[0].normalized = character;
				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
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
	function expandReplacements(input) {
		var expansion = [];
		$.each(input, function (key, value) {
			expansion.push( jQuery.hotkeys.replacements[value] ? jQuery.hotkeys.replacements[value] : value );
		});
		return expansion.join(' ');
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( this.jQuery );
