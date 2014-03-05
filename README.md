#About
**jQuery Hotkeys** is a plug-in that lets you easily add and remove handlers for keyboard events anywhere in your code supporting almost any key combination.  

This plugin is based off of the plugin by Tzury Bar Yochay [jQuery.hotkeys](https://github.com/tzuryby/jquery.hotkeys) and later extended by John Resig [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys).

## Installation ##
You can install this plugin with [Bower](http://bower.io/) with this command:

```js
bower install xero.jquery.hotkeys --save-dev
```

## Usage ##

The syntax is as follows:

```js
$(expression).bind(types, keys, handler);
$(expression).unbind(types, handler);

$(document).bind('keydown', 'ctrl+a', fn);

// e.g. replace '$' sign with 'EUR'
$('input.foo').bind('keyup', '$', function(){
  this.value = this.value.replace('$', 'EUR');
});
```

Syntax when wanting to use jQuery's `on()`/`off` methods:

```js
$(expression).on(types, null, keys, handler);
$(expression).off(types, handler);

$(document).on('keydown', null, 'ctrl+a', fn);

// e.g. replace '$' sign with 'EUR'
$('input.foo').on('keyup', null, '$', function(){
  this.value = this.value.replace('$', 'EUR');
});
```

Syntax when wanting to use a single shortcut exapansions:

```js
$(expression).bind(types, keys, handler);
$(expression).unbind(types, handler);

$(document).bind('keydown', 'a-z', fn);
```

The last example will will listen for all letters `a-z`.

Syntax when wanting to use multiple shortcut exapansions:

```js
$(expression).bind(types, keys, handler);
$(expression).unbind(types, handler);

$(document).bind('keydown', ['a-z', '0-9'], fn);
```

The last example will will listen for all letters `a-z` and all numbers `0-9`.

## Types
Supported types are `'keydown'`, `'keyup'` and `'keypress'`

## Event Object
The Event object that gets return to the handler has been augmented to include a `normalized` attribute that contains the interpreted character that was found by the plugin. This may include values such as `backspace`, `del`, or `left` which represents special keys. This attribute has been tested to work with `keydown` listener types.

## Availble Expansions

### Expansion sets that make up all keyboard keys when combined together.
* `a-z`: a b c d e f g h i j k l m n o p q r s t u v w x y z
* `A-Z`: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
* `a-Z`: a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
* `shifted`: ~ ! @ # $ % ^ & * ( ) _ + { } | : " < > ? shift+~ shift+! shift+@ shift+# shift+$ shift+% shift+^ shift+& shift+* shift+( shift+) shift+_ shift++ shift+{ shift+} shift+| shift+: shift+" shift+< shift+> shift+?
* `nonshifted`: ` 1 2 3 4 5 6 7 8 9 0 - = [ ] \\ ; \' , . /
* `arrow`: left up right down
* `special`: backspace tab return shift ctrl alt pause capslock esc space pageup pagedown end home insert delete del numlock scroll meta
* `function`: f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11 f12

### Special expansion sets
* `0-9`: 1 2 3 4 5 6 7 8 9 0
* `numpad`: '1 2 3 4 5 6 7 8 9 0 / * - + return .
* `undo`: 'ctrl+z meta+z
* `cut`: 'ctrl+x meta+x
* `copy`: 'ctrl+c meta+c
* `paste`: 'ctrl+v meta+v
* `operators`: '= + - * / % < >



## Notes

If you want to use more than one modifiers (e.g. alt+ctrl+z) you should define them by an alphabetical order e.g. alt+ctrl+shift

Hotkeys aren't tracked if you're inside of an input element (unless you explicitly bind the hotkey directly to the input). This helps to avoid conflict with normal user typing.

## jQuery Compatibility

Works with jQuery 1.4.2 and newer.

It known to be working with all the major browsers on all available platforms (Win/Mac/Linux)

 * IE 6/7/8
 * FF 1.5/2/3
 * Opera-9
 * Safari-3
 * Chrome-0.2

### Addendum

Firefox is the most liberal one in the manner of letting you capture all short-cuts even those that are built-in in the browser such as `Ctrl-t` for new tab, or `Ctrl-a` for selecting all text. You can always bubble them up to the browser by returning `true` in your handler.

Others, (IE) either let you handle built-in short-cuts, but will add their functionality after your code has executed. Or (Opera/Safari) will *not* pass those events to the DOM at all.

*So, if you bind `Ctrl-Q` or `Alt-F4` and your Safari/Opera window is closed don't be surprised.*
