/**
 * http://www.openjs.com/scripts/events/keyboard_shortcuts/
 * Version : 2.01.B
 * By Binny V A
 * License : BSD
 */
shortcut = {
  all_shortcuts: {}, //All the shortcuts are stored in this array
  add: function (shortcut_combination, callback, opt) {
    //Provide a set of default options
    var default_options = {
      type: "keydown",
      propagate: false,
      disable_in_input: false,
      target: document,
      keycode: false,
    };
    if (!opt) opt = default_options;
    else {
      for (var dfo in default_options) {
        if (typeof opt[dfo] == "undefined") opt[dfo] = default_options[dfo];
      }
    }

    var ele = opt.target;
    if (typeof opt.target == "string")
      ele = document.getElementById(opt.target);
    var ths = this;
    shortcut_combination = shortcut_combination.toLowerCase();

    //The function to be called at keypress
    var func = function (e) {
      e = e || window.event;

      if (opt["disable_in_input"]) {
        //Don't enable shortcut keys in Input, Textarea fields
        var element;
        if (e.target) element = e.target;
        else if (e.srcElement) element = e.srcElement;
        if (element.nodeType == 3) element = element.parentNode;

        if (element.tagName == "INPUT" || element.tagName == "TEXTAREA") return;
      }

      //Find Which key is pressed
      if (e.keyCode) code = e.keyCode;
      else if (e.which) code = e.which;
      var character = String.fromCharCode(code).toLowerCase();

      if (code == 188) character = ","; //If the user presses , when the type is onkeydown
      if (code == 190) character = "."; //If the user presses , when the type is onkeydown

      var keys = shortcut_combination.split("+");
      //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
      var kp = 0;

      //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
      var shift_nums = {
        "`": "~",
        1: "!",
        2: "@",
        3: "#",
        4: "$",
        5: "%",
        6: "^",
        7: "&",
        8: "*",
        9: "(",
        0: ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": '"',
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|",
      };
      //Special Keys - and their codes
      var special_keys = {
        esc: 27,
        escape: 27,
        tab: 9,
        space: 32,
        return: 13,
        enter: 13,
        backspace: 8,

        scrolllock: 145,
        scroll_lock: 145,
        scroll: 145,
        capslock: 20,
        caps_lock: 20,
        caps: 20,
        numlock: 144,
        num_lock: 144,
        num: 144,

        pause: 19,
        break: 19,

        insert: 45,
        home: 36,
        delete: 46,
        end: 35,

        pageup: 33,
        page_up: 33,
        pu: 33,

        pagedown: 34,
        page_down: 34,
        pd: 34,

        left: 37,
        up: 38,
        right: 39,
        down: 40,

        f1: 112,
        f2: 113,
        f3: 114,
        f4: 115,
        f5: 116,
        f6: 117,
        f7: 118,
        f8: 119,
        f9: 120,
        f10: 121,
        f11: 122,
        f12: 123,
      };

      var modifiers = {
        shift: { wanted: false, pressed: false },
        ctrl: { wanted: false, pressed: false },
        alt: { wanted: false, pressed: false },
        meta: { wanted: false, pressed: false }, //Meta is Mac specific
      };

      if (e.ctrlKey) modifiers.ctrl.pressed = true;
      if (e.shiftKey) modifiers.shift.pressed = true;
      if (e.altKey) modifiers.alt.pressed = true;
      if (e.metaKey) modifiers.meta.pressed = true;

      for (var i = 0; (k = keys[i]), i < keys.length; i++) {
        //Modifiers
        if (k == "ctrl" || k == "control") {
          kp++;
          modifiers.ctrl.wanted = true;
        } else if (k == "shift") {
          kp++;
          modifiers.shift.wanted = true;
        } else if (k == "alt") {
          kp++;
          modifiers.alt.wanted = true;
        } else if (k == "meta") {
          kp++;
          modifiers.meta.wanted = true;
        } else if (k.length > 1) {
          //If it is a special key
          if (special_keys[k] == code) kp++;
        } else if (opt["keycode"]) {
          if (opt["keycode"] == code) kp++;
        } else {
          //The special keys did not match
          if (character == k) kp++;
          else {
            if (shift_nums[character] && e.shiftKey) {
              //Stupid Shift key bug created by using lowercase
              character = shift_nums[character];
              if (character == k) kp++;
            }
          }
        }
      }

      if (
        kp == keys.length &&
        modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
        modifiers.shift.pressed == modifiers.shift.wanted &&
        modifiers.alt.pressed == modifiers.alt.wanted &&
        modifiers.meta.pressed == modifiers.meta.wanted
      ) {
        callback(e);

        if (!opt["propagate"]) {
          //Stop the event
          //e.cancelBubble is supported by IE - this will kill the bubbling process.
          e.cancelBubble = true;
          e.returnValue = false;

          //e.stopPropagation works in Firefox.
          if (e.stopPropagation) {
            e.stopPropagation();
            e.preventDefault();
          }
          return false;
        }
      }
    };
    this.all_shortcuts[shortcut_combination] = {
      callback: func,
      target: ele,
      event: opt["type"],
    };
    //Attach the function with the event
    if (ele.addEventListener) ele.addEventListener(opt["type"], func, false);
    else if (ele.attachEvent) ele.attachEvent("on" + opt["type"], func);
    else ele["on" + opt["type"]] = func;
  },

  //Remove the shortcut - just specify the shortcut and I will remove the binding
  remove: function (shortcut_combination) {
    shortcut_combination = shortcut_combination.toLowerCase();
    var binding = this.all_shortcuts[shortcut_combination];
    delete this.all_shortcuts[shortcut_combination];
    if (!binding) return;
    var type = binding["event"];
    var ele = binding["target"];
    var callback = binding["callback"];

    if (ele.detachEvent) ele.detachEvent("on" + type, callback);
    else if (ele.removeEventListener)
      ele.removeEventListener(type, callback, false);
    else ele["on" + type] = false;
  },
};

shortcut.add("1", function () {
  $(".ui-keyboard-1").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-1').eq(2).css('background', '#c5dbec');
// });

shortcut.add("2", function () {
  $(".ui-keyboard-2").eq(1).css("background", "#c5dbec");
});

shortcut.add(
  "bla",
  function () {
    $(".ui-keyboard-2").eq(2).css("background", "#c5dbec");
  },
  { type: "keydown", keycode: 98 }
);

shortcut.add("3", function () {
  $(".ui-keyboard-3").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-3').eq(2).css('background', '#c5dbec');
// });

shortcut.add("4", function () {
  $(".ui-keyboard-4").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-4').eq(2).css('background', '#c5dbec');
// });

shortcut.add("5", function () {
  $(".ui-keyboard-5").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-5').eq(2).css('background', '#c5dbec');
// });

shortcut.add("6", function () {
  $(".ui-keyboard-6").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-6').eq(2).css('background', '#c5dbec');
// });

shortcut.add("7", function () {
  $(".ui-keyboard-7").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-7').eq(2).css('background', '#c5dbec');
// });

shortcut.add("8", function () {
  $(".ui-keyboard-8").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-8').eq(2).css('background', '#c5dbec');
// });

shortcut.add("9", function () {
  $(".ui-keyboard-9").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-9').eq(2).css('background', '#c5dbec');
// });

shortcut.add("0", function () {
  $(".ui-keyboard-0").eq(1).css("background", "#c5dbec");
});

// shortcut.add("End",function() {
// 	$('.ui-keyboard-0').eq(2).css('background', '#c5dbec');
// });

shortcut.add("Enter", function () {
  $(".ui-keyboard-enter").css("background", "#c5dbec");
});

shortcut.add("Esc", function () {
  $(".ui-keyboard-ESC").css("background", "#c5dbec");
});

shortcut.add("F1", function () {
  $(".ui-keyboard-F1").css("background", "#c5dbec");
});

shortcut.add("F2", function () {
  $(".ui-keyboard-F2").css("background", "#c5dbec");
});

shortcut.add("F3", function () {
  $(".ui-keyboard-F3").css("background", "#c5dbec");
});

shortcut.add("F4", function () {
  $(".ui-keyboard-F4").css("background", "#c5dbec");
});

shortcut.add("F5", function () {
  $(".ui-keyboard-F5").css("background", "#c5dbec");
});

shortcut.add("F6", function () {
  $(".ui-keyboard-F6").css("background", "#c5dbec");
});

shortcut.add("F7", function () {
  $(".ui-keyboard-F7").css("background", "#c5dbec");
});

shortcut.add("F8", function () {
  $(".ui-keyboard-F8").css("background", "#c5dbec");
});

shortcut.add("F9", function () {
  $(".ui-keyboard-F9").css("background", "#c5dbec");
});

shortcut.add("F10", function () {
  $(".ui-keyboard-F10").css("background", "#c5dbec");
});

shortcut.add("F11", function () {
  $(".ui-keyboard-F11").css("background", "#c5dbec");
});

shortcut.add("F12", function () {
  $(".ui-keyboard-F12").css("background", "#c5dbec");
});

shortcut.add("Return", function () {
  $(".ui-keyboard-Return").css("background", "#c5dbec");
});

shortcut.add("Scroll_lock", function () {
  $(".ui-keyboard-Scroll").css("background", "#c5dbec");
});

shortcut.add("Caps_lock", function () {
  $(".ui-keyboard-Caps").css("background", "#c5dbec");
});

shortcut.add("Num_lock", function () {
  $(".ui-keyboard-Num").css("background", "#c5dbec");
});

shortcut.add("Pause", function () {
  $(".ui-keyboard-Pause").css("background", "#c5dbec");
});

shortcut.add("Home", function () {
  $(".ui-keyboard-Home").css("background", "#c5dbec");
});

shortcut.add("Delete", function () {
  $(".ui-keyboard-Delete").css("background", "#c5dbec");
});

shortcut.add("Page_up", function () {
  $(".ui-keyboard-Page_up").css("background", "#c5dbec");
});

shortcut.add("Page_down", function () {
  $(".ui-keyboard-Page_down").css("background", "#c5dbec");
});

shortcut.add("Left", function () {
  $(".ui-keyboard-38larr-59").css("background", "#c5dbec");
});

shortcut.add("Right", function () {
  $(".ui-keyboard-38rarr-59").css("background", "#c5dbec");
});

shortcut.add("Up", function () {
  $(".ui-keyboard-38uarr-59").css("background", "#c5dbec");
});

shortcut.add("Down", function () {
  $(".ui-keyboard-38darr-59").css("background", "#c5dbec");
});

shortcut.add("Ctrl", function () {
  $(".ui-keyboard-Ctrl").css("background", "#c5dbec");
});

shortcut.add("Scroll_lock", function () {
  $(".ui-keyboard-ScrlLk").css("background", "#c5dbec");
});

shortcut.add("Num_lock", function () {
  $(".ui-keyboard-NmLk").css("background", "#c5dbec");
});

shortcut.add("Insert", function () {
  $(".ui-keyboard-Ins").css("background", "#c5dbec");
});

shortcut.add("Pause", function () {
  $(".ui-keyboard-Pause").css("background", "#c5dbec");
});

$(document).on("keydown", function (event) {
  var key = event.keyCode;
  $("." + list(key)).addClass("keydown_press");
});

// $(document).on('keyup', function() {
// 	$(".ui-keyboard-button").removeClass('keydown_press');
// });

$(document).on("keyup keydown_press", function (event) {
  var key = event.keyCode;
  $("." + list(key)).removeClass("keydown_press");
  $("." + list(key)).addClass("ui-state-hover");

  if ($(".ui-keyboard-ESC").hasClass("keydown_press")) {
    $(".ui-keyboard-ESC").removeClass("keydown_press");
  }
});

function list(a) {
  switch (a) {
    case 27:
      return "ui-keyboard-ESC";
      break;
    case 112:
      return "ui-keyboard-F1";
      break;
    case 113:
      return "ui-keyboard-F2";
      break;
    case 114:
      return "ui-keyboard-F3";
      break;
    case 115:
      return "ui-keyboard-F4";
      break;
    case 116:
      return "ui-keyboard-F5";
      break;
    case 117:
      return "ui-keyboard-F6";
      break;
    case 118:
      return "ui-keyboard-F7";
      break;
    case 119:
      return "ui-keyboard-F8";
      break;
    case 120:
      return "ui-keyboard-F9";
      break;
    case 121:
      return "ui-keyboard-F10";
      break;
    case 122:
      return "ui-keyboard-F11";
      break;
    case 123:
      return "ui-keyboard-F12";
      break;
    case 145:
      return "ui-keyboard-ScrlLk";
      break;
    case 19:
      return "ui-keyboard-Pause";
      break;
    case 45:
      return "ui-keyboard-Ins";
      break;
    case 46:
      return "ui-keyboard-del";
      break;
    case 36:
      return "ui-keyboard-Home";
      break;
    case 35:
      return "ui-keyboard-End";
      break;
    case 33:
      return "ui-keyboard-PgUp";
      break;
    case 34:
      return "ui-keyboard-PgDn";
      break;
    case 192:
      return "ui-keyboard-96";
      break;
    case 49:
      return "ui-keyboard-keyset-normal .ui-keyboard-1";
      break;
    case 50:
      return "ui-keyboard-keyset-normal .ui-keyboard-2";
      break;
    case 51:
      return "ui-keyboard-keyset-normal .ui-keyboard-3";
      break;
    case 52:
      return "ui-keyboard-keyset-normal .ui-keyboard-4";
      break;
    case 53:
      return "ui-keyboard-keyset-normal .ui-keyboard-5";
      break;
    case 54:
      return "ui-keyboard-keyset-normal .ui-keyboard-6";
      break;
    case 55:
      return "ui-keyboard-keyset-normal .ui-keyboard-7";
      break;
    case 56:
      return "ui-keyboard-keyset-normal .ui-keyboard-8";
      break;
    case 57:
      return "ui-keyboard-keyset-normal .ui-keyboard-9";
      break;
    case 48:
      return "ui-keyboard-keyset-normal .ui-keyboard-0";
      break;
    case 189:
      return "ui-keyboard-keyset-normal .ui-keyboard--";
      break;
    case 173:
      return "ui-keyboard-keyset-normal .ui-keyboard--";
      break;
    case 187:
      return "ui-keyboard-61";
      break;
    case 61:
      return "ui-keyboard-61";
      break;
    case 8:
      return "ui-keyboard-bksp";
      break;
    case 144:
      return "ui-keyboard-NmLk";
      break;
    case 111:
      return "ui-keyboard-extender .ui-keyboard-47";
      break;
    case 106:
      return "ui-keyboard-extender .ui-keyboard-42";
      break;
    case 109:
      return "ui-keyboard-extender .ui-keyboard--";
      break;
    case 9:
      return "ui-keyboard-tab";
      break;
    case 81:
      return "ui-keyboard-q";
      break;
    case 87:
      return "ui-keyboard-w";
      break;
    case 69:
      return "ui-keyboard-e";
      break;
    case 82:
      return "ui-keyboard-r";
      break;
    case 84:
      return "ui-keyboard-t";
      break;
    case 89:
      return "ui-keyboard-y";
      break;
    case 85:
      return "ui-keyboard-u";
      break;
    case 73:
      return "ui-keyboard-i";
      break;
    case 79:
      return "ui-keyboard-o";
      break;
    case 80:
      return "ui-keyboard-p";
      break;
    case 219:
      return "ui-keyboard-91";
      break;
    case 221:
      return "ui-keyboard-93";
      break;
    case 220:
      return "ui-keyboard-92";
      break;
    case 103:
      return "ui-keyboard-extender .ui-keyboard-7";
      break;
    case 104:
      return "ui-keyboard-extender .ui-keyboard-8";
      break;
    case 105:
      return "ui-keyboard-extender .ui-keyboard-9";
      break;
    case 107:
      return "ui-keyboard-extender .ui-keyboard-43";
      break;
    case 20:
      return "ui-keyboard-Caps";
      break;
    case 65:
      return "ui-keyboard-a";
      break;
    case 83:
      return "ui-keyboard-s";
      break;
    case 68:
      return "ui-keyboard-d";
      break;
    case 70:
      return "ui-keyboard-f";
      break;
    case 71:
      return "ui-keyboard-g";
      break;
    case 72:
      return "ui-keyboard-h";
      break;
    case 74:
      return "ui-keyboard-j";
      break;
    case 75:
      return "ui-keyboard-k";
      break;
    case 76:
      return "ui-keyboard-l";
      break;
    case 59:
      return "ui-keyboard-59";
      break;
    case 186:
      return "ui-keyboard-59";
      break;
    case 222:
      return "ui-keyboard-39";
      break;
    case 100:
      return "ui-keyboard-extender .ui-keyboard-4";
      break;
    case 101:
      return "ui-keyboard-extender .ui-keyboard-5";
      break;
    case 102:
      return "ui-keyboard-extender .ui-keyboard-6";
      break;
    case 90:
      return "ui-keyboard-z";
      break;
    case 88:
      return "ui-keyboard-x";
      break;
    case 67:
      return "ui-keyboard-c";
      break;
    case 86:
      return "ui-keyboard-v";
      break;
    case 66:
      return "ui-keyboard-b";
      break;
    case 78:
      return "ui-keyboard-n";
      break;
    case 77:
      return "ui-keyboard-m";
      break;
    case 188:
      return "ui-keyboard-keyset-normal .ui-keyboard-44";
      break;
    case 190:
      return "ui-keyboard-keyset-normal .ui-keyboard-46";
      break;
    case 191:
      return "ui-keyboard-keyset-normal .ui-keyboard-47";
      break;
    case 96:
      return "ui-keyboard-extender .ui-keyboard-0";
      break;
    case 32:
      return "ui-keyboard-space";
      break;
    case 93:
      return "menu";
      break;
    case 38:
      return "ui-keyboard-38uarr-59";
      break;
    case 40:
      return "ui-keyboard-38darr-59";
      break;
    case 37:
      return "ui-keyboard-left";
      break;
    case 39:
      return "ui-keyboard-right";
      break;
    case 110:
      return "ui-keyboard-extender .ui-keyboard-46";
      break;
    case 97:
      return "ui-keyboard-extender .ui-keyboard-1";
      break;
    case 98:
      return "ui-keyboard-extender .ui-keyboard-2";
      break;
    case 99:
      return "ui-keyboard-extender .ui-keyboard-3";
      break;
    case 0:
      return "Left Click";
      break;
    case 1:
      return "Scroll Click";
      break;
    case 2:
      return "Right Click";
      break;
    case 16:
      return "ui-keyboard-shift";
      break;
    case 18:
      return "ui-keyboard-alt";
      break;
    case 17:
      return "ui-keyboard-Ctrl";
      break;
    case 91:
      return "WIN";
      break;
    case 13:
      return "ui-keyboard-enter";
      break;
    case 44:
      return "ui-keyboard-prtSc";
      break;
  }
}
