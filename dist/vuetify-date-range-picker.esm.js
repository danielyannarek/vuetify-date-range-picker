import moment from 'moment';
import { VIcon, VBtn, VCol, VListItemTitle, VListItem, VList, VMenu, VRow, VSheet, VDatePicker, VTextField, VCheckbox, VCardText, VSpacer, VCardActions, VCard, VContainer, VDialog, VOverlay } from 'vuetify/lib';
import { mdiChevronDown, mdiCalendarCheck, mdiCalendarRemove } from '@mdi/js';

var DATE_FORMAT = "YYYY-MM-DD";
var MONTH_FORMAT = "YYYY-MM";
var DEFAULT_FORMAT = "MMM D, YYYY";
var TODAY = String(moment().format(DATE_FORMAT));

var LAST_WEEK = [
  String(moment(TODAY).subtract(1, "weeks").startOf("isoWeek").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "weeks").endOf("isoWeek").format(DATE_FORMAT)) ];

var LAST_MONTH = [
  String(moment(TODAY).subtract(1, "month").startOf("month").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "month").endOf("month").format(DATE_FORMAT)) ];

var LAST_3_MONTHS = [
  String(moment(TODAY).subtract(3, "month").startOf("month").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "month").endOf("month").format(DATE_FORMAT)) ];

var LAST_7_DAYS = [
  String(moment(TODAY).subtract(7, "day").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "day").format(DATE_FORMAT)) ];

var LAST_30_DAYS = [
  String(moment(TODAY).subtract(30, "day").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "day").format(DATE_FORMAT)) ];

var LAST_90_DAYS = [
  String(moment(TODAY).subtract(90, "day").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "day").format(DATE_FORMAT)) ];

var LAST_YEAR = [
  String(moment(TODAY).subtract(1, "year").startOf("Year").format(DATE_FORMAT)),
  String(moment(TODAY).subtract(1, "year").endOf("Year").format(DATE_FORMAT)) ];

var THIS_YEAR = [
  String(moment(TODAY).startOf("Year").format(DATE_FORMAT)),
  String(moment(TODAY).format(DATE_FORMAT)) ];

var PREVIOUS_PERIOD = function (ref) {
  var start = ref[0];
  var until = ref[1];

  var duration = moment(until).diff(moment(start), "days") + 1;

  return [
    String(moment(start).subtract(duration, "days").format(DATE_FORMAT)),
    String(moment(until).subtract(duration, "days").format(DATE_FORMAT)) ]
};

var PREVIOUS_MONTH = function (ref) {
  var start = ref[0];
  var until = ref[1];

  return [
    String(moment(start).subtract(1, "month").format(DATE_FORMAT)),
    String(moment(until).subtract(1, "month").format(DATE_FORMAT)) ]
};

var PREVIOUS_YEAR = function (ref) {
  var start = ref[0];
  var until = ref[1];

  return [
    String(moment(start).subtract(1, "year").format(DATE_FORMAT)),
    String(moment(until).subtract(1, "year").format(DATE_FORMAT)) ]
};

var primaryPresets = {
  LAST_WEEK: LAST_WEEK,
  LAST_MONTH: LAST_MONTH,
  LAST_3_MONTHS: LAST_3_MONTHS,
  LAST_7_DAYS: LAST_7_DAYS,
  LAST_30_DAYS: LAST_30_DAYS,
  LAST_90_DAYS: LAST_90_DAYS,
  LAST_YEAR: LAST_YEAR,
  THIS_YEAR: THIS_YEAR,
};

var comparePresets = {
  PREVIOUS_PERIOD: PREVIOUS_PERIOD,
  PREVIOUS_MONTH: PREVIOUS_MONTH,
  PREVIOUS_YEAR: PREVIOUS_YEAR,
};

var DateRangePresets = Object.assign({}, {TODAY: TODAY,
  DATE_FORMAT: DATE_FORMAT,
  MONTH_FORMAT: MONTH_FORMAT,
  DEFAULT_FORMAT: DEFAULT_FORMAT},

  primaryPresets,
  comparePresets);

var defaultDateFormat = "MMM D, YYYY";
var defaultPrimaryPreset = "LAST_7_DAYS";
var defaultComparePreset = "PREVIOUS_PERIOD";

var state = {
  debug: false,

  // date range picker config props and emitted values
  config: {
    compare: true,
  },

  // layout
  show_calendar_icon: true,
  show_presets_icon: true,

  // config
  compare: true,
  dark_theme: false,
  date_format: defaultDateFormat,

  // defaults
  default_date_format: defaultDateFormat,
  default_primary_preset: defaultPrimaryPreset,
  default_compare_preset: defaultComparePreset,

  // primary date range
  date_start: DateRangePresets[defaultPrimaryPreset][0],
  date_until: DateRangePresets[defaultPrimaryPreset][1],
  picker_active_mount: DateRangePresets[defaultPrimaryPreset][0],
  picker_active_compare_mount: DateRangePresets[defaultPrimaryPreset][0],

  // compare period date range
  compare_start: DateRangePresets.PREVIOUS_PERIOD(DateRangePresets[defaultPrimaryPreset])[0],
  compare_until: DateRangePresets.PREVIOUS_PERIOD(DateRangePresets[defaultPrimaryPreset])[1],

  // primary and compare presets
  primary_preset: defaultPrimaryPreset,
  compare_preset: defaultComparePreset,

  // primary and compare presets lists
  primary_presets: Object.keys(primaryPresets),
  compare_presets: Object.keys(comparePresets),

  // layout
  dialog_opened: false,
  picker_primary_active: true,
};

var getters = {
  // dialog window state
  isDialogOpened: function isDialogOpened(state) {
    return state.dialog_opened
  },

  isCalendarIconShown: function isCalendarIconShown(state) {
    return state.show_calendar_icon
  },

  isPresetsIconShown: function isPresetsIconShown(state) {
    return state.show_presets_icon
  },

  getPresetLabel: function getPresetLabel() {
    return function (preset) { return preset.replaceAll("_", " "); }
  },

  getPresetLabelSmall: function getPresetLabelSmall() {
    return function (preset) { return preset.replaceAll("_", " ").toLowerCase(); }
  },

  // compare checkbox state
  getCompareState: function getCompareState(state) {
    return state.compare
  },

  // primary date picker state
  getDateStart: function getDateStart(state) {
    return state.date_start
  },

  getDateUntil: function getDateUntil(state) {
    return state.date_until
  },

  getPickerPrimary: function getPickerPrimary(state) {
    return [state.date_start, state.date_until]
  },

  // compare date picker state
  getDateCompareStart: function getDateCompareStart(state) {
    return state.compare_start
  },

  getDateCompareUntil: function getDateCompareUntil(state) {
    return state.compare_until
  },

  getPickerCompare: function getPickerCompare(state) {
    return [state.compare_start, state.compare_until]
  },

  // vuetify date pickers state
  isPickerPrimaryActive: function isPickerPrimaryActive(state) {
    return state.picker_primary_active
  },

  // parameter getter to format date
  getFormattedDate: function getFormattedDate(state) {
    return function (start, until) {
      // moment(start).format(state.date_format)
      var startMonth = moment(start).month(); // jan=0, dec=11
      var startYear = moment(start).year();

      var untilMonth = moment(until).month(); // jan=0, dec=11
      var untilYear = moment(until).year();

      var first = "MMM D, YYYY";
      var second = "MMM D, YYYY";

      if (startYear === untilYear && startMonth === untilMonth) {
        first = "MMM D";
        second = "D, YYYY";
      } else if (startYear === untilYear) {
        first = "MMM D";
        second = "MMM D, YYYY";
      }

      return moment(start).format(first) + " - " + moment(until).format(second)
    }
  },

  getPickerDate: function getPickerDate(state) {
    return moment(state.picker_active_mount).format(DateRangePresets.MONTH_FORMAT)
  },

  getPickerPrimaryLeft: function getPickerPrimaryLeft(state) {
    return moment(state.picker_active_mount).subtract(1, "month").format(DateRangePresets.MONTH_FORMAT)
  },

  getPickerPrimaryRight: function getPickerPrimaryRight(state) {
    return moment(state.picker_active_mount).format(DateRangePresets.MONTH_FORMAT)
  },

  getConfig: function getConfig(state) {
    return state.config
  },

  // input field helpers
  getMaxDate: function getMaxDate(state) {
    return DateRangePresets.TODAY
  },

  // preset default
  getPrimaryPreset: function getPrimaryPreset(state) {
    return state.primary_preset
  },

  getComparePreset: function getComparePreset(state) {
    return state.compare_preset
  },

  // get presets
  getPrimaryPresets: function getPrimaryPresets(state) {
    return state.primary_presets
  },

  getComparePresets: function getComparePresets(state) {
    return state.compare_presets
  },
};

var mutations = {
  // controls the dialog
  SET_DEBUG: function (state, status) { return (state.debug = status); },

  // controls the dialog
  SET_DIALOG_OPENED: function (state, status) { return (state.dialog_opened = status); },

  // controls the dialog
  SET_PRESET_ICON_SHOWN: function (state, status) { return (state.show_presets_icon = status); },

  // controls the dialog
  SET_CALENDAR_ICON_SHOWN: function (state, status) { return (state.show_calendar_icon = status); },

  // flips compare period checkbox
  FLIP_COMPARE_STATE: function (state) {
    state.compare = !state.compare;

    // state.config = {
    //   compare: state.compare,
    //   dateStart: state.date_start,
    //   dateUntil: state.date_until,
    //   compareStart: state.compare_start,
    //   compareUntil: state.compare_until,
    //   primaryPreset: state.primary_preset,
    //   comparePreset: state.compare_preset,
    // }

    // if (state.compare) {
    //   state.picker_primary_active = false
    // }
  },

  // set primary picker active
  SET_PICKER_PRIMARY_ACTIVE: function (state, value) { return (state.picker_primary_active = value); },

  // control date range properties
  SET_DATE_START: function (state, date) {
    state.date_start = date;
    state.compare_start = DateRangePresets[state.compare_preset]([state.date_start, state.date_until])[0];
    state.primary_preset = null;
  },

  SET_DATE_UNTIL: function (state, date) {
    state.date_until = date;
    state.compare_until = DateRangePresets[state.compare_preset]([state.date_start, state.date_until])[1];
    state.primary_preset = null;
  },

  SET_COMPARE_START: function (state, date) {
    state.compare_start = date;
    state.compare_preset = null;
  },

  SET_COMPARE_UNTIL: function (state, date) {
    state.compare_until = date;
    state.compare_preset = null;
  },

  // control selected primary preset
  SET_PRIMARY_PRESET: function (state, preset) {
    state.primary_preset = preset;

    state.picker_active_mount = moment(DateRangePresets[preset][0]).add(1, "month").format(DateRangePresets.MONTH_FORMAT);
    state.piker_left = DateRangePresets[preset][0];
    state.date_start = DateRangePresets[preset][0];
    state.date_until = DateRangePresets[preset][1];
    if (state.compare_preset) {
      var compare = DateRangePresets[state.compare_preset]([state.date_start, state.date_until]);
      state.compare_start = compare[0];
      state.compare_until = compare[1];
    }
    state.picker_primary_active = true;
  },

  // control selected compare preset
  SET_COMPARE_PRESET: function (state, preset) {
    var range = DateRangePresets[preset]([state.date_start, state.date_until]);

    state.compare_preset = preset;
    state.compare_start = range[0];
    state.compare_until = range[1];

    state.picker_active_mount = moment(range[0]).add(1, "month").format(DateRangePresets.MONTH_FORMAT);
    state.picker_primary_active = false;
  },

  // load initial component props to the store state
  SET_PROPS: function (state, props) {
    if (state.debug) { console.log("[ SET_PROPS ]:"); }

    // load defaults
    state.compare = state.config.compare;

    if (props && [true, false].includes(props.compare)) { state.compare = props.compare; }

    if (state.debug) { console.log("- applying compare:", state.compare); }

    if (props && DateRangePresets[props.primaryPreset]) {
      state.primary_preset = props.primaryPreset;
      state.date_start = DateRangePresets[props && props.primaryPreset][0];
      state.date_until = DateRangePresets[props && props.primaryPreset][1];

      if (state.debug) { console.log("- applying primary preset from props:", DateRangePresets[props.primaryPreset]); }
    } else {
      state.primary_preset = null;
      state.date_start = (props && props.dateStart) || DateRangePresets[state.default_primary_preset][0];
      state.date_until = (props && props.dateUntil) || DateRangePresets[state.default_primary_preset][1];

      if (!props.dateStart && !props.dateUntil) {
        state.primary_preset = state.default_primary_preset;

        if (state.debug) {
          console.log("- applying primary date range from default preset:", state.date_start, "-", state.date_until);
        }
      }

      if (state.debug && (props.dateStart || props.dateUntil)) {
        console.log("- applying primary date range from props:", state.date_start, "-", state.date_until);
      }
    }

    if (props && DateRangePresets[props.comparePreset]) {
      var range = DateRangePresets[props.comparePreset]([state.date_start, state.date_until]);

      state.compare_preset = props.comparePreset;
      state.compare_start = range[0];
      state.compare_until = range[1];

      if (state.debug) { console.log("- applying compare preset:", range); }
    } else {
      state.compare_preset = null;
      state.compare_start =
        (props && props.compareStart) || DateRangePresets[state.default_compare_preset]([state.date_start, state.date_until])[0];
      state.compare_until =
        (props && props.compareUntil) || DateRangePresets[state.default_compare_preset]([state.date_start, state.date_until])[1];

      if (!props.compareStart && !props.compareUntil) {
        state.compare_preset = state.default_compare_preset;

        if (state.debug) {
          console.log(
            "- applying compare date range from default preset:",
            state.compare_start,
            "-",
            state.compare_until
          );
        }
      }

      if (state.debug && (props.compareStart || props.compare_until)) {
        console.log("- applying compare date range from props:", state.compare_start, "-", state.compare_until);
      }
    }
  },

  // set emitted config from current states
  SET_CONFIG: function (state) {
    // apply primary preset if matches current start/until fields
    Object.keys(primaryPresets).forEach(function (preset) {
      var ref = DateRangePresets[preset];
      var start = ref[0];
      var until = ref[1];

      if (start === state.date_start && until === state.date_until) {
        state.primary_preset = preset;
      }
    });

    // apply compare preset if matches compare start/until fields
    Object.keys(comparePresets).forEach(function (preset) {
      var ref = DateRangePresets[preset]([state.date_start, state.date_until]);
      var start = ref[0];
      var until = ref[1];

      if (start === state.compare_start && until === state.compare_until) {
        state.compare_preset = preset;
      }
    });

    state.config = {
      compare: state.compare,
      dateStart: state.date_start,
      dateUntil: state.date_until,
      compareStart: state.compare_start,
      compareUntil: state.compare_until,
      primaryPreset: state.primary_preset,
      comparePreset: state.compare_preset,
    };

    if (state.debug) { console.log("[ SET_CONFIG ]:", state.config); }

    // close dialog
    state.dialog_opened = false;
  },

  // set primary start and until date
  SET_PICKER_PRIMARY: function (state, date) {
    if (state.date_start && state.date_until) {
      state.date_start = date;
      state.date_until = undefined;
    } else if (state.date_start && !state.date_until) {
      state.date_until = date;
    } else {
      state.date_start = date;
    }
    state.primary_preset = null;
  },

  // set compere start and until date
  SET_PICKER_COMPARE: function (state, date) {
    if (state.compare_start && state.compare_until) {
      state.compare_start = date;
      state.compare_until = undefined;
    } else if (state.compare_start && !state.compare_until) {
      state.compare_until = date;
    } else {
      state.compare_start = date;
    }
    state.compare_preset = null;
  },

  // set active mount
  SET_PICKER_DATE: function (state, ev) { return (state.picker_active_mount = ev); },

  // set active mount for date piker next to each other
  SET_PICKER_DATE_LEFT: function (state, ev) {
    if (moment(state.picker_active_mount).diff(moment(ev), "months") >= 2) {
      state.picker_active_mount = moment(ev).add(1, "month").format(DateRangePresets.MONTH_FORMAT);
    }
  },
};

var DateRangeStore = {
  namespaced: true,

  state: state,
  getters: getters,
  mutations: mutations,
};

/*!
 * vuex v3.6.2
 * (c) 2021 Evan You
 * @license MIT
 */
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) { options = {}; }

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}

var target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};
var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  }, { prepend: true });

  store.subscribeAction(function (action, state) {
    devtoolHook.emit('vuex:action', action, state);
  }, { prepend: true });
}

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

// Base data struct for store's module, package with some attribute and method
var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  // Store some children item
  this._children = Object.create(null);
  // Store the origin module object which passed by programmer
  this._rawModule = rawModule;
  var rawState = rawModule.state;

  // Store the origin module's state
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors = { namespaced: { configurable: true } };

prototypeAccessors.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.hasChild = function hasChild (key) {
  return key in this._children
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1$1 = this;
    if ( runtime === void 0 ) { runtime = true; }

  if ((process.env.NODE_ENV !== 'production')) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  var child = parent.getChild(key);

  if (!child) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.warn(
        "[vuex] trying to unregister module '" + key + "', which is " +
        "not registered"
      );
    }
    return
  }

  if (!child.runtime) {
    return
  }

  parent.removeChild(key);
};

ModuleCollection.prototype.isRegistered = function isRegistered (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];

  if (parent) {
    return parent.hasChild(key)
  }

  return false
};

function update (path, targetModule, newModule) {
  if ((process.env.NODE_ENV !== 'production')) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if ((process.env.NODE_ENV !== 'production')) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1$1 = this;
  if ( options === void 0 ) { options = {}; }

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install$1(window.Vue);
  }

  if ((process.env.NODE_ENV !== 'production')) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) { plugins = []; }
  var strict = options.strict; if ( strict === void 0 ) { strict = false; }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();
  this._makeLocalGettersCache = Object.create(null);

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  var state = this._modules.root.state;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1$1); });

  var useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools;
  if (useDevtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors$1 = { state: { configurable: true } };

prototypeAccessors$1.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors$1.state.set = function (v) {
  if ((process.env.NODE_ENV !== 'production')) {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });

  this._subscribers
    .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) { return sub(mutation, this$1$1.state); });

  if (
    (process.env.NODE_ENV !== 'production') &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  try {
    this._actionSubscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(function (sub) { return sub.before; })
      .forEach(function (sub) { return sub.before(action, this$1$1.state); });
  } catch (e) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e);
    }
  }

  var result = entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload);

  return new Promise(function (resolve, reject) {
    result.then(function (res) {
      try {
        this$1$1._actionSubscribers
          .filter(function (sub) { return sub.after; })
          .forEach(function (sub) { return sub.after(action, this$1$1.state); });
      } catch (e) {
        if ((process.env.NODE_ENV !== 'production')) {
          console.warn("[vuex] error in after action subscribers: ");
          console.error(e);
        }
      }
      resolve(res);
    }, function (error) {
      try {
        this$1$1._actionSubscribers
          .filter(function (sub) { return sub.error; })
          .forEach(function (sub) { return sub.error(action, this$1$1.state, error); });
      } catch (e) {
        if ((process.env.NODE_ENV !== 'production')) {
          console.warn("[vuex] error in error action subscribers: ");
          console.error(e);
        }
      }
      reject(error);
    });
  })
};

Store.prototype.subscribe = function subscribe (fn, options) {
  return genericSubscribe(fn, this._subscribers, options)
};

Store.prototype.subscribeAction = function subscribeAction (fn, options) {
  var subs = typeof fn === 'function' ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers, options)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1$1 = this;

  if ((process.env.NODE_ENV !== 'production')) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1$1.state, this$1$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1$1 = this;

  this._withCommit(function () {
    this$1$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) { options = {}; }

  if (typeof path === 'string') { path = [path]; }

  if ((process.env.NODE_ENV !== 'production')) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if ((process.env.NODE_ENV !== 'production')) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hasModule = function hasModule (path) {
  if (typeof path === 'string') { path = [path]; }

  if ((process.env.NODE_ENV !== 'production')) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  return this._modules.isRegistered(path)
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors$1 );

function genericSubscribe (fn, subs, options) {
  if (subs.indexOf(fn) < 0) {
    options && options.prepend
      ? subs.unshift(fn)
      : subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  // reset local getters cache
  store._makeLocalGettersCache = Object.create(null);
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure environment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && (process.env.NODE_ENV !== 'production')) {
      console.error(("[vuex] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
    }
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      if ((process.env.NODE_ENV !== 'production')) {
        if (moduleName in parentState) {
          console.warn(
            ("[vuex] state field \"" + moduleName + "\" was overridden by a module with the same name at \"" + (path.join('.')) + "\"")
          );
        }
      }
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ((process.env.NODE_ENV !== 'production') && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ((process.env.NODE_ENV !== 'production') && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  if (!store._makeLocalGettersCache[namespace]) {
    var gettersProxy = {};
    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function (type) {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) { return }

      // extract local getter type
      var localType = type.slice(splitPos);

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: function () { return store.getters[type]; },
        enumerable: true
      });
    });
    store._makeLocalGettersCache[namespace] = gettersProxy;
  }

  return store._makeLocalGettersCache[namespace]
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if ((process.env.NODE_ENV !== 'production')) {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.reduce(function (state, key) { return state[key]; }, state)
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if ((process.env.NODE_ENV !== 'production')) {
    assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install$1 (_Vue) {
  if (Vue && _Vue === Vue) {
    if ((process.env.NODE_ENV !== 'production')) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept another params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  if ((process.env.NODE_ENV !== 'production') && !isValidMap(mutations)) {
    console.error('[vuex] mapMutations: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var arguments$1 = arguments;

      var args = [], len = arguments.length;
      while ( len-- ) { args[ len ] = arguments$1[ len ]; }

      // Get the commit method from store
      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  if ((process.env.NODE_ENV !== 'production') && !isValidMap(getters)) {
    console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object');
  }
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ((process.env.NODE_ENV !== 'production') && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  if (!isValidMap(map)) {
    return []
  }
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

/**
 * Validate whether given map is valid or not
 * @param {*} map
 * @return {Boolean}
 */
function isValidMap (map) {
  return Array.isArray(map) || isObject(map)
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ((process.env.NODE_ENV !== 'production') && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var script$6 = {
  components: {
    VIcon: VIcon,
    VBtn: VBtn,
    VCol: VCol,
    VListItemTitle: VListItemTitle,
    VListItem: VListItem,
    VList: VList,
    VMenu: VMenu,
    VRow: VRow,
    VSheet: VSheet
  },

  name: "DateSelector",

  data: function () { return ({
    icon: {
      mdiChevronDown: mdiChevronDown,
      mdiCalendarCheck: mdiCalendarCheck,
      mdiCalendarRemove: mdiCalendarRemove,
    },
  }); },

  computed: Object.assign({}, mapGetters("datepicker", [
      "getConfig",
      "isPresetsIconShown",
      "isCalendarIconShown",
      "getFormattedDate",
      "getPrimaryPresets",
      "getPresetLabel",
      "getPresetLabelSmall" ])),

  methods: Object.assign({}, mapMutations("datepicker", ["FLIP_COMPARE_STATE", "SET_DIALOG_OPENED", "SET_PRIMARY_PRESET", "SET_CONFIG"]))
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__$6 = script$6;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-sheet",
    {
      staticClass: "pa-2 date-selector elevation-2 rounded",
      on: {
        click: function($event) {
          return _vm.SET_DIALOG_OPENED(true)
        }
      }
    },
    [
      _c(
        "v-row",
        { attrs: { "no-gutters": "" } },
        [
          _vm.isCalendarIconShown
            ? _c(
                "v-col",
                { staticClass: "mr-2", attrs: { cols: "1" } },
                [
                  _c(
                    "v-btn",
                    {
                      attrs: { small: "", icon: "", fab: "" },
                      nativeOn: {
                        click: function($event) {
                          $event.stopPropagation();
                          _vm.FLIP_COMPARE_STATE();
                          _vm.SET_CONFIG();
                        }
                      }
                    },
                    [
                      _c("v-icon", [
                        _vm._v(
                          _vm._s(
                            _vm.getConfig.compare
                              ? _vm.icon.mdiCalendarCheck
                              : _vm.icon.mdiCalendarRemove
                          )
                        )
                      ])
                    ],
                    1
                  )
                ],
                1
              )
            : _vm._e(),
          _vm._v(" "),
          _c("v-col", { staticClass: "ml-3" }, [
            _vm.getConfig.primaryPreset
              ? _c(
                  "div",
                  { class: ["title", { "mt-1": !_vm.getConfig.compare }] },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(
                          _vm.getPresetLabel(_vm.getConfig.primaryPreset)
                        ) +
                        "\n      "
                    )
                  ]
                )
              : _c(
                  "div",
                  { class: ["subtitle-1", { "mt-2": !_vm.getConfig.compare }] },
                  [
                    _vm._v(
                      "\n        " +
                        _vm._s(
                          _vm.getFormattedDate(
                            _vm.getConfig.dateStart,
                            _vm.getConfig.dateUntil
                          )
                        ) +
                        "\n      "
                    )
                  ]
                ),
            _vm._v(" "),
            _vm.getConfig.compare
              ? _c("div", { staticClass: "text--lighten-2 mt-n2 caption" }, [
                  _vm.getConfig.comparePreset
                    ? _c("div", [
                        _vm._v(
                          "vs " +
                            _vm._s(
                              _vm.getPresetLabelSmall(
                                _vm.getConfig.comparePreset
                              )
                            )
                        )
                      ])
                    : _c("div", [
                        _vm._v(
                          "vs " +
                            _vm._s(
                              _vm.getFormattedDate(
                                _vm.getConfig.compareStart,
                                _vm.getConfig.compareUntil
                              )
                            )
                        )
                      ])
                ])
              : _vm._e()
          ]),
          _vm._v(" "),
          _vm.isPresetsIconShown
            ? _c(
                "v-col",
                { staticClass: "mr-4", attrs: { cols: "1" } },
                [
                  _c(
                    "v-menu",
                    {
                      attrs: { "offset-y": "", left: "" },
                      scopedSlots: _vm._u(
                        [
                          {
                            key: "activator",
                            fn: function(ref) {
                              var on = ref.on;
                              var attrs = ref.attrs;
                              return [
                                _c(
                                  "v-btn",
                                  _vm._g(
                                    _vm._b(
                                      {
                                        attrs: {
                                          primary: "",
                                          small: "",
                                          icon: "",
                                          fab: ""
                                        }
                                      },
                                      "v-btn",
                                      attrs,
                                      false
                                    ),
                                    on
                                  ),
                                  [
                                    _c("v-icon", [
                                      _vm._v(_vm._s(_vm.icon.mdiChevronDown))
                                    ])
                                  ],
                                  1
                                )
                              ]
                            }
                          }
                        ],
                        null,
                        false,
                        3091094009
                      )
                    },
                    [
                      _vm._v(" "),
                      _c(
                        "v-list",
                        _vm._l(_vm.getPrimaryPresets, function(item, index) {
                          return _c(
                            "v-list-item",
                            {
                              key: index,
                              on: {
                                click: function($event) {
                                  _vm.SET_PRIMARY_PRESET(item);
                                  _vm.SET_CONFIG();
                                  _vm.$emit("change", _vm.getConfig);
                                }
                              }
                            },
                            [
                              _c("v-list-item-title", [
                                _vm._v(_vm._s(_vm.getPresetLabel(item)))
                              ])
                            ],
                            1
                          )
                        }),
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            : _vm._e()
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  var __vue_inject_styles__$6 = function (inject) {
    if (!inject) { return }
    inject("data-v-7671c606_0", { source: ".date-selector[data-v-7671c606] {\n  cursor: pointer;\n}\n.date-selector .theme--dark.v-sheet[data-v-7671c606],\n.date-selector .theme--light.v-sheet[data-v-7671c606] {\n  background-color: transparent;\n}\n\n/*# sourceMappingURL=DateSelector.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DatePicker/DateSelector.vue","DateSelector.vue"],"names":[],"mappings":"AA6FA;EACA,eAAA;AC5FA;AD8FA;;EAEA,6BAAA;AC5FA;;AAEA,2CAA2C","file":"DateSelector.vue","sourcesContent":["<template>\n  <v-sheet class=\"pa-2 date-selector elevation-2 rounded\" @click=\"SET_DIALOG_OPENED(true)\">\n    <v-row no-gutters>\n      <v-col v-if=\"isCalendarIconShown\" cols=\"1\" class=\"mr-2\">\n        <v-btn\n          small\n          icon\n          fab\n          @click.native.stop=\"\n            FLIP_COMPARE_STATE()\n            SET_CONFIG()\n          \"\n        >\n          <v-icon>{{ getConfig.compare ? icon.mdiCalendarCheck : icon.mdiCalendarRemove }}</v-icon>\n        </v-btn>\n      </v-col>\n\n      <v-col class=\"ml-3\">\n        <div v-if=\"getConfig.primaryPreset\" :class=\"['title', { 'mt-1': !getConfig.compare }]\">\n          {{ getPresetLabel(getConfig.primaryPreset) }}\n        </div>\n        <div v-else :class=\"['subtitle-1', { 'mt-2': !getConfig.compare }]\">\n          {{ getFormattedDate(getConfig.dateStart, getConfig.dateUntil) }}\n        </div>\n\n        <div v-if=\"getConfig.compare\" class=\"text--lighten-2 mt-n2 caption\">\n          <div v-if=\"getConfig.comparePreset\">vs {{ getPresetLabelSmall(getConfig.comparePreset) }}</div>\n          <div v-else>vs {{ getFormattedDate(getConfig.compareStart, getConfig.compareUntil) }}</div>\n        </div>\n      </v-col>\n\n      <v-col v-if=\"isPresetsIconShown\" cols=\"1\" class=\"mr-4\">\n        <v-menu offset-y left>\n          <template #activator=\"{ on, attrs }\">\n            <v-btn primary small icon fab v-bind=\"attrs\" v-on=\"on\">\n              <v-icon>{{ icon.mdiChevronDown }}</v-icon>\n            </v-btn>\n          </template>\n\n          <v-list>\n            <v-list-item\n              v-for=\"(item, index) in getPrimaryPresets\"\n              :key=\"index\"\n              @click=\"\n                SET_PRIMARY_PRESET(item)\n                SET_CONFIG()\n                $emit('change', getConfig)\n              \"\n            >\n              <v-list-item-title>{{ getPresetLabel(item) }}</v-list-item-title>\n            </v-list-item>\n          </v-list>\n        </v-menu>\n      </v-col>\n    </v-row>\n  </v-sheet>\n</template>\n\n<script>\nimport { mapGetters, mapMutations } from \"vuex\"\nimport { mdiCalendarCheck, mdiCalendarRemove, mdiChevronDown } from \"@mdi/js\"\n\nexport default {\n  name: \"DateSelector\",\n\n  data: () => ({\n    icon: {\n      mdiChevronDown,\n      mdiCalendarCheck,\n      mdiCalendarRemove,\n    },\n  }),\n\n  computed: {\n    // date format helper\n    ...mapGetters(\"datepicker\", [\n      \"getConfig\",\n      \"isPresetsIconShown\",\n      \"isCalendarIconShown\",\n      \"getFormattedDate\",\n      \"getPrimaryPresets\",\n      \"getPresetLabel\",\n      \"getPresetLabelSmall\",\n    ]),\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\"FLIP_COMPARE_STATE\", \"SET_DIALOG_OPENED\", \"SET_PRIMARY_PRESET\", \"SET_CONFIG\"]),\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-selector {\n  cursor: pointer;\n\n  .theme--dark.v-sheet,\n  .theme--light.v-sheet {\n    background-color: transparent;\n  }\n}\n</style>\n",".date-selector {\n  cursor: pointer;\n}\n.date-selector .theme--dark.v-sheet,\n.date-selector .theme--light.v-sheet {\n  background-color: transparent;\n}\n\n/*# sourceMappingURL=DateSelector.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$6 = "data-v-7671c606";
  /* module identifier */
  var __vue_module_identifier__$6 = undefined;
  /* functional template */
  var __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$6 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$5 = {
  components: {
    VBtn: VBtn
  },

  name: "PrimaryPresets",

  computed: Object.assign({}, mapGetters("datepicker", ["getPrimaryPreset"])),

  methods: Object.assign({}, mapMutations("datepicker", ["SET_PRIMARY_PRESET"]))
};

/* script */
var __vue_script__$5 = script$5;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_7_DAYS",
            color: _vm.getPrimaryPreset === "LAST_7_DAYS" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_7_DAYS")
            }
          }
        },
        [_vm._v("\n    Last 7 days\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_30_DAYS",
            color: _vm.getPrimaryPreset === "LAST_30_DAYS" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_30_DAYS")
            }
          }
        },
        [_vm._v("\n    Last 30 days\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_90_DAYS",
            color: _vm.getPrimaryPreset === "LAST_90_DAYS" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_90_DAYS")
            }
          }
        },
        [_vm._v("\n    Last 90 days\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_WEEK",
            color: _vm.getPrimaryPreset === "LAST_WEEK" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_WEEK")
            }
          }
        },
        [_vm._v("\n    Last week\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_MONTH",
            color: _vm.getPrimaryPreset === "LAST_MONTH" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_MONTH")
            }
          }
        },
        [_vm._v("\n    Last month\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_3_MONTHS",
            color: _vm.getPrimaryPreset === "LAST_3_MONTHS" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_3_MONTHS")
            }
          }
        },
        [_vm._v("\n    Last 3 months\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "LAST_YEAR",
            color: _vm.getPrimaryPreset === "LAST_YEAR" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("LAST_YEAR")
            }
          }
        },
        [_vm._v("\n    Last Year\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            text: _vm.getPrimaryPreset !== "THIS_YEAR",
            color: _vm.getPrimaryPreset === "THIS_YEAR" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_PRIMARY_PRESET("THIS_YEAR")
            }
          }
        },
        [_vm._v("\n    This Year\n  ")]
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  var __vue_inject_styles__$5 = undefined;
  /* scoped */
  var __vue_scope_id__$5 = undefined;
  /* module identifier */
  var __vue_module_identifier__$5 = undefined;
  /* functional template */
  var __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$5 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    false,
    undefined,
    undefined,
    undefined
  );

var script$4 = {
  components: {
    VBtn: VBtn
  },

  name: "ComparePresets",

  computed: Object.assign({}, mapGetters("datepicker", ["getCompareState", "getComparePreset"])),

  methods: Object.assign({}, mapMutations("datepicker", ["SET_COMPARE_PRESET"]))
};

/* script */
var __vue_script__$4 = script$4;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            disabled: !_vm.getCompareState,
            text: _vm.getComparePreset !== "PREVIOUS_PERIOD",
            color: _vm.getComparePreset === "PREVIOUS_PERIOD" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_COMPARE_PRESET("PREVIOUS_PERIOD")
            }
          }
        },
        [_vm._v("\n    Previous period\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            disabled: !_vm.getCompareState,
            text: _vm.getComparePreset !== "PREVIOUS_MONTH",
            color: _vm.getComparePreset === "PREVIOUS_MONTH" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_COMPARE_PRESET("PREVIOUS_MONTH")
            }
          }
        },
        [_vm._v("\n    Previous month\n  ")]
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: {
            "x-small": "",
            depressed: "",
            disabled: !_vm.getCompareState,
            text: _vm.getComparePreset !== "PREVIOUS_YEAR",
            color: _vm.getComparePreset === "PREVIOUS_YEAR" ? "primary" : null
          },
          on: {
            click: function($event) {
              return _vm.SET_COMPARE_PRESET("PREVIOUS_YEAR")
            }
          }
        },
        [_vm._v("\n    Previous year\n  ")]
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  var __vue_inject_styles__$4 = undefined;
  /* scoped */
  var __vue_scope_id__$4 = undefined;
  /* module identifier */
  var __vue_module_identifier__$4 = undefined;
  /* functional template */
  var __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$4 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    false,
    undefined,
    undefined,
    undefined
  );

var script$3 = {
  name: "DatePickerDesktop",

  components: {
    PresetsPrimary: __vue_component__$5,
    PresetsCompare: __vue_component__$4,
    VDatePicker: VDatePicker,
    VCol: VCol,
    VRow: VRow,
    VTextField: VTextField,
    VCheckbox: VCheckbox,
    VCardText: VCardText,
    VSpacer: VSpacer,
    VBtn: VBtn,
    VCardActions: VCardActions,
    VCard: VCard
  },

  computed: Object.assign({}, mapGetters("datepicker", [
      // config
      "getConfig",
      "getMaxDate",

      // compare checkbox
      "getCompareState",

      // individual dates
      "getDateStart",
      "getDateUntil",
      "getDateCompareStart",
      "getDateCompareUntil",

      // date picker arrays of date range
      "getPickerPrimary",
      "getPickerCompare",
      "getPickerDate",
      "getPickerPrimaryLeft",
      "getPickerPrimaryRight",

      // vuetify date range calendars setup
      "isPickerPrimaryActive" ])),

  methods: Object.assign({}, mapMutations("datepicker", [
      // controls compare checkbox
      "FLIP_COMPARE_STATE",

      // controls applied selections
      "SET_CONFIG",

      // controls dialog modal
      "SET_DIALOG_OPENED",

      // control selected date ranges
      "SET_DATE_START",
      "SET_DATE_UNTIL",
      "SET_COMPARE_START",
      "SET_COMPARE_UNTIL",

      // control vuetify calendar pickers
      "SET_PICKER_PRIMARY_ACTIVE",
      "SET_PICKER_DATE",
      "SET_PICKER_PRIMARY",
      "SET_PICKER_COMPARE",
      "SET_PICKER_DATE_LEFT" ]),

    {emitConfig: function emitConfig() {
      this.SET_CONFIG();
      this.$emit("change", this.getConfig);
    }}),
};

/* script */
var __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-card",
    { staticClass: "date-picker-desktop elevation-4 mx-auto" },
    [
      _c(
        "v-card-text",
        { staticClass: "pickers" },
        [
          _c(
            "v-row",
            [
              _c(
                "v-col",
                { attrs: { cols: "7" } },
                [
                  _c(
                    "v-row",
                    {
                      class: [
                        "picker-main",
                        _vm.isPickerPrimaryActive ? "active" : ""
                      ]
                    },
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-date-picker", {
                            staticClass: "picker-main-left pr-1",
                            attrs: {
                              range: "",
                              "no-title": "",
                              "first-day-of-week": "1",
                              max: _vm.getMaxDate,
                              value: _vm.getPickerPrimary,
                              "picker-date": _vm.getPickerPrimaryLeft,
                              color: "primary darken-2 picker-main-selected"
                            },
                            on: {
                              "click:date": function($event) {
                                return _vm.SET_PICKER_PRIMARY($event)
                              },
                              "update:picker-date": function($event) {
                                return _vm.SET_PICKER_DATE_LEFT($event)
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-date-picker", {
                            staticClass: "picker-main-right",
                            attrs: {
                              range: "",
                              "no-title": "",
                              "first-day-of-week": "1",
                              max: _vm.getMaxDate,
                              value: _vm.getPickerPrimary,
                              "picker-date": _vm.getPickerPrimaryRight,
                              color: "primary darken-2 picker-main-selected"
                            },
                            on: {
                              "click:date": function($event) {
                                return _vm.SET_PICKER_PRIMARY($event)
                              },
                              "update:picker-date": function($event) {
                                return _vm.SET_PICKER_DATE($event)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.getCompareState
                    ? _c(
                        "v-row",
                        {
                          staticClass: "picker-compare",
                          attrs: { justify: "center" }
                        },
                        [
                          _c(
                            "v-col",
                            { attrs: { cols: "6" } },
                            [
                              _c("v-date-picker", {
                                staticClass: "pr-1",
                                attrs: {
                                  range: "",
                                  "no-title": "",
                                  "show-current": "false",
                                  "first-day-of-week": "1",
                                  max: _vm.getMaxDate,
                                  value: _vm.getPickerCompare,
                                  "picker-date": _vm.getPickerPrimaryLeft,
                                  color:
                                    "orange darken-2 picker-compare-selected"
                                },
                                on: {
                                  "click:date": function($event) {
                                    return _vm.SET_PICKER_COMPARE($event)
                                  },
                                  "update:picker-date": function($event) {
                                    return _vm.SET_PICKER_DATE_LEFT($event)
                                  }
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-col",
                            { attrs: { cols: "6" } },
                            [
                              _c("v-date-picker", {
                                attrs: {
                                  range: "",
                                  "no-title": "",
                                  "show-current": "false",
                                  "first-day-of-week": "1",
                                  max: _vm.getMaxDate,
                                  value: _vm.getPickerCompare,
                                  "picker-date": _vm.getPickerPrimaryRight,
                                  color:
                                    "orange darken-2 picker-compare-selected"
                                },
                                on: {
                                  "click:date": function($event) {
                                    return _vm.SET_PICKER_COMPARE($event)
                                  },
                                  "update:picker-date": function($event) {
                                    return _vm.SET_PICKER_DATE($event)
                                  }
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      )
                    : _vm._e()
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-col",
                { attrs: { cols: "5" } },
                [
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "From",
                              type: "date",
                              dense: "",
                              outlined: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateStart
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_DATE_START($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(true)
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "To",
                              type: "date",
                              dense: "",
                              outlined: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateUntil
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_DATE_UNTIL($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(true)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2 pr-1" },
                    [_c("PresetsPrimary")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2 pt-6" },
                    [
                      _c("v-checkbox", {
                        staticClass: "compare-label",
                        attrs: {
                          "input-value": _vm.getCompareState,
                          label: "Compare to the following"
                        },
                        on: {
                          change: function($event) {
                            return _vm.FLIP_COMPARE_STATE()
                          }
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "From",
                              type: "date",
                              outlined: "",
                              dense: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateCompareStart,
                              disabled: !_vm.getCompareState
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_COMPARE_START($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(false)
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "To",
                              type: "date",
                              outlined: "",
                              dense: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateCompareUntil,
                              disabled: !_vm.getCompareState
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_COMPARE_UNTIL($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(false)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2" },
                    [_c("PresetsCompare")],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-card-actions",
        { staticClass: "mt-2" },
        [
          _c("v-spacer"),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              staticClass: "px-4 mr-6",
              attrs: { outlined: "" },
              on: {
                click: function($event) {
                  return _vm.SET_DIALOG_OPENED(false)
                }
              }
            },
            [_vm._v("Cancel")]
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              staticClass: "primary px-7",
              on: {
                click: function($event) {
                  return _vm.emitConfig()
                }
              }
            },
            [_vm._v("Apply")]
          )
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  var __vue_inject_styles__$3 = function (inject) {
    if (!inject) { return }
    inject("data-v-611725d0_0", { source: ".date-picker-desktop[data-v-611725d0] {\n  max-width: 1040px;\n  margin-top: 15vh;\n}\n.date-picker-desktop[data-v-611725d0] .pickers {\n  max-height: 23em;\n}\n.date-picker-desktop[data-v-611725d0] .pickers .v-text-field__details {\n  display: none;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main {\n  position: relative;\n  z-index: 1;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main .picker-label {\n  opacity: 0;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main .v-picker {\n  background-color: transparent;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main.active {\n  z-index: 1000;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main .v-picker__body {\n  background-color: transparent;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main .v-date-picker-table button:not(.picker-main-selected) {\n  background-color: transparent;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main .v-date-picker-table button:focus {\n  background-color: #1976d2;\n  color: #ffffff;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main:not(.active) .picker-main-selected {\n  color: #ffffff;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare {\n  transform: translateY(-100%);\n  position: relative;\n  z-index: 2;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare.active {\n  z-index: 1015;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-date-picker-header {\n  opacity: 0;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-date-picker-table thead {\n  opacity: 0;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-date-picker-table button:not(.picker-compare-selected) {\n  color: transparent;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-date-picker-table button:focus {\n  background-color: #f57c00;\n  color: #ffffff;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-picker {\n  background-color: transparent !important;\n}\n.date-picker-desktop[data-v-611725d0] .picker-compare .v-picker .v-picker__body {\n  background-color: transparent !important;\n}\n.date-picker-desktop[data-v-611725d0] .compare-label .v-messages {\n  display: none;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main-left .v-date-picker-header > button:nth-of-type(2) {\n  display: none;\n}\n.date-picker-desktop[data-v-611725d0] .picker-main-right .v-date-picker-header > button:nth-of-type(1) {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerDesktop.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DatePicker/DatePickerDesktop.vue","DatePickerDesktop.vue"],"names":[],"mappings":"AA6OA;EACA,iBAAA;EACA,gBAAA;AC5OA;AD8OA;EACA,gBAAA;AC5OA;AD8OA;EACA,aAAA;AC5OA;ADgPA;EACA,kBAAA;EACA,UAAA;AC9OA;ADgPA;EACA,UAAA;AC9OA;ADiPA;EACA,6BAAA;AC/OA;ADkPA;EACA,aAAA;AChPA;ADoPA;EACA,6BAAA;AClPA;ADsPA;EACA,6BAAA;ACpPA;ADsPA;EACA,yBAAA;EACA,cAAA;ACpPA;ADyPA;EACA,cAAA;ACvPA;AD+PA;EACA,4BAAA;EAEA,kBAAA;EACA,UAAA;AC9PA;AD+PA;EACA,aAAA;AC7PA;ADiQA;EACA,UAAA;AC/PA;ADmQA;EACA,UAAA;ACjQA;ADoQA;EACA,kBAAA;AClQA;ADoQA;EACA,yBAAA;EACA,cAAA;AClQA;ADsQA;EACA,wCAAA;ACpQA;ADqQA;EACA,wCAAA;ACnQA;ADyQA;EACA,aAAA;ACvQA;AD4QA;EACA,aAAA;AC1QA;AD6QA;EACA,aAAA;AC3QA;;AAEA,gDAAgD","file":"DatePickerDesktop.vue","sourcesContent":["<template>\n  <v-card class=\"date-picker-desktop elevation-4 mx-auto\">\n    <v-card-text class=\"pickers\">\n      <v-row>\n        <v-col cols=\"7\">\n          <v-row :class=\"['picker-main', isPickerPrimaryActive ? 'active' : '']\">\n            <v-col cols=\"6\">\n              <!-- left calendar -->\n              <v-date-picker\n                range\n                no-title\n                first-day-of-week=\"1\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerPrimary\"\n                :picker-date=\"getPickerPrimaryLeft\"\n                class=\"picker-main-left pr-1\"\n                color=\"primary darken-2 picker-main-selected\"\n                @click:date=\"SET_PICKER_PRIMARY($event)\"\n                @update:picker-date=\"SET_PICKER_DATE_LEFT($event)\"\n              />\n            </v-col>\n            <v-col cols=\"6\">\n              <!-- right calendar -->\n              <v-date-picker\n                range\n                no-title\n                first-day-of-week=\"1\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerPrimary\"\n                :picker-date=\"getPickerPrimaryRight\"\n                class=\"picker-main-right\"\n                color=\"primary darken-2 picker-main-selected\"\n                @click:date=\"SET_PICKER_PRIMARY($event)\"\n                @update:picker-date=\"SET_PICKER_DATE($event)\"\n              />\n            </v-col>\n          </v-row>\n\n          <v-row v-if=\"getCompareState\" justify=\"center\" class=\"picker-compare\">\n            <v-col cols=\"6\">\n              <v-date-picker\n                range\n                no-title\n                show-current=\"false\"\n                first-day-of-week=\"1\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerCompare\"\n                :picker-date=\"getPickerPrimaryLeft\"\n                class=\"pr-1\"\n                color=\"orange darken-2 picker-compare-selected\"\n                @click:date=\"SET_PICKER_COMPARE($event)\"\n                @update:picker-date=\"SET_PICKER_DATE_LEFT($event)\"\n              />\n            </v-col>\n            <v-col cols=\"6\">\n              <v-date-picker\n                range\n                no-title\n                show-current=\"false\"\n                first-day-of-week=\"1\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerCompare\"\n                :picker-date=\"getPickerPrimaryRight\"\n                color=\"orange darken-2 picker-compare-selected\"\n                @click:date=\"SET_PICKER_COMPARE($event)\"\n                @update:picker-date=\"SET_PICKER_DATE($event)\"\n              />\n            </v-col>\n          </v-row>\n        </v-col>\n\n        <v-col cols=\"5\">\n          <v-row>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"From\"\n                type=\"date\"\n                dense\n                outlined\n                :max=\"getMaxDate\"\n                :value=\"getDateStart\"\n                class=\"picker-input\"\n                @input=\"SET_DATE_START($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n              />\n            </v-col>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"To\"\n                type=\"date\"\n                dense\n                outlined\n                :max=\"getMaxDate\"\n                :value=\"getDateUntil\"\n                class=\"picker-input\"\n                @input=\"SET_DATE_UNTIL($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n              />\n            </v-col>\n          </v-row>\n\n          <!-- presets for main period -->\n          <v-row class=\"pl-2 pr-1\">\n            <PresetsPrimary />\n          </v-row>\n\n          <v-row class=\"pl-2 pt-6\">\n            <v-checkbox\n              :input-value=\"getCompareState\"\n              label=\"Compare to the following\"\n              class=\"compare-label\"\n              @change=\"FLIP_COMPARE_STATE()\"\n            />\n          </v-row>\n\n          <v-row>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"From\"\n                type=\"date\"\n                outlined\n                dense\n                :max=\"getMaxDate\"\n                :value=\"getDateCompareStart\"\n                :disabled=\"!getCompareState\"\n                class=\"picker-input\"\n                @input=\"SET_COMPARE_START($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n              />\n            </v-col>\n\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"To\"\n                type=\"date\"\n                outlined\n                dense\n                :max=\"getMaxDate\"\n                :value=\"getDateCompareUntil\"\n                :disabled=\"!getCompareState\"\n                class=\"picker-input\"\n                @input=\"SET_COMPARE_UNTIL($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n              />\n            </v-col>\n          </v-row>\n\n          <!-- presets for compare period -->\n          <v-row class=\"pl-2\">\n            <PresetsCompare />\n          </v-row>\n        </v-col>\n      </v-row>\n    </v-card-text>\n\n    <v-card-actions class=\"mt-2\">\n      <v-spacer />\n      <v-btn outlined class=\"px-4 mr-6\" @click=\"SET_DIALOG_OPENED(false)\">Cancel</v-btn>\n      <v-btn class=\"primary px-7\" @click=\"emitConfig()\">Apply</v-btn>\n    </v-card-actions>\n  </v-card>\n</template>\n\n<script>\nimport { mapGetters, mapMutations } from \"vuex\"\nimport PresetsPrimary from \"./PresetsPrimary.vue\"\nimport PresetsCompare from \"./PresetsCompare.vue\"\n\nexport default {\n  name: \"DatePickerDesktop\",\n\n  components: {\n    PresetsPrimary,\n    PresetsCompare,\n  },\n\n  computed: {\n    ...mapGetters(\"datepicker\", [\n      // config\n      \"getConfig\",\n      \"getMaxDate\",\n\n      // compare checkbox\n      \"getCompareState\",\n\n      // individual dates\n      \"getDateStart\",\n      \"getDateUntil\",\n      \"getDateCompareStart\",\n      \"getDateCompareUntil\",\n\n      // date picker arrays of date range\n      \"getPickerPrimary\",\n      \"getPickerCompare\",\n      \"getPickerDate\",\n      \"getPickerPrimaryLeft\",\n      \"getPickerPrimaryRight\",\n\n      // vuetify date range calendars setup\n      \"isPickerPrimaryActive\",\n    ]),\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\n      // controls compare checkbox\n      \"FLIP_COMPARE_STATE\",\n\n      // controls applied selections\n      \"SET_CONFIG\",\n\n      // controls dialog modal\n      \"SET_DIALOG_OPENED\",\n\n      // control selected date ranges\n      \"SET_DATE_START\",\n      \"SET_DATE_UNTIL\",\n      \"SET_COMPARE_START\",\n      \"SET_COMPARE_UNTIL\",\n\n      // control vuetify calendar pickers\n      \"SET_PICKER_PRIMARY_ACTIVE\",\n      \"SET_PICKER_DATE\",\n      \"SET_PICKER_PRIMARY\",\n      \"SET_PICKER_COMPARE\",\n      \"SET_PICKER_DATE_LEFT\",\n    ]),\n\n    emitConfig() {\n      this.SET_CONFIG()\n      this.$emit(\"change\", this.getConfig)\n    },\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-picker-desktop::v-deep {\n  max-width: 1040px;\n  margin-top: 15vh;\n\n  .pickers {\n    max-height: 23em;\n\n    .v-text-field__details {\n      display: none;\n    }\n  }\n\n  .picker-main {\n    position: relative;\n    z-index: 1;\n\n    .picker-label {\n      opacity: 0;\n    }\n\n    .v-picker {\n      background-color: transparent;\n    }\n\n    &.active {\n      z-index: 1000;\n    }\n\n    // Body should be rendered but not visible\n    .v-picker__body {\n      background-color: transparent;\n    }\n\n    .v-date-picker-table {\n      button:not(.picker-main-selected) {\n        background-color: transparent;\n      }\n      button:focus {\n        background-color: #1976d2;\n        color: #ffffff;\n      }\n    }\n\n    &:not(.active) {\n      .picker-main-selected {\n        color: #ffffff;\n      }\n    }\n  }\n\n  // The secondary date picker should be translated\n  // over the primary and many of its elements should\n  // become invisible.\n  .picker-compare {\n    transform: translateY(-100%);\n\n    position: relative;\n    z-index: 2;\n    &.active {\n      z-index: 1015;\n    }\n\n    // Header should be rendered but not visible\n    .v-date-picker-header {\n      opacity: 0;\n    }\n\n    .v-date-picker-table {\n      thead {\n        opacity: 0;\n      }\n\n      button:not(.picker-compare-selected) {\n        color: transparent;\n      }\n      button:focus {\n        background-color: #f57c00;\n        color: #ffffff;\n      }\n    }\n\n    .v-picker {\n      background-color: transparent !important;\n      .v-picker__body {\n        background-color: transparent !important;\n      }\n    }\n  }\n\n  .compare-label {\n    .v-messages {\n      display: none;\n    }\n  }\n\n  //right and left arrows should be rendered but not visible\n  .picker-main-left .v-date-picker-header > button:nth-of-type(2) {\n    display: none;\n  }\n\n  .picker-main-right .v-date-picker-header > button:nth-of-type(1) {\n    display: none;\n  }\n}\n</style>\n",".date-picker-desktop::v-deep {\n  max-width: 1040px;\n  margin-top: 15vh;\n}\n.date-picker-desktop::v-deep .pickers {\n  max-height: 23em;\n}\n.date-picker-desktop::v-deep .pickers .v-text-field__details {\n  display: none;\n}\n.date-picker-desktop::v-deep .picker-main {\n  position: relative;\n  z-index: 1;\n}\n.date-picker-desktop::v-deep .picker-main .picker-label {\n  opacity: 0;\n}\n.date-picker-desktop::v-deep .picker-main .v-picker {\n  background-color: transparent;\n}\n.date-picker-desktop::v-deep .picker-main.active {\n  z-index: 1000;\n}\n.date-picker-desktop::v-deep .picker-main .v-picker__body {\n  background-color: transparent;\n}\n.date-picker-desktop::v-deep .picker-main .v-date-picker-table button:not(.picker-main-selected) {\n  background-color: transparent;\n}\n.date-picker-desktop::v-deep .picker-main .v-date-picker-table button:focus {\n  background-color: #1976d2;\n  color: #ffffff;\n}\n.date-picker-desktop::v-deep .picker-main:not(.active) .picker-main-selected {\n  color: #ffffff;\n}\n.date-picker-desktop::v-deep .picker-compare {\n  transform: translateY(-100%);\n  position: relative;\n  z-index: 2;\n}\n.date-picker-desktop::v-deep .picker-compare.active {\n  z-index: 1015;\n}\n.date-picker-desktop::v-deep .picker-compare .v-date-picker-header {\n  opacity: 0;\n}\n.date-picker-desktop::v-deep .picker-compare .v-date-picker-table thead {\n  opacity: 0;\n}\n.date-picker-desktop::v-deep .picker-compare .v-date-picker-table button:not(.picker-compare-selected) {\n  color: transparent;\n}\n.date-picker-desktop::v-deep .picker-compare .v-date-picker-table button:focus {\n  background-color: #f57c00;\n  color: #ffffff;\n}\n.date-picker-desktop::v-deep .picker-compare .v-picker {\n  background-color: transparent !important;\n}\n.date-picker-desktop::v-deep .picker-compare .v-picker .v-picker__body {\n  background-color: transparent !important;\n}\n.date-picker-desktop::v-deep .compare-label .v-messages {\n  display: none;\n}\n.date-picker-desktop::v-deep .picker-main-left .v-date-picker-header > button:nth-of-type(2) {\n  display: none;\n}\n.date-picker-desktop::v-deep .picker-main-right .v-date-picker-header > button:nth-of-type(1) {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerDesktop.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$3 = "data-v-611725d0";
  /* module identifier */
  var __vue_module_identifier__$3 = undefined;
  /* functional template */
  var __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$3 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$2 = {
  name: "DatePickerTablet",

  components: {
    PresetsPrimary: __vue_component__$5,
    PresetsCompare: __vue_component__$4,
    VDatePicker: VDatePicker,
    VCol: VCol,
    VRow: VRow,
    VTextField: VTextField,
    VCheckbox: VCheckbox,
    VCardText: VCardText,
    VSpacer: VSpacer,
    VBtn: VBtn,
    VCardActions: VCardActions,
    VCard: VCard
  },

  computed: Object.assign({}, mapGetters("datepicker", [
      // config
      "getConfig",
      "getMaxDate",

      // compare checkbox
      "getCompareState",

      // individual dates
      "getDateStart",
      "getDateUntil",
      "getDateCompareStart",
      "getDateCompareUntil",

      // date picker arrays of date range
      "getPickerPrimary",
      "getPickerCompare",

      // vuetify date range calendars setup
      "isPickerPrimaryActive",
      "getPickerDate" ])),

  methods: Object.assign({}, mapMutations("datepicker", [
      // controls compare checkbox
      "FLIP_COMPARE_STATE",

      // controls applied selections
      "SET_CONFIG",

      // controls dialog modal
      "SET_DIALOG_OPENED",

      // control selected date ranges
      "SET_DATE_START",
      "SET_DATE_UNTIL",
      "SET_COMPARE_START",
      "SET_COMPARE_UNTIL",
      "SET_PICKER_PRIMARY",
      "SET_PICKER_COMPARE",

      // control vuetify calendar pickers
      "SET_PICKER_PRIMARY_ACTIVE",
      "SET_PICKER_DATE" ]),

    {emitConfig: function emitConfig() {
      this.SET_CONFIG();
      this.$emit("change", this.getConfig);
    }}),
};

/* script */
var __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-card",
    { staticClass: "date-picker-tablet elevation-4 mx-auto" },
    [
      _c(
        "v-card-text",
        { staticClass: "pickers" },
        [
          _c(
            "v-row",
            [
              _c(
                "v-col",
                { attrs: { cols: "5" } },
                [
                  _c(
                    "v-row",
                    {
                      class: [
                        "picker-main",
                        _vm.isPickerPrimaryActive ? "active" : ""
                      ],
                      attrs: { justify: "center" }
                    },
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "12" } },
                        [
                          _c("v-date-picker", {
                            staticClass: "picker-compare-left pr-1",
                            attrs: {
                              range: "",
                              "no-title": "",
                              "first-day-of-week": "1",
                              max: _vm.getMaxDate,
                              value: _vm.getPickerPrimary,
                              "picker-date": _vm.getPickerDate,
                              color: "primary darken-2 picker-main-selected"
                            },
                            on: {
                              "click:date": function($event) {
                                return _vm.SET_PICKER_PRIMARY($event)
                              },
                              "update:picker-date": function($event) {
                                return _vm.SET_PICKER_DATE($event)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _vm.getCompareState
                    ? _c(
                        "v-row",
                        {
                          staticClass: "picker-compare",
                          attrs: { justify: "center" }
                        },
                        [
                          _c(
                            "v-col",
                            { attrs: { cols: "12" } },
                            [
                              _c("v-date-picker", {
                                staticClass: "picker-main-right",
                                attrs: {
                                  range: "",
                                  "no-title": "",
                                  "first-day-of-week": "1",
                                  color:
                                    "orange darken-2 picker-compare-selected",
                                  max: _vm.getMaxDate,
                                  value: _vm.getPickerCompare,
                                  "picker-date": _vm.getPickerDate
                                },
                                on: {
                                  "click:date": function($event) {
                                    return _vm.SET_PICKER_COMPARE($event)
                                  },
                                  "update:picker-date": function($event) {
                                    return _vm.SET_PICKER_DATE($event)
                                  }
                                }
                              })
                            ],
                            1
                          )
                        ],
                        1
                      )
                    : _vm._e()
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-col",
                { attrs: { cols: "7" } },
                [
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "From",
                              type: "date",
                              dense: "",
                              outlined: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateStart
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_DATE_START($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(true)
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "To",
                              type: "date",
                              dense: "",
                              outlined: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateUntil
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_DATE_UNTIL($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(true)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2 pr-1" },
                    [_c("PresetsPrimary")],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2 pt-6" },
                    [
                      _c("v-checkbox", {
                        staticClass: "compare-label",
                        attrs: {
                          "input-value": _vm.getCompareState,
                          label: "Compare to the following"
                        },
                        on: {
                          change: function($event) {
                            return _vm.FLIP_COMPARE_STATE()
                          }
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "From",
                              type: "date",
                              outlined: "",
                              dense: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateCompareStart,
                              disabled: !_vm.getCompareState
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_COMPARE_START($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(false)
                              }
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "v-col",
                        { attrs: { cols: "6" } },
                        [
                          _c("v-text-field", {
                            staticClass: "picker-input",
                            attrs: {
                              label: "To",
                              type: "date",
                              outlined: "",
                              dense: "",
                              max: _vm.getMaxDate,
                              value: _vm.getDateCompareUntil,
                              disabled: !_vm.getCompareState
                            },
                            on: {
                              input: function($event) {
                                return _vm.SET_COMPARE_UNTIL($event)
                              },
                              click: function($event) {
                                return _vm.SET_PICKER_PRIMARY_ACTIVE(false)
                              }
                            }
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "v-row",
                    { staticClass: "pl-2" },
                    [_c("PresetsCompare")],
                    1
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "v-card-actions",
        { staticClass: "mt-2" },
        [
          _c("v-spacer"),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              staticClass: "px-4 mr-6",
              attrs: { outlined: "" },
              on: {
                click: function($event) {
                  return _vm.SET_DIALOG_OPENED(false)
                }
              }
            },
            [_vm._v("Cancel")]
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              staticClass: "primary px-7",
              on: {
                click: function($event) {
                  return _vm.emitConfig()
                }
              }
            },
            [_vm._v("Apply")]
          )
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  var __vue_inject_styles__$2 = function (inject) {
    if (!inject) { return }
    inject("data-v-21e9ff66_0", { source: ".date-picker-tablet[data-v-21e9ff66] {\n  max-width: 785px;\n  margin-top: 15vh;\n}\n.date-picker-tablet[data-v-21e9ff66] .pickers {\n  max-height: 23em;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-input .v-text-field__details {\n  display: none;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main {\n  position: relative;\n  z-index: 1;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main .picker-label {\n  opacity: 0;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main .v-picker {\n  background-color: transparent;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main.active {\n  z-index: 1000;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main .v-picker__body {\n  background-color: transparent;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main .v-date-picker-table button:not(.picker-main-selected) {\n  background-color: transparent;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main .v-date-picker-table button:focus {\n  background-color: #1976d2;\n  color: #ffffff;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-main:not(.active) .picker-main-selected {\n  color: #ffffff;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare {\n  transform: translateY(-100%);\n  position: relative;\n  z-index: 2;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare.active {\n  z-index: 1015;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-date-picker-header {\n  opacity: 0;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-date-picker-table thead {\n  opacity: 0;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-date-picker-table button:not(.picker-compare-selected) {\n  color: transparent;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-date-picker-table button:focus {\n  background-color: #f57c00;\n  color: #ffffff;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-picker {\n  background-color: transparent !important;\n}\n.date-picker-tablet[data-v-21e9ff66] .picker-compare .v-picker .v-picker__body {\n  background-color: transparent !important;\n}\n.date-picker-tablet[data-v-21e9ff66] .compare-label .v-messages {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerTablet.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DatePicker/DatePickerTablet.vue","DatePickerTablet.vue"],"names":[],"mappings":"AAyMA;EACA,gBAAA;EACA,gBAAA;ACxMA;AD0MA;EACA,gBAAA;ACxMA;AD4MA;EACA,aAAA;AC1MA;AD8MA;EACA,kBAAA;EACA,UAAA;AC5MA;AD6MA;EACA,UAAA;AC3MA;AD6MA;EACA,6BAAA;AC3MA;AD8MA;EACA,aAAA;AC5MA;ADgNA;EACA,6BAAA;AC9MA;ADkNA;EACA,6BAAA;AChNA;ADkNA;EACA,yBAAA;EACA,cAAA;AChNA;ADqNA;EACA,cAAA;ACnNA;AD2NA;EACA,4BAAA;EAEA,kBAAA;EACA,UAAA;AC1NA;AD2NA;EACA,aAAA;ACzNA;AD4NA;EACA,UAAA;AC1NA;AD8NA;EACA,UAAA;AC5NA;AD+NA;EACA,kBAAA;AC7NA;AD+NA;EACA,yBAAA;EACA,cAAA;AC7NA;ADiOA;EACA,wCAAA;AC/NA;ADgOA;EACA,wCAAA;AC9NA;ADoOA;EACA,aAAA;AClOA;;AAEA,+CAA+C","file":"DatePickerTablet.vue","sourcesContent":["<template>\n  <v-card class=\"date-picker-tablet elevation-4 mx-auto\">\n    <v-card-text class=\"pickers\">\n      <v-row>\n        <v-col cols=\"5\">\n          <v-row justify=\"center\" :class=\"['picker-main', isPickerPrimaryActive ? 'active' : '']\">\n            <v-col cols=\"12\">\n              <v-date-picker\n                range\n                no-title\n                first-day-of-week=\"1\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerPrimary\"\n                :picker-date=\"getPickerDate\"\n                class=\"picker-compare-left pr-1\"\n                color=\"primary darken-2 picker-main-selected\"\n                @click:date=\"SET_PICKER_PRIMARY($event)\"\n                @update:picker-date=\"SET_PICKER_DATE($event)\"\n              />\n            </v-col>\n          </v-row>\n          <v-row v-if=\"getCompareState\" justify=\"center\" class=\"picker-compare\">\n            <v-col cols=\"12\">\n              <v-date-picker\n                range\n                no-title\n                first-day-of-week=\"1\"\n                class=\"picker-main-right\"\n                color=\"orange darken-2 picker-compare-selected\"\n                :max=\"getMaxDate\"\n                :value=\"getPickerCompare\"\n                :picker-date=\"getPickerDate\"\n                @click:date=\"SET_PICKER_COMPARE($event)\"\n                @update:picker-date=\"SET_PICKER_DATE($event)\"\n              />\n            </v-col>\n          </v-row>\n        </v-col>\n\n        <v-col cols=\"7\">\n          <v-row>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"From\"\n                type=\"date\"\n                dense\n                outlined\n                :max=\"getMaxDate\"\n                :value=\"getDateStart\"\n                class=\"picker-input\"\n                @input=\"SET_DATE_START($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n              />\n            </v-col>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"To\"\n                type=\"date\"\n                dense\n                outlined\n                :max=\"getMaxDate\"\n                :value=\"getDateUntil\"\n                class=\"picker-input\"\n                @input=\"SET_DATE_UNTIL($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n              />\n            </v-col>\n          </v-row>\n\n          <!-- presets for main period -->\n          <v-row class=\"pl-2 pr-1\">\n            <PresetsPrimary />\n          </v-row>\n\n          <v-row class=\"pl-2 pt-6\">\n            <v-checkbox\n              :input-value=\"getCompareState\"\n              label=\"Compare to the following\"\n              class=\"compare-label\"\n              @change=\"FLIP_COMPARE_STATE()\"\n            />\n          </v-row>\n\n          <v-row>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"From\"\n                type=\"date\"\n                outlined\n                dense\n                :max=\"getMaxDate\"\n                :value=\"getDateCompareStart\"\n                :disabled=\"!getCompareState\"\n                class=\"picker-input\"\n                @input=\"SET_COMPARE_START($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n              />\n            </v-col>\n            <v-col cols=\"6\">\n              <v-text-field\n                label=\"To\"\n                type=\"date\"\n                outlined\n                dense\n                :max=\"getMaxDate\"\n                :value=\"getDateCompareUntil\"\n                :disabled=\"!getCompareState\"\n                class=\"picker-input\"\n                @input=\"SET_COMPARE_UNTIL($event)\"\n                @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n              />\n            </v-col>\n          </v-row>\n\n          <!-- presets for compare period -->\n          <v-row class=\"pl-2\">\n            <PresetsCompare />\n          </v-row>\n        </v-col>\n      </v-row>\n    </v-card-text>\n\n    <v-card-actions class=\"mt-2\">\n      <v-spacer />\n      <v-btn outlined class=\"px-4 mr-6\" @click=\"SET_DIALOG_OPENED(false)\">Cancel</v-btn>\n      <v-btn class=\"primary px-7\" @click=\"emitConfig()\">Apply</v-btn>\n    </v-card-actions>\n  </v-card>\n</template>\n\n<script>\nimport PresetsPrimary from \"./PresetsPrimary.vue\"\nimport PresetsCompare from \"./PresetsCompare.vue\"\nimport { mapGetters, mapMutations } from \"vuex\"\n\nexport default {\n  name: \"DatePickerTablet\",\n\n  components: {\n    PresetsPrimary,\n    PresetsCompare,\n  },\n\n  computed: {\n    ...mapGetters(\"datepicker\", [\n      // config\n      \"getConfig\",\n      \"getMaxDate\",\n\n      // compare checkbox\n      \"getCompareState\",\n\n      // individual dates\n      \"getDateStart\",\n      \"getDateUntil\",\n      \"getDateCompareStart\",\n      \"getDateCompareUntil\",\n\n      // date picker arrays of date range\n      \"getPickerPrimary\",\n      \"getPickerCompare\",\n\n      // vuetify date range calendars setup\n      \"isPickerPrimaryActive\",\n      \"getPickerDate\",\n    ]),\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\n      // controls compare checkbox\n      \"FLIP_COMPARE_STATE\",\n\n      // controls applied selections\n      \"SET_CONFIG\",\n\n      // controls dialog modal\n      \"SET_DIALOG_OPENED\",\n\n      // control selected date ranges\n      \"SET_DATE_START\",\n      \"SET_DATE_UNTIL\",\n      \"SET_COMPARE_START\",\n      \"SET_COMPARE_UNTIL\",\n      \"SET_PICKER_PRIMARY\",\n      \"SET_PICKER_COMPARE\",\n\n      // control vuetify calendar pickers\n      \"SET_PICKER_PRIMARY_ACTIVE\",\n      \"SET_PICKER_DATE\",\n    ]),\n\n    emitConfig() {\n      this.SET_CONFIG()\n      this.$emit(\"change\", this.getConfig)\n    },\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-picker-tablet::v-deep {\n  max-width: 785px;\n  margin-top: 15vh;\n\n  .pickers {\n    max-height: 23em;\n  }\n\n  .picker-input {\n    .v-text-field__details {\n      display: none;\n    }\n  }\n\n  .picker-main {\n    position: relative;\n    z-index: 1;\n    .picker-label {\n      opacity: 0;\n    }\n    .v-picker {\n      background-color: transparent;\n    }\n\n    &.active {\n      z-index: 1000;\n    }\n\n    // Body should be rendered but not visible\n    .v-picker__body {\n      background-color: transparent;\n    }\n\n    .v-date-picker-table {\n      button:not(.picker-main-selected) {\n        background-color: transparent;\n      }\n      button:focus {\n        background-color: #1976d2;\n        color: #ffffff;\n      }\n    }\n\n    &:not(.active) {\n      .picker-main-selected {\n        color: #ffffff;\n      }\n    }\n  }\n\n  // The secondary date picker should be translated\n  // over the primary and many of its elements should\n  // become invisible.\n  .picker-compare {\n    transform: translateY(-100%);\n\n    position: relative;\n    z-index: 2;\n    &.active {\n      z-index: 1015;\n    }\n    // Header should be rendered but not visible\n    .v-date-picker-header {\n      opacity: 0;\n    }\n\n    .v-date-picker-table {\n      thead {\n        opacity: 0;\n      }\n\n      button:not(.picker-compare-selected) {\n        color: transparent;\n      }\n      button:focus {\n        background-color: #f57c00;\n        color: #ffffff;\n      }\n    }\n\n    .v-picker {\n      background-color: transparent !important;\n      .v-picker__body {\n        background-color: transparent !important;\n      }\n    }\n  }\n\n  .compare-label {\n    .v-messages {\n      display: none;\n    }\n  }\n}\n</style>\n",".date-picker-tablet::v-deep {\n  max-width: 785px;\n  margin-top: 15vh;\n}\n.date-picker-tablet::v-deep .pickers {\n  max-height: 23em;\n}\n.date-picker-tablet::v-deep .picker-input .v-text-field__details {\n  display: none;\n}\n.date-picker-tablet::v-deep .picker-main {\n  position: relative;\n  z-index: 1;\n}\n.date-picker-tablet::v-deep .picker-main .picker-label {\n  opacity: 0;\n}\n.date-picker-tablet::v-deep .picker-main .v-picker {\n  background-color: transparent;\n}\n.date-picker-tablet::v-deep .picker-main.active {\n  z-index: 1000;\n}\n.date-picker-tablet::v-deep .picker-main .v-picker__body {\n  background-color: transparent;\n}\n.date-picker-tablet::v-deep .picker-main .v-date-picker-table button:not(.picker-main-selected) {\n  background-color: transparent;\n}\n.date-picker-tablet::v-deep .picker-main .v-date-picker-table button:focus {\n  background-color: #1976d2;\n  color: #ffffff;\n}\n.date-picker-tablet::v-deep .picker-main:not(.active) .picker-main-selected {\n  color: #ffffff;\n}\n.date-picker-tablet::v-deep .picker-compare {\n  transform: translateY(-100%);\n  position: relative;\n  z-index: 2;\n}\n.date-picker-tablet::v-deep .picker-compare.active {\n  z-index: 1015;\n}\n.date-picker-tablet::v-deep .picker-compare .v-date-picker-header {\n  opacity: 0;\n}\n.date-picker-tablet::v-deep .picker-compare .v-date-picker-table thead {\n  opacity: 0;\n}\n.date-picker-tablet::v-deep .picker-compare .v-date-picker-table button:not(.picker-compare-selected) {\n  color: transparent;\n}\n.date-picker-tablet::v-deep .picker-compare .v-date-picker-table button:focus {\n  background-color: #f57c00;\n  color: #ffffff;\n}\n.date-picker-tablet::v-deep .picker-compare .v-picker {\n  background-color: transparent !important;\n}\n.date-picker-tablet::v-deep .picker-compare .v-picker .v-picker__body {\n  background-color: transparent !important;\n}\n.date-picker-tablet::v-deep .compare-label .v-messages {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerTablet.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$2 = "data-v-21e9ff66";
  /* module identifier */
  var __vue_module_identifier__$2 = undefined;
  /* functional template */
  var __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$2 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    false,
    createInjector,
    undefined,
    undefined
  );

var script$1 = {
  name: "DatePickerMobile",

  components: {
    PresetsPrimary: __vue_component__$5,
    PresetsCompare: __vue_component__$4,
    VTextField: VTextField,
    VCol: VCol,
    VRow: VRow,
    VCheckbox: VCheckbox,
    VCardText: VCardText,
    VSpacer: VSpacer,
    VBtn: VBtn,
    VCardActions: VCardActions,
    VContainer: VContainer,
    VCard: VCard,
    VDialog: VDialog
  },

  computed: Object.assign({}, mapGetters("datepicker", [
      // config
      "getConfig",
      "getMaxDate",

      // compare checkbox
      "getCompareState",

      // individual dates
      "getDateStart",
      "getDateUntil",
      "getDateCompareStart",
      "getDateCompareUntil" ])),

  methods: Object.assign({}, mapMutations("datepicker", [
      // controls compare checkbox
      "FLIP_COMPARE_STATE",

      // controls applied selections
      "SET_CONFIG",

      // controls dialog modal
      "SET_DIALOG_OPENED",

      // control selected date ranges
      "SET_DATE_START",
      "SET_DATE_UNTIL",
      "SET_COMPARE_START",
      "SET_COMPARE_UNTIL",

      // control vuetify calendar pickers
      "SET_PICKER_PRIMARY_ACTIVE" ]),

    {emitConfig: function emitConfig() {
      this.SET_CONFIG();
      this.$emit("change", this.getConfig);
    }}),
};

/* script */
var __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "v-dialog",
    {
      attrs: {
        value: true,
        fullscreen: "",
        "hide-overlay": "",
        transition: "dialog-bottom-transition"
      }
    },
    [
      _c(
        "v-card",
        { staticClass: "date-picker-mobile elevation-0 d-flex flex-column" },
        [
          _c(
            "v-container",
            [
              _c(
                "v-card-text",
                [
                  _c(
                    "v-row",
                    [
                      _c(
                        "v-col",
                        { attrs: { cols: "12" } },
                        [
                          _c(
                            "v-row",
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "12" } },
                                [
                                  _c("v-text-field", {
                                    staticClass: "picker-input",
                                    attrs: {
                                      label: "From",
                                      type: "date",
                                      outlined: "",
                                      dense: "",
                                      max: _vm.getMaxDate,
                                      value: _vm.getDateStart
                                    },
                                    on: {
                                      input: function($event) {
                                        return _vm.SET_DATE_START($event)
                                      },
                                      click: function($event) {
                                        return _vm.SET_PICKER_PRIMARY_ACTIVE(
                                          true
                                        )
                                      }
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "12" } },
                                [
                                  _c("v-text-field", {
                                    staticClass: "picker-input",
                                    attrs: {
                                      label: "To",
                                      type: "date",
                                      dense: "",
                                      outlined: "",
                                      max: _vm.getMaxDate,
                                      value: _vm.getDateUntil
                                    },
                                    on: {
                                      input: function($event) {
                                        return _vm.SET_DATE_UNTIL($event)
                                      },
                                      click: function($event) {
                                        return _vm.SET_PICKER_PRIMARY_ACTIVE(
                                          true
                                        )
                                      }
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            {
                              staticClass: "pl-2 pr-1",
                              attrs: { justify: "start" }
                            },
                            [_c("PresetsPrimary")],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            { staticClass: "pl-2 pt-0" },
                            [
                              _c("v-checkbox", {
                                staticClass: "compare-label",
                                attrs: {
                                  "input-value": _vm.getCompareState,
                                  label: "Compare to the following"
                                },
                                on: {
                                  change: function($event) {
                                    return _vm.FLIP_COMPARE_STATE()
                                  }
                                }
                              })
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "12" } },
                                [
                                  _c("v-text-field", {
                                    staticClass: "picker-input",
                                    attrs: {
                                      label: "From",
                                      type: "date",
                                      outlined: "",
                                      dense: "",
                                      max: _vm.getMaxDate,
                                      value: _vm.getDateCompareStart,
                                      disabled: !_vm.getCompareState
                                    },
                                    on: {
                                      input: function($event) {
                                        return _vm.SET_COMPARE_START($event)
                                      },
                                      click: function($event) {
                                        return _vm.SET_PICKER_PRIMARY_ACTIVE(
                                          false
                                        )
                                      }
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            [
                              _c(
                                "v-col",
                                { attrs: { cols: "12" } },
                                [
                                  _c("v-text-field", {
                                    staticClass: "picker-input",
                                    attrs: {
                                      label: "To",
                                      type: "date",
                                      outlined: "",
                                      dense: "",
                                      max: _vm.getMaxDate,
                                      value: _vm.getDateCompareUntil,
                                      disabled: !_vm.getCompareState
                                    },
                                    on: {
                                      input: function($event) {
                                        return _vm.SET_COMPARE_UNTIL($event)
                                      },
                                      click: function($event) {
                                        return _vm.SET_PICKER_PRIMARY_ACTIVE(
                                          false
                                        )
                                      }
                                    }
                                  })
                                ],
                                1
                              )
                            ],
                            1
                          ),
                          _vm._v(" "),
                          _c(
                            "v-row",
                            {
                              staticClass: "pl-2",
                              attrs: { justify: "start" }
                            },
                            [_c("PresetsCompare")],
                            1
                          )
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "v-card-actions",
                { staticClass: "mt-2" },
                [
                  _c("v-spacer"),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      staticClass: "px-4 mr-3",
                      attrs: { outlined: "" },
                      on: {
                        click: function($event) {
                          return _vm.SET_DIALOG_OPENED(false)
                        }
                      }
                    },
                    [_vm._v("Cancel")]
                  ),
                  _vm._v(" "),
                  _c(
                    "v-btn",
                    {
                      staticClass: "primary px-7",
                      on: {
                        click: function($event) {
                          return _vm.emitConfig()
                        }
                      }
                    },
                    [_vm._v("Apply")]
                  )
                ],
                1
              )
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = function (inject) {
    if (!inject) { return }
    inject("data-v-41e05ef6_0", { source: ".date-picker-mobile[data-v-41e05ef6] .picker-input .v-text-field__details {\n  display: none;\n}\n.date-picker-mobile[data-v-41e05ef6] .compare-label .v-messages {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerMobile.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DatePicker/DatePickerMobile.vue","DatePickerMobile.vue"],"names":[],"mappings":"AAyKA;EACA,aAAA;ACxKA;AD6KA;EACA,aAAA;AC3KA;;AAEA,+CAA+C","file":"DatePickerMobile.vue","sourcesContent":["<template>\n  <v-dialog :value=\"true\" fullscreen hide-overlay transition=\"dialog-bottom-transition\">\n    <v-card class=\"date-picker-mobile elevation-0 d-flex flex-column\">\n      <v-container>\n        <v-card-text>\n          <v-row>\n            <v-col cols=\"12\">\n              <v-row>\n                <v-col cols=\"12\">\n                  <v-text-field\n                    label=\"From\"\n                    type=\"date\"\n                    outlined\n                    dense\n                    :max=\"getMaxDate\"\n                    :value=\"getDateStart\"\n                    class=\"picker-input\"\n                    @input=\"SET_DATE_START($event)\"\n                    @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n                  />\n                </v-col>\n              </v-row>\n\n              <v-row>\n                <v-col cols=\"12\">\n                  <v-text-field\n                    label=\"To\"\n                    type=\"date\"\n                    dense\n                    outlined\n                    :max=\"getMaxDate\"\n                    :value=\"getDateUntil\"\n                    class=\"picker-input\"\n                    @input=\"SET_DATE_UNTIL($event)\"\n                    @click=\"SET_PICKER_PRIMARY_ACTIVE(true)\"\n                  />\n                </v-col>\n              </v-row>\n\n              <!-- presets for main period -->\n              <v-row justify=\"start\" class=\"pl-2 pr-1\">\n                <PresetsPrimary />\n              </v-row>\n\n              <v-row class=\"pl-2 pt-0\">\n                <v-checkbox\n                  :input-value=\"getCompareState\"\n                  label=\"Compare to the following\"\n                  class=\"compare-label\"\n                  @change=\"FLIP_COMPARE_STATE()\"\n                />\n              </v-row>\n\n              <v-row>\n                <v-col cols=\"12\">\n                  <v-text-field\n                    label=\"From\"\n                    type=\"date\"\n                    outlined\n                    dense\n                    :max=\"getMaxDate\"\n                    :value=\"getDateCompareStart\"\n                    :disabled=\"!getCompareState\"\n                    class=\"picker-input\"\n                    @input=\"SET_COMPARE_START($event)\"\n                    @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n                  />\n                </v-col>\n              </v-row>\n              <v-row>\n                <v-col cols=\"12\">\n                  <v-text-field\n                    label=\"To\"\n                    type=\"date\"\n                    outlined\n                    dense\n                    :max=\"getMaxDate\"\n                    :value=\"getDateCompareUntil\"\n                    :disabled=\"!getCompareState\"\n                    class=\"picker-input\"\n                    @input=\"SET_COMPARE_UNTIL($event)\"\n                    @click=\"SET_PICKER_PRIMARY_ACTIVE(false)\"\n                  />\n                </v-col>\n              </v-row>\n\n              <!-- presets for compare period -->\n              <v-row justify=\"start\" class=\"pl-2\">\n                <PresetsCompare />\n              </v-row>\n            </v-col>\n          </v-row>\n        </v-card-text>\n\n        <v-card-actions class=\"mt-2\">\n          <v-spacer />\n          <v-btn outlined class=\"px-4 mr-3\" @click=\"SET_DIALOG_OPENED(false)\">Cancel</v-btn>\n          <v-btn class=\"primary px-7\" @click=\"emitConfig()\">Apply</v-btn>\n        </v-card-actions>\n      </v-container>\n    </v-card>\n  </v-dialog>\n</template>\n\n<script>\nimport PresetsPrimary from \"./PresetsPrimary.vue\"\nimport PresetsCompare from \"./PresetsCompare.vue\"\nimport { mapGetters, mapMutations } from \"vuex\"\n\nexport default {\n  name: \"DatePickerMobile\",\n\n  components: {\n    PresetsPrimary,\n    PresetsCompare,\n  },\n\n  computed: {\n    ...mapGetters(\"datepicker\", [\n      // config\n      \"getConfig\",\n      \"getMaxDate\",\n\n      // compare checkbox\n      \"getCompareState\",\n\n      // individual dates\n      \"getDateStart\",\n      \"getDateUntil\",\n      \"getDateCompareStart\",\n      \"getDateCompareUntil\",\n    ]),\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\n      // controls compare checkbox\n      \"FLIP_COMPARE_STATE\",\n\n      // controls applied selections\n      \"SET_CONFIG\",\n\n      // controls dialog modal\n      \"SET_DIALOG_OPENED\",\n\n      // control selected date ranges\n      \"SET_DATE_START\",\n      \"SET_DATE_UNTIL\",\n      \"SET_COMPARE_START\",\n      \"SET_COMPARE_UNTIL\",\n\n      // control vuetify calendar pickers\n      \"SET_PICKER_PRIMARY_ACTIVE\",\n    ]),\n\n    emitConfig() {\n      this.SET_CONFIG()\n      this.$emit(\"change\", this.getConfig)\n    },\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-picker-mobile::v-deep {\n  .picker-input {\n    // Under the date inputs there is a place\n    // for some details, which are completely\n    // unnecessary\n    .v-text-field__details {\n      display: none;\n    }\n  }\n\n  .compare-label {\n    .v-messages {\n      display: none;\n    }\n  }\n}\n</style>\n",".date-picker-mobile::v-deep .picker-input .v-text-field__details {\n  display: none;\n}\n.date-picker-mobile::v-deep .compare-label .v-messages {\n  display: none;\n}\n\n/*# sourceMappingURL=DatePickerMobile.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__$1 = "data-v-41e05ef6";
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__$1 = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    false,
    createInjector,
    undefined,
    undefined
  );

var script = {
  name: "DatePicker",

  components: {
    DateSelector: __vue_component__$6,
    DatePickerDesktop: __vue_component__$3,
    DatePickerTablet: __vue_component__$2,
    DatePickerMobile: __vue_component__$1,
    VOverlay: VOverlay
  },

  props: ["config"],

  data: function () { return ({
    // The following takes care of the classes which should not go to the root element
    // but to the <date-selector /> which actually represents the whole picker
    inheritedClasses: "",
    configParsed: {},
  }); },

  computed: Object.assign({}, mapGetters("datepicker", ["isDialogOpened", "getConfig"]),

    // props have to be stringify to be make watch reactive on object
    {propsChange: function propsChange() {
      return JSON.stringify(this.config)
    }}),

  watch: {
    // we need to watch for any props update to pass it to component
    propsChange: function propsChange() {
      this.SET_PROPS(Object.assign({}, this.config));
    },
  },

  // this component has to be mounted for this.$el.className
  mounted: function mounted() {
    // The classes which are provided to the root element are passed to the <date-selector />
    this.inheritedClasses = this.$el.className;

    // We don't want to lose the default root element classes
    this.$el.className = "date-selector d-inline-flex align-center justify-center";

    this.SET_PROPS(Object.assign({}, this.config));
    this.SET_CONFIG();
  },

  methods: Object.assign({}, mapMutations("datepicker", ["SET_DIALOG_OPENED", "SET_PROPS", "SET_CONFIG"])),
};

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "date-selector" },
    [
      _c("v-overlay", {
        attrs: { value: _vm.isDialogOpened },
        nativeOn: {
          click: function($event) {
            return _vm.SET_DIALOG_OPENED(true)
          }
        }
      }),
      _vm._v(" "),
      _c(
        "DateSelector",
        _vm._b(
          {
            class: _vm.inheritedClasses,
            on: {
              change: function($event) {
                return _vm.$emit("change", $event)
              }
            }
          },
          "DateSelector",
          _vm.$attrs,
          false
        )
      ),
      _vm._v(" "),
      _vm.isDialogOpened
        ? _c(
            "div",
            { staticClass: "date-pickers-container" },
            [
              _vm.$vuetify.breakpoint.mdAndUp
                ? _c("DatePickerDesktop", {
                    on: {
                      change: function($event) {
                        return _vm.$emit("change", $event)
                      }
                    }
                  })
                : _vm.$vuetify.breakpoint.sm
                ? _c("DatePickerTablet", {
                    on: {
                      change: function($event) {
                        return _vm.$emit("change", $event)
                      }
                    }
                  })
                : _c("DatePickerMobile", {
                    on: {
                      change: function($event) {
                        return _vm.$emit("change", $event)
                      }
                    }
                  })
            ],
            1
          )
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-6db996af_0", { source: ".date-pickers-container[data-v-6db996af] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0;\n  z-index: 100;\n  width: 100vw;\n}\n\n/*# sourceMappingURL=DateRangePicker.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DateRangePicker.vue","DateRangePicker.vue"],"names":[],"mappings":"AA4EA;EACA,eAAA;EACA,MAAA;EACA,OAAA;EACA,UAAA;EACA,SAAA;EACA,YAAA;EACA,YAAA;AC3EA;;AAEA,8CAA8C","file":"DateRangePicker.vue","sourcesContent":["<template>\n  <div class=\"date-selector\">\n    <v-overlay :value=\"isDialogOpened\" @click.native=\"SET_DIALOG_OPENED(true)\" />\n\n    <DateSelector v-bind=\"$attrs\" :class=\"inheritedClasses\" @change=\"$emit('change', $event)\" />\n\n    <div v-if=\"isDialogOpened\" class=\"date-pickers-container\">\n      <DatePickerDesktop v-if=\"$vuetify.breakpoint.mdAndUp\" @change=\"$emit('change', $event)\" />\n      <DatePickerTablet v-else-if=\"$vuetify.breakpoint.sm\" @change=\"$emit('change', $event)\" />\n      <DatePickerMobile v-else @change=\"$emit('change', $event)\" />\n    </div>\n  </div>\n</template>\n\n<script>\nimport { mapGetters, mapMutations } from \"vuex\"\n\nimport DateSelector from \"./DatePicker/DateSelector.vue\"\nimport DatePickerDesktop from \"./DatePicker/DatePickerDesktop.vue\"\nimport DatePickerTablet from \"./DatePicker/DatePickerTablet.vue\"\nimport DatePickerMobile from \"./DatePicker/DatePickerMobile.vue\"\n\nexport default {\n  name: \"DatePicker\",\n\n  components: {\n    DateSelector,\n    DatePickerDesktop,\n    DatePickerTablet,\n    DatePickerMobile,\n  },\n\n  props: [\"config\"],\n\n  data: () => ({\n    // The following takes care of the classes which should not go to the root element\n    // but to the <date-selector /> which actually represents the whole picker\n    inheritedClasses: \"\",\n    configParsed: {},\n  }),\n\n  computed: {\n    ...mapGetters(\"datepicker\", [\"isDialogOpened\", \"getConfig\"]),\n\n    // props have to be stringify to be make watch reactive on object\n    propsChange() {\n      return JSON.stringify(this.config)\n    },\n  },\n\n  watch: {\n    // we need to watch for any props update to pass it to component\n    propsChange() {\n      this.SET_PROPS({ ...this.config })\n    },\n  },\n\n  // this component has to be mounted for this.$el.className\n  mounted() {\n    // The classes which are provided to the root element are passed to the <date-selector />\n    this.inheritedClasses = this.$el.className\n\n    // We don't want to lose the default root element classes\n    this.$el.className = \"date-selector d-inline-flex align-center justify-center\"\n\n    this.SET_PROPS({ ...this.config })\n    this.SET_CONFIG()\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\"SET_DIALOG_OPENED\", \"SET_PROPS\", \"SET_CONFIG\"]),\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-pickers-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0;\n  z-index: 100;\n  width: 100vw;\n}\n</style>\n\n<style lang=\"scss\">\n/* not scoped white calendar icon for dark theme <v-text-field type=\"date\" /> */\n.theme--dark input[type=\"date\"]::-webkit-calendar-picker-indicator {\n  background: url('data:image/svg+xml;utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"23\" height=\"23\" viewBox=\"0 0 24 24\"><path fill=\"%23FFFFFF\" d=\"M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1\" /></svg>')\n    no-repeat;\n}\n</style>\n",".date-pickers-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0;\n  z-index: 100;\n  width: 100vw;\n}\n\n/*# sourceMappingURL=DateRangePicker.vue.map */"]}, media: undefined })
,inject("data-v-6db996af_1", { source: "/* not scoped white calendar icon for dark theme <v-text-field type=\"date\" /> */\n.theme--dark input[type=date]::-webkit-calendar-picker-indicator {\n  background: url('data:image/svg+xml;utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"23\" height=\"23\" viewBox=\"0 0 24 24\"><path fill=\"%23FFFFFF\" d=\"M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1\" /></svg>') no-repeat;\n}\n\n/*# sourceMappingURL=DateRangePicker.vue.map */", map: {"version":3,"sources":["/Users/mark/Sites/npm-packages/vuetify-date-range-picker/src/components/DateRangePicker.vue","DateRangePicker.vue"],"names":[],"mappings":"AAwFA,+EAAA;AACA;EACA,6RAAA;ACvFA;;AAEA,8CAA8C","file":"DateRangePicker.vue","sourcesContent":["<template>\n  <div class=\"date-selector\">\n    <v-overlay :value=\"isDialogOpened\" @click.native=\"SET_DIALOG_OPENED(true)\" />\n\n    <DateSelector v-bind=\"$attrs\" :class=\"inheritedClasses\" @change=\"$emit('change', $event)\" />\n\n    <div v-if=\"isDialogOpened\" class=\"date-pickers-container\">\n      <DatePickerDesktop v-if=\"$vuetify.breakpoint.mdAndUp\" @change=\"$emit('change', $event)\" />\n      <DatePickerTablet v-else-if=\"$vuetify.breakpoint.sm\" @change=\"$emit('change', $event)\" />\n      <DatePickerMobile v-else @change=\"$emit('change', $event)\" />\n    </div>\n  </div>\n</template>\n\n<script>\nimport { mapGetters, mapMutations } from \"vuex\"\n\nimport DateSelector from \"./DatePicker/DateSelector.vue\"\nimport DatePickerDesktop from \"./DatePicker/DatePickerDesktop.vue\"\nimport DatePickerTablet from \"./DatePicker/DatePickerTablet.vue\"\nimport DatePickerMobile from \"./DatePicker/DatePickerMobile.vue\"\n\nexport default {\n  name: \"DatePicker\",\n\n  components: {\n    DateSelector,\n    DatePickerDesktop,\n    DatePickerTablet,\n    DatePickerMobile,\n  },\n\n  props: [\"config\"],\n\n  data: () => ({\n    // The following takes care of the classes which should not go to the root element\n    // but to the <date-selector /> which actually represents the whole picker\n    inheritedClasses: \"\",\n    configParsed: {},\n  }),\n\n  computed: {\n    ...mapGetters(\"datepicker\", [\"isDialogOpened\", \"getConfig\"]),\n\n    // props have to be stringify to be make watch reactive on object\n    propsChange() {\n      return JSON.stringify(this.config)\n    },\n  },\n\n  watch: {\n    // we need to watch for any props update to pass it to component\n    propsChange() {\n      this.SET_PROPS({ ...this.config })\n    },\n  },\n\n  // this component has to be mounted for this.$el.className\n  mounted() {\n    // The classes which are provided to the root element are passed to the <date-selector />\n    this.inheritedClasses = this.$el.className\n\n    // We don't want to lose the default root element classes\n    this.$el.className = \"date-selector d-inline-flex align-center justify-center\"\n\n    this.SET_PROPS({ ...this.config })\n    this.SET_CONFIG()\n  },\n\n  methods: {\n    ...mapMutations(\"datepicker\", [\"SET_DIALOG_OPENED\", \"SET_PROPS\", \"SET_CONFIG\"]),\n  },\n}\n</script>\n\n<style lang=\"scss\" scoped>\n.date-pickers-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  padding: 0;\n  margin: 0;\n  z-index: 100;\n  width: 100vw;\n}\n</style>\n\n<style lang=\"scss\">\n/* not scoped white calendar icon for dark theme <v-text-field type=\"date\" /> */\n.theme--dark input[type=\"date\"]::-webkit-calendar-picker-indicator {\n  background: url('data:image/svg+xml;utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"23\" height=\"23\" viewBox=\"0 0 24 24\"><path fill=\"%23FFFFFF\" d=\"M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1\" /></svg>')\n    no-repeat;\n}\n</style>\n","/* not scoped white calendar icon for dark theme <v-text-field type=\"date\" /> */\n.theme--dark input[type=date]::-webkit-calendar-picker-indicator {\n  background: url('data:image/svg+xml;utf-8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"23\" height=\"23\" viewBox=\"0 0 24 24\"><path fill=\"%23FFFFFF\" d=\"M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1\" /></svg>') no-repeat;\n}\n\n/*# sourceMappingURL=DateRangePicker.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-6db996af";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

var defaultSettings = {
  debug: false,
  store: null, // vuex store
};

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue, options) {
  if ( options === void 0 ) options = {};

  if (install.installed) { return }

  install.installed = true;

  // merge default settings with user settings
  var config = Object.assign({}, defaultSettings, options);

  var store = config.store;

  // verify if required dependency instances are passed to this package config
  if (config.debug) {
    if (store === null) {
      console.error("[ date picker ]: WARNING: VueX store instance missing in DateRangePicker config!");
    }
  }
  if (store === null) {
    // use backup store if none passed in options - backwards compatibility
    store = DateRangeStore;
  }

  // register vuex store namespace
  store.registerModule("datepicker", DateRangeStore);

  if (config.debug) {
    console.log("[ date picker ]: registering VueX namespace: datepicker");
  }

  delete config.store;

  // commit npm package config to vuex store
  store.commit("datepicker/SET_DEBUG", config.debug);

  if ([true, false].includes(config.showPresetsIcon)) {
    store.commit("datepicker/SET_PRESET_ICON_SHOWN", Boolean(config.showPresetsIcon));
  }
  if ([true, false].includes(config.showCalendarIcon)) {
    store.commit("datepicker/SET_CALENDAR_ICON_SHOWN", Boolean(config.showCalendarIcon));
  }

  Vue.component("DateRangePicker", __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
  install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;

if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) { GlobalVue.use(plugin); }

var presets = DateRangePresets;
var datepicker = DateRangeStore;

export { datepicker, plugin as default, install, presets };
