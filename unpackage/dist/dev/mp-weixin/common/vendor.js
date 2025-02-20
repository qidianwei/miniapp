"use strict";
/**
* @vue/shared v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function makeMap(str, expectsLowerCase) {
  const set2 = new Set(str.split(","));
  return expectsLowerCase ? (val) => set2.has(val.toLowerCase()) : (val) => set2.has(val);
}
const EMPTY_OBJ = Object.freeze({});
const EMPTY_ARR = Object.freeze([]);
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s2 = str ? `on${capitalize(str)}` : ``;
  return s2;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns$1 = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n2 = parseFloat(val);
  return isNaN(n2) ? val : n2;
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
const LOCALE_ZH_HANS = "zh-Hans";
const LOCALE_ZH_HANT = "zh-Hant";
const LOCALE_EN = "en";
const LOCALE_FR = "fr";
const LOCALE_ES = "es";
function include(str, parts) {
  return !!parts.find((part) => str.indexOf(part) !== -1);
}
function startsWith(str, parts) {
  return parts.find((part) => str.indexOf(part) === 0);
}
function normalizeLocale(locale, messages) {
  if (!locale) {
    return;
  }
  locale = locale.trim().replace(/_/g, "-");
  if (messages && messages[locale]) {
    return locale;
  }
  locale = locale.toLowerCase();
  if (locale === "chinese") {
    return LOCALE_ZH_HANS;
  }
  if (locale.indexOf("zh") === 0) {
    if (locale.indexOf("-hans") > -1) {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("-hant") > -1) {
      return LOCALE_ZH_HANT;
    }
    if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
      return LOCALE_ZH_HANT;
    }
    return LOCALE_ZH_HANS;
  }
  let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
  if (messages && Object.keys(messages).length > 0) {
    locales = Object.keys(messages);
  }
  const lang = startsWith(locale, locales);
  if (lang) {
    return lang;
  }
}
const SLOT_DEFAULT_NAME = "d";
const ON_SHOW = "onShow";
const ON_HIDE = "onHide";
const ON_LAUNCH = "onLaunch";
const ON_ERROR = "onError";
const ON_THEME_CHANGE = "onThemeChange";
const ON_PAGE_NOT_FOUND = "onPageNotFound";
const ON_UNHANDLE_REJECTION = "onUnhandledRejection";
const ON_EXIT = "onExit";
const ON_LOAD = "onLoad";
const ON_READY = "onReady";
const ON_UNLOAD = "onUnload";
const ON_INIT = "onInit";
const ON_SAVE_EXIT_STATE = "onSaveExitState";
const ON_RESIZE = "onResize";
const ON_BACK_PRESS = "onBackPress";
const ON_PAGE_SCROLL = "onPageScroll";
const ON_TAB_ITEM_TAP = "onTabItemTap";
const ON_REACH_BOTTOM = "onReachBottom";
const ON_PULL_DOWN_REFRESH = "onPullDownRefresh";
const ON_SHARE_TIMELINE = "onShareTimeline";
const ON_SHARE_CHAT = "onShareChat";
const ON_ADD_TO_FAVORITES = "onAddToFavorites";
const ON_SHARE_APP_MESSAGE = "onShareAppMessage";
const ON_NAVIGATION_BAR_BUTTON_TAP = "onNavigationBarButtonTap";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED = "onNavigationBarSearchInputClicked";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED = "onNavigationBarSearchInputChanged";
const ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED = "onNavigationBarSearchInputConfirmed";
const ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED = "onNavigationBarSearchInputFocusChanged";
const VIRTUAL_HOST_STYLE = "virtualHostStyle";
const VIRTUAL_HOST_CLASS = "virtualHostClass";
const VIRTUAL_HOST_HIDDEN = "virtualHostHidden";
const VIRTUAL_HOST_ID = "virtualHostId";
function hasLeadingSlash(str) {
  return str.indexOf("/") === 0;
}
function addLeadingSlash(str) {
  return hasLeadingSlash(str) ? str : "/" + str;
}
const invokeArrayFns = (fns, arg) => {
  let ret;
  for (let i = 0; i < fns.length; i++) {
    ret = fns[i](arg);
  }
  return ret;
};
function once(fn, ctx = null) {
  let res;
  return (...args) => {
    if (fn) {
      res = fn.apply(ctx, args);
      fn = null;
    }
    return res;
  };
}
function getValueByDataPath(obj, path) {
  if (!isString(path)) {
    return;
  }
  path = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = path.split(".");
  let key = parts[0];
  if (!obj) {
    obj = {};
  }
  if (parts.length === 1) {
    return obj[key];
  }
  return getValueByDataPath(obj[key], parts.slice(1).join("."));
}
function sortObject(obj) {
  let sortObj = {};
  if (isPlainObject(obj)) {
    Object.keys(obj).sort().forEach((key) => {
      const _key = key;
      sortObj[_key] = obj[_key];
    });
  }
  return !Object.keys(sortObj) ? obj : sortObj;
}
const customizeRE = /:/g;
function customizeEvent(str) {
  return camelize(str.replace(customizeRE, "-"));
}
const encode = encodeURIComponent;
function stringifyQuery(obj, encodeStr = encode) {
  const res = obj ? Object.keys(obj).map((key) => {
    let val = obj[key];
    if (typeof val === void 0 || val === null) {
      val = "";
    } else if (isPlainObject(val)) {
      val = JSON.stringify(val);
    }
    return encodeStr(key) + "=" + encodeStr(val);
  }).filter((x) => x.length > 0).join("&") : null;
  return res ? `?${res}` : "";
}
const PAGE_HOOKS = [
  ON_INIT,
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_ADD_TO_FAVORITES,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
function isRootHook(name) {
  return PAGE_HOOKS.indexOf(name) > -1;
}
const UniLifecycleHooks = [
  ON_SHOW,
  ON_HIDE,
  ON_LAUNCH,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION,
  ON_EXIT,
  ON_INIT,
  ON_LOAD,
  ON_READY,
  ON_UNLOAD,
  ON_RESIZE,
  ON_BACK_PRESS,
  ON_PAGE_SCROLL,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_SHARE_TIMELINE,
  ON_ADD_TO_FAVORITES,
  ON_SHARE_APP_MESSAGE,
  ON_SHARE_CHAT,
  ON_SAVE_EXIT_STATE,
  ON_NAVIGATION_BAR_BUTTON_TAP,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CLICKED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CHANGED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_CONFIRMED,
  ON_NAVIGATION_BAR_SEARCH_INPUT_FOCUS_CHANGED
];
const MINI_PROGRAM_PAGE_RUNTIME_HOOKS = /* @__PURE__ */ (() => {
  return {
    onPageScroll: 1,
    onShareAppMessage: 1 << 1,
    onShareTimeline: 1 << 2
  };
})();
function isUniLifecycleHook(name, value, checkType = true) {
  if (checkType && !isFunction(value)) {
    return false;
  }
  if (UniLifecycleHooks.indexOf(name) > -1) {
    return true;
  } else if (name.indexOf("on") === 0) {
    return true;
  }
  return false;
}
let vueApp;
const createVueAppHooks = [];
function onCreateVueApp(hook) {
  if (vueApp) {
    return hook(vueApp);
  }
  createVueAppHooks.push(hook);
}
function invokeCreateVueAppHook(app) {
  vueApp = app;
  createVueAppHooks.forEach((hook) => hook(app));
}
const invokeCreateErrorHandler = once((app, createErrorHandler2) => {
  return createErrorHandler2(app);
});
const E = function() {
};
E.prototype = {
  _id: 1,
  on: function(name, callback, ctx) {
    var e2 = this.e || (this.e = {});
    (e2[name] || (e2[name] = [])).push({
      fn: callback,
      ctx,
      _id: this._id
    });
    return this._id++;
  },
  once: function(name, callback, ctx) {
    var self2 = this;
    function listener() {
      self2.off(name, listener);
      callback.apply(ctx, arguments);
    }
    listener._ = callback;
    return this.on(name, listener, ctx);
  },
  emit: function(name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;
    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }
    return this;
  },
  off: function(name, event) {
    var e2 = this.e || (this.e = {});
    var evts = e2[name];
    var liveEvents = [];
    if (evts && event) {
      for (var i = evts.length - 1; i >= 0; i--) {
        if (evts[i].fn === event || evts[i].fn._ === event || evts[i]._id === event) {
          evts.splice(i, 1);
          break;
        }
      }
      liveEvents = evts;
    }
    liveEvents.length ? e2[name] = liveEvents : delete e2[name];
    return this;
  }
};
var E$1 = E;
/**
* @dcloudio/uni-mp-vue v3.4.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
  console.warn(`[Vue warn] ${msg}`, ...args);
}
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    } else {
      warn$2(`cannot run an inactive effect scope.`);
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function recordEffectScope(effect2, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeEffect;
class ReactiveEffect {
  constructor(fn, trigger2, scheduler, scope) {
    this.fn = fn;
    this.trigger = trigger2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this._dirtyLevel = 4;
    this._trackId = 0;
    this._runnings = 0;
    this._shouldSchedule = false;
    this._depsLength = 0;
    recordEffectScope(this, scope);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      this._dirtyLevel = 1;
      pauseTracking();
      for (let i = 0; i < this._depsLength; i++) {
        const dep = this.deps[i];
        if (dep.computed) {
          triggerComputed(dep.computed);
          if (this._dirtyLevel >= 4) {
            break;
          }
        }
      }
      if (this._dirtyLevel === 1) {
        this._dirtyLevel = 0;
      }
      resetTracking();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(v) {
    this._dirtyLevel = v ? 4 : 0;
  }
  run() {
    this._dirtyLevel = 0;
    if (!this.active) {
      return this.fn();
    }
    let lastShouldTrack = shouldTrack;
    let lastEffect = activeEffect;
    try {
      shouldTrack = true;
      activeEffect = this;
      this._runnings++;
      preCleanupEffect(this);
      return this.fn();
    } finally {
      postCleanupEffect(this);
      this._runnings--;
      activeEffect = lastEffect;
      shouldTrack = lastShouldTrack;
    }
  }
  stop() {
    var _a;
    if (this.active) {
      preCleanupEffect(this);
      postCleanupEffect(this);
      (_a = this.onStop) == null ? void 0 : _a.call(this);
      this.active = false;
    }
  }
}
function triggerComputed(computed2) {
  return computed2.value;
}
function preCleanupEffect(effect2) {
  effect2._trackId++;
  effect2._depsLength = 0;
}
function postCleanupEffect(effect2) {
  if (effect2.deps.length > effect2._depsLength) {
    for (let i = effect2._depsLength; i < effect2.deps.length; i++) {
      cleanupDepEffect(effect2.deps[i], effect2);
    }
    effect2.deps.length = effect2._depsLength;
  }
}
function cleanupDepEffect(dep, effect2) {
  const trackId = dep.get(effect2);
  if (trackId !== void 0 && effect2._trackId !== trackId) {
    dep.delete(effect2);
    if (dep.size === 0) {
      dep.cleanup();
    }
  }
}
let shouldTrack = true;
let pauseScheduleStack = 0;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function pauseScheduling() {
  pauseScheduleStack++;
}
function resetScheduling() {
  pauseScheduleStack--;
  while (!pauseScheduleStack && queueEffectSchedulers.length) {
    queueEffectSchedulers.shift()();
  }
}
function trackEffect(effect2, dep, debuggerEventExtraInfo) {
  var _a;
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    const oldDep = effect2.deps[effect2._depsLength];
    if (oldDep !== dep) {
      if (oldDep) {
        cleanupDepEffect(oldDep, effect2);
      }
      effect2.deps[effect2._depsLength++] = dep;
    } else {
      effect2._depsLength++;
    }
    {
      (_a = effect2.onTrack) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
    }
  }
}
const queueEffectSchedulers = [];
function triggerEffects(dep, dirtyLevel, debuggerEventExtraInfo) {
  var _a;
  pauseScheduling();
  for (const effect2 of dep.keys()) {
    let tracking;
    if (effect2._dirtyLevel < dirtyLevel && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      effect2._shouldSchedule || (effect2._shouldSchedule = effect2._dirtyLevel === 0);
      effect2._dirtyLevel = dirtyLevel;
    }
    if (effect2._shouldSchedule && (tracking != null ? tracking : tracking = dep.get(effect2) === effect2._trackId)) {
      {
        (_a = effect2.onTrigger) == null ? void 0 : _a.call(effect2, extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      effect2.trigger();
      if ((!effect2._runnings || effect2.allowRecurse) && effect2._dirtyLevel !== 2) {
        effect2._shouldSchedule = false;
        if (effect2.scheduler) {
          queueEffectSchedulers.push(effect2.scheduler);
        }
      }
    }
  }
  resetScheduling();
}
const createDep = (cleanup, computed2) => {
  const dep = /* @__PURE__ */ new Map();
  dep.cleanup = cleanup;
  dep.computed = computed2;
  return dep;
};
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = Symbol("iterate");
const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate");
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(() => depsMap.delete(key)));
    }
    trackEffect(
      activeEffect,
      dep,
      {
        target,
        type,
        key
      }
    );
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  pauseScheduling();
  for (const dep of deps) {
    if (dep) {
      triggerEffects(
        dep,
        4,
        {
          target,
          type,
          key,
          newValue,
          oldValue,
          oldTarget
        }
      );
    }
  }
  resetScheduling();
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      pauseScheduling();
      const res = toRaw(this)[key].apply(this, args);
      resetScheduling();
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (!this._isShallow) {
      const isOldValueReadonly = isReadonly(oldValue);
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
        if (isOldValueReadonly) {
          return false;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value, oldValue);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    {
      warn$2(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
  deleteProperty(target, key) {
    {
      warn$2(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      );
    }
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value, oldValue);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  } else {
    checkIdentityKeys(target, has2, key);
  }
  const oldValue = get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0, oldValue);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const oldTarget = isMap(target) ? new Map(target) : new Set(target);
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0, oldTarget);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    {
      const key = args[0] ? `on key "${args[0]}" ` : ``;
      warn$2(
        `${capitalize(type)} operation ${key}failed: target is readonly.`,
        toRaw(this)
      );
    }
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
function checkIdentityKeys(target, has2, key) {
  const rawKey = toRaw(key);
  if (rawKey !== key && has2.call(target, rawKey)) {
    const type = toRawType(target);
    warn$2(
      `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    {
      warn$2(`value cannot be made reactive: ${String(target)}`);
    }
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  if (Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? reactive(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
const COMPUTED_SIDE_EFFECT_WARN = `Computed is still dirty after getter evaluation, likely because a computed is mutating its own dependency in its getter. State mutations in computed getters should be avoided.  Check the docs for more details: https://vuejs.org/guide/essentials/computed.html#getters-should-be-side-effect-free`;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this.getter = getter;
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => triggerRefValue(
        this,
        this.effect._dirtyLevel === 2 ? 2 : 3
      )
    );
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    if ((!self2._cacheable || self2.effect.dirty) && hasChanged(self2._value, self2._value = self2.effect.run())) {
      triggerRefValue(self2, 4);
    }
    trackRefValue(self2);
    if (self2.effect._dirtyLevel >= 2) {
      if (this._warnRecursive) {
        warn$2(COMPUTED_SIDE_EFFECT_WARN, `

getter: `, this.getter);
      }
      triggerRefValue(self2, 2);
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
  // #region polyfill _dirty for backward compatibility third party code for Vue <= 3.3.x
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(v) {
    this.effect.dirty = v;
  }
  // #endregion
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = () => {
      warn$2("Write operation failed: computed value is readonly");
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  if (debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack;
    cRef.effect.onTrigger = debugOptions.onTrigger;
  }
  return cRef;
}
function trackRefValue(ref2) {
  var _a;
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    trackEffect(
      activeEffect,
      (_a = ref2.dep) != null ? _a : ref2.dep = createDep(
        () => ref2.dep = void 0,
        ref2 instanceof ComputedRefImpl ? ref2 : void 0
      ),
      {
        target: ref2,
        type: "get",
        key: "value"
      }
    );
  }
}
function triggerRefValue(ref2, dirtyLevel = 4, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    triggerEffects(
      dep,
      dirtyLevel,
      {
        target: ref2,
        type: "set",
        key: "value",
        newValue: newVal
      }
    );
  }
}
function isRef(r2) {
  return !!(r2 && r2.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this, 4, newVal);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
const stack = [];
function pushWarningContext(vnode) {
  stack.push(vnode);
}
function popWarningContext() {
  stack.pop();
}
function warn$1(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
const ErrorTypeStrings = {
  ["sp"]: "serverPrefetch hook",
  ["bc"]: "beforeCreate hook",
  ["c"]: "created hook",
  ["bm"]: "beforeMount hook",
  ["m"]: "mounted hook",
  ["bu"]: "beforeUpdate hook",
  ["u"]: "updated",
  ["bum"]: "beforeUnmount hook",
  ["um"]: "unmounted hook",
  ["a"]: "activated hook",
  ["da"]: "deactivated hook",
  ["ec"]: "errorCaptured hook",
  ["rtc"]: "renderTracked hook",
  ["rtg"]: "renderTriggered hook",
  [0]: "setup function",
  [1]: "render function",
  [2]: "watcher getter",
  [3]: "watcher callback",
  [4]: "watcher cleanup function",
  [5]: "native event handler",
  [6]: "component event handler",
  [7]: "vnode hook",
  [8]: "directive hook",
  [9]: "transition hook",
  [10]: "app errorHandler",
  [11]: "app warnHandler",
  [12]: "ref function",
  [13]: "async component loader",
  [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://github.com/vuejs/core ."
};
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = ErrorTypeStrings[type] || type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    const info = ErrorTypeStrings[type] || type;
    if (contextVNode) {
      pushWarningContext(contextVNode);
    }
    warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
    if (contextVNode) {
      popWarningContext();
    }
    if (throwInDev) {
      console.error(err);
    } else {
      console.error(err);
    }
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
const RECURSION_LIMIT = 100;
function nextTick$1(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue$1.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue$1[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue$1.length || !queue$1.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function hasQueueJob(job) {
  return queue$1.indexOf(job) > -1;
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = isFlushing ? flushIndex + 1 : 0) {
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  for (; i < queue$1.length; i++) {
    const cb = queue$1[i];
    if (cb && cb.pre) {
      if (checkRecursiveUpdates(seen, cb)) {
        continue;
      }
      queue$1.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
        continue;
      }
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff2 = getId(a) - getId(b);
  if (diff2 === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff2;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  {
    seen = seen || /* @__PURE__ */ new Map();
  }
  queue$1.sort(comparator);
  const check = (job) => checkRecursiveUpdates(seen, job);
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (check(job)) {
          continue;
        }
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs(seen);
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
function checkRecursiveUpdates(seen, fn) {
  if (!seen.has(fn)) {
    seen.set(fn, 1);
  } else {
    const count = seen.get(fn);
    if (count > RECURSION_LIMIT) {
      const instance = fn.ownerInstance;
      const componentName = instance && getComponentName(instance.type);
      handleError(
        `Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
        null,
        10
      );
      return true;
    } else {
      seen.set(fn, count + 1);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (
    // handle late devtools injection - only do this if we are in an actual
    // browser environment to avoid the timer handle stalling test runner exit
    // (#4815)
    typeof window !== "undefined" && // some envs mock window but not fully
    window.HTMLElement && // also exclude jsdom
    !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
  ) {
    const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target);
    });
    setTimeout(() => {
      if (!devtools) {
        target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app, version2) {
  emit$1("app:init", app, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:added"
  /* COMPONENT_ADDED */
);
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:updated"
  /* COMPONENT_UPDATED */
);
const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
  "component:removed"
  /* COMPONENT_REMOVED */
);
const devtoolsComponentRemoved = (component) => {
  if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
  !devtools.cleanupBuffer(component)) {
    _devtoolsComponentRemoved(component);
  }
};
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(
      hook,
      component.appContext.app,
      component.uid,
      // fixed by xxxxxx
      // 为 0 是 App，无 parent 是 Page 指向 App
      component.uid === 0 ? void 0 : component.parent ? component.parent.uid : 0,
      component
    );
  };
}
const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:start"
  /* PERFORMANCE_START */
);
const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
  "perf:end"
  /* PERFORMANCE_END */
);
function createDevtoolsPerformanceHook(hook) {
  return (component, type, time) => {
    emit$1(hook, component.appContext.app, component.uid, component, type, time);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1(
    "component:emit",
    component.appContext.app,
    component,
    event,
    params
  );
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  {
    const {
      emitsOptions,
      propsOptions: [propsOptions]
    } = instance;
    if (emitsOptions) {
      if (!(event in emitsOptions) && true) {
        if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
          warn$1(
            `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
          );
        }
      } else {
        const validator = emitsOptions[event];
        if (isFunction(validator)) {
          const isValid = validator(...rawArgs);
          if (!isValid) {
            warn$1(
              `Invalid event arguments: event validation failed for event "${event}".`
            );
          }
        }
      }
    }
  }
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
      warn$1(
        `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(
          event
        )}" instead of "${event}".`
      );
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  instance && instance.type.__scopeId || null;
  return prev;
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  if (!isFunction(cb)) {
    warn$1(
      `\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`
    );
  }
  return doWatch(source, cb, options);
}
function doWatch(source, cb, {
  immediate,
  deep,
  flush,
  once: once2,
  onTrack,
  onTrigger
} = EMPTY_OBJ) {
  if (cb && once2) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      unwatch();
    };
  }
  if (deep !== void 0 && typeof deep === "number") {
    warn$1(
      `watch() "deep" option with number value will be used as watch depth in future versions. Please use a boolean instead to avoid potential breakage.`
    );
  }
  if (!cb) {
    if (immediate !== void 0) {
      warn$1(
        `watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (deep !== void 0) {
      warn$1(
        `watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
    if (once2 !== void 0) {
      warn$1(
        `watch() "once" option is only respected when using the watch(source, callback, options?) signature.`
      );
    }
  }
  const warnInvalidSource = (s2) => {
    warn$1(
      `Invalid watch source: `,
      s2,
      `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`
    );
  };
  const instance = currentInstance;
  const reactiveGetter = (source2) => deep === true ? source2 : (
    // for deep: false, only traverse root-level properties
    traverse(source2, deep === false ? 1 : void 0)
  );
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s2) => isReactive(s2) || isShallow(s2));
    getter = () => source.map((s2) => {
      if (isRef(s2)) {
        return s2.value;
      } else if (isReactive(s2)) {
        return reactiveGetter(s2);
      } else if (isFunction(s2)) {
        return callWithErrorHandling(s2, instance, 2);
      } else {
        warnInvalidSource(s2);
      }
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
    warnInvalidSource(source);
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect2.onStop = void 0;
    };
  };
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active || !effect2.dirty) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect$1(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect2 = new ReactiveEffect(getter, NOOP, scheduler);
  const scope = getCurrentScope();
  const unwatch = () => {
    effect2.stop();
    if (scope) {
      remove(scope.effects, effect2);
    }
  };
  {
    effect2.onTrack = onTrack;
    effect2.onTrigger = onTrigger;
  }
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect$1(
      effect2.run.bind(effect2),
      instance && instance.suspense
    );
  } else {
    effect2.run();
  }
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, depth, currentDepth = 0, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  if (depth && depth > 0) {
    if (currentDepth >= depth) {
      return value;
    }
    currentDepth++;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, depth, currentDepth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, currentDepth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, currentDepth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, currentDepth, seen);
    }
  }
  return value;
}
function validateDirectiveName(name) {
  if (isBuiltInDirective(name)) {
    warn$1("Do not use built-in directive ids as custom directive id: " + name);
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      warn$1(`root props passed to app.mount() must be an object.`);
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
        {
          warn$1(
            `app.config cannot be replaced. Modify individual options instead.`
          );
        }
      },
      use(plugin2, ...options) {
        if (installedPlugins.has(plugin2)) {
          warn$1(`Plugin has already been applied to target app.`);
        } else if (plugin2 && isFunction(plugin2.install)) {
          installedPlugins.add(plugin2);
          plugin2.install(app, ...options);
        } else if (isFunction(plugin2)) {
          installedPlugins.add(plugin2);
          plugin2(app, ...options);
        } else {
          warn$1(
            `A plugin must either be a function or an object with an "install" function.`
          );
        }
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          } else {
            warn$1(
              "Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : "")
            );
          }
        }
        return app;
      },
      component(name, component) {
        {
          validateComponentName(name, context.config);
        }
        if (!component) {
          return context.components[name];
        }
        if (context.components[name]) {
          warn$1(`Component "${name}" has already been registered in target app.`);
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        {
          validateDirectiveName(name);
        }
        if (!directive) {
          return context.directives[name];
        }
        if (context.directives[name]) {
          warn$1(`Directive "${name}" has already been registered in target app.`);
        }
        context.directives[name] = directive;
        return app;
      },
      // fixed by xxxxxx
      mount() {
      },
      // fixed by xxxxxx
      unmount() {
      },
      provide(key, value) {
        if (key in context.provides) {
          warn$1(
            `App already provides property with key "${String(key)}". It will be overwritten with the new value.`
          );
        }
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance) {
    {
      warn$1(`provide() can only be used inside setup().`);
    }
  } else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
    if (currentInstance.type.mpType === "app") {
      currentInstance.appContext.app.provide(key, value);
    }
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else {
      warn$1(`injection "${String(key)}" not found.`);
    }
  } else {
    warn$1(`inject() can only be used inside setup() or functional components.`);
  }
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    if (isRootHook(type)) {
      target = target.root;
    }
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  } else {
    const apiName = toHandlerKey(
      (ErrorTypeStrings[type] || type.replace(/^on/, "")).replace(/ hook$/, "")
    );
    warn$1(
      `${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup().`
    );
  }
}
const createHook$1 = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook$1("bm");
const onMounted = createHook$1("m");
const onBeforeUpdate = createHook$1("bu");
const onUpdated = createHook$1("u");
const onBeforeUnmount = createHook$1("bum");
const onUnmounted = createHook$1("um");
const onServerPrefetch = createHook$1("sp");
const onRenderTriggered = createHook$1(
  "rtg"
);
const onRenderTracked = createHook$1(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    // fixed by xxxxxx vue-i18n 在 dev 模式，访问了 $el，故模拟一个假的
    // $el: i => i.vnode.el,
    $el: (i) => i.__$el || (i.__$el = {}),
    $data: (i) => i.data,
    $props: (i) => shallowReadonly(i.props),
    $attrs: (i) => shallowReadonly(i.attrs),
    $slots: (i) => shallowReadonly(i.slots),
    $refs: (i) => shallowReadonly(i.refs),
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      i.effect.dirty = true;
      queueJob(i.update);
    }),
    // $nextTick: i => i.n || (i.n = nextTick.bind(i.proxy!)),// fixed by xxxxxx
    $watch: (i) => instanceWatch.bind(i)
  })
);
const isReservedPrefix = (key) => key === "_" || key === "$";
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key === "__isVue") {
      return true;
    }
    let normalizedProps;
    if (key[0] !== "$") {
      const n2 = accessCache[key];
      if (n2 !== void 0) {
        switch (n2) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      } else if (key === "$slots") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    key.indexOf("__v") !== 0)) {
      if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
        warn$1(
          `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
        );
      } else if (instance === currentRenderingInstance) {
        warn$1(
          `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
        );
      }
    }
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
      warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
      return false;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      warn$1(
        `Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`
      );
      return false;
    } else {
      if (key in instance.appContext.config.globalProperties) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          value
        });
      } else {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
{
  PublicInstanceProxyHandlers.ownKeys = (target) => {
    warn$1(
      `Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`
    );
    return Reflect.ownKeys(target);
  };
}
function createDevRenderContext(instance) {
  const target = {};
  Object.defineProperty(target, `_`, {
    configurable: true,
    enumerable: false,
    get: () => instance
  });
  Object.keys(publicPropertiesMap).forEach((key) => {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => publicPropertiesMap[key](instance),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: NOOP
    });
  });
  return target;
}
function exposePropsOnRenderContext(instance) {
  const {
    ctx,
    propsOptions: [propsOptions]
  } = instance;
  if (propsOptions) {
    Object.keys(propsOptions).forEach((key) => {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => instance.props[key],
        set: NOOP
      });
    });
  }
}
function exposeSetupStateOnRenderContext(instance) {
  const { ctx, setupState } = instance;
  Object.keys(toRaw(setupState)).forEach((key) => {
    if (!setupState.__isScriptSetup) {
      if (isReservedPrefix(key[0])) {
        warn$1(
          `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => setupState[key],
        set: NOOP
      });
    }
  });
}
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
function createDuplicateChecker() {
  const cache = /* @__PURE__ */ Object.create(null);
  return (type, key) => {
    if (cache[key]) {
      warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
    } else {
      cache[key] = type;
    }
  };
}
let shouldCacheAccess = true;
function applyOptions$1(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = createDuplicateChecker();
  {
    const [propsOptions] = instance.propsOptions;
    if (propsOptions) {
      for (const key in propsOptions) {
        checkDuplicateProperties("Props", key);
      }
    }
  }
  function initInjections() {
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties);
    }
  }
  {
    initInjections();
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          Object.defineProperty(ctx, key, {
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          });
        }
        {
          checkDuplicateProperties("Methods", key);
        }
      } else {
        warn$1(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`
        );
      }
    }
  }
  if (dataOptions) {
    if (!isFunction(dataOptions)) {
      warn$1(
        `The data option must be a function. Plain object usage is no longer supported.`
      );
    }
    const data = dataOptions.call(publicThis, publicThis);
    if (isPromise(data)) {
      warn$1(
        `data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`
      );
    }
    if (!isObject(data)) {
      warn$1(`data() should return an object.`);
    } else {
      instance.data = reactive(data);
      {
        for (const key in data) {
          checkDuplicateProperties("Data", key);
          if (!isReservedPrefix(key[0])) {
            Object.defineProperty(ctx, key, {
              configurable: true,
              enumerable: true,
              get: () => data[key],
              set: NOOP
            });
          }
        }
      }
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      if (get2 === NOOP) {
        warn$1(`Computed property "${key}" has no getter.`);
      }
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
        warn$1(
          `Write operation failed: computed property "${key}" is readonly.`
        );
      };
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
      {
        checkDuplicateProperties("Computed", key);
      }
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  function initProvides() {
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
  }
  {
    initProvides();
  }
  {
    if (created) {
      callHook$1(created, instance, "c");
    }
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
  if (instance.ctx.$onApplyOptions) {
    instance.ctx.$onApplyOptions(options, instance, publicThis);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
    {
      checkDuplicateProperties("Inject", key);
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    } else {
      warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      } else {
        warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
      }
    }
  } else {
    warn$1(`Invalid watch option: "${key}"`, raw);
  }
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m2) => mergeOptions(resolved, m2, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m2) => mergeOptions(to, m2, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") {
      warn$1(
        `"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`
      );
    } else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray$1,
  created: mergeAsArray$1,
  beforeMount: mergeAsArray$1,
  mounted: mergeAsArray$1,
  beforeUpdate: mergeAsArray$1,
  updated: mergeAsArray$1,
  beforeDestroy: mergeAsArray$1,
  beforeUnmount: mergeAsArray$1,
  destroyed: mergeAsArray$1,
  unmounted: mergeAsArray$1,
  activated: mergeAsArray$1,
  deactivated: mergeAsArray$1,
  errorCaptured: mergeAsArray$1,
  serverPrefetch: mergeAsArray$1,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray$1(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray$1(to[key], from[key]);
  }
  return merged;
}
function initProps$1(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function isInHmrContext(instance) {
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !isInHmrContext() && (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue$1(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue$1(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
  {
    validateProps(rawProps || {}, props, instance);
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue$1(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue$1(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      if (!isString(raw[i])) {
        warn$1(`props must be strings when using array syntax.`, raw[i]);
      }
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    if (!isObject(raw)) {
      warn$1(`invalid props options`, raw);
    }
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  } else {
    warn$1(`Invalid prop name: "${key}" is a reserved property.`);
  }
  return false;
}
function getType$1(ctor) {
  if (ctor === null) {
    return "null";
  }
  if (typeof ctor === "function") {
    return ctor.name || "";
  } else if (typeof ctor === "object") {
    const name = ctor.constructor && ctor.constructor.name;
    return name || "";
  }
  return "";
}
function isSameType(a, b) {
  return getType$1(a) === getType$1(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t2) => isSameType(t2, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
function validateProps(rawProps, props, instance) {
  const resolvedValues = toRaw(props);
  const options = instance.propsOptions[0];
  for (const key in options) {
    let opt = options[key];
    if (opt == null)
      continue;
    validateProp$1(
      key,
      resolvedValues[key],
      opt,
      shallowReadonly(resolvedValues),
      !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
    );
  }
}
function validateProp$1(name, value, prop, props, isAbsent) {
  const { type, required, validator, skipCheck } = prop;
  if (required && isAbsent) {
    warn$1('Missing required prop: "' + name + '"');
    return;
  }
  if (value == null && !required) {
    return;
  }
  if (type != null && type !== true && !skipCheck) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType$1(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      warn$1(getInvalidTypeMessage$1(name, value, expectedTypes));
      return;
    }
  }
  if (validator && !validator(value, props)) {
    warn$1('Invalid prop: custom validator check failed for prop "' + name + '".');
  }
}
const isSimpleType$1 = /* @__PURE__ */ makeMap(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function assertType$1(value, type) {
  let valid;
  const expectedType = getType$1(type);
  if (isSimpleType$1(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else if (expectedType === "null") {
    valid = value === null;
  } else {
    valid = value instanceof type;
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage$1(name, value, expectedTypes) {
  if (expectedTypes.length === 0) {
    return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
  }
  let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue$1(value, expectedType);
  const receivedValue = styleValue$1(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable$1(expectedType) && !isBoolean$1(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable$1(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function styleValue$1(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable$1(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean$1(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
let supported;
let perf;
function startMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    perf.mark(`vue-${type}-${instance.uid}`);
  }
  {
    devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function endMeasure(instance, type) {
  if (instance.appContext.config.performance && isSupported()) {
    const startTag = `vue-${type}-${instance.uid}`;
    const endTag = startTag + `:end`;
    perf.mark(endTag);
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    );
    perf.clearMarks(startTag);
    perf.clearMarks(endTag);
  }
  {
    devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
  }
}
function isSupported() {
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else {
    supported = false;
  }
  return supported;
}
const queuePostRenderEffect$1 = queuePostFlushCb;
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null,
    // fixed by xxxxxx 用于存储uni-app的元素缓存
    $uniElements: /* @__PURE__ */ new Map(),
    $templateUniElementRefs: [],
    $templateUniElementStyles: {},
    $eS: {}
  };
  {
    instance.ctx = createDevRenderContext(instance);
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  internalSetCurrentInstance = (i) => {
    currentInstance = i;
  };
  setInSSRSetupState = (v) => {
    isInSSRComponentSetup = v;
  };
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
  if (isBuiltInTag(name) || isNativeTag(name)) {
    warn$1(
      "Do not use built-in or reserved HTML elements as component id: " + name
    );
  }
}
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isSSR && setInSSRSetupState(isSSR);
  const {
    props
    /*, children*/
  } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps$1(instance, props, isStateful, isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component2 = instance.type;
  {
    if (Component2.name) {
      validateComponentName(Component2.name, instance.appContext.config);
    }
    if (Component2.components) {
      const names = Object.keys(Component2.components);
      for (let i = 0; i < names.length; i++) {
        validateComponentName(names[i], instance.appContext.config);
      }
    }
    if (Component2.directives) {
      const names = Object.keys(Component2.directives);
      for (let i = 0; i < names.length; i++) {
        validateDirectiveName(names[i]);
      }
    }
    if (Component2.compilerOptions && isRuntimeOnly()) {
      warn$1(
        `"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`
      );
    }
  }
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  {
    exposePropsOnRenderContext(instance);
  }
  const { setup } = Component2;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        shallowReadonly(instance.props),
        setupContext
      ]
    );
    resetTracking();
    reset();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      {
        warn$1(
          `setup() returned a Promise, but the version of Vue you are using does not support it yet.`
        );
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    if (isVNode(setupResult)) {
      warn$1(
        `setup() should not return VNodes directly - return a render function instead.`
      );
    }
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
    {
      exposeSetupStateOnRenderContext(instance);
    }
  } else if (setupResult !== void 0) {
    warn$1(
      `setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`
    );
  }
  finishComponentSetup(instance, isSSR);
}
let compile;
const isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component2 = instance.type;
  if (!instance.render) {
    instance.render = Component2.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions$1(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
  if (!Component2.render && instance.render === NOOP && !isSSR) {
    if (Component2.template) {
      warn$1(
        `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
      );
    } else {
      warn$1(`Component is missing template or render function.`);
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn$1(`setupContext.attrs is readonly.`);
        return false;
      }
    }
  ));
}
function getSlotsProxy(instance) {
  return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
    get(target, key) {
      track(instance, "get", "$slots");
      return target[key];
    }
  }));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    {
      if (instance.exposed) {
        warn$1(`expose() should be called only once per setup().`);
      }
      if (exposed != null) {
        let exposedType = typeof exposed;
        if (exposedType === "object") {
          if (isArray(exposed)) {
            exposedType = "array";
          } else if (isRef(exposed)) {
            exposedType = "ref";
          }
        }
        if (exposedType !== "object") {
          warn$1(
            `expose() should be passed a plain object, received ${exposedType}.`
          );
        }
      }
    }
    instance.exposed = exposed || {};
  };
  {
    return Object.freeze({
      get attrs() {
        return getAttrsProxy(instance);
      },
      get slots() {
        return getSlotsProxy(instance);
      },
      get emit() {
        return (event, ...args) => instance.emit(event, ...args);
      },
      expose
    });
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        return instance.proxy[key];
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component2, includeInferred = true) {
  return isFunction(Component2) ? Component2.displayName || Component2.name : Component2.name || includeInferred && Component2.__name;
}
function formatComponentName(instance, Component2, isRoot = false) {
  let name = getComponentName(Component2);
  if (!name && Component2.__file) {
    const match = Component2.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component2) {
          return key;
        }
      }
    };
    name = inferFromRegistry(
      instance.components || instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
const computed = (getterOrOptions, debugOptions) => {
  const c2 = computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  {
    const i = getCurrentInstance();
    if (i && i.appContext.config.warnRecursiveComputed) {
      c2._warnRecursive = true;
    }
  }
  return c2;
};
const version = "3.4.21";
const warn = warn$1;
function unwrapper(target) {
  return unref(target);
}
const ARRAYTYPE = "[object Array]";
const OBJECTTYPE = "[object Object]";
function diff(current, pre) {
  const result = {};
  syncKeys(current, pre);
  _diff(current, pre, "", result);
  return result;
}
function syncKeys(current, pre) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    for (let key in pre) {
      const currentValue = current[key];
      if (currentValue === void 0) {
        current[key] = null;
      } else {
        syncKeys(currentValue, pre[key]);
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item, index2) => {
        syncKeys(current[index2], item);
      });
    }
  }
}
function _diff(current, pre, path, result) {
  current = unwrapper(current);
  if (current === pre)
    return;
  const rootCurrentType = toTypeString(current);
  const rootPreType = toTypeString(pre);
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current);
    } else {
      for (let key in current) {
        const currentValue = unwrapper(current[key]);
        const preValue = pre[key];
        const currentType = toTypeString(currentValue);
        const preType = toTypeString(preValue);
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != preValue) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            if (currentValue.length < preValue.length) {
              setResult(
                result,
                (path == "" ? "" : path + ".") + key,
                currentValue
              );
            } else {
              currentValue.forEach((item, index2) => {
                _diff(
                  item,
                  preValue[index2],
                  (path == "" ? "" : path + ".") + key + "[" + index2 + "]",
                  result
                );
              });
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
            setResult(
              result,
              (path == "" ? "" : path + ".") + key,
              currentValue
            );
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == "" ? "" : path + ".") + key + "." + subKey,
                result
              );
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current);
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current);
      } else {
        current.forEach((item, index2) => {
          _diff(item, pre[index2], path + "[" + index2 + "]", result);
        });
      }
    }
  } else {
    setResult(result, path, current);
  }
}
function setResult(result, k, v) {
  result[k] = v;
}
function hasComponentEffect(instance) {
  return queue$1.includes(instance.update);
}
function flushCallbacks(instance) {
  const ctx = instance.ctx;
  const callbacks = ctx.__next_tick_callbacks;
  if (callbacks && callbacks.length) {
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
}
function nextTick(instance, fn) {
  const ctx = instance.ctx;
  if (!ctx.__next_tick_pending && !hasComponentEffect(instance)) {
    return nextTick$1(fn && fn.bind(instance.proxy));
  }
  let _resolve;
  if (!ctx.__next_tick_callbacks) {
    ctx.__next_tick_callbacks = [];
  }
  ctx.__next_tick_callbacks.push(() => {
    if (fn) {
      callWithErrorHandling(
        fn.bind(instance.proxy),
        instance,
        14
      );
    } else if (_resolve) {
      _resolve(instance.proxy);
    }
  });
  return new Promise((resolve2) => {
    _resolve = resolve2;
  });
}
function clone(src, seen) {
  src = unwrapper(src);
  const type = typeof src;
  if (type === "object" && src !== null) {
    let copy = seen.get(src);
    if (typeof copy !== "undefined") {
      return copy;
    }
    if (isArray(src)) {
      const len = src.length;
      copy = new Array(len);
      seen.set(src, copy);
      for (let i = 0; i < len; i++) {
        copy[i] = clone(src[i], seen);
      }
    } else {
      copy = {};
      seen.set(src, copy);
      for (const name in src) {
        if (hasOwn(src, name)) {
          copy[name] = clone(src[name], seen);
        }
      }
    }
    return copy;
  }
  if (type !== "symbol") {
    return src;
  }
}
function deepCopy(src) {
  return clone(src, typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : /* @__PURE__ */ new Map());
}
function getMPInstanceData(instance, keys) {
  const data = instance.data;
  const ret = /* @__PURE__ */ Object.create(null);
  keys.forEach((key) => {
    ret[key] = data[key];
  });
  return ret;
}
function patch(instance, data, oldData) {
  if (!data) {
    return;
  }
  data = deepCopy(data);
  data.$eS = instance.$eS || {};
  const ctx = instance.ctx;
  const mpType = ctx.mpType;
  if (mpType === "page" || mpType === "component") {
    data.r0 = 1;
    const mpInstance = ctx.$scope;
    const keys = Object.keys(data);
    const diffData = diff(data, oldData || getMPInstanceData(mpInstance, keys));
    if (Object.keys(diffData).length) {
      ctx.__next_tick_pending = true;
      mpInstance.setData(diffData, () => {
        ctx.__next_tick_pending = false;
        flushCallbacks(instance);
      });
      flushPreFlushCbs();
    } else {
      flushCallbacks(instance);
    }
  }
}
function initAppConfig(appConfig) {
  appConfig.globalProperties.$nextTick = function $nextTick(fn) {
    return nextTick(this.$, fn);
  };
}
function onApplyOptions(options, instance, publicThis) {
  instance.appContext.config.globalProperties.$applyOptions(
    options,
    instance,
    publicThis
  );
  const computedOptions = options.computed;
  if (computedOptions) {
    const keys = Object.keys(computedOptions);
    if (keys.length) {
      const ctx = instance.ctx;
      if (!ctx.$computedKeys) {
        ctx.$computedKeys = [];
      }
      ctx.$computedKeys.push(...keys);
    }
  }
  delete instance.ctx.$onApplyOptions;
}
function setRef$1(instance, isUnmount = false) {
  const {
    setupState,
    $templateRefs,
    $templateUniElementRefs,
    ctx: { $scope, $mpPlatform }
  } = instance;
  if ($mpPlatform === "mp-alipay") {
    return;
  }
  if (!$scope || !$templateRefs && !$templateUniElementRefs) {
    return;
  }
  if (isUnmount) {
    $templateRefs && $templateRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    $templateUniElementRefs && $templateUniElementRefs.forEach(
      (templateRef) => setTemplateRef(templateRef, null, setupState)
    );
    return;
  }
  const check = $mpPlatform === "mp-baidu" || $mpPlatform === "mp-toutiao";
  const doSetByRefs = (refs) => {
    if (refs.length === 0) {
      return [];
    }
    const mpComponents = (
      // 字节小程序 selectAllComponents 可能返回 null
      // https://github.com/dcloudio/uni-app/issues/3954
      ($scope.selectAllComponents(".r") || []).concat(
        $scope.selectAllComponents(".r-i-f") || []
      )
    );
    return refs.filter((templateRef) => {
      const refValue = findComponentPublicInstance(mpComponents, templateRef.i);
      if (check && refValue === null) {
        return true;
      }
      setTemplateRef(templateRef, refValue, setupState);
      return false;
    });
  };
  const doSet = () => {
    if ($templateRefs) {
      const refs = doSetByRefs($templateRefs);
      if (refs.length && instance.proxy && instance.proxy.$scope) {
        instance.proxy.$scope.setData({ r1: 1 }, () => {
          doSetByRefs(refs);
        });
      }
    }
  };
  if ($templateUniElementRefs && $templateUniElementRefs.length) {
    nextTick(instance, () => {
      $templateUniElementRefs.forEach((templateRef) => {
        if (isArray(templateRef.v)) {
          templateRef.v.forEach((v) => {
            setTemplateRef(templateRef, v, setupState);
          });
        } else {
          setTemplateRef(templateRef, templateRef.v, setupState);
        }
      });
    });
  }
  if ($scope._$setRef) {
    $scope._$setRef(doSet);
  } else {
    nextTick(instance, doSet);
  }
}
function toSkip(value) {
  if (isObject(value)) {
    markRaw(value);
  }
  return value;
}
function findComponentPublicInstance(mpComponents, id) {
  const mpInstance = mpComponents.find(
    (com) => com && (com.properties || com.props).uI === id
  );
  if (mpInstance) {
    const vm = mpInstance.$vm;
    if (vm) {
      return getExposeProxy(vm.$) || vm;
    }
    return toSkip(mpInstance);
  }
  return null;
}
function setTemplateRef({ r: r2, f: f2 }, refValue, setupState) {
  if (isFunction(r2)) {
    r2(refValue, {});
  } else {
    const _isString = isString(r2);
    const _isRef = isRef(r2);
    if (_isString || _isRef) {
      if (f2) {
        if (!_isRef) {
          return;
        }
        if (!isArray(r2.value)) {
          r2.value = [];
        }
        const existing = r2.value;
        if (existing.indexOf(refValue) === -1) {
          existing.push(refValue);
          if (!refValue) {
            return;
          }
          if (refValue.$) {
            onBeforeUnmount(() => remove(existing, refValue), refValue.$);
          }
        }
      } else if (_isString) {
        if (hasOwn(setupState, r2)) {
          setupState[r2] = refValue;
        }
      } else if (isRef(r2)) {
        r2.value = refValue;
      } else {
        warnRef(r2);
      }
    } else {
      warnRef(r2);
    }
  }
}
function warnRef(ref2) {
  warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
}
const queuePostRenderEffect = queuePostFlushCb;
function mountComponent(initialVNode, options) {
  const instance = initialVNode.component = createComponentInstance(initialVNode, options.parentComponent, null);
  {
    instance.ctx.$onApplyOptions = onApplyOptions;
    instance.ctx.$children = [];
  }
  if (options.mpType === "app") {
    instance.render = NOOP;
  }
  if (options.onBeforeSetup) {
    options.onBeforeSetup(instance, options);
  }
  {
    pushWarningContext(initialVNode);
    startMeasure(instance, `mount`);
  }
  {
    startMeasure(instance, `init`);
  }
  setupComponent(instance);
  {
    endMeasure(instance, `init`);
  }
  {
    if (options.parentComponent && instance.proxy) {
      options.parentComponent.ctx.$children.push(getExposeProxy(instance) || instance.proxy);
    }
  }
  setupRenderEffect(instance);
  {
    popWarningContext();
    endMeasure(instance, `mount`);
  }
  return instance.proxy;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
function renderComponentRoot(instance) {
  const {
    type: Component2,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    uid: uid2,
    appContext: {
      app: {
        config: {
          globalProperties: { pruneComponentPropsCache: pruneComponentPropsCache2 }
        }
      }
    },
    inheritAttrs
  } = instance;
  instance.$uniElementIds = /* @__PURE__ */ new Map();
  instance.$templateRefs = [];
  instance.$templateUniElementRefs = [];
  instance.$templateUniElementStyles = {};
  instance.$ei = 0;
  pruneComponentPropsCache2(uid2);
  instance.__counter = instance.__counter === 0 ? 1 : 0;
  let result;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      fallthroughAttrs(inheritAttrs, props, propsOptions, attrs);
      const proxyToUse = withProxy || proxy;
      result = render.call(
        proxyToUse,
        proxyToUse,
        renderCache,
        props,
        setupState,
        data,
        ctx
      );
    } else {
      fallthroughAttrs(
        inheritAttrs,
        props,
        propsOptions,
        Component2.props ? attrs : getFunctionalFallthrough(attrs)
      );
      const render2 = Component2;
      result = render2.length > 1 ? render2(props, { attrs, slots, emit: emit2 }) : render2(
        props,
        null
        /* we know it doesn't need it */
      );
    }
  } catch (err) {
    handleError(err, instance, 1);
    result = false;
  }
  setRef$1(instance);
  setCurrentRenderingInstance(prev);
  return result;
}
function fallthroughAttrs(inheritAttrs, props, propsOptions, fallthroughAttrs2) {
  if (props && fallthroughAttrs2 && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs2).filter(
      (key) => key !== "class" && key !== "style"
    );
    if (!keys.length) {
      return;
    }
    if (propsOptions && keys.some(isModelListener)) {
      keys.forEach((key) => {
        if (!isModelListener(key) || !(key.slice(9) in propsOptions)) {
          props[key] = fallthroughAttrs2[key];
        }
      });
    } else {
      keys.forEach((key) => props[key] = fallthroughAttrs2[key]);
    }
  }
}
const updateComponentPreRender = (instance) => {
  pauseTracking();
  flushPreFlushCbs();
  resetTracking();
};
function componentUpdateScopedSlotsFn() {
  const scopedSlotsData = this.$scopedSlotsData;
  if (!scopedSlotsData || scopedSlotsData.length === 0) {
    return;
  }
  const mpInstance = this.ctx.$scope;
  const oldData = mpInstance.data;
  const diffData = /* @__PURE__ */ Object.create(null);
  scopedSlotsData.forEach(({ path, index: index2, data }) => {
    const oldScopedSlotData = getValueByDataPath(oldData, path);
    const diffPath = isString(index2) ? `${path}.${index2}` : `${path}[${index2}]`;
    if (typeof oldScopedSlotData === "undefined" || typeof oldScopedSlotData[index2] === "undefined") {
      diffData[diffPath] = data;
    } else {
      const diffScopedSlotData = diff(
        data,
        oldScopedSlotData[index2]
      );
      Object.keys(diffScopedSlotData).forEach((name) => {
        diffData[diffPath + "." + name] = diffScopedSlotData[name];
      });
    }
  });
  scopedSlotsData.length = 0;
  if (Object.keys(diffData).length) {
    mpInstance.setData(diffData);
  }
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function setupRenderEffect(instance) {
  const updateScopedSlots = componentUpdateScopedSlotsFn.bind(
    instance
  );
  instance.$updateScopedSlots = () => nextTick$1(() => queueJob(updateScopedSlots));
  const componentUpdateFn = () => {
    if (!instance.isMounted) {
      onBeforeUnmount(() => {
        setRef$1(instance, true);
      }, instance);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      {
        devtoolsComponentAdded(instance);
      }
    } else {
      const { next, bu, u } = instance;
      {
        pushWarningContext(next || instance.vnode);
      }
      toggleRecurse(instance, false);
      updateComponentPreRender();
      if (bu) {
        invokeArrayFns$1(bu);
      }
      toggleRecurse(instance, true);
      {
        startMeasure(instance, `patch`);
      }
      patch(instance, renderComponentRoot(instance));
      {
        endMeasure(instance, `patch`);
      }
      if (u) {
        queuePostRenderEffect(u);
      }
      {
        devtoolsComponentUpdated(instance);
      }
      {
        popWarningContext();
      }
    }
  };
  const effect2 = instance.effect = new ReactiveEffect(
    componentUpdateFn,
    NOOP,
    () => queueJob(update),
    instance.scope
    // track it in component's effect scope
  );
  const update = instance.update = () => {
    if (effect2.dirty) {
      effect2.run();
    }
  };
  update.id = instance.uid;
  toggleRecurse(instance, true);
  {
    effect2.onTrack = instance.rtc ? (e2) => invokeArrayFns$1(instance.rtc, e2) : void 0;
    effect2.onTrigger = instance.rtg ? (e2) => invokeArrayFns$1(instance.rtg, e2) : void 0;
    update.ownerInstance = instance;
  }
  {
    update();
  }
}
function unmountComponent(instance) {
  const { bum, scope, update, um } = instance;
  if (bum) {
    invokeArrayFns$1(bum);
  }
  {
    const parentInstance = instance.parent;
    if (parentInstance) {
      const $children = parentInstance.ctx.$children;
      const target = getExposeProxy(instance) || instance.proxy;
      const index2 = $children.indexOf(target);
      if (index2 > -1) {
        $children.splice(index2, 1);
      }
    }
  }
  scope.stop();
  if (update) {
    update.active = false;
  }
  if (um) {
    queuePostRenderEffect(um);
  }
  queuePostRenderEffect(() => {
    instance.isUnmounted = true;
  });
  {
    devtoolsComponentRemoved(instance);
  }
}
const oldCreateApp = createAppAPI();
function getTarget() {
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  if (typeof my !== "undefined") {
    return my;
  }
}
function createVueApp(rootComponent, rootProps = null) {
  const target = getTarget();
  target.__VUE__ = true;
  {
    setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
  }
  const app = oldCreateApp(rootComponent, rootProps);
  const appContext = app._context;
  initAppConfig(appContext.config);
  const createVNode2 = (initialVNode) => {
    initialVNode.appContext = appContext;
    initialVNode.shapeFlag = 6;
    return initialVNode;
  };
  const createComponent2 = function createComponent22(initialVNode, options) {
    return mountComponent(createVNode2(initialVNode), options);
  };
  const destroyComponent = function destroyComponent2(component) {
    return component && unmountComponent(component.$);
  };
  app.mount = function mount() {
    rootComponent.render = NOOP;
    const instance = mountComponent(
      createVNode2({ type: rootComponent }),
      {
        mpType: "app",
        mpInstance: null,
        parentComponent: null,
        slots: [],
        props: null
      }
    );
    app._instance = instance.$;
    {
      devtoolsInitApp(app, version);
    }
    instance.$app = app;
    instance.$createComponent = createComponent2;
    instance.$destroyComponent = destroyComponent;
    appContext.$appInstance = instance;
    return instance;
  };
  app.unmount = function unmount() {
    warn(`Cannot unmount an app.`);
  };
  return app;
}
function injectLifecycleHook(name, hook, publicThis, instance) {
  if (isFunction(hook)) {
    injectHook(name, hook.bind(publicThis), instance);
  }
}
function initHooks$1(options, instance, publicThis) {
  const mpType = options.mpType || publicThis.$mpType;
  if (!mpType || mpType === "component") {
    return;
  }
  Object.keys(options).forEach((name) => {
    if (isUniLifecycleHook(name, options[name], false)) {
      const hooks = options[name];
      if (isArray(hooks)) {
        hooks.forEach((hook) => injectLifecycleHook(name, hook, publicThis, instance));
      } else {
        injectLifecycleHook(name, hooks, publicThis, instance);
      }
    }
  });
}
function applyOptions$2(options, instance, publicThis) {
  initHooks$1(options, instance, publicThis);
}
function set(target, key, val) {
  return target[key] = val;
}
function $callMethod(method, ...args) {
  const fn = this[method];
  if (fn) {
    return fn(...args);
  }
  console.error(`method ${method} not found`);
  return null;
}
function createErrorHandler(app) {
  const userErrorHandler = app.config.errorHandler;
  return function errorHandler(err, instance, info) {
    if (userErrorHandler) {
      userErrorHandler(err, instance, info);
    }
    const appInstance = app._instance;
    if (!appInstance || !appInstance.proxy) {
      throw err;
    }
    if (appInstance[ON_ERROR]) {
      {
        appInstance.proxy.$callHook(ON_ERROR, err);
      }
    } else {
      logError(err, info, instance ? instance.$.vnode : null, false);
    }
  };
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function initOptionMergeStrategies(optionMergeStrategies) {
  UniLifecycleHooks.forEach((name) => {
    optionMergeStrategies[name] = mergeAsArray;
  });
}
let realAtob;
const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const b64re = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
if (typeof atob !== "function") {
  realAtob = function(str) {
    str = String(str).replace(/[\t\n\f\r ]+/g, "");
    if (!b64re.test(str)) {
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    }
    str += "==".slice(2 - (str.length & 3));
    var bitmap;
    var result = "";
    var r1;
    var r2;
    var i = 0;
    for (; i < str.length; ) {
      bitmap = b64.indexOf(str.charAt(i++)) << 18 | b64.indexOf(str.charAt(i++)) << 12 | (r1 = b64.indexOf(str.charAt(i++))) << 6 | (r2 = b64.indexOf(str.charAt(i++)));
      result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) : r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) : String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
    }
    return result;
  };
} else {
  realAtob = atob;
}
function b64DecodeUnicode(str) {
  return decodeURIComponent(realAtob(str).split("").map(function(c2) {
    return "%" + ("00" + c2.charCodeAt(0).toString(16)).slice(-2);
  }).join(""));
}
function getCurrentUserInfo() {
  const token = index.getStorageSync("uni_id_token") || "";
  const tokenArr = token.split(".");
  if (!token || tokenArr.length !== 3) {
    return {
      uid: null,
      role: [],
      permission: [],
      tokenExpired: 0
    };
  }
  let userInfo;
  try {
    userInfo = JSON.parse(b64DecodeUnicode(tokenArr[1]));
  } catch (error) {
    throw new Error("获取当前用户信息出错，详细错误信息为：" + error.message);
  }
  userInfo.tokenExpired = userInfo.exp * 1e3;
  delete userInfo.exp;
  delete userInfo.iat;
  return userInfo;
}
function uniIdMixin(globalProperties) {
  globalProperties.uniIDHasRole = function(roleId) {
    const { role } = getCurrentUserInfo();
    return role.indexOf(roleId) > -1;
  };
  globalProperties.uniIDHasPermission = function(permissionId) {
    const { permission } = getCurrentUserInfo();
    return this.uniIDHasRole("admin") || permission.indexOf(permissionId) > -1;
  };
  globalProperties.uniIDTokenValid = function() {
    const { tokenExpired } = getCurrentUserInfo();
    return tokenExpired > Date.now();
  };
}
function initApp(app) {
  const appConfig = app.config;
  appConfig.errorHandler = invokeCreateErrorHandler(app, createErrorHandler);
  initOptionMergeStrategies(appConfig.optionMergeStrategies);
  const globalProperties = appConfig.globalProperties;
  {
    uniIdMixin(globalProperties);
  }
  {
    globalProperties.$set = set;
    globalProperties.$applyOptions = applyOptions$2;
    globalProperties.$callMethod = $callMethod;
  }
  {
    index.invokeCreateVueAppHook(app);
  }
}
const propsCaches = /* @__PURE__ */ Object.create(null);
function pruneComponentPropsCache(uid2) {
  delete propsCaches[uid2];
}
function findComponentPropsData(up) {
  if (!up) {
    return;
  }
  const [uid2, propsId] = up.split(",");
  if (!propsCaches[uid2]) {
    return;
  }
  return propsCaches[uid2][parseInt(propsId)];
}
var plugin = {
  install(app) {
    initApp(app);
    app.config.globalProperties.pruneComponentPropsCache = pruneComponentPropsCache;
    const oldMount = app.mount;
    app.mount = function mount(rootContainer) {
      const instance = oldMount.call(app, rootContainer);
      const createApp2 = getCreateApp();
      if (createApp2) {
        createApp2(instance);
      } else {
        if (typeof createMiniProgramApp !== "undefined") {
          createMiniProgramApp(instance);
        }
      }
      return instance;
    };
  }
};
function getCreateApp() {
  const method = "createApp";
  if (typeof global !== "undefined" && typeof global[method] !== "undefined") {
    return global[method];
  } else if (typeof my !== "undefined") {
    return my[method];
  }
}
function stringifyStyle(value) {
  if (isString(value)) {
    return value;
  }
  return stringify(normalizeStyle(value));
}
function stringify(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    ret += `${key.startsWith(`--`) ? key : hyphenate(key)}:${styles[key]};`;
  }
  return ret;
}
function vOn(value, key) {
  const instance = getCurrentInstance();
  const ctx = instance.ctx;
  const extraKey = typeof key !== "undefined" && (ctx.$mpPlatform === "mp-weixin" || ctx.$mpPlatform === "mp-qq" || ctx.$mpPlatform === "mp-xhs") && (isString(key) || typeof key === "number") ? "_" + key : "";
  const name = "e" + instance.$ei++ + extraKey;
  const mpInstance = ctx.$scope;
  if (!value) {
    delete mpInstance[name];
    return name;
  }
  const existingInvoker = mpInstance[name];
  if (existingInvoker) {
    existingInvoker.value = value;
  } else {
    mpInstance[name] = createInvoker(value, instance);
  }
  return name;
}
function createInvoker(initialValue, instance) {
  const invoker = (e2) => {
    patchMPEvent(e2);
    let args = [e2];
    if (instance && instance.ctx.$getTriggerEventDetail) {
      if (typeof e2.detail === "number") {
        e2.detail = instance.ctx.$getTriggerEventDetail(e2.detail);
      }
    }
    if (e2.detail && e2.detail.__args__) {
      args = e2.detail.__args__;
    }
    const eventValue = invoker.value;
    const invoke = () => callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, eventValue), instance, 5, args);
    const eventTarget = e2.target;
    const eventSync = eventTarget ? eventTarget.dataset ? String(eventTarget.dataset.eventsync) === "true" : false : false;
    if (bubbles.includes(e2.type) && !eventSync) {
      setTimeout(invoke);
    } else {
      const res = invoke();
      if (e2.type === "input" && (isArray(res) || isPromise(res))) {
        return;
      }
      return res;
    }
  };
  invoker.value = initialValue;
  return invoker;
}
const bubbles = [
  // touch事件暂不做延迟，否则在 Android 上会影响性能，比如一些拖拽跟手手势等
  // 'touchstart',
  // 'touchmove',
  // 'touchcancel',
  // 'touchend',
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];
function patchMPEvent(event, instance) {
  if (event.type && event.target) {
    event.preventDefault = NOOP;
    event.stopPropagation = NOOP;
    event.stopImmediatePropagation = NOOP;
    if (!hasOwn(event, "detail")) {
      event.detail = {};
    }
    if (hasOwn(event, "markerId")) {
      event.detail = typeof event.detail === "object" ? event.detail : {};
      event.detail.markerId = event.markerId;
    }
    if (isPlainObject(event.detail) && hasOwn(event.detail, "checked") && !hasOwn(event.detail, "value")) {
      event.detail.value = event.detail.checked;
    }
    if (isPlainObject(event.detail)) {
      event.target = extend({}, event.target, event.detail);
    }
  }
}
function patchStopImmediatePropagation(e2, value) {
  if (isArray(value)) {
    const originalStop = e2.stopImmediatePropagation;
    e2.stopImmediatePropagation = () => {
      originalStop && originalStop.call(e2);
      e2._stopped = true;
    };
    return value.map((fn) => (e3) => !e3._stopped && fn(e3));
  } else {
    return value;
  }
}
function vFor(source, renderItem) {
  let ret;
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, i);
    }
  } else if (typeof source === "number") {
    if (!Number.isInteger(source)) {
      warn(`The v-for range expect an integer value but got ${source}.`);
      return [];
    }
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, i);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, i));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function setRef(ref2, id, opts = {}) {
  const { $templateRefs } = getCurrentInstance();
  $templateRefs.push({ i: id, r: ref2, k: opts.k, f: opts.f });
}
const o = (value, key) => vOn(value, key);
const f = (source, renderItem) => vFor(source, renderItem);
const s = (value) => stringifyStyle(value);
const e = (target, ...sources) => extend(target, ...sources);
const n = (value) => normalizeClass(value);
const t = (val) => toDisplayString(val);
const sr = (ref2, id, opts) => setRef(ref2, id, opts);
function createApp$1(rootComponent, rootProps = null) {
  rootComponent && (rootComponent.mpType = "app");
  return createVueApp(rootComponent, rootProps).use(plugin);
}
const createSSRApp = createApp$1;
function validateProtocolFail(name, msg) {
  console.warn(`${name}: ${msg}`);
}
function validateProtocol(name, data, protocol, onFail) {
  if (!onFail) {
    onFail = validateProtocolFail;
  }
  for (const key in protocol) {
    const errMsg = validateProp(key, data[key], protocol[key], !hasOwn(data, key));
    if (isString(errMsg)) {
      onFail(name, errMsg);
    }
  }
}
function validateProtocols(name, args, protocol, onFail) {
  if (!protocol) {
    return;
  }
  if (!isArray(protocol)) {
    return validateProtocol(name, args[0] || /* @__PURE__ */ Object.create(null), protocol, onFail);
  }
  const len = protocol.length;
  const argsLen = args.length;
  for (let i = 0; i < len; i++) {
    const opts = protocol[i];
    const data = /* @__PURE__ */ Object.create(null);
    if (argsLen > i) {
      data[opts.name] = args[i];
    }
    validateProtocol(name, data, { [opts.name]: opts }, onFail);
  }
}
function validateProp(name, value, prop, isAbsent) {
  if (!isPlainObject(prop)) {
    prop = { type: prop };
  }
  const { type, required, validator } = prop;
  if (required && isAbsent) {
    return 'Missing required args: "' + name + '"';
  }
  if (value == null && !required) {
    return;
  }
  if (type != null) {
    let isValid = false;
    const types = isArray(type) ? type : [type];
    const expectedTypes = [];
    for (let i = 0; i < types.length && !isValid; i++) {
      const { valid, expectedType } = assertType(value, types[i]);
      expectedTypes.push(expectedType || "");
      isValid = valid;
    }
    if (!isValid) {
      return getInvalidTypeMessage(name, value, expectedTypes);
    }
  }
  if (validator) {
    return validator(value);
  }
}
const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol");
function assertType(value, type) {
  let valid;
  const expectedType = getType(type);
  if (isSimpleType(expectedType)) {
    const t2 = typeof value;
    valid = t2 === expectedType.toLowerCase();
    if (!valid && t2 === "object") {
      valid = value instanceof type;
    }
  } else if (expectedType === "Object") {
    valid = isObject(value);
  } else if (expectedType === "Array") {
    valid = isArray(value);
  } else {
    {
      valid = value instanceof type;
    }
  }
  return {
    valid,
    expectedType
  };
}
function getInvalidTypeMessage(name, value, expectedTypes) {
  let message = `Invalid args: type check failed for args "${name}". Expected ${expectedTypes.map(capitalize).join(", ")}`;
  const expectedType = expectedTypes[0];
  const receivedType = toRawType(value);
  const expectedValue = styleValue(value, expectedType);
  const receivedValue = styleValue(value, receivedType);
  if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
    message += ` with value ${expectedValue}`;
  }
  message += `, got ${receivedType} `;
  if (isExplicable(receivedType)) {
    message += `with value ${receivedValue}.`;
  }
  return message;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : "";
}
function styleValue(value, type) {
  if (type === "String") {
    return `"${value}"`;
  } else if (type === "Number") {
    return `${Number(value)}`;
  } else {
    return `${value}`;
  }
}
function isExplicable(type) {
  const explicitTypes = ["string", "number", "boolean"];
  return explicitTypes.some((elem) => type.toLowerCase() === elem);
}
function isBoolean(...args) {
  return args.some((elem) => elem.toLowerCase() === "boolean");
}
function tryCatch(fn) {
  return function() {
    try {
      return fn.apply(fn, arguments);
    } catch (e2) {
      console.error(e2);
    }
  };
}
let invokeCallbackId = 1;
const invokeCallbacks = {};
function addInvokeCallback(id, name, callback, keepAlive = false) {
  invokeCallbacks[id] = {
    name,
    keepAlive,
    callback
  };
  return id;
}
function invokeCallback(id, res, extras) {
  if (typeof id === "number") {
    const opts = invokeCallbacks[id];
    if (opts) {
      if (!opts.keepAlive) {
        delete invokeCallbacks[id];
      }
      return opts.callback(res, extras);
    }
  }
  return res;
}
const API_SUCCESS = "success";
const API_FAIL = "fail";
const API_COMPLETE = "complete";
function getApiCallbacks(args) {
  const apiCallbacks = {};
  for (const name in args) {
    const fn = args[name];
    if (isFunction(fn)) {
      apiCallbacks[name] = tryCatch(fn);
      delete args[name];
    }
  }
  return apiCallbacks;
}
function normalizeErrMsg(errMsg, name) {
  if (!errMsg || errMsg.indexOf(":fail") === -1) {
    return name + ":ok";
  }
  return name + errMsg.substring(errMsg.indexOf(":fail"));
}
function createAsyncApiCallback(name, args = {}, { beforeAll, beforeSuccess } = {}) {
  if (!isPlainObject(args)) {
    args = {};
  }
  const { success, fail, complete } = getApiCallbacks(args);
  const hasSuccess = isFunction(success);
  const hasFail = isFunction(fail);
  const hasComplete = isFunction(complete);
  const callbackId = invokeCallbackId++;
  addInvokeCallback(callbackId, name, (res) => {
    res = res || {};
    res.errMsg = normalizeErrMsg(res.errMsg, name);
    isFunction(beforeAll) && beforeAll(res);
    if (res.errMsg === name + ":ok") {
      isFunction(beforeSuccess) && beforeSuccess(res, args);
      hasSuccess && success(res);
    } else {
      hasFail && fail(res);
    }
    hasComplete && complete(res);
  });
  return callbackId;
}
const HOOK_SUCCESS = "success";
const HOOK_FAIL = "fail";
const HOOK_COMPLETE = "complete";
const globalInterceptors = {};
const scopedInterceptors = {};
function wrapperHook(hook, params) {
  return function(data) {
    return hook(data, params) || data;
  };
}
function queue(hooks, data, params) {
  let promise = false;
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    if (promise) {
      promise = Promise.resolve(wrapperHook(hook, params));
    } else {
      const res = hook(data, params);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then() {
          },
          catch() {
          }
        };
      }
    }
  }
  return promise || {
    then(callback) {
      return callback(data);
    },
    catch() {
    }
  };
}
function wrapperOptions(interceptors2, options = {}) {
  [HOOK_SUCCESS, HOOK_FAIL, HOOK_COMPLETE].forEach((name) => {
    const hooks = interceptors2[name];
    if (!isArray(hooks)) {
      return;
    }
    const oldCallback = options[name];
    options[name] = function callbackInterceptor(res) {
      queue(hooks, res, options).then((res2) => {
        return isFunction(oldCallback) && oldCallback(res2) || res2;
      });
    };
  });
  return options;
}
function wrapperReturnValue(method, returnValue) {
  const returnValueHooks = [];
  if (isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push(...globalInterceptors.returnValue);
  }
  const interceptor = scopedInterceptors[method];
  if (interceptor && isArray(interceptor.returnValue)) {
    returnValueHooks.push(...interceptor.returnValue);
  }
  returnValueHooks.forEach((hook) => {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}
function getApiInterceptorHooks(method) {
  const interceptor = /* @__PURE__ */ Object.create(null);
  Object.keys(globalInterceptors).forEach((hook) => {
    if (hook !== "returnValue") {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  const scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach((hook) => {
      if (hook !== "returnValue") {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}
function invokeApi(method, api, options, params) {
  const interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (isArray(interceptor.invoke)) {
      const res = queue(interceptor.invoke, options);
      return res.then((options2) => {
        return api(wrapperOptions(getApiInterceptorHooks(method), options2), ...params);
      });
    } else {
      return api(wrapperOptions(interceptor, options), ...params);
    }
  }
  return api(options, ...params);
}
function hasCallback(args) {
  if (isPlainObject(args) && [API_SUCCESS, API_FAIL, API_COMPLETE].find((cb) => isFunction(args[cb]))) {
    return true;
  }
  return false;
}
function handlePromise(promise) {
  return promise;
}
function promisify$1(name, fn) {
  return (args = {}, ...rest) => {
    if (hasCallback(args)) {
      return wrapperReturnValue(name, invokeApi(name, fn, args, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject) => {
      invokeApi(name, fn, extend(args, { success: resolve, fail: reject }), rest);
    })));
  };
}
function formatApiArgs(args, options) {
  args[0];
  {
    return;
  }
}
function invokeSuccess(id, name, res) {
  const result = {
    errMsg: name + ":ok"
  };
  return invokeCallback(id, extend(res || {}, result));
}
function invokeFail(id, name, errMsg, errRes = {}) {
  const errMsgPrefix = name + ":fail";
  let apiErrMsg = "";
  if (!errMsg) {
    apiErrMsg = errMsgPrefix;
  } else if (errMsg.indexOf(errMsgPrefix) === 0) {
    apiErrMsg = errMsg;
  } else {
    apiErrMsg = errMsgPrefix + " " + errMsg;
  }
  {
    delete errRes.errCode;
  }
  let res = extend({ errMsg: apiErrMsg }, errRes);
  return invokeCallback(id, res);
}
function beforeInvokeApi(name, args, protocol, options) {
  {
    validateProtocols(name, args, protocol);
  }
  const errMsg = formatApiArgs(args);
  if (errMsg) {
    return errMsg;
  }
}
function parseErrMsg(errMsg) {
  if (!errMsg || isString(errMsg)) {
    return errMsg;
  }
  if (errMsg.stack) {
    if (typeof globalThis === "undefined" || !globalThis.harmonyChannel) {
      console.error(errMsg.message + "\n" + errMsg.stack);
    }
    return errMsg.message;
  }
  return errMsg;
}
function wrapperTaskApi(name, fn, protocol, options) {
  return (args) => {
    const id = createAsyncApiCallback(name, args, options);
    const errMsg = beforeInvokeApi(name, [args], protocol);
    if (errMsg) {
      return invokeFail(id, name, errMsg);
    }
    return fn(args, {
      resolve: (res) => invokeSuccess(id, name, res),
      reject: (errMsg2, errRes) => invokeFail(id, name, parseErrMsg(errMsg2), errRes)
    });
  };
}
function wrapperSyncApi(name, fn, protocol, options) {
  return (...args) => {
    const errMsg = beforeInvokeApi(name, args, protocol);
    if (errMsg) {
      throw new Error(errMsg);
    }
    return fn.apply(null, args);
  };
}
function wrapperAsyncApi(name, fn, protocol, options) {
  return wrapperTaskApi(name, fn, protocol, options);
}
function defineSyncApi(name, fn, protocol, options) {
  return wrapperSyncApi(name, fn, protocol);
}
function defineAsyncApi(name, fn, protocol, options) {
  return promisify$1(name, wrapperAsyncApi(name, fn, protocol, options));
}
const API_UPX2PX = "upx2px";
const Upx2pxProtocol = [
  {
    name: "upx",
    type: [Number, String],
    required: true
  }
];
const EPS = 1e-4;
const BASE_DEVICE_WIDTH = 750;
let isIOS = false;
let deviceWidth = 0;
let deviceDPR = 0;
function checkDeviceWidth() {
  const { windowWidth, pixelRatio, platform } = Object.assign({}, wx.getWindowInfo(), {
    platform: wx.getDeviceInfo().platform
  });
  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === "ios";
}
const upx2px = defineSyncApi(API_UPX2PX, (number, newDeviceWidth) => {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }
  number = Number(number);
  if (number === 0) {
    return 0;
  }
  let width = newDeviceWidth || deviceWidth;
  let result = number / BASE_DEVICE_WIDTH * width;
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      result = 1;
    } else {
      result = 0.5;
    }
  }
  return number < 0 ? -result : result;
}, Upx2pxProtocol);
function __f__(type, filename, ...args) {
  if (filename) {
    args.push(filename);
  }
  console[type].apply(console, args);
}
const API_ADD_INTERCEPTOR = "addInterceptor";
const API_REMOVE_INTERCEPTOR = "removeInterceptor";
const AddInterceptorProtocol = [
  {
    name: "method",
    type: [String, Object],
    required: true
  }
];
const RemoveInterceptorProtocol = AddInterceptorProtocol;
function mergeInterceptorHook(interceptors2, interceptor) {
  Object.keys(interceptor).forEach((hook) => {
    if (isFunction(interceptor[hook])) {
      interceptors2[hook] = mergeHook(interceptors2[hook], interceptor[hook]);
    }
  });
}
function removeInterceptorHook(interceptors2, interceptor) {
  if (!interceptors2 || !interceptor) {
    return;
  }
  Object.keys(interceptor).forEach((name) => {
    const hooks = interceptors2[name];
    const hook = interceptor[name];
    if (isArray(hooks) && isFunction(hook)) {
      remove(hooks, hook);
    }
  });
}
function mergeHook(parentVal, childVal) {
  const res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [childVal] : parentVal;
  return res ? dedupeHooks(res) : res;
}
function dedupeHooks(hooks) {
  const res = [];
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}
const addInterceptor = defineSyncApi(API_ADD_INTERCEPTOR, (method, interceptor) => {
  if (isString(method) && isPlainObject(interceptor)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), interceptor);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}, AddInterceptorProtocol);
const removeInterceptor = defineSyncApi(API_REMOVE_INTERCEPTOR, (method, interceptor) => {
  if (isString(method)) {
    if (isPlainObject(interceptor)) {
      removeInterceptorHook(scopedInterceptors[method], interceptor);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}, RemoveInterceptorProtocol);
const interceptors = {};
const API_ON = "$on";
const OnProtocol = [
  {
    name: "event",
    type: String,
    required: true
  },
  {
    name: "callback",
    type: Function,
    required: true
  }
];
const API_ONCE = "$once";
const OnceProtocol = OnProtocol;
const API_OFF = "$off";
const OffProtocol = [
  {
    name: "event",
    type: [String, Array]
  },
  {
    name: "callback",
    type: [Function, Number]
  }
];
const API_EMIT = "$emit";
const EmitProtocol = [
  {
    name: "event",
    type: String,
    required: true
  }
];
class EventBus {
  constructor() {
    this.$emitter = new E$1();
  }
  on(name, callback) {
    return this.$emitter.on(name, callback);
  }
  once(name, callback) {
    return this.$emitter.once(name, callback);
  }
  off(name, callback) {
    if (!name) {
      this.$emitter.e = {};
      return;
    }
    this.$emitter.off(name, callback);
  }
  emit(name, ...args) {
    this.$emitter.emit(name, ...args);
  }
}
const eventBus = new EventBus();
const $on = defineSyncApi(API_ON, (name, callback) => {
  eventBus.on(name, callback);
  return () => eventBus.off(name, callback);
}, OnProtocol);
const $once = defineSyncApi(API_ONCE, (name, callback) => {
  eventBus.once(name, callback);
  return () => eventBus.off(name, callback);
}, OnceProtocol);
const $off = defineSyncApi(API_OFF, (name, callback) => {
  if (!isArray(name))
    name = name ? [name] : [];
  name.forEach((n2) => eventBus.off(n2, callback));
}, OffProtocol);
const $emit = defineSyncApi(API_EMIT, (name, ...args) => {
  eventBus.emit(name, ...args);
}, EmitProtocol);
let cid;
let cidErrMsg;
let enabled;
function normalizePushMessage(message) {
  try {
    return JSON.parse(message);
  } catch (e2) {
  }
  return message;
}
function invokePushCallback(args) {
  if (args.type === "enabled") {
    enabled = true;
  } else if (args.type === "clientId") {
    cid = args.cid;
    cidErrMsg = args.errMsg;
    invokeGetPushCidCallbacks(cid, args.errMsg);
  } else if (args.type === "pushMsg") {
    const message = {
      type: "receive",
      data: normalizePushMessage(args.message)
    };
    for (let i = 0; i < onPushMessageCallbacks.length; i++) {
      const callback = onPushMessageCallbacks[i];
      callback(message);
      if (message.stopped) {
        break;
      }
    }
  } else if (args.type === "click") {
    onPushMessageCallbacks.forEach((callback) => {
      callback({
        type: "click",
        data: normalizePushMessage(args.message)
      });
    });
  }
}
const getPushCidCallbacks = [];
function invokeGetPushCidCallbacks(cid2, errMsg) {
  getPushCidCallbacks.forEach((callback) => {
    callback(cid2, errMsg);
  });
  getPushCidCallbacks.length = 0;
}
const API_GET_PUSH_CLIENT_ID = "getPushClientId";
const getPushClientId = defineAsyncApi(API_GET_PUSH_CLIENT_ID, (_, { resolve, reject }) => {
  Promise.resolve().then(() => {
    if (typeof enabled === "undefined") {
      enabled = false;
      cid = "";
      cidErrMsg = "uniPush is not enabled";
    }
    getPushCidCallbacks.push((cid2, errMsg) => {
      if (cid2) {
        resolve({ cid: cid2 });
      } else {
        reject(errMsg);
      }
    });
    if (typeof cid !== "undefined") {
      invokeGetPushCidCallbacks(cid, cidErrMsg);
    }
  });
});
const onPushMessageCallbacks = [];
const onPushMessage = (fn) => {
  if (onPushMessageCallbacks.indexOf(fn) === -1) {
    onPushMessageCallbacks.push(fn);
  }
};
const offPushMessage = (fn) => {
  if (!fn) {
    onPushMessageCallbacks.length = 0;
  } else {
    const index2 = onPushMessageCallbacks.indexOf(fn);
    if (index2 > -1) {
      onPushMessageCallbacks.splice(index2, 1);
    }
  }
};
const SYNC_API_RE = /^\$|__f__|getLocale|setLocale|sendNativeEvent|restoreGlobal|requireGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|rpx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64|getDeviceInfo|getAppBaseInfo|getWindowInfo|getSystemSetting|getAppAuthorizeSetting/;
const CONTEXT_API_RE = /^create|Manager$/;
const CONTEXT_API_RE_EXC = ["createBLEConnection"];
const TASK_APIS = ["request", "downloadFile", "uploadFile", "connectSocket"];
const ASYNC_API = ["createBLEConnection"];
const CALLBACK_API_RE = /^on|^off/;
function isContextApi(name) {
  return CONTEXT_API_RE.test(name) && CONTEXT_API_RE_EXC.indexOf(name) === -1;
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name) && ASYNC_API.indexOf(name) === -1;
}
function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== "onPush";
}
function isTaskApi(name) {
  return TASK_APIS.indexOf(name) !== -1;
}
function shouldPromise(name) {
  if (isContextApi(name) || isSyncApi(name) || isCallbackApi(name)) {
    return false;
  }
  return true;
}
if (!Promise.prototype.finally) {
  Promise.prototype.finally = function(onfinally) {
    const promise = this.constructor;
    return this.then((value) => promise.resolve(onfinally && onfinally()).then(() => value), (reason) => promise.resolve(onfinally && onfinally()).then(() => {
      throw reason;
    }));
  };
}
function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  if (!isFunction(api)) {
    return api;
  }
  return function promiseApi(options = {}, ...rest) {
    if (isFunction(options.success) || isFunction(options.fail) || isFunction(options.complete)) {
      return wrapperReturnValue(name, invokeApi(name, api, options, rest));
    }
    return wrapperReturnValue(name, handlePromise(new Promise((resolve, reject) => {
      invokeApi(name, api, extend({}, options, {
        success: resolve,
        fail: reject
      }), rest);
    })));
  };
}
const CALLBACKS = ["success", "fail", "cancel", "complete"];
function initWrapper(protocols2) {
  function processCallback(methodName, method, returnValue) {
    return function(res) {
      return method(processReturnValue(methodName, res, returnValue));
    };
  }
  function processArgs(methodName, fromArgs, argsOption = {}, returnValue = {}, keepFromArgs = false) {
    if (isPlainObject(fromArgs)) {
      const toArgs = keepFromArgs === true ? fromArgs : {};
      if (isFunction(argsOption)) {
        argsOption = argsOption(fromArgs, toArgs) || {};
      }
      for (const key in fromArgs) {
        if (hasOwn(argsOption, key)) {
          let keyOption = argsOption[key];
          if (isFunction(keyOption)) {
            keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
          }
          if (!keyOption) {
            console.warn(`微信小程序 ${methodName} 暂不支持 ${key}`);
          } else if (isString(keyOption)) {
            toArgs[keyOption] = fromArgs[key];
          } else if (isPlainObject(keyOption)) {
            toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
          }
        } else if (CALLBACKS.indexOf(key) !== -1) {
          const callback = fromArgs[key];
          if (isFunction(callback)) {
            toArgs[key] = processCallback(methodName, callback, returnValue);
          }
        } else {
          if (!keepFromArgs && !hasOwn(toArgs, key)) {
            toArgs[key] = fromArgs[key];
          }
        }
      }
      return toArgs;
    } else if (isFunction(fromArgs)) {
      if (isFunction(argsOption)) {
        argsOption(fromArgs, {});
      }
      fromArgs = processCallback(methodName, fromArgs, returnValue);
    }
    return fromArgs;
  }
  function processReturnValue(methodName, res, returnValue, keepReturnValue = false) {
    if (isFunction(protocols2.returnValue)) {
      res = protocols2.returnValue(methodName, res);
    }
    const realKeepReturnValue = keepReturnValue || false;
    return processArgs(methodName, res, returnValue, {}, realKeepReturnValue);
  }
  return function wrapper(methodName, method) {
    const hasProtocol = hasOwn(protocols2, methodName);
    const needWrapper = hasProtocol || isFunction(protocols2.returnValue) || isContextApi(methodName) || isTaskApi(methodName);
    const hasMethod = hasProtocol || isFunction(method);
    if (!hasProtocol && !method) {
      return function() {
        console.error(`微信小程序 暂不支持${methodName}`);
      };
    }
    if (!needWrapper || !hasMethod) {
      return method;
    }
    const protocol = protocols2[methodName];
    return function(arg1, arg2) {
      let options = protocol || {};
      if (isFunction(protocol)) {
        options = protocol(arg1);
      }
      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);
      const args = [arg1];
      if (typeof arg2 !== "undefined") {
        args.push(arg2);
      }
      const returnValue = wx[options.name || methodName].apply(wx, args);
      if (isContextApi(methodName) || isTaskApi(methodName)) {
        if (returnValue && !returnValue.__v_skip) {
          returnValue.__v_skip = true;
        }
      }
      if (isSyncApi(methodName)) {
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  };
}
const getLocale = () => {
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm) {
    return app.$vm.$locale;
  }
  return normalizeLocale(wx.getAppBaseInfo().language) || LOCALE_EN;
};
const setLocale = (locale) => {
  const app = isFunction(getApp) && getApp();
  if (!app) {
    return false;
  }
  const oldLocale = app.$vm.$locale;
  if (oldLocale !== locale) {
    app.$vm.$locale = locale;
    onLocaleChangeCallbacks.forEach((fn) => fn({ locale }));
    return true;
  }
  return false;
};
const onLocaleChangeCallbacks = [];
const onLocaleChange = (fn) => {
  if (onLocaleChangeCallbacks.indexOf(fn) === -1) {
    onLocaleChangeCallbacks.push(fn);
  }
};
if (typeof global !== "undefined") {
  global.getLocale = getLocale;
}
const UUID_KEY = "__DC_STAT_UUID";
let deviceId;
function useDeviceId(global2 = wx) {
  return function addDeviceId(_, toRes) {
    deviceId = deviceId || global2.getStorageSync(UUID_KEY);
    if (!deviceId) {
      deviceId = Date.now() + "" + Math.floor(Math.random() * 1e7);
      wx.setStorage({
        key: UUID_KEY,
        data: deviceId
      });
    }
    toRes.deviceId = deviceId;
  };
}
function addSafeAreaInsets(fromRes, toRes) {
  if (fromRes.safeArea) {
    const safeArea = fromRes.safeArea;
    toRes.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: fromRes.windowWidth - safeArea.right,
      bottom: fromRes.screenHeight - safeArea.bottom
    };
  }
}
function getOSInfo(system, platform) {
  let osName = "";
  let osVersion = "";
  if (platform && false) {
    osName = platform;
    osVersion = system;
  } else {
    osName = system.split(" ")[0] || "";
    osVersion = system.split(" ")[1] || "";
  }
  return {
    osName: osName.toLocaleLowerCase(),
    osVersion
  };
}
function populateParameters(fromRes, toRes) {
  const { brand = "", model = "", system = "", language = "", theme, version: version2, platform, fontSizeSetting, SDKVersion, pixelRatio, deviceOrientation } = fromRes;
  const { osName, osVersion } = getOSInfo(system, platform);
  let hostVersion = version2;
  let deviceType = getGetDeviceType(fromRes, model);
  let deviceBrand = getDeviceBrand(brand);
  let _hostName = getHostName(fromRes);
  let _deviceOrientation = deviceOrientation;
  let _devicePixelRatio = pixelRatio;
  let _SDKVersion = SDKVersion;
  const hostLanguage = (language || "").replace(/_/g, "-");
  const parameters = {
    appId: "__UNI__7040E39",
    appName: "前端小程序",
    appVersion: "1.0.0",
    appVersionCode: "100",
    appLanguage: getAppLanguage(hostLanguage),
    uniCompileVersion: "4.45",
    uniCompilerVersion: "4.45",
    uniRuntimeVersion: "4.45",
    uniPlatform: "mp-weixin",
    deviceBrand,
    deviceModel: model,
    deviceType,
    devicePixelRatio: _devicePixelRatio,
    deviceOrientation: _deviceOrientation,
    osName,
    osVersion,
    hostTheme: theme,
    hostVersion,
    hostLanguage,
    hostName: _hostName,
    hostSDKVersion: _SDKVersion,
    hostFontSizeSetting: fontSizeSetting,
    windowTop: 0,
    windowBottom: 0,
    // TODO
    osLanguage: void 0,
    osTheme: void 0,
    ua: void 0,
    hostPackageName: void 0,
    browserName: void 0,
    browserVersion: void 0,
    isUniAppX: false
  };
  extend(toRes, parameters);
}
function getGetDeviceType(fromRes, model) {
  let deviceType = fromRes.deviceType || "phone";
  {
    const deviceTypeMaps = {
      ipad: "pad",
      windows: "pc",
      mac: "pc"
    };
    const deviceTypeMapsKeys = Object.keys(deviceTypeMaps);
    const _model = model.toLocaleLowerCase();
    for (let index2 = 0; index2 < deviceTypeMapsKeys.length; index2++) {
      const _m = deviceTypeMapsKeys[index2];
      if (_model.indexOf(_m) !== -1) {
        deviceType = deviceTypeMaps[_m];
        break;
      }
    }
  }
  return deviceType;
}
function getDeviceBrand(brand) {
  let deviceBrand = brand;
  if (deviceBrand) {
    deviceBrand = deviceBrand.toLocaleLowerCase();
  }
  return deviceBrand;
}
function getAppLanguage(defaultLanguage) {
  return getLocale ? getLocale() : defaultLanguage;
}
function getHostName(fromRes) {
  const _platform = "WeChat";
  let _hostName = fromRes.hostName || _platform;
  {
    if (fromRes.environment) {
      _hostName = fromRes.environment;
    } else if (fromRes.host && fromRes.host.env) {
      _hostName = fromRes.host.env;
    }
  }
  return _hostName;
}
const getSystemInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    useDeviceId()(fromRes, toRes);
    populateParameters(fromRes, toRes);
  }
};
const getSystemInfoSync = getSystemInfo;
const redirectTo = {};
const previewImage = {
  args(fromArgs, toArgs) {
    let currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    const urls = fromArgs.urls;
    if (!isArray(urls)) {
      return;
    }
    const len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      toArgs.current = urls[currentIndex];
      toArgs.urls = urls.filter((item, index2) => index2 < currentIndex ? item !== urls[currentIndex] : true);
    } else {
      toArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false
    };
  }
};
const showActionSheet = {
  args(fromArgs, toArgs) {
    toArgs.alertText = fromArgs.title;
  }
};
const getDeviceInfo = {
  returnValue: (fromRes, toRes) => {
    const { brand, model, system = "", platform = "" } = fromRes;
    let deviceType = getGetDeviceType(fromRes, model);
    let deviceBrand = getDeviceBrand(brand);
    useDeviceId()(fromRes, toRes);
    const { osName, osVersion } = getOSInfo(system, platform);
    toRes = sortObject(extend(toRes, {
      deviceType,
      deviceBrand,
      deviceModel: model,
      osName,
      osVersion
    }));
  }
};
const getAppBaseInfo = {
  returnValue: (fromRes, toRes) => {
    const { version: version2, language, SDKVersion, theme } = fromRes;
    let _hostName = getHostName(fromRes);
    let hostLanguage = (language || "").replace(/_/g, "-");
    const parameters = {
      hostVersion: version2,
      hostLanguage,
      hostName: _hostName,
      hostSDKVersion: SDKVersion,
      hostTheme: theme,
      appId: "__UNI__7040E39",
      appName: "前端小程序",
      appVersion: "1.0.0",
      appVersionCode: "100",
      appLanguage: getAppLanguage(hostLanguage),
      isUniAppX: false,
      uniPlatform: "mp-weixin",
      uniCompileVersion: "4.45",
      uniCompilerVersion: "4.45",
      uniRuntimeVersion: "4.45"
    };
    extend(toRes, parameters);
  }
};
const getWindowInfo = {
  returnValue: (fromRes, toRes) => {
    addSafeAreaInsets(fromRes, toRes);
    toRes = sortObject(extend(toRes, {
      windowTop: 0,
      windowBottom: 0
    }));
  }
};
const getAppAuthorizeSetting = {
  returnValue: function(fromRes, toRes) {
    const { locationReducedAccuracy } = fromRes;
    toRes.locationAccuracy = "unsupported";
    if (locationReducedAccuracy === true) {
      toRes.locationAccuracy = "reduced";
    } else if (locationReducedAccuracy === false) {
      toRes.locationAccuracy = "full";
    }
  }
};
const onError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        wx.$onErrorHandlers = [];
      }
      wx.$onErrorHandlers.push(fromArgs);
    } else {
      injectHook(ON_ERROR, fromArgs, app.$vm.$);
    }
  }
};
const offError = {
  args(fromArgs) {
    const app = getApp({ allowDefault: true }) || {};
    if (!app.$vm) {
      if (!wx.$onErrorHandlers) {
        return;
      }
      const index2 = wx.$onErrorHandlers.findIndex((fn) => fn === fromArgs);
      if (index2 !== -1) {
        wx.$onErrorHandlers.splice(index2, 1);
      }
    } else if (fromArgs.__weh) {
      const onErrors = app.$vm.$[ON_ERROR];
      if (onErrors) {
        const index2 = onErrors.indexOf(fromArgs.__weh);
        if (index2 > -1) {
          onErrors.splice(index2, 1);
        }
      }
    }
  }
};
const onSocketOpen = {
  args() {
    if (wx.__uni_console__) {
      if (wx.__uni_console_warned__) {
        return;
      }
      wx.__uni_console_warned__ = true;
      console.warn(`开发模式下小程序日志回显会使用 socket 连接，为了避免冲突，建议使用 SocketTask 的方式去管理 WebSocket 或手动关闭日志回显功能。[详情](https://uniapp.dcloud.net.cn/tutorial/run/mp-log.html)`);
    }
  }
};
const onSocketMessage = onSocketOpen;
const baseApis = {
  $on,
  $off,
  $once,
  $emit,
  upx2px,
  rpx2px: upx2px,
  interceptors,
  addInterceptor,
  removeInterceptor,
  onCreateVueApp,
  invokeCreateVueAppHook,
  getLocale,
  setLocale,
  onLocaleChange,
  getPushClientId,
  onPushMessage,
  offPushMessage,
  invokePushCallback,
  __f__
};
function initUni(api, protocols2, platform = wx) {
  const wrapper = initWrapper(protocols2);
  const UniProxyHandlers = {
    get(target, key) {
      if (hasOwn(target, key)) {
        return target[key];
      }
      if (hasOwn(api, key)) {
        return promisify(key, api[key]);
      }
      if (hasOwn(baseApis, key)) {
        return promisify(key, baseApis[key]);
      }
      return promisify(key, wrapper(key, platform[key]));
    }
  };
  return new Proxy({}, UniProxyHandlers);
}
function initGetProvider(providers) {
  return function getProvider2({ service, success, fail, complete }) {
    let res;
    if (providers[service]) {
      res = {
        errMsg: "getProvider:ok",
        service,
        provider: providers[service]
      };
      isFunction(success) && success(res);
    } else {
      res = {
        errMsg: "getProvider:fail:服务[" + service + "]不存在"
      };
      isFunction(fail) && fail(res);
    }
    isFunction(complete) && complete(res);
  };
}
const objectKeys = [
  "qy",
  "env",
  "error",
  "version",
  "lanDebug",
  "cloud",
  "serviceMarket",
  "router",
  "worklet",
  "__webpack_require_UNI_MP_PLUGIN__"
];
const singlePageDisableKey = ["lanDebug", "router", "worklet"];
const launchOption = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : null;
function isWxKey(key) {
  if (launchOption && launchOption.scene === 1154 && singlePageDisableKey.includes(key)) {
    return false;
  }
  return objectKeys.indexOf(key) > -1 || typeof wx[key] === "function";
}
function initWx() {
  const newWx = {};
  for (const key in wx) {
    if (isWxKey(key)) {
      newWx[key] = wx[key];
    }
  }
  if (typeof globalThis !== "undefined" && typeof requireMiniProgram === "undefined") {
    globalThis.wx = newWx;
  }
  return newWx;
}
const mocks$1 = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
const getProvider = initGetProvider({
  oauth: ["weixin"],
  share: ["weixin"],
  payment: ["wxpay"],
  push: ["weixin"]
});
function initComponentMocks(component) {
  const res = /* @__PURE__ */ Object.create(null);
  mocks$1.forEach((name) => {
    res[name] = component[name];
  });
  return res;
}
function createSelectorQuery() {
  const query = wx$2.createSelectorQuery();
  const oldIn = query.in;
  query.in = function newIn(component) {
    return oldIn.call(this, initComponentMocks(component));
  };
  return query;
}
const wx$2 = initWx();
let baseInfo = wx$2.getAppBaseInfo && wx$2.getAppBaseInfo();
if (!baseInfo) {
  baseInfo = wx$2.getSystemInfoSync();
}
const host = baseInfo ? baseInfo.host : null;
const shareVideoMessage = host && host.env === "SAAASDK" ? wx$2.miniapp.shareVideoMessage : wx$2.shareVideoMessage;
var shims = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  createSelectorQuery,
  getProvider,
  shareVideoMessage
});
const compressImage = {
  args(fromArgs, toArgs) {
    if (fromArgs.compressedHeight && !toArgs.compressHeight) {
      toArgs.compressHeight = fromArgs.compressedHeight;
    }
    if (fromArgs.compressedWidth && !toArgs.compressWidth) {
      toArgs.compressWidth = fromArgs.compressedWidth;
    }
  }
};
var protocols = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  compressImage,
  getAppAuthorizeSetting,
  getAppBaseInfo,
  getDeviceInfo,
  getSystemInfo,
  getSystemInfoSync,
  getWindowInfo,
  offError,
  onError,
  onSocketMessage,
  onSocketOpen,
  previewImage,
  redirectTo,
  showActionSheet
});
const wx$1 = initWx();
var index = initUni(shims, protocols, wx$1);
const CONSOLE_TYPES = ["log", "warn", "error", "info", "debug"];
let sendConsole = null;
const messageQueue = [];
function sendConsoleMessages(messages) {
  if (sendConsole == null) {
    messageQueue.push(...messages);
    return;
  }
  sendConsole(JSON.stringify({
    type: "console",
    data: messages
  }));
}
function setSendConsole(value) {
  sendConsole = value;
  if (value != null && messageQueue.length > 0) {
    const messages = messageQueue.slice();
    messageQueue.length = 0;
    sendConsoleMessages(messages);
  }
}
const originalConsole = /* @__PURE__ */ CONSOLE_TYPES.reduce((methods, type) => {
  methods[type] = console[type].bind(console);
  return methods;
}, {});
const atFileRegex = /^at\s+[\w/./-]+:\d+$/;
function rewriteConsole() {
  function wrapConsole(type) {
    return function(...args) {
      const originalArgs = [...args];
      if (originalArgs.length) {
        const maybeAtFile = originalArgs[originalArgs.length - 1];
        if (typeof maybeAtFile === "string" && atFileRegex.test(maybeAtFile)) {
          originalArgs.pop();
        }
      }
      {
        originalConsole[type](...originalArgs);
      }
      sendConsoleMessages([formatMessage(type, args)]);
    };
  }
  if (isConsoleWritable()) {
    CONSOLE_TYPES.forEach((type) => {
      console[type] = wrapConsole(type);
    });
    return function restoreConsole() {
      CONSOLE_TYPES.forEach((type) => {
        console[type] = originalConsole[type];
      });
    };
  } else {
    const oldLog = index.__f__;
    if (oldLog) {
      index.__f__ = function(...args) {
        const [type, filename, ...rest] = args;
        oldLog(type, "", ...rest);
        sendConsoleMessages([formatMessage(type, [...rest, filename])]);
      };
      return function restoreConsole() {
        index.__f__ = oldLog;
      };
    }
  }
  return function restoreConsole() {
  };
}
function isConsoleWritable() {
  const value = console.log;
  const sym = Symbol();
  try {
    console.log = sym;
  } catch (ex) {
    return false;
  }
  const isWritable = console.log === sym;
  console.log = value;
  return isWritable;
}
function formatMessage(type, args) {
  try {
    return {
      type,
      args: formatArgs(args)
    };
  } catch (e2) {
    originalConsole.error(e2);
  }
  return {
    type,
    args: []
  };
}
function formatArgs(args) {
  return args.map((arg) => formatArg(arg));
}
function formatArg(arg, depth = 0) {
  if (depth >= 7) {
    return {
      type: "object",
      value: "[Maximum depth reached]"
    };
  }
  return ARG_FORMATTERS[typeof arg](arg, depth);
}
function formatObject(value, depth) {
  if (value === null) {
    return {
      type: "null"
    };
  }
  if (isComponentPublicInstance(value)) {
    return formatComponentPublicInstance(value, depth);
  }
  if (isComponentInternalInstance(value)) {
    return formatComponentInternalInstance(value, depth);
  }
  if (isUniElement(value)) {
    return formatUniElement(value, depth);
  }
  if (isCSSStyleDeclaration(value)) {
    return formatCSSStyleDeclaration(value, depth);
  }
  if (Array.isArray(value)) {
    return {
      type: "object",
      subType: "array",
      value: {
        properties: value.map((v, i) => formatArrayElement(v, i, depth + 1))
      }
    };
  }
  if (value instanceof Set) {
    return {
      type: "object",
      subType: "set",
      className: "Set",
      description: `Set(${value.size})`,
      value: {
        entries: Array.from(value).map((v) => formatSetEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Map) {
    return {
      type: "object",
      subType: "map",
      className: "Map",
      description: `Map(${value.size})`,
      value: {
        entries: Array.from(value.entries()).map((v) => formatMapEntry(v, depth + 1))
      }
    };
  }
  if (value instanceof Promise) {
    return {
      type: "object",
      subType: "promise",
      value: {
        properties: []
      }
    };
  }
  if (value instanceof RegExp) {
    return {
      type: "object",
      subType: "regexp",
      value: String(value),
      className: "Regexp"
    };
  }
  if (value instanceof Date) {
    return {
      type: "object",
      subType: "date",
      value: String(value),
      className: "Date"
    };
  }
  if (value instanceof Error) {
    return {
      type: "object",
      subType: "error",
      value: value.message || String(value),
      className: value.name || "Error"
    };
  }
  return {
    type: "object",
    value: {
      properties: Object.entries(value).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isComponentPublicInstance(value) {
  return value.$ && isComponentInternalInstance(value.$);
}
function isComponentInternalInstance(value) {
  return value.type && value.uid != null && value.appContext;
}
function formatComponentPublicInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentPublicInstance",
    value: {
      properties: Object.entries(value.$.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function formatComponentInternalInstance(value, depth) {
  return {
    type: "object",
    className: "ComponentInternalInstance",
    value: {
      properties: Object.entries(value.type).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isUniElement(value) {
  return value.style && value.tagName != null && value.nodeName != null;
}
function formatUniElement(value, depth) {
  return {
    type: "object",
    // 非 x 没有 UniElement 的概念
    // className: 'UniElement',
    value: {
      properties: Object.entries(value).filter(([name]) => [
        "id",
        "tagName",
        "nodeName",
        "dataset",
        "offsetTop",
        "offsetLeft",
        "style"
      ].includes(name)).map(([name, value2]) => formatObjectProperty(name, value2, depth + 1))
    }
  };
}
function isCSSStyleDeclaration(value) {
  return typeof value.getPropertyValue === "function" && typeof value.setProperty === "function" && value.$styles;
}
function formatCSSStyleDeclaration(style, depth) {
  return {
    type: "object",
    value: {
      properties: Object.entries(style.$styles).map(([name, value]) => formatObjectProperty(name, value, depth + 1))
    }
  };
}
function formatObjectProperty(name, value, depth) {
  return Object.assign(formatArg(value, depth), {
    name
  });
}
function formatArrayElement(value, index2, depth) {
  return Object.assign(formatArg(value, depth), {
    name: `${index2}`
  });
}
function formatSetEntry(value, depth) {
  return {
    value: formatArg(value, depth)
  };
}
function formatMapEntry(value, depth) {
  return {
    key: formatArg(value[0], depth),
    value: formatArg(value[1], depth)
  };
}
const ARG_FORMATTERS = {
  function(value) {
    return {
      type: "function",
      value: `function ${value.name}() {}`
    };
  },
  undefined() {
    return {
      type: "undefined"
    };
  },
  object(value, depth) {
    return formatObject(value, depth);
  },
  boolean(value) {
    return {
      type: "boolean",
      value: String(value)
    };
  },
  number(value) {
    return {
      type: "number",
      value: String(value)
    };
  },
  bigint(value) {
    return {
      type: "bigint",
      value: String(value)
    };
  },
  string(value) {
    return {
      type: "string",
      value
    };
  },
  symbol(value) {
    return {
      type: "symbol",
      value: value.description
    };
  }
};
function initRuntimeSocket(hosts, port, id) {
  if (!hosts || !port || !id)
    return Promise.resolve(null);
  return hosts.split(",").reduce((promise, host2) => {
    return promise.then((socket) => {
      if (socket)
        return socket;
      return tryConnectSocket(host2, port, id);
    });
  }, Promise.resolve(null));
}
const SOCKET_TIMEOUT = 500;
function tryConnectSocket(host2, port, id) {
  return new Promise((resolve, reject) => {
    const socket = index.connectSocket({
      url: `ws://${host2}:${port}/${id}`,
      // 支付宝小程序 是否开启多实例
      multiple: true,
      fail() {
        resolve(null);
      }
    });
    const timer = setTimeout(() => {
      socket.close({
        code: 1006,
        reason: "connect timeout"
      });
      resolve(null);
    }, SOCKET_TIMEOUT);
    socket.onOpen((e2) => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.onClose((e2) => {
      clearTimeout(timer);
      resolve(null);
    });
    socket.onError((e2) => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}
let sendError = null;
const errorQueue = /* @__PURE__ */ new Set();
function sendErrorMessages(errors) {
  if (sendError == null) {
    errors.forEach((error) => {
      errorQueue.add(error);
    });
    return;
  }
  sendError(JSON.stringify({
    type: "error",
    data: errors.map((err) => {
      const isPromiseRejection = err && "promise" in err && "reason" in err;
      const prefix = isPromiseRejection ? "UnhandledPromiseRejection: " : "";
      if (isPromiseRejection) {
        err = err.reason;
      }
      if (err instanceof Error && err.stack) {
        return prefix + err.stack;
      }
      if (typeof err === "object" && err !== null) {
        try {
          return prefix + JSON.stringify(err);
        } catch (err2) {
          return prefix + String(err2);
        }
      }
      return prefix + String(err);
    })
  }));
}
function setSendError(value) {
  sendError = value;
  if (value != null && errorQueue.size > 0) {
    const errors = Array.from(errorQueue);
    errorQueue.clear();
    sendErrorMessages(errors);
  }
}
function initOnError() {
  function onError2(error) {
    try {
      if (typeof PromiseRejectionEvent !== "undefined" && error instanceof PromiseRejectionEvent && error.reason instanceof Error && error.reason.message && error.reason.message.includes(`Cannot create property 'errMsg' on string 'taskId`)) {
        return;
      }
      if (true) {
        originalConsole.error(error);
      }
      sendErrorMessages([error]);
    } catch (err) {
      originalConsole.error(err);
    }
  }
  if (typeof index.onError === "function") {
    index.onError(onError2);
  }
  if (typeof index.onUnhandledRejection === "function") {
    index.onUnhandledRejection(onError2);
  }
  return function offError2() {
    if (typeof index.offError === "function") {
      index.offError(onError2);
    }
    if (typeof index.offUnhandledRejection === "function") {
      index.offUnhandledRejection(onError2);
    }
  };
}
function initRuntimeSocketService() {
  const hosts = "127.0.0.1,172.16.8.160,10.211.55.2,10.37.129.2";
  const port = "8090";
  const id = "mp-weixin_KAoNXT";
  const lazy = typeof swan !== "undefined";
  let restoreError = lazy ? () => {
  } : initOnError();
  let restoreConsole = lazy ? () => {
  } : rewriteConsole();
  return Promise.resolve().then(() => {
    if (lazy) {
      restoreError = initOnError();
      restoreConsole = rewriteConsole();
    }
    return initRuntimeSocket(hosts, port, id).then((socket) => {
      if (!socket) {
        restoreError();
        restoreConsole();
        originalConsole.error(wrapError("开发模式下日志通道建立 socket 连接失败。"));
        originalConsole.error(wrapError("如果是小程序平台，请勾选不校验合法域名配置。"));
        originalConsole.error(wrapError("如果是运行到真机，请确认手机与电脑处于同一网络。"));
        return false;
      }
      initMiniProgramGlobalFlag();
      socket.onClose(() => {
        originalConsole.error(wrapError("开发模式下日志通道 socket 连接关闭，请在 HBuilderX 中重新运行。"));
        restoreError();
        restoreConsole();
      });
      setSendConsole((data) => {
        socket.send({
          data
        });
      });
      setSendError((data) => {
        socket.send({
          data
        });
      });
      return true;
    });
  });
}
const ERROR_CHAR = "‌";
function wrapError(error) {
  return `${ERROR_CHAR}${error}${ERROR_CHAR}`;
}
function initMiniProgramGlobalFlag() {
  if (typeof wx$1 !== "undefined") {
    wx$1.__uni_console__ = true;
  } else if (typeof my !== "undefined") {
    my.__uni_console__ = true;
  } else if (typeof tt !== "undefined") {
    tt.__uni_console__ = true;
  } else if (typeof swan !== "undefined") {
    swan.__uni_console__ = true;
  } else if (typeof qq !== "undefined") {
    qq.__uni_console__ = true;
  } else if (typeof ks !== "undefined") {
    ks.__uni_console__ = true;
  } else if (typeof jd !== "undefined") {
    jd.__uni_console__ = true;
  } else if (typeof xhs !== "undefined") {
    xhs.__uni_console__ = true;
  } else if (typeof has !== "undefined") {
    has.__uni_console__ = true;
  } else if (typeof qa !== "undefined") {
    qa.__uni_console__ = true;
  }
}
initRuntimeSocketService();
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
function initVueIds(vueIds, mpInstance) {
  if (!vueIds) {
    return;
  }
  const ids = vueIds.split(",");
  const len = ids.length;
  if (len === 1) {
    mpInstance._$vueId = ids[0];
  } else if (len === 2) {
    mpInstance._$vueId = ids[0];
    mpInstance._$vuePid = ids[1];
  }
}
const EXTRAS = ["externalClasses"];
function initExtraOptions(miniProgramComponentOptions, vueOptions) {
  EXTRAS.forEach((name) => {
    if (hasOwn(vueOptions, name)) {
      miniProgramComponentOptions[name] = vueOptions[name];
    }
  });
}
const WORKLET_RE = /_(.*)_worklet_factory_/;
function initWorkletMethods(mpMethods, vueMethods) {
  if (vueMethods) {
    Object.keys(vueMethods).forEach((name) => {
      const matches = name.match(WORKLET_RE);
      if (matches) {
        const workletName = matches[1];
        mpMethods[name] = vueMethods[name];
        mpMethods[workletName] = vueMethods[workletName];
      }
    });
  }
}
function initWxsCallMethods(methods, wxsCallMethods) {
  if (!isArray(wxsCallMethods)) {
    return;
  }
  wxsCallMethods.forEach((callMethod) => {
    methods[callMethod] = function(args) {
      return this.$vm[callMethod](args);
    };
  });
}
function selectAllComponents(mpInstance, selector, $refs) {
  const components = mpInstance.selectAllComponents(selector);
  components.forEach((component) => {
    const ref2 = component.properties.uR;
    $refs[ref2] = component.$vm || component;
  });
}
function initRefs(instance, mpInstance) {
  Object.defineProperty(instance, "refs", {
    get() {
      const $refs = {};
      selectAllComponents(mpInstance, ".r", $refs);
      const forComponents = mpInstance.selectAllComponents(".r-i-f");
      forComponents.forEach((component) => {
        const ref2 = component.properties.uR;
        if (!ref2) {
          return;
        }
        if (!$refs[ref2]) {
          $refs[ref2] = [];
        }
        $refs[ref2].push(component.$vm || component);
      });
      return $refs;
    }
  });
}
function findVmByVueId(instance, vuePid) {
  const $children = instance.$children;
  for (let i = $children.length - 1; i >= 0; i--) {
    const childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  let parentVm;
  for (let i = $children.length - 1; i >= 0; i--) {
    parentVm = findVmByVueId($children[i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}
const MP_METHODS = [
  "createSelectorQuery",
  "createIntersectionObserver",
  "selectAllComponents",
  "selectComponent"
];
function createEmitFn(oldEmit, ctx) {
  return function emit2(event, ...args) {
    const scope = ctx.$scope;
    if (scope && event) {
      const detail = { __args__: args };
      {
        scope.triggerEvent(event, detail);
      }
    }
    return oldEmit.apply(this, [event, ...args]);
  };
}
function initBaseInstance(instance, options) {
  const ctx = instance.ctx;
  ctx.mpType = options.mpType;
  ctx.$mpType = options.mpType;
  ctx.$mpPlatform = "mp-weixin";
  ctx.$scope = options.mpInstance;
  {
    Object.defineProperties(ctx, {
      // only id
      [VIRTUAL_HOST_ID]: {
        get() {
          const id = this.$scope.data[VIRTUAL_HOST_ID];
          return id === void 0 ? "" : id;
        }
      }
    });
  }
  ctx.$mp = {};
  {
    ctx._self = {};
  }
  instance.slots = {};
  if (isArray(options.slots) && options.slots.length) {
    options.slots.forEach((name) => {
      instance.slots[name] = true;
    });
    if (instance.slots[SLOT_DEFAULT_NAME]) {
      instance.slots.default = true;
    }
  }
  ctx.getOpenerEventChannel = function() {
    {
      return options.mpInstance.getOpenerEventChannel();
    }
  };
  ctx.$hasHook = hasHook;
  ctx.$callHook = callHook;
  instance.emit = createEmitFn(instance.emit, ctx);
}
function initComponentInstance(instance, options) {
  initBaseInstance(instance, options);
  const ctx = instance.ctx;
  MP_METHODS.forEach((method) => {
    ctx[method] = function(...args) {
      const mpInstance = ctx.$scope;
      if (mpInstance && mpInstance[method]) {
        return mpInstance[method].apply(mpInstance, args);
      }
    };
  });
}
function initMocks(instance, mpInstance, mocks2) {
  const ctx = instance.ctx;
  mocks2.forEach((mock) => {
    if (hasOwn(mpInstance, mock)) {
      instance[mock] = ctx[mock] = mpInstance[mock];
    }
  });
}
function hasHook(name) {
  const hooks = this.$[name];
  if (hooks && hooks.length) {
    return true;
  }
  return false;
}
function callHook(name, args) {
  if (name === "mounted") {
    callHook.call(this, "bm");
    this.$.isMounted = true;
    name = "m";
  }
  const hooks = this.$[name];
  return hooks && invokeArrayFns(hooks, args);
}
const PAGE_INIT_HOOKS = [
  ON_LOAD,
  ON_SHOW,
  ON_HIDE,
  ON_UNLOAD,
  ON_RESIZE,
  ON_TAB_ITEM_TAP,
  ON_REACH_BOTTOM,
  ON_PULL_DOWN_REFRESH,
  ON_ADD_TO_FAVORITES
  // 'onReady', // lifetimes.ready
  // 'onPageScroll', // 影响性能，开发者手动注册
  // 'onShareTimeline', // 右上角菜单，开发者手动注册
  // 'onShareAppMessage' // 右上角菜单，开发者手动注册
];
function findHooks(vueOptions, hooks = /* @__PURE__ */ new Set()) {
  if (vueOptions) {
    Object.keys(vueOptions).forEach((name) => {
      if (isUniLifecycleHook(name, vueOptions[name])) {
        hooks.add(name);
      }
    });
    {
      const { extends: extendsOptions, mixins } = vueOptions;
      if (mixins) {
        mixins.forEach((mixin) => findHooks(mixin, hooks));
      }
      if (extendsOptions) {
        findHooks(extendsOptions, hooks);
      }
    }
  }
  return hooks;
}
function initHook(mpOptions, hook, excludes) {
  if (excludes.indexOf(hook) === -1 && !hasOwn(mpOptions, hook)) {
    mpOptions[hook] = function(args) {
      return this.$vm && this.$vm.$callHook(hook, args);
    };
  }
}
const EXCLUDE_HOOKS = [ON_READY];
function initHooks(mpOptions, hooks, excludes = EXCLUDE_HOOKS) {
  hooks.forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initUnknownHooks(mpOptions, vueOptions, excludes = EXCLUDE_HOOKS) {
  findHooks(vueOptions).forEach((hook) => initHook(mpOptions, hook, excludes));
}
function initRuntimeHooks(mpOptions, runtimeHooks) {
  if (!runtimeHooks) {
    return;
  }
  const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
  hooks.forEach((hook) => {
    if (runtimeHooks & MINI_PROGRAM_PAGE_RUNTIME_HOOKS[hook]) {
      initHook(mpOptions, hook, []);
    }
  });
}
const findMixinRuntimeHooks = /* @__PURE__ */ once(() => {
  const runtimeHooks = [];
  const app = isFunction(getApp) && getApp({ allowDefault: true });
  if (app && app.$vm && app.$vm.$) {
    const mixins = app.$vm.$.appContext.mixins;
    if (isArray(mixins)) {
      const hooks = Object.keys(MINI_PROGRAM_PAGE_RUNTIME_HOOKS);
      mixins.forEach((mixin) => {
        hooks.forEach((hook) => {
          if (hasOwn(mixin, hook) && !runtimeHooks.includes(hook)) {
            runtimeHooks.push(hook);
          }
        });
      });
    }
  }
  return runtimeHooks;
});
function initMixinRuntimeHooks(mpOptions) {
  initHooks(mpOptions, findMixinRuntimeHooks());
}
const HOOKS = [
  ON_SHOW,
  ON_HIDE,
  ON_ERROR,
  ON_THEME_CHANGE,
  ON_PAGE_NOT_FOUND,
  ON_UNHANDLE_REJECTION
];
function parseApp(instance, parseAppOptions) {
  const internalInstance = instance.$;
  const appOptions = {
    globalData: instance.$options && instance.$options.globalData || {},
    $vm: instance,
    // mp-alipay 组件 data 初始化比 onLaunch 早，提前挂载
    onLaunch(options) {
      this.$vm = instance;
      const ctx = internalInstance.ctx;
      if (this.$vm && ctx.$scope && ctx.$callHook) {
        return;
      }
      initBaseInstance(internalInstance, {
        mpType: "app",
        mpInstance: this,
        slots: []
      });
      ctx.globalData = this.globalData;
      instance.$callHook(ON_LAUNCH, options);
    }
  };
  const onErrorHandlers = wx.$onErrorHandlers;
  if (onErrorHandlers) {
    onErrorHandlers.forEach((fn) => {
      injectHook(ON_ERROR, fn, internalInstance);
    });
    onErrorHandlers.length = 0;
  }
  initLocale(instance);
  const vueOptions = instance.$.type;
  initHooks(appOptions, HOOKS);
  initUnknownHooks(appOptions, vueOptions);
  {
    const methods = vueOptions.methods;
    methods && extend(appOptions, methods);
  }
  return appOptions;
}
function initCreateApp(parseAppOptions) {
  return function createApp2(vm) {
    return App(parseApp(vm));
  };
}
function initCreateSubpackageApp(parseAppOptions) {
  return function createApp2(vm) {
    const appOptions = parseApp(vm);
    const app = isFunction(getApp) && getApp({
      allowDefault: true
    });
    if (!app)
      return;
    vm.$.ctx.$scope = app;
    const globalData = app.globalData;
    if (globalData) {
      Object.keys(appOptions.globalData).forEach((name) => {
        if (!hasOwn(globalData, name)) {
          globalData[name] = appOptions.globalData[name];
        }
      });
    }
    Object.keys(appOptions).forEach((name) => {
      if (!hasOwn(app, name)) {
        app[name] = appOptions[name];
      }
    });
    initAppLifecycle(appOptions, vm);
  };
}
function initAppLifecycle(appOptions, vm) {
  if (isFunction(appOptions.onLaunch)) {
    const args = wx.getLaunchOptionsSync && wx.getLaunchOptionsSync();
    appOptions.onLaunch(args);
  }
  if (isFunction(appOptions.onShow) && wx.onAppShow) {
    wx.onAppShow((args) => {
      vm.$callHook("onShow", args);
    });
  }
  if (isFunction(appOptions.onHide) && wx.onAppHide) {
    wx.onAppHide((args) => {
      vm.$callHook("onHide", args);
    });
  }
}
function initLocale(appVm) {
  const locale = ref(
    normalizeLocale(wx.getAppBaseInfo().language) || LOCALE_EN
  );
  Object.defineProperty(appVm, "$locale", {
    get() {
      return locale.value;
    },
    set(v) {
      locale.value = v;
    }
  });
}
const builtInProps = [
  // 百度小程序,快手小程序自定义组件不支持绑定动态事件，动态dataset，故通过props传递事件信息
  // event-opts
  "eO",
  // 组件 ref
  "uR",
  // 组件 ref-in-for
  "uRIF",
  // 组件 id
  "uI",
  // 组件类型 m: 小程序组件
  "uT",
  // 组件 props
  "uP",
  // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
  "uS"
];
function initDefaultProps(options, isBehavior = false) {
  const properties = {};
  if (!isBehavior) {
    let observerSlots = function(newVal) {
      const $slots = /* @__PURE__ */ Object.create(null);
      newVal && newVal.forEach((slotName) => {
        $slots[slotName] = true;
      });
      this.setData({
        $slots
      });
    };
    builtInProps.forEach((name) => {
      properties[name] = {
        type: null,
        value: ""
      };
    });
    properties.uS = {
      type: null,
      value: []
    };
    {
      properties.uS.observer = observerSlots;
    }
  }
  if (options.behaviors) {
    if (options.behaviors.includes("wx://form-field")) {
      if (!options.properties || !options.properties.name) {
        properties.name = {
          type: null,
          value: ""
        };
      }
      if (!options.properties || !options.properties.value) {
        properties.value = {
          type: null,
          value: ""
        };
      }
    }
  }
  return properties;
}
function initVirtualHostProps(options) {
  const properties = {};
  {
    if (options && options.virtualHost) {
      properties[VIRTUAL_HOST_STYLE] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_CLASS] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_HIDDEN] = {
        type: null,
        value: ""
      };
      properties[VIRTUAL_HOST_ID] = {
        type: null,
        value: ""
      };
    }
  }
  return properties;
}
function initProps(mpComponentOptions) {
  if (!mpComponentOptions.properties) {
    mpComponentOptions.properties = {};
  }
  extend(mpComponentOptions.properties, initDefaultProps(mpComponentOptions), initVirtualHostProps(mpComponentOptions.options));
}
const PROP_TYPES = [String, Number, Boolean, Object, Array, null];
function parsePropType(type, defaultValue) {
  if (isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}
function normalizePropType(type, defaultValue) {
  const res = parsePropType(type);
  return PROP_TYPES.indexOf(res) !== -1 ? res : null;
}
function initPageProps({ properties }, rawProps) {
  if (isArray(rawProps)) {
    rawProps.forEach((key) => {
      properties[key] = {
        type: String,
        value: ""
      };
    });
  } else if (isPlainObject(rawProps)) {
    Object.keys(rawProps).forEach((key) => {
      const opts = rawProps[key];
      if (isPlainObject(opts)) {
        let value = opts.default;
        if (isFunction(value)) {
          value = value();
        }
        const type = opts.type;
        opts.type = normalizePropType(type);
        properties[key] = {
          type: opts.type,
          value
        };
      } else {
        properties[key] = {
          type: normalizePropType(opts)
        };
      }
    });
  }
}
function findPropsData(properties, isPage2) {
  return (isPage2 ? findPagePropsData(properties) : findComponentPropsData(resolvePropValue(properties.uP))) || {};
}
function findPagePropsData(properties) {
  const propsData = {};
  if (isPlainObject(properties)) {
    Object.keys(properties).forEach((name) => {
      if (builtInProps.indexOf(name) === -1) {
        propsData[name] = resolvePropValue(properties[name]);
      }
    });
  }
  return propsData;
}
function initFormField(vm) {
  const vueOptions = vm.$options;
  if (isArray(vueOptions.behaviors) && vueOptions.behaviors.includes("uni://form-field")) {
    vm.$watch("modelValue", () => {
      vm.$scope && vm.$scope.setData({
        name: vm.name,
        value: vm.modelValue
      });
    }, {
      immediate: true
    });
  }
}
function resolvePropValue(prop) {
  return prop;
}
function initData(_) {
  return {};
}
function initPropsObserver(componentOptions) {
  const observe = function observe2() {
    const up = this.properties.uP;
    if (!up) {
      return;
    }
    if (this.$vm) {
      updateComponentProps(resolvePropValue(up), this.$vm.$);
    } else if (resolvePropValue(this.properties.uT) === "m") {
      updateMiniProgramComponentProperties(resolvePropValue(up), this);
    }
  };
  {
    if (!componentOptions.observers) {
      componentOptions.observers = {};
    }
    componentOptions.observers.uP = observe;
  }
}
function updateMiniProgramComponentProperties(up, mpInstance) {
  const prevProps = mpInstance.properties;
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps, false)) {
    mpInstance.setData(nextProps);
  }
}
function updateComponentProps(up, instance) {
  const prevProps = toRaw(instance.props);
  const nextProps = findComponentPropsData(up) || {};
  if (hasPropsChanged(prevProps, nextProps)) {
    updateProps(instance, nextProps, prevProps, false);
    if (hasQueueJob(instance.update)) {
      invalidateJob(instance.update);
    }
    {
      instance.update();
    }
  }
}
function hasPropsChanged(prevProps, nextProps, checkLen = true) {
  const nextKeys = Object.keys(nextProps);
  if (checkLen && nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key]) {
      return true;
    }
  }
  return false;
}
function initBehaviors(vueOptions) {
  const vueBehaviors = vueOptions.behaviors;
  let vueProps = vueOptions.props;
  if (!vueProps) {
    vueOptions.props = vueProps = [];
  }
  const behaviors = [];
  if (isArray(vueBehaviors)) {
    vueBehaviors.forEach((behavior) => {
      behaviors.push(behavior.replace("uni://", "wx://"));
      if (behavior === "uni://form-field") {
        if (isArray(vueProps)) {
          vueProps.push("name");
          vueProps.push("modelValue");
        } else {
          vueProps.name = {
            type: String,
            default: ""
          };
          vueProps.modelValue = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: ""
          };
        }
      }
    });
  }
  return behaviors;
}
function applyOptions(componentOptions, vueOptions) {
  componentOptions.data = initData();
  componentOptions.behaviors = initBehaviors(vueOptions);
}
function parseComponent(vueOptions, { parse, mocks: mocks2, isPage: isPage2, isPageInProject, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 }) {
  vueOptions = vueOptions.default || vueOptions;
  const options = {
    multipleSlots: true,
    // styleIsolation: 'apply-shared',
    addGlobalClass: true,
    pureDataPattern: /^uP$/
  };
  if (isArray(vueOptions.mixins)) {
    vueOptions.mixins.forEach((item) => {
      if (isObject(item.options)) {
        extend(options, item.options);
      }
    });
  }
  if (vueOptions.options) {
    extend(options, vueOptions.options);
  }
  const mpComponentOptions = {
    options,
    lifetimes: initLifetimes2({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }),
    pageLifetimes: {
      show() {
        this.$vm && this.$vm.$callHook("onPageShow");
      },
      hide() {
        this.$vm && this.$vm.$callHook("onPageHide");
      },
      resize(size2) {
        this.$vm && this.$vm.$callHook("onPageResize", size2);
      }
    },
    methods: {
      __l: handleLink2
    }
  };
  {
    applyOptions(mpComponentOptions, vueOptions);
  }
  initProps(mpComponentOptions);
  initPropsObserver(mpComponentOptions);
  initExtraOptions(mpComponentOptions, vueOptions);
  initWxsCallMethods(mpComponentOptions.methods, vueOptions.wxsCallMethods);
  {
    initWorkletMethods(mpComponentOptions.methods, vueOptions.methods);
  }
  if (parse) {
    parse(mpComponentOptions, { handleLink: handleLink2 });
  }
  return mpComponentOptions;
}
function initCreateComponent(parseOptions2) {
  return function createComponent2(vueComponentOptions) {
    return Component(parseComponent(vueComponentOptions, parseOptions2));
  };
}
let $createComponentFn;
let $destroyComponentFn;
function getAppVm() {
  return getApp().$vm;
}
function $createComponent(initialVNode, options) {
  if (!$createComponentFn) {
    $createComponentFn = getAppVm().$createComponent;
  }
  const proxy = $createComponentFn(initialVNode, options);
  return getExposeProxy(proxy.$) || proxy;
}
function $destroyComponent(instance) {
  if (!$destroyComponentFn) {
    $destroyComponentFn = getAppVm().$destroyComponent;
  }
  return $destroyComponentFn(instance);
}
function parsePage(vueOptions, parseOptions2) {
  const { parse, mocks: mocks2, isPage: isPage2, initRelation: initRelation2, handleLink: handleLink2, initLifetimes: initLifetimes2 } = parseOptions2;
  const miniProgramPageOptions = parseComponent(vueOptions, {
    mocks: mocks2,
    isPage: isPage2,
    isPageInProject: true,
    initRelation: initRelation2,
    handleLink: handleLink2,
    initLifetimes: initLifetimes2
  });
  initPageProps(miniProgramPageOptions, (vueOptions.default || vueOptions).props);
  const methods = miniProgramPageOptions.methods;
  methods.onLoad = function(query) {
    {
      this.options = query;
    }
    this.$page = {
      fullPath: addLeadingSlash(this.route + stringifyQuery(query))
    };
    return this.$vm && this.$vm.$callHook(ON_LOAD, query);
  };
  initHooks(methods, PAGE_INIT_HOOKS);
  {
    initUnknownHooks(methods, vueOptions);
  }
  initRuntimeHooks(methods, vueOptions.__runtimeHooks);
  initMixinRuntimeHooks(methods);
  parse && parse(miniProgramPageOptions, { handleLink: handleLink2 });
  return miniProgramPageOptions;
}
function initCreatePage(parseOptions2) {
  return function createPage2(vuePageOptions) {
    return Component(parsePage(vuePageOptions, parseOptions2));
  };
}
function initCreatePluginApp(parseAppOptions) {
  return function createApp2(vm) {
    initAppLifecycle(parseApp(vm), vm);
  };
}
const MPPage = Page;
const MPComponent = Component;
function initTriggerEvent(mpInstance) {
  const oldTriggerEvent = mpInstance.triggerEvent;
  const newTriggerEvent = function(event, ...args) {
    return oldTriggerEvent.apply(mpInstance, [
      customizeEvent(event),
      ...args
    ]);
  };
  try {
    mpInstance.triggerEvent = newTriggerEvent;
  } catch (error) {
    mpInstance._triggerEvent = newTriggerEvent;
  }
}
function initMiniProgramHook(name, options, isComponent) {
  const oldHook = options[name];
  if (!oldHook) {
    options[name] = function() {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function(...args) {
      initTriggerEvent(this);
      return oldHook.apply(this, args);
    };
  }
}
Page = function(options) {
  initMiniProgramHook(ON_LOAD, options);
  return MPPage(options);
};
Component = function(options) {
  initMiniProgramHook("created", options);
  const isVueComponent = options.properties && options.properties.uP;
  if (!isVueComponent) {
    initProps(options);
    initPropsObserver(options);
  }
  return MPComponent(options);
};
function initLifetimes({ mocks: mocks2, isPage: isPage2, initRelation: initRelation2, vueOptions }) {
  return {
    attached() {
      let properties = this.properties;
      initVueIds(properties.uI, this);
      const relationOptions = {
        vuePid: this._$vuePid
      };
      initRelation2(this, relationOptions);
      const mpInstance = this;
      const isMiniProgramPage = isPage2(mpInstance);
      let propsData = properties;
      this.$vm = $createComponent({
        type: vueOptions,
        props: findPropsData(propsData, isMiniProgramPage)
      }, {
        mpType: isMiniProgramPage ? "page" : "component",
        mpInstance,
        slots: properties.uS || {},
        // vueSlots
        parentComponent: relationOptions.parent && relationOptions.parent.$,
        onBeforeSetup(instance, options) {
          initRefs(instance, mpInstance);
          initMocks(instance, mpInstance, mocks2);
          initComponentInstance(instance, options);
        }
      });
      if (!isMiniProgramPage) {
        initFormField(this.$vm);
      }
    },
    ready() {
      if (this.$vm) {
        {
          this.$vm.$callHook("mounted");
          this.$vm.$callHook(ON_READY);
        }
      }
    },
    detached() {
      if (this.$vm) {
        pruneComponentPropsCache(this.$vm.$.uid);
        $destroyComponent(this.$vm);
      }
    }
  };
}
const mocks = ["__route__", "__wxExparserNodeId__", "__wxWebviewId__"];
function isPage(mpInstance) {
  return !!mpInstance.route;
}
function initRelation(mpInstance, detail) {
  mpInstance.triggerEvent("__l", detail);
}
function handleLink(event) {
  const detail = event.detail || event.value;
  const vuePid = detail.vuePid;
  let parentVm;
  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }
  if (!parentVm) {
    parentVm = this.$vm;
  }
  detail.parent = parentVm;
}
var parseOptions = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  handleLink,
  initLifetimes,
  initRelation,
  isPage,
  mocks
});
const createApp = initCreateApp();
const createPage = initCreatePage(parseOptions);
const createComponent = initCreateComponent(parseOptions);
const createPluginApp = initCreatePluginApp();
const createSubpackageApp = initCreateSubpackageApp();
{
  wx.createApp = global.createApp = createApp;
  wx.createPage = createPage;
  wx.createComponent = createComponent;
  wx.createPluginApp = global.createPluginApp = createPluginApp;
  wx.createSubpackageApp = global.createSubpackageApp = createSubpackageApp;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var matter = { exports: {} };
/*!
 * matter-js 0.19.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(module2, exports2) {
  (function webpackUniversalModuleDefinition(root, factory) {
    module2.exports = factory();
  })(commonjsGlobal, function() {
    return (
      /******/
      function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          var module3 = installedModules[moduleId] = {
            /******/
            i: moduleId,
            /******/
            l: false,
            /******/
            exports: {}
            /******/
          };
          modules[moduleId].call(module3.exports, module3, module3.exports, __webpack_require__);
          module3.l = true;
          return module3.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports3, name, getter) {
          if (!__webpack_require__.o(exports3, name)) {
            Object.defineProperty(exports3, name, { enumerable: true, get: getter });
          }
        };
        __webpack_require__.r = function(exports3) {
          if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
            Object.defineProperty(exports3, Symbol.toStringTag, { value: "Module" });
          }
          Object.defineProperty(exports3, "__esModule", { value: true });
        };
        __webpack_require__.t = function(value, mode) {
          if (mode & 1)
            value = __webpack_require__(value);
          if (mode & 8)
            return value;
          if (mode & 4 && typeof value === "object" && value && value.__esModule)
            return value;
          var ns = /* @__PURE__ */ Object.create(null);
          __webpack_require__.r(ns);
          Object.defineProperty(ns, "default", { enumerable: true, value });
          if (mode & 2 && typeof value != "string")
            for (var key in value)
              __webpack_require__.d(ns, key, (function(key2) {
                return value[key2];
              }).bind(null, key));
          return ns;
        };
        __webpack_require__.n = function(module3) {
          var getter = module3 && module3.__esModule ? (
            /******/
            function getDefault() {
              return module3["default"];
            }
          ) : (
            /******/
            function getModuleExports() {
              return module3;
            }
          );
          __webpack_require__.d(getter, "a", getter);
          return getter;
        };
        __webpack_require__.o = function(object, property) {
          return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 20);
      }([
        /* 0 */
        /***/
        function(module3, exports3) {
          var Common = {};
          module3.exports = Common;
          (function() {
            Common._baseDelta = 1e3 / 60;
            Common._nextId = 0;
            Common._seed = 0;
            Common._nowStartTime = +/* @__PURE__ */ new Date();
            Common._warnedOnce = {};
            Common._decomp = null;
            Common.extend = function(obj, deep) {
              var argsStart, deepClone;
              if (typeof deep === "boolean") {
                argsStart = 2;
                deepClone = deep;
              } else {
                argsStart = 1;
                deepClone = true;
              }
              for (var i = argsStart; i < arguments.length; i++) {
                var source = arguments[i];
                if (source) {
                  for (var prop in source) {
                    if (deepClone && source[prop] && source[prop].constructor === Object) {
                      if (!obj[prop] || obj[prop].constructor === Object) {
                        obj[prop] = obj[prop] || {};
                        Common.extend(obj[prop], deepClone, source[prop]);
                      } else {
                        obj[prop] = source[prop];
                      }
                    } else {
                      obj[prop] = source[prop];
                    }
                  }
                }
              }
              return obj;
            };
            Common.clone = function(obj, deep) {
              return Common.extend({}, deep, obj);
            };
            Common.keys = function(obj) {
              if (Object.keys)
                return Object.keys(obj);
              var keys = [];
              for (var key in obj)
                keys.push(key);
              return keys;
            };
            Common.values = function(obj) {
              var values = [];
              if (Object.keys) {
                var keys = Object.keys(obj);
                for (var i = 0; i < keys.length; i++) {
                  values.push(obj[keys[i]]);
                }
                return values;
              }
              for (var key in obj)
                values.push(obj[key]);
              return values;
            };
            Common.get = function(obj, path, begin, end) {
              path = path.split(".").slice(begin, end);
              for (var i = 0; i < path.length; i += 1) {
                obj = obj[path[i]];
              }
              return obj;
            };
            Common.set = function(obj, path, val, begin, end) {
              var parts = path.split(".").slice(begin, end);
              Common.get(obj, path, 0, -1)[parts[parts.length - 1]] = val;
              return val;
            };
            Common.shuffle = function(array) {
              for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Common.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
              }
              return array;
            };
            Common.choose = function(choices) {
              return choices[Math.floor(Common.random() * choices.length)];
            };
            Common.isElement = function(obj) {
              if (typeof HTMLElement !== "undefined") {
                return obj instanceof HTMLElement;
              }
              return !!(obj && obj.nodeType && obj.nodeName);
            };
            Common.isArray = function(obj) {
              return Object.prototype.toString.call(obj) === "[object Array]";
            };
            Common.isFunction = function(obj) {
              return typeof obj === "function";
            };
            Common.isPlainObject = function(obj) {
              return typeof obj === "object" && obj.constructor === Object;
            };
            Common.isString = function(obj) {
              return toString.call(obj) === "[object String]";
            };
            Common.clamp = function(value, min, max) {
              if (value < min)
                return min;
              if (value > max)
                return max;
              return value;
            };
            Common.sign = function(value) {
              return value < 0 ? -1 : 1;
            };
            Common.now = function() {
              if (typeof window !== "undefined" && window.performance) {
                if (window.performance.now) {
                  return window.performance.now();
                } else if (window.performance.webkitNow) {
                  return window.performance.webkitNow();
                }
              }
              if (Date.now) {
                return Date.now();
              }
              return /* @__PURE__ */ new Date() - Common._nowStartTime;
            };
            Common.random = function(min, max) {
              min = typeof min !== "undefined" ? min : 0;
              max = typeof max !== "undefined" ? max : 1;
              return min + _seededRandom() * (max - min);
            };
            var _seededRandom = function() {
              Common._seed = (Common._seed * 9301 + 49297) % 233280;
              return Common._seed / 233280;
            };
            Common.colorToNumber = function(colorString) {
              colorString = colorString.replace("#", "");
              if (colorString.length == 3) {
                colorString = colorString.charAt(0) + colorString.charAt(0) + colorString.charAt(1) + colorString.charAt(1) + colorString.charAt(2) + colorString.charAt(2);
              }
              return parseInt(colorString, 16);
            };
            Common.logLevel = 1;
            Common.log = function() {
              if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
                console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }
            };
            Common.info = function() {
              if (console && Common.logLevel > 0 && Common.logLevel <= 2) {
                console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }
            };
            Common.warn = function() {
              if (console && Common.logLevel > 0 && Common.logLevel <= 3) {
                console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
              }
            };
            Common.warnOnce = function() {
              var message = Array.prototype.slice.call(arguments).join(" ");
              if (!Common._warnedOnce[message]) {
                Common.warn(message);
                Common._warnedOnce[message] = true;
              }
            };
            Common.deprecated = function(obj, prop, warning) {
              obj[prop] = Common.chain(function() {
                Common.warnOnce("🔅 deprecated 🔅", warning);
              }, obj[prop]);
            };
            Common.nextId = function() {
              return Common._nextId++;
            };
            Common.indexOf = function(haystack, needle) {
              if (haystack.indexOf)
                return haystack.indexOf(needle);
              for (var i = 0; i < haystack.length; i++) {
                if (haystack[i] === needle)
                  return i;
              }
              return -1;
            };
            Common.map = function(list, func) {
              if (list.map) {
                return list.map(func);
              }
              var mapped = [];
              for (var i = 0; i < list.length; i += 1) {
                mapped.push(func(list[i]));
              }
              return mapped;
            };
            Common.topologicalSort = function(graph) {
              var result = [], visited = [], temp = [];
              for (var node in graph) {
                if (!visited[node] && !temp[node]) {
                  Common._topologicalSort(node, visited, temp, graph, result);
                }
              }
              return result;
            };
            Common._topologicalSort = function(node, visited, temp, graph, result) {
              var neighbors = graph[node] || [];
              temp[node] = true;
              for (var i = 0; i < neighbors.length; i += 1) {
                var neighbor = neighbors[i];
                if (temp[neighbor]) {
                  continue;
                }
                if (!visited[neighbor]) {
                  Common._topologicalSort(neighbor, visited, temp, graph, result);
                }
              }
              temp[node] = false;
              visited[node] = true;
              result.push(node);
            };
            Common.chain = function() {
              var funcs = [];
              for (var i = 0; i < arguments.length; i += 1) {
                var func = arguments[i];
                if (func._chained) {
                  funcs.push.apply(funcs, func._chained);
                } else {
                  funcs.push(func);
                }
              }
              var chain = function() {
                var lastResult, args = new Array(arguments.length);
                for (var i2 = 0, l = arguments.length; i2 < l; i2++) {
                  args[i2] = arguments[i2];
                }
                for (i2 = 0; i2 < funcs.length; i2 += 1) {
                  var result = funcs[i2].apply(lastResult, args);
                  if (typeof result !== "undefined") {
                    lastResult = result;
                  }
                }
                return lastResult;
              };
              chain._chained = funcs;
              return chain;
            };
            Common.chainPathBefore = function(base, path, func) {
              return Common.set(base, path, Common.chain(
                func,
                Common.get(base, path)
              ));
            };
            Common.chainPathAfter = function(base, path, func) {
              return Common.set(base, path, Common.chain(
                Common.get(base, path),
                func
              ));
            };
            Common.setDecomp = function(decomp) {
              Common._decomp = decomp;
            };
            Common.getDecomp = function() {
              var decomp = Common._decomp;
              try {
                if (!decomp && typeof window !== "undefined") {
                  decomp = window.decomp;
                }
                if (!decomp && typeof commonjsGlobal !== "undefined") {
                  decomp = commonjsGlobal.decomp;
                }
              } catch (e2) {
                decomp = null;
              }
              return decomp;
            };
          })();
        },
        /* 1 */
        /***/
        function(module3, exports3) {
          var Bounds = {};
          module3.exports = Bounds;
          (function() {
            Bounds.create = function(vertices) {
              var bounds = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              if (vertices)
                Bounds.update(bounds, vertices);
              return bounds;
            };
            Bounds.update = function(bounds, vertices, velocity) {
              bounds.min.x = Infinity;
              bounds.max.x = -Infinity;
              bounds.min.y = Infinity;
              bounds.max.y = -Infinity;
              for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                if (vertex.x > bounds.max.x)
                  bounds.max.x = vertex.x;
                if (vertex.x < bounds.min.x)
                  bounds.min.x = vertex.x;
                if (vertex.y > bounds.max.y)
                  bounds.max.y = vertex.y;
                if (vertex.y < bounds.min.y)
                  bounds.min.y = vertex.y;
              }
              if (velocity) {
                if (velocity.x > 0) {
                  bounds.max.x += velocity.x;
                } else {
                  bounds.min.x += velocity.x;
                }
                if (velocity.y > 0) {
                  bounds.max.y += velocity.y;
                } else {
                  bounds.min.y += velocity.y;
                }
              }
            };
            Bounds.contains = function(bounds, point) {
              return point.x >= bounds.min.x && point.x <= bounds.max.x && point.y >= bounds.min.y && point.y <= bounds.max.y;
            };
            Bounds.overlaps = function(boundsA, boundsB) {
              return boundsA.min.x <= boundsB.max.x && boundsA.max.x >= boundsB.min.x && boundsA.max.y >= boundsB.min.y && boundsA.min.y <= boundsB.max.y;
            };
            Bounds.translate = function(bounds, vector) {
              bounds.min.x += vector.x;
              bounds.max.x += vector.x;
              bounds.min.y += vector.y;
              bounds.max.y += vector.y;
            };
            Bounds.shift = function(bounds, position) {
              var deltaX = bounds.max.x - bounds.min.x, deltaY = bounds.max.y - bounds.min.y;
              bounds.min.x = position.x;
              bounds.max.x = position.x + deltaX;
              bounds.min.y = position.y;
              bounds.max.y = position.y + deltaY;
            };
          })();
        },
        /* 2 */
        /***/
        function(module3, exports3) {
          var Vector = {};
          module3.exports = Vector;
          (function() {
            Vector.create = function(x, y) {
              return { x: x || 0, y: y || 0 };
            };
            Vector.clone = function(vector) {
              return { x: vector.x, y: vector.y };
            };
            Vector.magnitude = function(vector) {
              return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            };
            Vector.magnitudeSquared = function(vector) {
              return vector.x * vector.x + vector.y * vector.y;
            };
            Vector.rotate = function(vector, angle, output) {
              var cos = Math.cos(angle), sin = Math.sin(angle);
              if (!output)
                output = {};
              var x = vector.x * cos - vector.y * sin;
              output.y = vector.x * sin + vector.y * cos;
              output.x = x;
              return output;
            };
            Vector.rotateAbout = function(vector, angle, point, output) {
              var cos = Math.cos(angle), sin = Math.sin(angle);
              if (!output)
                output = {};
              var x = point.x + ((vector.x - point.x) * cos - (vector.y - point.y) * sin);
              output.y = point.y + ((vector.x - point.x) * sin + (vector.y - point.y) * cos);
              output.x = x;
              return output;
            };
            Vector.normalise = function(vector) {
              var magnitude = Vector.magnitude(vector);
              if (magnitude === 0)
                return { x: 0, y: 0 };
              return { x: vector.x / magnitude, y: vector.y / magnitude };
            };
            Vector.dot = function(vectorA, vectorB) {
              return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
            };
            Vector.cross = function(vectorA, vectorB) {
              return vectorA.x * vectorB.y - vectorA.y * vectorB.x;
            };
            Vector.cross3 = function(vectorA, vectorB, vectorC) {
              return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
            };
            Vector.add = function(vectorA, vectorB, output) {
              if (!output)
                output = {};
              output.x = vectorA.x + vectorB.x;
              output.y = vectorA.y + vectorB.y;
              return output;
            };
            Vector.sub = function(vectorA, vectorB, output) {
              if (!output)
                output = {};
              output.x = vectorA.x - vectorB.x;
              output.y = vectorA.y - vectorB.y;
              return output;
            };
            Vector.mult = function(vector, scalar) {
              return { x: vector.x * scalar, y: vector.y * scalar };
            };
            Vector.div = function(vector, scalar) {
              return { x: vector.x / scalar, y: vector.y / scalar };
            };
            Vector.perp = function(vector, negate) {
              negate = negate === true ? -1 : 1;
              return { x: negate * -vector.y, y: negate * vector.x };
            };
            Vector.neg = function(vector) {
              return { x: -vector.x, y: -vector.y };
            };
            Vector.angle = function(vectorA, vectorB) {
              return Math.atan2(vectorB.y - vectorA.y, vectorB.x - vectorA.x);
            };
            Vector._temp = [
              Vector.create(),
              Vector.create(),
              Vector.create(),
              Vector.create(),
              Vector.create(),
              Vector.create()
            ];
          })();
        },
        /* 3 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Vertices = {};
          module3.exports = Vertices;
          var Vector = __webpack_require__(2);
          var Common = __webpack_require__(0);
          (function() {
            Vertices.create = function(points, body) {
              var vertices = [];
              for (var i = 0; i < points.length; i++) {
                var point = points[i], vertex = {
                  x: point.x,
                  y: point.y,
                  index: i,
                  body,
                  isInternal: false
                };
                vertices.push(vertex);
              }
              return vertices;
            };
            Vertices.fromPath = function(path, body) {
              var pathPattern = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, points = [];
              path.replace(pathPattern, function(match, x, y) {
                points.push({ x: parseFloat(x), y: parseFloat(y) });
              });
              return Vertices.create(points, body);
            };
            Vertices.centre = function(vertices) {
              var area = Vertices.area(vertices, true), centre = { x: 0, y: 0 }, cross, temp, j;
              for (var i = 0; i < vertices.length; i++) {
                j = (i + 1) % vertices.length;
                cross = Vector.cross(vertices[i], vertices[j]);
                temp = Vector.mult(Vector.add(vertices[i], vertices[j]), cross);
                centre = Vector.add(centre, temp);
              }
              return Vector.div(centre, 6 * area);
            };
            Vertices.mean = function(vertices) {
              var average = { x: 0, y: 0 };
              for (var i = 0; i < vertices.length; i++) {
                average.x += vertices[i].x;
                average.y += vertices[i].y;
              }
              return Vector.div(average, vertices.length);
            };
            Vertices.area = function(vertices, signed) {
              var area = 0, j = vertices.length - 1;
              for (var i = 0; i < vertices.length; i++) {
                area += (vertices[j].x - vertices[i].x) * (vertices[j].y + vertices[i].y);
                j = i;
              }
              if (signed)
                return area / 2;
              return Math.abs(area) / 2;
            };
            Vertices.inertia = function(vertices, mass) {
              var numerator = 0, denominator = 0, v = vertices, cross, j;
              for (var n2 = 0; n2 < v.length; n2++) {
                j = (n2 + 1) % v.length;
                cross = Math.abs(Vector.cross(v[j], v[n2]));
                numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n2]) + Vector.dot(v[n2], v[n2]));
                denominator += cross;
              }
              return mass / 6 * (numerator / denominator);
            };
            Vertices.translate = function(vertices, vector, scalar) {
              scalar = typeof scalar !== "undefined" ? scalar : 1;
              var verticesLength = vertices.length, translateX = vector.x * scalar, translateY = vector.y * scalar, i;
              for (i = 0; i < verticesLength; i++) {
                vertices[i].x += translateX;
                vertices[i].y += translateY;
              }
              return vertices;
            };
            Vertices.rotate = function(vertices, angle, point) {
              if (angle === 0)
                return;
              var cos = Math.cos(angle), sin = Math.sin(angle), pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex, dx, dy, i;
              for (i = 0; i < verticesLength; i++) {
                vertex = vertices[i];
                dx = vertex.x - pointX;
                dy = vertex.y - pointY;
                vertex.x = pointX + (dx * cos - dy * sin);
                vertex.y = pointY + (dx * sin + dy * cos);
              }
              return vertices;
            };
            Vertices.contains = function(vertices, point) {
              var pointX = point.x, pointY = point.y, verticesLength = vertices.length, vertex = vertices[verticesLength - 1], nextVertex;
              for (var i = 0; i < verticesLength; i++) {
                nextVertex = vertices[i];
                if ((pointX - vertex.x) * (nextVertex.y - vertex.y) + (pointY - vertex.y) * (vertex.x - nextVertex.x) > 0) {
                  return false;
                }
                vertex = nextVertex;
              }
              return true;
            };
            Vertices.scale = function(vertices, scaleX, scaleY, point) {
              if (scaleX === 1 && scaleY === 1)
                return vertices;
              point = point || Vertices.centre(vertices);
              var vertex, delta;
              for (var i = 0; i < vertices.length; i++) {
                vertex = vertices[i];
                delta = Vector.sub(vertex, point);
                vertices[i].x = point.x + delta.x * scaleX;
                vertices[i].y = point.y + delta.y * scaleY;
              }
              return vertices;
            };
            Vertices.chamfer = function(vertices, radius, quality, qualityMin, qualityMax) {
              if (typeof radius === "number") {
                radius = [radius];
              } else {
                radius = radius || [8];
              }
              quality = typeof quality !== "undefined" ? quality : -1;
              qualityMin = qualityMin || 2;
              qualityMax = qualityMax || 14;
              var newVertices = [];
              for (var i = 0; i < vertices.length; i++) {
                var prevVertex = vertices[i - 1 >= 0 ? i - 1 : vertices.length - 1], vertex = vertices[i], nextVertex = vertices[(i + 1) % vertices.length], currentRadius = radius[i < radius.length ? i : radius.length - 1];
                if (currentRadius === 0) {
                  newVertices.push(vertex);
                  continue;
                }
                var prevNormal = Vector.normalise({
                  x: vertex.y - prevVertex.y,
                  y: prevVertex.x - vertex.x
                });
                var nextNormal = Vector.normalise({
                  x: nextVertex.y - vertex.y,
                  y: vertex.x - nextVertex.x
                });
                var diagonalRadius = Math.sqrt(2 * Math.pow(currentRadius, 2)), radiusVector = Vector.mult(Common.clone(prevNormal), currentRadius), midNormal = Vector.normalise(Vector.mult(Vector.add(prevNormal, nextNormal), 0.5)), scaledVertex = Vector.sub(vertex, Vector.mult(midNormal, diagonalRadius));
                var precision = quality;
                if (quality === -1) {
                  precision = Math.pow(currentRadius, 0.32) * 1.75;
                }
                precision = Common.clamp(precision, qualityMin, qualityMax);
                if (precision % 2 === 1)
                  precision += 1;
                var alpha = Math.acos(Vector.dot(prevNormal, nextNormal)), theta = alpha / precision;
                for (var j = 0; j < precision; j++) {
                  newVertices.push(Vector.add(Vector.rotate(radiusVector, theta * j), scaledVertex));
                }
              }
              return newVertices;
            };
            Vertices.clockwiseSort = function(vertices) {
              var centre = Vertices.mean(vertices);
              vertices.sort(function(vertexA, vertexB) {
                return Vector.angle(centre, vertexA) - Vector.angle(centre, vertexB);
              });
              return vertices;
            };
            Vertices.isConvex = function(vertices) {
              var flag = 0, n2 = vertices.length, i, j, k, z;
              if (n2 < 3)
                return null;
              for (i = 0; i < n2; i++) {
                j = (i + 1) % n2;
                k = (i + 2) % n2;
                z = (vertices[j].x - vertices[i].x) * (vertices[k].y - vertices[j].y);
                z -= (vertices[j].y - vertices[i].y) * (vertices[k].x - vertices[j].x);
                if (z < 0) {
                  flag |= 1;
                } else if (z > 0) {
                  flag |= 2;
                }
                if (flag === 3) {
                  return false;
                }
              }
              if (flag !== 0) {
                return true;
              } else {
                return null;
              }
            };
            Vertices.hull = function(vertices) {
              var upper = [], lower = [], vertex, i;
              vertices = vertices.slice(0);
              vertices.sort(function(vertexA, vertexB) {
                var dx = vertexA.x - vertexB.x;
                return dx !== 0 ? dx : vertexA.y - vertexB.y;
              });
              for (i = 0; i < vertices.length; i += 1) {
                vertex = vertices[i];
                while (lower.length >= 2 && Vector.cross3(lower[lower.length - 2], lower[lower.length - 1], vertex) <= 0) {
                  lower.pop();
                }
                lower.push(vertex);
              }
              for (i = vertices.length - 1; i >= 0; i -= 1) {
                vertex = vertices[i];
                while (upper.length >= 2 && Vector.cross3(upper[upper.length - 2], upper[upper.length - 1], vertex) <= 0) {
                  upper.pop();
                }
                upper.push(vertex);
              }
              upper.pop();
              lower.pop();
              return upper.concat(lower);
            };
          })();
        },
        /* 4 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Body = {};
          module3.exports = Body;
          var Vertices = __webpack_require__(3);
          var Vector = __webpack_require__(2);
          var Sleeping = __webpack_require__(7);
          var Common = __webpack_require__(0);
          var Bounds = __webpack_require__(1);
          var Axes = __webpack_require__(11);
          (function() {
            Body._timeCorrection = true;
            Body._inertiaScale = 4;
            Body._nextCollidingGroupId = 1;
            Body._nextNonCollidingGroupId = -1;
            Body._nextCategory = 1;
            Body._baseDelta = 1e3 / 60;
            Body.create = function(options) {
              var defaults = {
                id: Common.nextId(),
                type: "body",
                label: "Body",
                parts: [],
                plugin: {},
                angle: 0,
                vertices: Vertices.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
                position: { x: 0, y: 0 },
                force: { x: 0, y: 0 },
                torque: 0,
                positionImpulse: { x: 0, y: 0 },
                constraintImpulse: { x: 0, y: 0, angle: 0 },
                totalContacts: 0,
                speed: 0,
                angularSpeed: 0,
                velocity: { x: 0, y: 0 },
                angularVelocity: 0,
                isSensor: false,
                isStatic: false,
                isSleeping: false,
                motion: 0,
                sleepThreshold: 60,
                density: 1e-3,
                restitution: 0,
                friction: 0.1,
                frictionStatic: 0.5,
                frictionAir: 0.01,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                },
                slop: 0.05,
                timeScale: 1,
                render: {
                  visible: true,
                  opacity: 1,
                  strokeStyle: null,
                  fillStyle: null,
                  lineWidth: null,
                  sprite: {
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                  }
                },
                events: null,
                bounds: null,
                chamfer: null,
                circleRadius: 0,
                positionPrev: null,
                anglePrev: 0,
                parent: null,
                axes: null,
                area: 0,
                mass: 0,
                inertia: 0,
                deltaTime: 1e3 / 60,
                _original: null
              };
              var body = Common.extend(defaults, options);
              _initProperties(body, options);
              return body;
            };
            Body.nextGroup = function(isNonColliding) {
              if (isNonColliding)
                return Body._nextNonCollidingGroupId--;
              return Body._nextCollidingGroupId++;
            };
            Body.nextCategory = function() {
              Body._nextCategory = Body._nextCategory << 1;
              return Body._nextCategory;
            };
            var _initProperties = function(body, options) {
              options = options || {};
              Body.set(body, {
                bounds: body.bounds || Bounds.create(body.vertices),
                positionPrev: body.positionPrev || Vector.clone(body.position),
                anglePrev: body.anglePrev || body.angle,
                vertices: body.vertices,
                parts: body.parts || [body],
                isStatic: body.isStatic,
                isSleeping: body.isSleeping,
                parent: body.parent || body
              });
              Vertices.rotate(body.vertices, body.angle, body.position);
              Axes.rotate(body.axes, body.angle);
              Bounds.update(body.bounds, body.vertices, body.velocity);
              Body.set(body, {
                axes: options.axes || body.axes,
                area: options.area || body.area,
                mass: options.mass || body.mass,
                inertia: options.inertia || body.inertia
              });
              var defaultFillStyle = body.isStatic ? "#14151f" : Common.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), defaultStrokeStyle = body.isStatic ? "#555" : "#ccc", defaultLineWidth = body.isStatic && body.render.fillStyle === null ? 1 : 0;
              body.render.fillStyle = body.render.fillStyle || defaultFillStyle;
              body.render.strokeStyle = body.render.strokeStyle || defaultStrokeStyle;
              body.render.lineWidth = body.render.lineWidth || defaultLineWidth;
              body.render.sprite.xOffset += -(body.bounds.min.x - body.position.x) / (body.bounds.max.x - body.bounds.min.x);
              body.render.sprite.yOffset += -(body.bounds.min.y - body.position.y) / (body.bounds.max.y - body.bounds.min.y);
            };
            Body.set = function(body, settings, value) {
              var property;
              if (typeof settings === "string") {
                property = settings;
                settings = {};
                settings[property] = value;
              }
              for (property in settings) {
                if (!Object.prototype.hasOwnProperty.call(settings, property))
                  continue;
                value = settings[property];
                switch (property) {
                  case "isStatic":
                    Body.setStatic(body, value);
                    break;
                  case "isSleeping":
                    Sleeping.set(body, value);
                    break;
                  case "mass":
                    Body.setMass(body, value);
                    break;
                  case "density":
                    Body.setDensity(body, value);
                    break;
                  case "inertia":
                    Body.setInertia(body, value);
                    break;
                  case "vertices":
                    Body.setVertices(body, value);
                    break;
                  case "position":
                    Body.setPosition(body, value);
                    break;
                  case "angle":
                    Body.setAngle(body, value);
                    break;
                  case "velocity":
                    Body.setVelocity(body, value);
                    break;
                  case "angularVelocity":
                    Body.setAngularVelocity(body, value);
                    break;
                  case "speed":
                    Body.setSpeed(body, value);
                    break;
                  case "angularSpeed":
                    Body.setAngularSpeed(body, value);
                    break;
                  case "parts":
                    Body.setParts(body, value);
                    break;
                  case "centre":
                    Body.setCentre(body, value);
                    break;
                  default:
                    body[property] = value;
                }
              }
            };
            Body.setStatic = function(body, isStatic) {
              for (var i = 0; i < body.parts.length; i++) {
                var part = body.parts[i];
                part.isStatic = isStatic;
                if (isStatic) {
                  part._original = {
                    restitution: part.restitution,
                    friction: part.friction,
                    mass: part.mass,
                    inertia: part.inertia,
                    density: part.density,
                    inverseMass: part.inverseMass,
                    inverseInertia: part.inverseInertia
                  };
                  part.restitution = 0;
                  part.friction = 1;
                  part.mass = part.inertia = part.density = Infinity;
                  part.inverseMass = part.inverseInertia = 0;
                  part.positionPrev.x = part.position.x;
                  part.positionPrev.y = part.position.y;
                  part.anglePrev = part.angle;
                  part.angularVelocity = 0;
                  part.speed = 0;
                  part.angularSpeed = 0;
                  part.motion = 0;
                } else if (part._original) {
                  part.restitution = part._original.restitution;
                  part.friction = part._original.friction;
                  part.mass = part._original.mass;
                  part.inertia = part._original.inertia;
                  part.density = part._original.density;
                  part.inverseMass = part._original.inverseMass;
                  part.inverseInertia = part._original.inverseInertia;
                  part._original = null;
                }
              }
            };
            Body.setMass = function(body, mass) {
              var moment = body.inertia / (body.mass / 6);
              body.inertia = moment * (mass / 6);
              body.inverseInertia = 1 / body.inertia;
              body.mass = mass;
              body.inverseMass = 1 / body.mass;
              body.density = body.mass / body.area;
            };
            Body.setDensity = function(body, density) {
              Body.setMass(body, density * body.area);
              body.density = density;
            };
            Body.setInertia = function(body, inertia) {
              body.inertia = inertia;
              body.inverseInertia = 1 / body.inertia;
            };
            Body.setVertices = function(body, vertices) {
              if (vertices[0].body === body) {
                body.vertices = vertices;
              } else {
                body.vertices = Vertices.create(vertices, body);
              }
              body.axes = Axes.fromVertices(body.vertices);
              body.area = Vertices.area(body.vertices);
              Body.setMass(body, body.density * body.area);
              var centre = Vertices.centre(body.vertices);
              Vertices.translate(body.vertices, centre, -1);
              Body.setInertia(body, Body._inertiaScale * Vertices.inertia(body.vertices, body.mass));
              Vertices.translate(body.vertices, body.position);
              Bounds.update(body.bounds, body.vertices, body.velocity);
            };
            Body.setParts = function(body, parts, autoHull) {
              var i;
              parts = parts.slice(0);
              body.parts.length = 0;
              body.parts.push(body);
              body.parent = body;
              for (i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part !== body) {
                  part.parent = body;
                  body.parts.push(part);
                }
              }
              if (body.parts.length === 1)
                return;
              autoHull = typeof autoHull !== "undefined" ? autoHull : true;
              if (autoHull) {
                var vertices = [];
                for (i = 0; i < parts.length; i++) {
                  vertices = vertices.concat(parts[i].vertices);
                }
                Vertices.clockwiseSort(vertices);
                var hull = Vertices.hull(vertices), hullCentre = Vertices.centre(hull);
                Body.setVertices(body, hull);
                Vertices.translate(body.vertices, hullCentre);
              }
              var total = Body._totalProperties(body);
              body.area = total.area;
              body.parent = body;
              body.position.x = total.centre.x;
              body.position.y = total.centre.y;
              body.positionPrev.x = total.centre.x;
              body.positionPrev.y = total.centre.y;
              Body.setMass(body, total.mass);
              Body.setInertia(body, total.inertia);
              Body.setPosition(body, total.centre);
            };
            Body.setCentre = function(body, centre, relative) {
              if (!relative) {
                body.positionPrev.x = centre.x - (body.position.x - body.positionPrev.x);
                body.positionPrev.y = centre.y - (body.position.y - body.positionPrev.y);
                body.position.x = centre.x;
                body.position.y = centre.y;
              } else {
                body.positionPrev.x += centre.x;
                body.positionPrev.y += centre.y;
                body.position.x += centre.x;
                body.position.y += centre.y;
              }
            };
            Body.setPosition = function(body, position, updateVelocity) {
              var delta = Vector.sub(position, body.position);
              if (updateVelocity) {
                body.positionPrev.x = body.position.x;
                body.positionPrev.y = body.position.y;
                body.velocity.x = delta.x;
                body.velocity.y = delta.y;
                body.speed = Vector.magnitude(delta);
              } else {
                body.positionPrev.x += delta.x;
                body.positionPrev.y += delta.y;
              }
              for (var i = 0; i < body.parts.length; i++) {
                var part = body.parts[i];
                part.position.x += delta.x;
                part.position.y += delta.y;
                Vertices.translate(part.vertices, delta);
                Bounds.update(part.bounds, part.vertices, body.velocity);
              }
            };
            Body.setAngle = function(body, angle, updateVelocity) {
              var delta = angle - body.angle;
              if (updateVelocity) {
                body.anglePrev = body.angle;
                body.angularVelocity = delta;
                body.angularSpeed = Math.abs(delta);
              } else {
                body.anglePrev += delta;
              }
              for (var i = 0; i < body.parts.length; i++) {
                var part = body.parts[i];
                part.angle += delta;
                Vertices.rotate(part.vertices, delta, body.position);
                Axes.rotate(part.axes, delta);
                Bounds.update(part.bounds, part.vertices, body.velocity);
                if (i > 0) {
                  Vector.rotateAbout(part.position, delta, body.position, part.position);
                }
              }
            };
            Body.setVelocity = function(body, velocity) {
              var timeScale = body.deltaTime / Body._baseDelta;
              body.positionPrev.x = body.position.x - velocity.x * timeScale;
              body.positionPrev.y = body.position.y - velocity.y * timeScale;
              body.velocity.x = (body.position.x - body.positionPrev.x) / timeScale;
              body.velocity.y = (body.position.y - body.positionPrev.y) / timeScale;
              body.speed = Vector.magnitude(body.velocity);
            };
            Body.getVelocity = function(body) {
              var timeScale = Body._baseDelta / body.deltaTime;
              return {
                x: (body.position.x - body.positionPrev.x) * timeScale,
                y: (body.position.y - body.positionPrev.y) * timeScale
              };
            };
            Body.getSpeed = function(body) {
              return Vector.magnitude(Body.getVelocity(body));
            };
            Body.setSpeed = function(body, speed) {
              Body.setVelocity(body, Vector.mult(Vector.normalise(Body.getVelocity(body)), speed));
            };
            Body.setAngularVelocity = function(body, velocity) {
              var timeScale = body.deltaTime / Body._baseDelta;
              body.anglePrev = body.angle - velocity * timeScale;
              body.angularVelocity = (body.angle - body.anglePrev) / timeScale;
              body.angularSpeed = Math.abs(body.angularVelocity);
            };
            Body.getAngularVelocity = function(body) {
              return (body.angle - body.anglePrev) * Body._baseDelta / body.deltaTime;
            };
            Body.getAngularSpeed = function(body) {
              return Math.abs(Body.getAngularVelocity(body));
            };
            Body.setAngularSpeed = function(body, speed) {
              Body.setAngularVelocity(body, Common.sign(Body.getAngularVelocity(body)) * speed);
            };
            Body.translate = function(body, translation, updateVelocity) {
              Body.setPosition(body, Vector.add(body.position, translation), updateVelocity);
            };
            Body.rotate = function(body, rotation, point, updateVelocity) {
              if (!point) {
                Body.setAngle(body, body.angle + rotation, updateVelocity);
              } else {
                var cos = Math.cos(rotation), sin = Math.sin(rotation), dx = body.position.x - point.x, dy = body.position.y - point.y;
                Body.setPosition(body, {
                  x: point.x + (dx * cos - dy * sin),
                  y: point.y + (dx * sin + dy * cos)
                }, updateVelocity);
                Body.setAngle(body, body.angle + rotation, updateVelocity);
              }
            };
            Body.scale = function(body, scaleX, scaleY, point) {
              var totalArea = 0, totalInertia = 0;
              point = point || body.position;
              for (var i = 0; i < body.parts.length; i++) {
                var part = body.parts[i];
                Vertices.scale(part.vertices, scaleX, scaleY, point);
                part.axes = Axes.fromVertices(part.vertices);
                part.area = Vertices.area(part.vertices);
                Body.setMass(part, body.density * part.area);
                Vertices.translate(part.vertices, { x: -part.position.x, y: -part.position.y });
                Body.setInertia(part, Body._inertiaScale * Vertices.inertia(part.vertices, part.mass));
                Vertices.translate(part.vertices, { x: part.position.x, y: part.position.y });
                if (i > 0) {
                  totalArea += part.area;
                  totalInertia += part.inertia;
                }
                part.position.x = point.x + (part.position.x - point.x) * scaleX;
                part.position.y = point.y + (part.position.y - point.y) * scaleY;
                Bounds.update(part.bounds, part.vertices, body.velocity);
              }
              if (body.parts.length > 1) {
                body.area = totalArea;
                if (!body.isStatic) {
                  Body.setMass(body, body.density * totalArea);
                  Body.setInertia(body, totalInertia);
                }
              }
              if (body.circleRadius) {
                if (scaleX === scaleY) {
                  body.circleRadius *= scaleX;
                } else {
                  body.circleRadius = null;
                }
              }
            };
            Body.update = function(body, deltaTime) {
              deltaTime = (typeof deltaTime !== "undefined" ? deltaTime : 1e3 / 60) * body.timeScale;
              var deltaTimeSquared = deltaTime * deltaTime, correction = Body._timeCorrection ? deltaTime / (body.deltaTime || deltaTime) : 1;
              var frictionAir = 1 - body.frictionAir * (deltaTime / Common._baseDelta), velocityPrevX = (body.position.x - body.positionPrev.x) * correction, velocityPrevY = (body.position.y - body.positionPrev.y) * correction;
              body.velocity.x = velocityPrevX * frictionAir + body.force.x / body.mass * deltaTimeSquared;
              body.velocity.y = velocityPrevY * frictionAir + body.force.y / body.mass * deltaTimeSquared;
              body.positionPrev.x = body.position.x;
              body.positionPrev.y = body.position.y;
              body.position.x += body.velocity.x;
              body.position.y += body.velocity.y;
              body.deltaTime = deltaTime;
              body.angularVelocity = (body.angle - body.anglePrev) * frictionAir * correction + body.torque / body.inertia * deltaTimeSquared;
              body.anglePrev = body.angle;
              body.angle += body.angularVelocity;
              for (var i = 0; i < body.parts.length; i++) {
                var part = body.parts[i];
                Vertices.translate(part.vertices, body.velocity);
                if (i > 0) {
                  part.position.x += body.velocity.x;
                  part.position.y += body.velocity.y;
                }
                if (body.angularVelocity !== 0) {
                  Vertices.rotate(part.vertices, body.angularVelocity, body.position);
                  Axes.rotate(part.axes, body.angularVelocity);
                  if (i > 0) {
                    Vector.rotateAbout(part.position, body.angularVelocity, body.position, part.position);
                  }
                }
                Bounds.update(part.bounds, part.vertices, body.velocity);
              }
            };
            Body.updateVelocities = function(body) {
              var timeScale = Body._baseDelta / body.deltaTime, bodyVelocity = body.velocity;
              bodyVelocity.x = (body.position.x - body.positionPrev.x) * timeScale;
              bodyVelocity.y = (body.position.y - body.positionPrev.y) * timeScale;
              body.speed = Math.sqrt(bodyVelocity.x * bodyVelocity.x + bodyVelocity.y * bodyVelocity.y);
              body.angularVelocity = (body.angle - body.anglePrev) * timeScale;
              body.angularSpeed = Math.abs(body.angularVelocity);
            };
            Body.applyForce = function(body, position, force) {
              var offset = { x: position.x - body.position.x, y: position.y - body.position.y };
              body.force.x += force.x;
              body.force.y += force.y;
              body.torque += offset.x * force.y - offset.y * force.x;
            };
            Body._totalProperties = function(body) {
              var properties = {
                mass: 0,
                area: 0,
                inertia: 0,
                centre: { x: 0, y: 0 }
              };
              for (var i = body.parts.length === 1 ? 0 : 1; i < body.parts.length; i++) {
                var part = body.parts[i], mass = part.mass !== Infinity ? part.mass : 1;
                properties.mass += mass;
                properties.area += part.area;
                properties.inertia += part.inertia;
                properties.centre = Vector.add(properties.centre, Vector.mult(part.position, mass));
              }
              properties.centre = Vector.div(properties.centre, properties.mass);
              return properties;
            };
          })();
        },
        /* 5 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Events = {};
          module3.exports = Events;
          var Common = __webpack_require__(0);
          (function() {
            Events.on = function(object, eventNames, callback) {
              var names = eventNames.split(" "), name;
              for (var i = 0; i < names.length; i++) {
                name = names[i];
                object.events = object.events || {};
                object.events[name] = object.events[name] || [];
                object.events[name].push(callback);
              }
              return callback;
            };
            Events.off = function(object, eventNames, callback) {
              if (!eventNames) {
                object.events = {};
                return;
              }
              if (typeof eventNames === "function") {
                callback = eventNames;
                eventNames = Common.keys(object.events).join(" ");
              }
              var names = eventNames.split(" ");
              for (var i = 0; i < names.length; i++) {
                var callbacks = object.events[names[i]], newCallbacks = [];
                if (callback && callbacks) {
                  for (var j = 0; j < callbacks.length; j++) {
                    if (callbacks[j] !== callback)
                      newCallbacks.push(callbacks[j]);
                  }
                }
                object.events[names[i]] = newCallbacks;
              }
            };
            Events.trigger = function(object, eventNames, event) {
              var names, name, callbacks, eventClone;
              var events = object.events;
              if (events && Common.keys(events).length > 0) {
                if (!event)
                  event = {};
                names = eventNames.split(" ");
                for (var i = 0; i < names.length; i++) {
                  name = names[i];
                  callbacks = events[name];
                  if (callbacks) {
                    eventClone = Common.clone(event, false);
                    eventClone.name = name;
                    eventClone.source = object;
                    for (var j = 0; j < callbacks.length; j++) {
                      callbacks[j].apply(object, [eventClone]);
                    }
                  }
                }
              }
            };
          })();
        },
        /* 6 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Composite = {};
          module3.exports = Composite;
          var Events = __webpack_require__(5);
          var Common = __webpack_require__(0);
          var Bounds = __webpack_require__(1);
          var Body = __webpack_require__(4);
          (function() {
            Composite.create = function(options) {
              return Common.extend({
                id: Common.nextId(),
                type: "composite",
                parent: null,
                isModified: false,
                bodies: [],
                constraints: [],
                composites: [],
                label: "Composite",
                plugin: {},
                cache: {
                  allBodies: null,
                  allConstraints: null,
                  allComposites: null
                }
              }, options);
            };
            Composite.setModified = function(composite, isModified, updateParents, updateChildren) {
              composite.isModified = isModified;
              if (isModified && composite.cache) {
                composite.cache.allBodies = null;
                composite.cache.allConstraints = null;
                composite.cache.allComposites = null;
              }
              if (updateParents && composite.parent) {
                Composite.setModified(composite.parent, isModified, updateParents, updateChildren);
              }
              if (updateChildren) {
                for (var i = 0; i < composite.composites.length; i++) {
                  var childComposite = composite.composites[i];
                  Composite.setModified(childComposite, isModified, updateParents, updateChildren);
                }
              }
            };
            Composite.add = function(composite, object) {
              var objects = [].concat(object);
              Events.trigger(composite, "beforeAdd", { object });
              for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                switch (obj.type) {
                  case "body":
                    if (obj.parent !== obj) {
                      Common.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    Composite.addBody(composite, obj);
                    break;
                  case "constraint":
                    Composite.addConstraint(composite, obj);
                    break;
                  case "composite":
                    Composite.addComposite(composite, obj);
                    break;
                  case "mouseConstraint":
                    Composite.addConstraint(composite, obj.constraint);
                    break;
                }
              }
              Events.trigger(composite, "afterAdd", { object });
              return composite;
            };
            Composite.remove = function(composite, object, deep) {
              var objects = [].concat(object);
              Events.trigger(composite, "beforeRemove", { object });
              for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                switch (obj.type) {
                  case "body":
                    Composite.removeBody(composite, obj, deep);
                    break;
                  case "constraint":
                    Composite.removeConstraint(composite, obj, deep);
                    break;
                  case "composite":
                    Composite.removeComposite(composite, obj, deep);
                    break;
                  case "mouseConstraint":
                    Composite.removeConstraint(composite, obj.constraint);
                    break;
                }
              }
              Events.trigger(composite, "afterRemove", { object });
              return composite;
            };
            Composite.addComposite = function(compositeA, compositeB) {
              compositeA.composites.push(compositeB);
              compositeB.parent = compositeA;
              Composite.setModified(compositeA, true, true, false);
              return compositeA;
            };
            Composite.removeComposite = function(compositeA, compositeB, deep) {
              var position = Common.indexOf(compositeA.composites, compositeB);
              if (position !== -1) {
                Composite.removeCompositeAt(compositeA, position);
              }
              if (deep) {
                for (var i = 0; i < compositeA.composites.length; i++) {
                  Composite.removeComposite(compositeA.composites[i], compositeB, true);
                }
              }
              return compositeA;
            };
            Composite.removeCompositeAt = function(composite, position) {
              composite.composites.splice(position, 1);
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.addBody = function(composite, body) {
              composite.bodies.push(body);
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.removeBody = function(composite, body, deep) {
              var position = Common.indexOf(composite.bodies, body);
              if (position !== -1) {
                Composite.removeBodyAt(composite, position);
              }
              if (deep) {
                for (var i = 0; i < composite.composites.length; i++) {
                  Composite.removeBody(composite.composites[i], body, true);
                }
              }
              return composite;
            };
            Composite.removeBodyAt = function(composite, position) {
              composite.bodies.splice(position, 1);
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.addConstraint = function(composite, constraint) {
              composite.constraints.push(constraint);
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.removeConstraint = function(composite, constraint, deep) {
              var position = Common.indexOf(composite.constraints, constraint);
              if (position !== -1) {
                Composite.removeConstraintAt(composite, position);
              }
              if (deep) {
                for (var i = 0; i < composite.composites.length; i++) {
                  Composite.removeConstraint(composite.composites[i], constraint, true);
                }
              }
              return composite;
            };
            Composite.removeConstraintAt = function(composite, position) {
              composite.constraints.splice(position, 1);
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.clear = function(composite, keepStatic, deep) {
              if (deep) {
                for (var i = 0; i < composite.composites.length; i++) {
                  Composite.clear(composite.composites[i], keepStatic, true);
                }
              }
              if (keepStatic) {
                composite.bodies = composite.bodies.filter(function(body) {
                  return body.isStatic;
                });
              } else {
                composite.bodies.length = 0;
              }
              composite.constraints.length = 0;
              composite.composites.length = 0;
              Composite.setModified(composite, true, true, false);
              return composite;
            };
            Composite.allBodies = function(composite) {
              if (composite.cache && composite.cache.allBodies) {
                return composite.cache.allBodies;
              }
              var bodies = [].concat(composite.bodies);
              for (var i = 0; i < composite.composites.length; i++)
                bodies = bodies.concat(Composite.allBodies(composite.composites[i]));
              if (composite.cache) {
                composite.cache.allBodies = bodies;
              }
              return bodies;
            };
            Composite.allConstraints = function(composite) {
              if (composite.cache && composite.cache.allConstraints) {
                return composite.cache.allConstraints;
              }
              var constraints = [].concat(composite.constraints);
              for (var i = 0; i < composite.composites.length; i++)
                constraints = constraints.concat(Composite.allConstraints(composite.composites[i]));
              if (composite.cache) {
                composite.cache.allConstraints = constraints;
              }
              return constraints;
            };
            Composite.allComposites = function(composite) {
              if (composite.cache && composite.cache.allComposites) {
                return composite.cache.allComposites;
              }
              var composites = [].concat(composite.composites);
              for (var i = 0; i < composite.composites.length; i++)
                composites = composites.concat(Composite.allComposites(composite.composites[i]));
              if (composite.cache) {
                composite.cache.allComposites = composites;
              }
              return composites;
            };
            Composite.get = function(composite, id, type) {
              var objects, object;
              switch (type) {
                case "body":
                  objects = Composite.allBodies(composite);
                  break;
                case "constraint":
                  objects = Composite.allConstraints(composite);
                  break;
                case "composite":
                  objects = Composite.allComposites(composite).concat(composite);
                  break;
              }
              if (!objects)
                return null;
              object = objects.filter(function(object2) {
                return object2.id.toString() === id.toString();
              });
              return object.length === 0 ? null : object[0];
            };
            Composite.move = function(compositeA, objects, compositeB) {
              Composite.remove(compositeA, objects);
              Composite.add(compositeB, objects);
              return compositeA;
            };
            Composite.rebase = function(composite) {
              var objects = Composite.allBodies(composite).concat(Composite.allConstraints(composite)).concat(Composite.allComposites(composite));
              for (var i = 0; i < objects.length; i++) {
                objects[i].id = Common.nextId();
              }
              return composite;
            };
            Composite.translate = function(composite, translation, recursive) {
              var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
              for (var i = 0; i < bodies.length; i++) {
                Body.translate(bodies[i], translation);
              }
              return composite;
            };
            Composite.rotate = function(composite, rotation, point, recursive) {
              var cos = Math.cos(rotation), sin = Math.sin(rotation), bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                Body.setPosition(body, {
                  x: point.x + (dx * cos - dy * sin),
                  y: point.y + (dx * sin + dy * cos)
                });
                Body.rotate(body, rotation);
              }
              return composite;
            };
            Composite.scale = function(composite, scaleX, scaleY, point, recursive) {
              var bodies = recursive ? Composite.allBodies(composite) : composite.bodies;
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i], dx = body.position.x - point.x, dy = body.position.y - point.y;
                Body.setPosition(body, {
                  x: point.x + dx * scaleX,
                  y: point.y + dy * scaleY
                });
                Body.scale(body, scaleX, scaleY);
              }
              return composite;
            };
            Composite.bounds = function(composite) {
              var bodies = Composite.allBodies(composite), vertices = [];
              for (var i = 0; i < bodies.length; i += 1) {
                var body = bodies[i];
                vertices.push(body.bounds.min, body.bounds.max);
              }
              return Bounds.create(vertices);
            };
          })();
        },
        /* 7 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Sleeping = {};
          module3.exports = Sleeping;
          var Body = __webpack_require__(4);
          var Events = __webpack_require__(5);
          var Common = __webpack_require__(0);
          (function() {
            Sleeping._motionWakeThreshold = 0.18;
            Sleeping._motionSleepThreshold = 0.08;
            Sleeping._minBias = 0.9;
            Sleeping.update = function(bodies, delta) {
              var timeScale = delta / Common._baseDelta, motionSleepThreshold = Sleeping._motionSleepThreshold;
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i], speed = Body.getSpeed(body), angularSpeed = Body.getAngularSpeed(body), motion = speed * speed + angularSpeed * angularSpeed;
                if (body.force.x !== 0 || body.force.y !== 0) {
                  Sleeping.set(body, false);
                  continue;
                }
                var minMotion = Math.min(body.motion, motion), maxMotion = Math.max(body.motion, motion);
                body.motion = Sleeping._minBias * minMotion + (1 - Sleeping._minBias) * maxMotion;
                if (body.sleepThreshold > 0 && body.motion < motionSleepThreshold) {
                  body.sleepCounter += 1;
                  if (body.sleepCounter >= body.sleepThreshold / timeScale) {
                    Sleeping.set(body, true);
                  }
                } else if (body.sleepCounter > 0) {
                  body.sleepCounter -= 1;
                }
              }
            };
            Sleeping.afterCollisions = function(pairs) {
              var motionSleepThreshold = Sleeping._motionSleepThreshold;
              for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                if (!pair.isActive)
                  continue;
                var collision = pair.collision, bodyA = collision.bodyA.parent, bodyB = collision.bodyB.parent;
                if (bodyA.isSleeping && bodyB.isSleeping || bodyA.isStatic || bodyB.isStatic)
                  continue;
                if (bodyA.isSleeping || bodyB.isSleeping) {
                  var sleepingBody = bodyA.isSleeping && !bodyA.isStatic ? bodyA : bodyB, movingBody = sleepingBody === bodyA ? bodyB : bodyA;
                  if (!sleepingBody.isStatic && movingBody.motion > motionSleepThreshold) {
                    Sleeping.set(sleepingBody, false);
                  }
                }
              }
            };
            Sleeping.set = function(body, isSleeping) {
              var wasSleeping = body.isSleeping;
              if (isSleeping) {
                body.isSleeping = true;
                body.sleepCounter = body.sleepThreshold;
                body.positionImpulse.x = 0;
                body.positionImpulse.y = 0;
                body.positionPrev.x = body.position.x;
                body.positionPrev.y = body.position.y;
                body.anglePrev = body.angle;
                body.speed = 0;
                body.angularSpeed = 0;
                body.motion = 0;
                if (!wasSleeping) {
                  Events.trigger(body, "sleepStart");
                }
              } else {
                body.isSleeping = false;
                body.sleepCounter = 0;
                if (wasSleeping) {
                  Events.trigger(body, "sleepEnd");
                }
              }
            };
          })();
        },
        /* 8 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Collision = {};
          module3.exports = Collision;
          var Vertices = __webpack_require__(3);
          var Pair = __webpack_require__(9);
          (function() {
            var _supports = [];
            var _overlapAB = {
              overlap: 0,
              axis: null
            };
            var _overlapBA = {
              overlap: 0,
              axis: null
            };
            Collision.create = function(bodyA, bodyB) {
              return {
                pair: null,
                collided: false,
                bodyA,
                bodyB,
                parentA: bodyA.parent,
                parentB: bodyB.parent,
                depth: 0,
                normal: { x: 0, y: 0 },
                tangent: { x: 0, y: 0 },
                penetration: { x: 0, y: 0 },
                supports: []
              };
            };
            Collision.collides = function(bodyA, bodyB, pairs) {
              Collision._overlapAxes(_overlapAB, bodyA.vertices, bodyB.vertices, bodyA.axes);
              if (_overlapAB.overlap <= 0) {
                return null;
              }
              Collision._overlapAxes(_overlapBA, bodyB.vertices, bodyA.vertices, bodyB.axes);
              if (_overlapBA.overlap <= 0) {
                return null;
              }
              var pair = pairs && pairs.table[Pair.id(bodyA, bodyB)], collision;
              if (!pair) {
                collision = Collision.create(bodyA, bodyB);
                collision.collided = true;
                collision.bodyA = bodyA.id < bodyB.id ? bodyA : bodyB;
                collision.bodyB = bodyA.id < bodyB.id ? bodyB : bodyA;
                collision.parentA = collision.bodyA.parent;
                collision.parentB = collision.bodyB.parent;
              } else {
                collision = pair.collision;
              }
              bodyA = collision.bodyA;
              bodyB = collision.bodyB;
              var minOverlap;
              if (_overlapAB.overlap < _overlapBA.overlap) {
                minOverlap = _overlapAB;
              } else {
                minOverlap = _overlapBA;
              }
              var normal = collision.normal, supports = collision.supports, minAxis = minOverlap.axis, minAxisX = minAxis.x, minAxisY = minAxis.y;
              if (minAxisX * (bodyB.position.x - bodyA.position.x) + minAxisY * (bodyB.position.y - bodyA.position.y) < 0) {
                normal.x = minAxisX;
                normal.y = minAxisY;
              } else {
                normal.x = -minAxisX;
                normal.y = -minAxisY;
              }
              collision.tangent.x = -normal.y;
              collision.tangent.y = normal.x;
              collision.depth = minOverlap.overlap;
              collision.penetration.x = normal.x * collision.depth;
              collision.penetration.y = normal.y * collision.depth;
              var supportsB = Collision._findSupports(bodyA, bodyB, normal, 1), supportCount = 0;
              if (Vertices.contains(bodyA.vertices, supportsB[0])) {
                supports[supportCount++] = supportsB[0];
              }
              if (Vertices.contains(bodyA.vertices, supportsB[1])) {
                supports[supportCount++] = supportsB[1];
              }
              if (supportCount < 2) {
                var supportsA = Collision._findSupports(bodyB, bodyA, normal, -1);
                if (Vertices.contains(bodyB.vertices, supportsA[0])) {
                  supports[supportCount++] = supportsA[0];
                }
                if (supportCount < 2 && Vertices.contains(bodyB.vertices, supportsA[1])) {
                  supports[supportCount++] = supportsA[1];
                }
              }
              if (supportCount === 0) {
                supports[supportCount++] = supportsB[0];
              }
              supports.length = supportCount;
              return collision;
            };
            Collision._overlapAxes = function(result, verticesA, verticesB, axes) {
              var verticesALength = verticesA.length, verticesBLength = verticesB.length, verticesAX = verticesA[0].x, verticesAY = verticesA[0].y, verticesBX = verticesB[0].x, verticesBY = verticesB[0].y, axesLength = axes.length, overlapMin = Number.MAX_VALUE, overlapAxisNumber = 0, overlap, overlapAB, overlapBA, dot, i, j;
              for (i = 0; i < axesLength; i++) {
                var axis = axes[i], axisX = axis.x, axisY = axis.y, minA = verticesAX * axisX + verticesAY * axisY, minB = verticesBX * axisX + verticesBY * axisY, maxA = minA, maxB = minB;
                for (j = 1; j < verticesALength; j += 1) {
                  dot = verticesA[j].x * axisX + verticesA[j].y * axisY;
                  if (dot > maxA) {
                    maxA = dot;
                  } else if (dot < minA) {
                    minA = dot;
                  }
                }
                for (j = 1; j < verticesBLength; j += 1) {
                  dot = verticesB[j].x * axisX + verticesB[j].y * axisY;
                  if (dot > maxB) {
                    maxB = dot;
                  } else if (dot < minB) {
                    minB = dot;
                  }
                }
                overlapAB = maxA - minB;
                overlapBA = maxB - minA;
                overlap = overlapAB < overlapBA ? overlapAB : overlapBA;
                if (overlap < overlapMin) {
                  overlapMin = overlap;
                  overlapAxisNumber = i;
                  if (overlap <= 0) {
                    break;
                  }
                }
              }
              result.axis = axes[overlapAxisNumber];
              result.overlap = overlapMin;
            };
            Collision._projectToAxis = function(projection, vertices, axis) {
              var min = vertices[0].x * axis.x + vertices[0].y * axis.y, max = min;
              for (var i = 1; i < vertices.length; i += 1) {
                var dot = vertices[i].x * axis.x + vertices[i].y * axis.y;
                if (dot > max) {
                  max = dot;
                } else if (dot < min) {
                  min = dot;
                }
              }
              projection.min = min;
              projection.max = max;
            };
            Collision._findSupports = function(bodyA, bodyB, normal, direction) {
              var vertices = bodyB.vertices, verticesLength = vertices.length, bodyAPositionX = bodyA.position.x, bodyAPositionY = bodyA.position.y, normalX = normal.x * direction, normalY = normal.y * direction, nearestDistance = Number.MAX_VALUE, vertexA, vertexB, vertexC, distance, j;
              for (j = 0; j < verticesLength; j += 1) {
                vertexB = vertices[j];
                distance = normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y);
                if (distance < nearestDistance) {
                  nearestDistance = distance;
                  vertexA = vertexB;
                }
              }
              vertexC = vertices[(verticesLength + vertexA.index - 1) % verticesLength];
              nearestDistance = normalX * (bodyAPositionX - vertexC.x) + normalY * (bodyAPositionY - vertexC.y);
              vertexB = vertices[(vertexA.index + 1) % verticesLength];
              if (normalX * (bodyAPositionX - vertexB.x) + normalY * (bodyAPositionY - vertexB.y) < nearestDistance) {
                _supports[0] = vertexA;
                _supports[1] = vertexB;
                return _supports;
              }
              _supports[0] = vertexA;
              _supports[1] = vertexC;
              return _supports;
            };
          })();
        },
        /* 9 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Pair = {};
          module3.exports = Pair;
          var Contact = __webpack_require__(16);
          (function() {
            Pair.create = function(collision, timestamp) {
              var bodyA = collision.bodyA, bodyB = collision.bodyB;
              var pair = {
                id: Pair.id(bodyA, bodyB),
                bodyA,
                bodyB,
                collision,
                contacts: [],
                activeContacts: [],
                separation: 0,
                isActive: true,
                confirmedActive: true,
                isSensor: bodyA.isSensor || bodyB.isSensor,
                timeCreated: timestamp,
                timeUpdated: timestamp,
                inverseMass: 0,
                friction: 0,
                frictionStatic: 0,
                restitution: 0,
                slop: 0
              };
              Pair.update(pair, collision, timestamp);
              return pair;
            };
            Pair.update = function(pair, collision, timestamp) {
              var contacts = pair.contacts, supports = collision.supports, activeContacts = pair.activeContacts, parentA = collision.parentA, parentB = collision.parentB, parentAVerticesLength = parentA.vertices.length;
              pair.isActive = true;
              pair.timeUpdated = timestamp;
              pair.collision = collision;
              pair.separation = collision.depth;
              pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
              pair.friction = parentA.friction < parentB.friction ? parentA.friction : parentB.friction;
              pair.frictionStatic = parentA.frictionStatic > parentB.frictionStatic ? parentA.frictionStatic : parentB.frictionStatic;
              pair.restitution = parentA.restitution > parentB.restitution ? parentA.restitution : parentB.restitution;
              pair.slop = parentA.slop > parentB.slop ? parentA.slop : parentB.slop;
              collision.pair = pair;
              activeContacts.length = 0;
              for (var i = 0; i < supports.length; i++) {
                var support = supports[i], contactId = support.body === parentA ? support.index : parentAVerticesLength + support.index, contact = contacts[contactId];
                if (contact) {
                  activeContacts.push(contact);
                } else {
                  activeContacts.push(contacts[contactId] = Contact.create(support));
                }
              }
            };
            Pair.setActive = function(pair, isActive, timestamp) {
              if (isActive) {
                pair.isActive = true;
                pair.timeUpdated = timestamp;
              } else {
                pair.isActive = false;
                pair.activeContacts.length = 0;
              }
            };
            Pair.id = function(bodyA, bodyB) {
              if (bodyA.id < bodyB.id) {
                return "A" + bodyA.id + "B" + bodyB.id;
              } else {
                return "A" + bodyB.id + "B" + bodyA.id;
              }
            };
          })();
        },
        /* 10 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Constraint = {};
          module3.exports = Constraint;
          var Vertices = __webpack_require__(3);
          var Vector = __webpack_require__(2);
          var Sleeping = __webpack_require__(7);
          var Bounds = __webpack_require__(1);
          var Axes = __webpack_require__(11);
          var Common = __webpack_require__(0);
          (function() {
            Constraint._warming = 0.4;
            Constraint._torqueDampen = 1;
            Constraint._minLength = 1e-6;
            Constraint.create = function(options) {
              var constraint = options;
              if (constraint.bodyA && !constraint.pointA)
                constraint.pointA = { x: 0, y: 0 };
              if (constraint.bodyB && !constraint.pointB)
                constraint.pointB = { x: 0, y: 0 };
              var initialPointA = constraint.bodyA ? Vector.add(constraint.bodyA.position, constraint.pointA) : constraint.pointA, initialPointB = constraint.bodyB ? Vector.add(constraint.bodyB.position, constraint.pointB) : constraint.pointB, length = Vector.magnitude(Vector.sub(initialPointA, initialPointB));
              constraint.length = typeof constraint.length !== "undefined" ? constraint.length : length;
              constraint.id = constraint.id || Common.nextId();
              constraint.label = constraint.label || "Constraint";
              constraint.type = "constraint";
              constraint.stiffness = constraint.stiffness || (constraint.length > 0 ? 1 : 0.7);
              constraint.damping = constraint.damping || 0;
              constraint.angularStiffness = constraint.angularStiffness || 0;
              constraint.angleA = constraint.bodyA ? constraint.bodyA.angle : constraint.angleA;
              constraint.angleB = constraint.bodyB ? constraint.bodyB.angle : constraint.angleB;
              constraint.plugin = {};
              var render = {
                visible: true,
                lineWidth: 2,
                strokeStyle: "#ffffff",
                type: "line",
                anchors: true
              };
              if (constraint.length === 0 && constraint.stiffness > 0.1) {
                render.type = "pin";
                render.anchors = false;
              } else if (constraint.stiffness < 0.9) {
                render.type = "spring";
              }
              constraint.render = Common.extend(render, constraint.render);
              return constraint;
            };
            Constraint.preSolveAll = function(bodies) {
              for (var i = 0; i < bodies.length; i += 1) {
                var body = bodies[i], impulse = body.constraintImpulse;
                if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
                  continue;
                }
                body.position.x += impulse.x;
                body.position.y += impulse.y;
                body.angle += impulse.angle;
              }
            };
            Constraint.solveAll = function(constraints, delta) {
              var timeScale = Common.clamp(delta / Common._baseDelta, 0, 1);
              for (var i = 0; i < constraints.length; i += 1) {
                var constraint = constraints[i], fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic, fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
                if (fixedA || fixedB) {
                  Constraint.solve(constraints[i], timeScale);
                }
              }
              for (i = 0; i < constraints.length; i += 1) {
                constraint = constraints[i];
                fixedA = !constraint.bodyA || constraint.bodyA && constraint.bodyA.isStatic;
                fixedB = !constraint.bodyB || constraint.bodyB && constraint.bodyB.isStatic;
                if (!fixedA && !fixedB) {
                  Constraint.solve(constraints[i], timeScale);
                }
              }
            };
            Constraint.solve = function(constraint, timeScale) {
              var bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointA = constraint.pointA, pointB = constraint.pointB;
              if (!bodyA && !bodyB)
                return;
              if (bodyA && !bodyA.isStatic) {
                Vector.rotate(pointA, bodyA.angle - constraint.angleA, pointA);
                constraint.angleA = bodyA.angle;
              }
              if (bodyB && !bodyB.isStatic) {
                Vector.rotate(pointB, bodyB.angle - constraint.angleB, pointB);
                constraint.angleB = bodyB.angle;
              }
              var pointAWorld = pointA, pointBWorld = pointB;
              if (bodyA)
                pointAWorld = Vector.add(bodyA.position, pointA);
              if (bodyB)
                pointBWorld = Vector.add(bodyB.position, pointB);
              if (!pointAWorld || !pointBWorld)
                return;
              var delta = Vector.sub(pointAWorld, pointBWorld), currentLength = Vector.magnitude(delta);
              if (currentLength < Constraint._minLength) {
                currentLength = Constraint._minLength;
              }
              var difference = (currentLength - constraint.length) / currentLength, isRigid = constraint.stiffness >= 1 || constraint.length === 0, stiffness = isRigid ? constraint.stiffness * timeScale : constraint.stiffness * timeScale * timeScale, damping = constraint.damping * timeScale, force = Vector.mult(delta, difference * stiffness), massTotal = (bodyA ? bodyA.inverseMass : 0) + (bodyB ? bodyB.inverseMass : 0), inertiaTotal = (bodyA ? bodyA.inverseInertia : 0) + (bodyB ? bodyB.inverseInertia : 0), resistanceTotal = massTotal + inertiaTotal, torque, share, normal, normalVelocity, relativeVelocity;
              if (damping > 0) {
                var zero = Vector.create();
                normal = Vector.div(delta, currentLength);
                relativeVelocity = Vector.sub(
                  bodyB && Vector.sub(bodyB.position, bodyB.positionPrev) || zero,
                  bodyA && Vector.sub(bodyA.position, bodyA.positionPrev) || zero
                );
                normalVelocity = Vector.dot(normal, relativeVelocity);
              }
              if (bodyA && !bodyA.isStatic) {
                share = bodyA.inverseMass / massTotal;
                bodyA.constraintImpulse.x -= force.x * share;
                bodyA.constraintImpulse.y -= force.y * share;
                bodyA.position.x -= force.x * share;
                bodyA.position.y -= force.y * share;
                if (damping > 0) {
                  bodyA.positionPrev.x -= damping * normal.x * normalVelocity * share;
                  bodyA.positionPrev.y -= damping * normal.y * normalVelocity * share;
                }
                torque = Vector.cross(pointA, force) / resistanceTotal * Constraint._torqueDampen * bodyA.inverseInertia * (1 - constraint.angularStiffness);
                bodyA.constraintImpulse.angle -= torque;
                bodyA.angle -= torque;
              }
              if (bodyB && !bodyB.isStatic) {
                share = bodyB.inverseMass / massTotal;
                bodyB.constraintImpulse.x += force.x * share;
                bodyB.constraintImpulse.y += force.y * share;
                bodyB.position.x += force.x * share;
                bodyB.position.y += force.y * share;
                if (damping > 0) {
                  bodyB.positionPrev.x += damping * normal.x * normalVelocity * share;
                  bodyB.positionPrev.y += damping * normal.y * normalVelocity * share;
                }
                torque = Vector.cross(pointB, force) / resistanceTotal * Constraint._torqueDampen * bodyB.inverseInertia * (1 - constraint.angularStiffness);
                bodyB.constraintImpulse.angle += torque;
                bodyB.angle += torque;
              }
            };
            Constraint.postSolveAll = function(bodies) {
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i], impulse = body.constraintImpulse;
                if (body.isStatic || impulse.x === 0 && impulse.y === 0 && impulse.angle === 0) {
                  continue;
                }
                Sleeping.set(body, false);
                for (var j = 0; j < body.parts.length; j++) {
                  var part = body.parts[j];
                  Vertices.translate(part.vertices, impulse);
                  if (j > 0) {
                    part.position.x += impulse.x;
                    part.position.y += impulse.y;
                  }
                  if (impulse.angle !== 0) {
                    Vertices.rotate(part.vertices, impulse.angle, body.position);
                    Axes.rotate(part.axes, impulse.angle);
                    if (j > 0) {
                      Vector.rotateAbout(part.position, impulse.angle, body.position, part.position);
                    }
                  }
                  Bounds.update(part.bounds, part.vertices, body.velocity);
                }
                impulse.angle *= Constraint._warming;
                impulse.x *= Constraint._warming;
                impulse.y *= Constraint._warming;
              }
            };
            Constraint.pointAWorld = function(constraint) {
              return {
                x: (constraint.bodyA ? constraint.bodyA.position.x : 0) + (constraint.pointA ? constraint.pointA.x : 0),
                y: (constraint.bodyA ? constraint.bodyA.position.y : 0) + (constraint.pointA ? constraint.pointA.y : 0)
              };
            };
            Constraint.pointBWorld = function(constraint) {
              return {
                x: (constraint.bodyB ? constraint.bodyB.position.x : 0) + (constraint.pointB ? constraint.pointB.x : 0),
                y: (constraint.bodyB ? constraint.bodyB.position.y : 0) + (constraint.pointB ? constraint.pointB.y : 0)
              };
            };
          })();
        },
        /* 11 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Axes = {};
          module3.exports = Axes;
          var Vector = __webpack_require__(2);
          var Common = __webpack_require__(0);
          (function() {
            Axes.fromVertices = function(vertices) {
              var axes = {};
              for (var i = 0; i < vertices.length; i++) {
                var j = (i + 1) % vertices.length, normal = Vector.normalise({
                  x: vertices[j].y - vertices[i].y,
                  y: vertices[i].x - vertices[j].x
                }), gradient = normal.y === 0 ? Infinity : normal.x / normal.y;
                gradient = gradient.toFixed(3).toString();
                axes[gradient] = normal;
              }
              return Common.values(axes);
            };
            Axes.rotate = function(axes, angle) {
              if (angle === 0)
                return;
              var cos = Math.cos(angle), sin = Math.sin(angle);
              for (var i = 0; i < axes.length; i++) {
                var axis = axes[i], xx;
                xx = axis.x * cos - axis.y * sin;
                axis.y = axis.x * sin + axis.y * cos;
                axis.x = xx;
              }
            };
          })();
        },
        /* 12 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Bodies = {};
          module3.exports = Bodies;
          var Vertices = __webpack_require__(3);
          var Common = __webpack_require__(0);
          var Body = __webpack_require__(4);
          var Bounds = __webpack_require__(1);
          var Vector = __webpack_require__(2);
          (function() {
            Bodies.rectangle = function(x, y, width, height, options) {
              options = options || {};
              var rectangle = {
                label: "Rectangle Body",
                position: { x, y },
                vertices: Vertices.fromPath("L 0 0 L " + width + " 0 L " + width + " " + height + " L 0 " + height)
              };
              if (options.chamfer) {
                var chamfer = options.chamfer;
                rectangle.vertices = Vertices.chamfer(
                  rectangle.vertices,
                  chamfer.radius,
                  chamfer.quality,
                  chamfer.qualityMin,
                  chamfer.qualityMax
                );
                delete options.chamfer;
              }
              return Body.create(Common.extend({}, rectangle, options));
            };
            Bodies.trapezoid = function(x, y, width, height, slope, options) {
              options = options || {};
              slope *= 0.5;
              var roof = (1 - slope * 2) * width;
              var x1 = width * slope, x2 = x1 + roof, x3 = x2 + x1, verticesPath;
              if (slope < 0.5) {
                verticesPath = "L 0 0 L " + x1 + " " + -height + " L " + x2 + " " + -height + " L " + x3 + " 0";
              } else {
                verticesPath = "L 0 0 L " + x2 + " " + -height + " L " + x3 + " 0";
              }
              var trapezoid = {
                label: "Trapezoid Body",
                position: { x, y },
                vertices: Vertices.fromPath(verticesPath)
              };
              if (options.chamfer) {
                var chamfer = options.chamfer;
                trapezoid.vertices = Vertices.chamfer(
                  trapezoid.vertices,
                  chamfer.radius,
                  chamfer.quality,
                  chamfer.qualityMin,
                  chamfer.qualityMax
                );
                delete options.chamfer;
              }
              return Body.create(Common.extend({}, trapezoid, options));
            };
            Bodies.circle = function(x, y, radius, options, maxSides) {
              options = options || {};
              var circle = {
                label: "Circle Body",
                circleRadius: radius
              };
              maxSides = maxSides || 25;
              var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));
              if (sides % 2 === 1)
                sides += 1;
              return Bodies.polygon(x, y, sides, radius, Common.extend({}, circle, options));
            };
            Bodies.polygon = function(x, y, sides, radius, options) {
              options = options || {};
              if (sides < 3)
                return Bodies.circle(x, y, radius, options);
              var theta = 2 * Math.PI / sides, path = "", offset = theta * 0.5;
              for (var i = 0; i < sides; i += 1) {
                var angle = offset + i * theta, xx = Math.cos(angle) * radius, yy = Math.sin(angle) * radius;
                path += "L " + xx.toFixed(3) + " " + yy.toFixed(3) + " ";
              }
              var polygon = {
                label: "Polygon Body",
                position: { x, y },
                vertices: Vertices.fromPath(path)
              };
              if (options.chamfer) {
                var chamfer = options.chamfer;
                polygon.vertices = Vertices.chamfer(
                  polygon.vertices,
                  chamfer.radius,
                  chamfer.quality,
                  chamfer.qualityMin,
                  chamfer.qualityMax
                );
                delete options.chamfer;
              }
              return Body.create(Common.extend({}, polygon, options));
            };
            Bodies.fromVertices = function(x, y, vertexSets, options, flagInternal, removeCollinear, minimumArea, removeDuplicatePoints) {
              var decomp = Common.getDecomp(), canDecomp, body, parts, isConvex, isConcave, vertices, i, j, k, v, z;
              canDecomp = Boolean(decomp && decomp.quickDecomp);
              options = options || {};
              parts = [];
              flagInternal = typeof flagInternal !== "undefined" ? flagInternal : false;
              removeCollinear = typeof removeCollinear !== "undefined" ? removeCollinear : 0.01;
              minimumArea = typeof minimumArea !== "undefined" ? minimumArea : 10;
              removeDuplicatePoints = typeof removeDuplicatePoints !== "undefined" ? removeDuplicatePoints : 0.01;
              if (!Common.isArray(vertexSets[0])) {
                vertexSets = [vertexSets];
              }
              for (v = 0; v < vertexSets.length; v += 1) {
                vertices = vertexSets[v];
                isConvex = Vertices.isConvex(vertices);
                isConcave = !isConvex;
                if (isConcave && !canDecomp) {
                  Common.warnOnce(
                    "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                  );
                }
                if (isConvex || !canDecomp) {
                  if (isConvex) {
                    vertices = Vertices.clockwiseSort(vertices);
                  } else {
                    vertices = Vertices.hull(vertices);
                  }
                  parts.push({
                    position: { x, y },
                    vertices
                  });
                } else {
                  var concave = vertices.map(function(vertex) {
                    return [vertex.x, vertex.y];
                  });
                  decomp.makeCCW(concave);
                  if (removeCollinear !== false)
                    decomp.removeCollinearPoints(concave, removeCollinear);
                  if (removeDuplicatePoints !== false && decomp.removeDuplicatePoints)
                    decomp.removeDuplicatePoints(concave, removeDuplicatePoints);
                  var decomposed = decomp.quickDecomp(concave);
                  for (i = 0; i < decomposed.length; i++) {
                    var chunk = decomposed[i];
                    var chunkVertices = chunk.map(function(vertices2) {
                      return {
                        x: vertices2[0],
                        y: vertices2[1]
                      };
                    });
                    if (minimumArea > 0 && Vertices.area(chunkVertices) < minimumArea)
                      continue;
                    parts.push({
                      position: Vertices.centre(chunkVertices),
                      vertices: chunkVertices
                    });
                  }
                }
              }
              for (i = 0; i < parts.length; i++) {
                parts[i] = Body.create(Common.extend(parts[i], options));
              }
              if (flagInternal) {
                var coincident_max_dist = 5;
                for (i = 0; i < parts.length; i++) {
                  var partA = parts[i];
                  for (j = i + 1; j < parts.length; j++) {
                    var partB = parts[j];
                    if (Bounds.overlaps(partA.bounds, partB.bounds)) {
                      var pav = partA.vertices, pbv = partB.vertices;
                      for (k = 0; k < partA.vertices.length; k++) {
                        for (z = 0; z < partB.vertices.length; z++) {
                          var da = Vector.magnitudeSquared(Vector.sub(pav[(k + 1) % pav.length], pbv[z])), db = Vector.magnitudeSquared(Vector.sub(pav[k], pbv[(z + 1) % pbv.length]));
                          if (da < coincident_max_dist && db < coincident_max_dist) {
                            pav[k].isInternal = true;
                            pbv[z].isInternal = true;
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (parts.length > 1) {
                body = Body.create(Common.extend({ parts: parts.slice(0) }, options));
                Body.setPosition(body, { x, y });
                return body;
              } else {
                return parts[0];
              }
            };
          })();
        },
        /* 13 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Detector = {};
          module3.exports = Detector;
          var Common = __webpack_require__(0);
          var Collision = __webpack_require__(8);
          (function() {
            Detector.create = function(options) {
              var defaults = {
                bodies: [],
                pairs: null
              };
              return Common.extend(defaults, options);
            };
            Detector.setBodies = function(detector, bodies) {
              detector.bodies = bodies.slice(0);
            };
            Detector.clear = function(detector) {
              detector.bodies = [];
            };
            Detector.collisions = function(detector) {
              var collisions = [], pairs = detector.pairs, bodies = detector.bodies, bodiesLength = bodies.length, canCollide = Detector.canCollide, collides = Collision.collides, i, j;
              bodies.sort(Detector._compareBoundsX);
              for (i = 0; i < bodiesLength; i++) {
                var bodyA = bodies[i], boundsA = bodyA.bounds, boundXMax = bodyA.bounds.max.x, boundYMax = bodyA.bounds.max.y, boundYMin = bodyA.bounds.min.y, bodyAStatic = bodyA.isStatic || bodyA.isSleeping, partsALength = bodyA.parts.length, partsASingle = partsALength === 1;
                for (j = i + 1; j < bodiesLength; j++) {
                  var bodyB = bodies[j], boundsB = bodyB.bounds;
                  if (boundsB.min.x > boundXMax) {
                    break;
                  }
                  if (boundYMax < boundsB.min.y || boundYMin > boundsB.max.y) {
                    continue;
                  }
                  if (bodyAStatic && (bodyB.isStatic || bodyB.isSleeping)) {
                    continue;
                  }
                  if (!canCollide(bodyA.collisionFilter, bodyB.collisionFilter)) {
                    continue;
                  }
                  var partsBLength = bodyB.parts.length;
                  if (partsASingle && partsBLength === 1) {
                    var collision = collides(bodyA, bodyB, pairs);
                    if (collision) {
                      collisions.push(collision);
                    }
                  } else {
                    var partsAStart = partsALength > 1 ? 1 : 0, partsBStart = partsBLength > 1 ? 1 : 0;
                    for (var k = partsAStart; k < partsALength; k++) {
                      var partA = bodyA.parts[k], boundsA = partA.bounds;
                      for (var z = partsBStart; z < partsBLength; z++) {
                        var partB = bodyB.parts[z], boundsB = partB.bounds;
                        if (boundsA.min.x > boundsB.max.x || boundsA.max.x < boundsB.min.x || boundsA.max.y < boundsB.min.y || boundsA.min.y > boundsB.max.y) {
                          continue;
                        }
                        var collision = collides(partA, partB, pairs);
                        if (collision) {
                          collisions.push(collision);
                        }
                      }
                    }
                  }
                }
              }
              return collisions;
            };
            Detector.canCollide = function(filterA, filterB) {
              if (filterA.group === filterB.group && filterA.group !== 0)
                return filterA.group > 0;
              return (filterA.mask & filterB.category) !== 0 && (filterB.mask & filterA.category) !== 0;
            };
            Detector._compareBoundsX = function(bodyA, bodyB) {
              return bodyA.bounds.min.x - bodyB.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Mouse = {};
          module3.exports = Mouse;
          var Common = __webpack_require__(0);
          (function() {
            Mouse.create = function(element) {
              var mouse = {};
              if (!element) {
                Common.log("Mouse.create: element was undefined, defaulting to document.body", "warn");
              }
              mouse.element = element || document.body;
              mouse.absolute = { x: 0, y: 0 };
              mouse.position = { x: 0, y: 0 };
              mouse.mousedownPosition = { x: 0, y: 0 };
              mouse.mouseupPosition = { x: 0, y: 0 };
              mouse.offset = { x: 0, y: 0 };
              mouse.scale = { x: 1, y: 1 };
              mouse.wheelDelta = 0;
              mouse.button = -1;
              mouse.pixelRatio = parseInt(mouse.element.getAttribute("data-pixel-ratio"), 10) || 1;
              mouse.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              };
              mouse.mousemove = function(event) {
                var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                if (touches) {
                  mouse.button = 0;
                  event.preventDefault();
                }
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.sourceEvents.mousemove = event;
              };
              mouse.mousedown = function(event) {
                var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                if (touches) {
                  mouse.button = 0;
                  event.preventDefault();
                } else {
                  mouse.button = event.button;
                }
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.mousedownPosition.x = mouse.position.x;
                mouse.mousedownPosition.y = mouse.position.y;
                mouse.sourceEvents.mousedown = event;
              };
              mouse.mouseup = function(event) {
                var position = Mouse._getRelativeMousePosition(event, mouse.element, mouse.pixelRatio), touches = event.changedTouches;
                if (touches) {
                  event.preventDefault();
                }
                mouse.button = -1;
                mouse.absolute.x = position.x;
                mouse.absolute.y = position.y;
                mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
                mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
                mouse.mouseupPosition.x = mouse.position.x;
                mouse.mouseupPosition.y = mouse.position.y;
                mouse.sourceEvents.mouseup = event;
              };
              mouse.mousewheel = function(event) {
                mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail));
                event.preventDefault();
              };
              Mouse.setElement(mouse, mouse.element);
              return mouse;
            };
            Mouse.setElement = function(mouse, element) {
              mouse.element = element;
              element.addEventListener("mousemove", mouse.mousemove);
              element.addEventListener("mousedown", mouse.mousedown);
              element.addEventListener("mouseup", mouse.mouseup);
              element.addEventListener("mousewheel", mouse.mousewheel);
              element.addEventListener("DOMMouseScroll", mouse.mousewheel);
              element.addEventListener("touchmove", mouse.mousemove);
              element.addEventListener("touchstart", mouse.mousedown);
              element.addEventListener("touchend", mouse.mouseup);
            };
            Mouse.clearSourceEvents = function(mouse) {
              mouse.sourceEvents.mousemove = null;
              mouse.sourceEvents.mousedown = null;
              mouse.sourceEvents.mouseup = null;
              mouse.sourceEvents.mousewheel = null;
              mouse.wheelDelta = 0;
            };
            Mouse.setOffset = function(mouse, offset) {
              mouse.offset.x = offset.x;
              mouse.offset.y = offset.y;
              mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
              mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
            };
            Mouse.setScale = function(mouse, scale) {
              mouse.scale.x = scale.x;
              mouse.scale.y = scale.y;
              mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x;
              mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y;
            };
            Mouse._getRelativeMousePosition = function(event, element, pixelRatio) {
              var elementBounds = element.getBoundingClientRect(), rootNode = document.documentElement || document.body.parentNode || document.body, scrollX = window.pageXOffset !== void 0 ? window.pageXOffset : rootNode.scrollLeft, scrollY = window.pageYOffset !== void 0 ? window.pageYOffset : rootNode.scrollTop, touches = event.changedTouches, x, y;
              if (touches) {
                x = touches[0].pageX - elementBounds.left - scrollX;
                y = touches[0].pageY - elementBounds.top - scrollY;
              } else {
                x = event.pageX - elementBounds.left - scrollX;
                y = event.pageY - elementBounds.top - scrollY;
              }
              return {
                x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
                y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Plugin = {};
          module3.exports = Plugin;
          var Common = __webpack_require__(0);
          (function() {
            Plugin._registry = {};
            Plugin.register = function(plugin2) {
              if (!Plugin.isPlugin(plugin2)) {
                Common.warn("Plugin.register:", Plugin.toString(plugin2), "does not implement all required fields.");
              }
              if (plugin2.name in Plugin._registry) {
                var registered = Plugin._registry[plugin2.name], pluginVersion = Plugin.versionParse(plugin2.version).number, registeredVersion = Plugin.versionParse(registered.version).number;
                if (pluginVersion > registeredVersion) {
                  Common.warn("Plugin.register:", Plugin.toString(registered), "was upgraded to", Plugin.toString(plugin2));
                  Plugin._registry[plugin2.name] = plugin2;
                } else if (pluginVersion < registeredVersion) {
                  Common.warn("Plugin.register:", Plugin.toString(registered), "can not be downgraded to", Plugin.toString(plugin2));
                } else if (plugin2 !== registered) {
                  Common.warn("Plugin.register:", Plugin.toString(plugin2), "is already registered to different plugin object");
                }
              } else {
                Plugin._registry[plugin2.name] = plugin2;
              }
              return plugin2;
            };
            Plugin.resolve = function(dependency) {
              return Plugin._registry[Plugin.dependencyParse(dependency).name];
            };
            Plugin.toString = function(plugin2) {
              return typeof plugin2 === "string" ? plugin2 : (plugin2.name || "anonymous") + "@" + (plugin2.version || plugin2.range || "0.0.0");
            };
            Plugin.isPlugin = function(obj) {
              return obj && obj.name && obj.version && obj.install;
            };
            Plugin.isUsed = function(module4, name) {
              return module4.used.indexOf(name) > -1;
            };
            Plugin.isFor = function(plugin2, module4) {
              var parsed = plugin2.for && Plugin.dependencyParse(plugin2.for);
              return !plugin2.for || module4.name === parsed.name && Plugin.versionSatisfies(module4.version, parsed.range);
            };
            Plugin.use = function(module4, plugins) {
              module4.uses = (module4.uses || []).concat(plugins || []);
              if (module4.uses.length === 0) {
                Common.warn("Plugin.use:", Plugin.toString(module4), "does not specify any dependencies to install.");
                return;
              }
              var dependencies = Plugin.dependencies(module4), sortedDependencies = Common.topologicalSort(dependencies), status = [];
              for (var i = 0; i < sortedDependencies.length; i += 1) {
                if (sortedDependencies[i] === module4.name) {
                  continue;
                }
                var plugin2 = Plugin.resolve(sortedDependencies[i]);
                if (!plugin2) {
                  status.push("❌ " + sortedDependencies[i]);
                  continue;
                }
                if (Plugin.isUsed(module4, plugin2.name)) {
                  continue;
                }
                if (!Plugin.isFor(plugin2, module4)) {
                  Common.warn("Plugin.use:", Plugin.toString(plugin2), "is for", plugin2.for, "but installed on", Plugin.toString(module4) + ".");
                  plugin2._warned = true;
                }
                if (plugin2.install) {
                  plugin2.install(module4);
                } else {
                  Common.warn("Plugin.use:", Plugin.toString(plugin2), "does not specify an install function.");
                  plugin2._warned = true;
                }
                if (plugin2._warned) {
                  status.push("🔶 " + Plugin.toString(plugin2));
                  delete plugin2._warned;
                } else {
                  status.push("✅ " + Plugin.toString(plugin2));
                }
                module4.used.push(plugin2.name);
              }
              if (status.length > 0) {
                Common.info(status.join("  "));
              }
            };
            Plugin.dependencies = function(module4, tracked) {
              var parsedBase = Plugin.dependencyParse(module4), name = parsedBase.name;
              tracked = tracked || {};
              if (name in tracked) {
                return;
              }
              module4 = Plugin.resolve(module4) || module4;
              tracked[name] = Common.map(module4.uses || [], function(dependency) {
                if (Plugin.isPlugin(dependency)) {
                  Plugin.register(dependency);
                }
                var parsed = Plugin.dependencyParse(dependency), resolved = Plugin.resolve(dependency);
                if (resolved && !Plugin.versionSatisfies(resolved.version, parsed.range)) {
                  Common.warn(
                    "Plugin.dependencies:",
                    Plugin.toString(resolved),
                    "does not satisfy",
                    Plugin.toString(parsed),
                    "used by",
                    Plugin.toString(parsedBase) + "."
                  );
                  resolved._warned = true;
                  module4._warned = true;
                } else if (!resolved) {
                  Common.warn(
                    "Plugin.dependencies:",
                    Plugin.toString(dependency),
                    "used by",
                    Plugin.toString(parsedBase),
                    "could not be resolved."
                  );
                  module4._warned = true;
                }
                return parsed.name;
              });
              for (var i = 0; i < tracked[name].length; i += 1) {
                Plugin.dependencies(tracked[name][i], tracked);
              }
              return tracked;
            };
            Plugin.dependencyParse = function(dependency) {
              if (Common.isString(dependency)) {
                var pattern = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                if (!pattern.test(dependency)) {
                  Common.warn("Plugin.dependencyParse:", dependency, "is not a valid dependency string.");
                }
                return {
                  name: dependency.split("@")[0],
                  range: dependency.split("@")[1] || "*"
                };
              }
              return {
                name: dependency.name,
                range: dependency.range || dependency.version
              };
            };
            Plugin.versionParse = function(range) {
              var pattern = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              if (!pattern.test(range)) {
                Common.warn("Plugin.versionParse:", range, "is not a valid version or range.");
              }
              var parts = pattern.exec(range);
              var major = Number(parts[4]);
              var minor = Number(parts[5]);
              var patch2 = Number(parts[6]);
              return {
                isRange: Boolean(parts[1] || parts[2]),
                version: parts[3],
                range,
                operator: parts[1] || parts[2] || "",
                major,
                minor,
                patch: patch2,
                parts: [major, minor, patch2],
                prerelease: parts[7],
                number: major * 1e8 + minor * 1e4 + patch2
              };
            };
            Plugin.versionSatisfies = function(version2, range) {
              range = range || "*";
              var r = Plugin.versionParse(range), v = Plugin.versionParse(version2);
              if (r.isRange) {
                if (r.operator === "*" || version2 === "*") {
                  return true;
                }
                if (r.operator === ">") {
                  return v.number > r.number;
                }
                if (r.operator === ">=") {
                  return v.number >= r.number;
                }
                if (r.operator === "~") {
                  return v.major === r.major && v.minor === r.minor && v.patch >= r.patch;
                }
                if (r.operator === "^") {
                  if (r.major > 0) {
                    return v.major === r.major && v.number >= r.number;
                  }
                  if (r.minor > 0) {
                    return v.minor === r.minor && v.patch >= r.patch;
                  }
                  return v.patch === r.patch;
                }
              }
              return version2 === range || version2 === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(module3, exports3) {
          var Contact = {};
          module3.exports = Contact;
          (function() {
            Contact.create = function(vertex) {
              return {
                vertex,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          })();
        },
        /* 17 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Engine = {};
          module3.exports = Engine;
          var Sleeping = __webpack_require__(7);
          var Resolver = __webpack_require__(18);
          var Detector = __webpack_require__(13);
          var Pairs = __webpack_require__(19);
          var Events = __webpack_require__(5);
          var Composite = __webpack_require__(6);
          var Constraint = __webpack_require__(10);
          var Common = __webpack_require__(0);
          var Body = __webpack_require__(4);
          (function() {
            Engine.create = function(options) {
              options = options || {};
              var defaults = {
                positionIterations: 6,
                velocityIterations: 4,
                constraintIterations: 2,
                enableSleeping: false,
                events: [],
                plugin: {},
                gravity: {
                  x: 0,
                  y: 1,
                  scale: 1e-3
                },
                timing: {
                  timestamp: 0,
                  timeScale: 1,
                  lastDelta: 0,
                  lastElapsed: 0
                }
              };
              var engine = Common.extend(defaults, options);
              engine.world = options.world || Composite.create({ label: "World" });
              engine.pairs = options.pairs || Pairs.create();
              engine.detector = options.detector || Detector.create();
              engine.grid = { buckets: [] };
              engine.world.gravity = engine.gravity;
              engine.broadphase = engine.grid;
              engine.metrics = {};
              return engine;
            };
            Engine.update = function(engine, delta) {
              var startTime = Common.now();
              var world = engine.world, detector = engine.detector, pairs = engine.pairs, timing = engine.timing, timestamp = timing.timestamp, i;
              delta = typeof delta !== "undefined" ? delta : Common._baseDelta;
              delta *= timing.timeScale;
              timing.timestamp += delta;
              timing.lastDelta = delta;
              var event = {
                timestamp: timing.timestamp,
                delta
              };
              Events.trigger(engine, "beforeUpdate", event);
              var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world);
              if (world.isModified) {
                Detector.setBodies(detector, allBodies);
                Composite.setModified(world, false, false, true);
              }
              if (engine.enableSleeping)
                Sleeping.update(allBodies, delta);
              Engine._bodiesApplyGravity(allBodies, engine.gravity);
              if (delta > 0) {
                Engine._bodiesUpdate(allBodies, delta);
              }
              Constraint.preSolveAll(allBodies);
              for (i = 0; i < engine.constraintIterations; i++) {
                Constraint.solveAll(allConstraints, delta);
              }
              Constraint.postSolveAll(allBodies);
              detector.pairs = engine.pairs;
              var collisions = Detector.collisions(detector);
              Pairs.update(pairs, collisions, timestamp);
              if (engine.enableSleeping)
                Sleeping.afterCollisions(pairs.list);
              if (pairs.collisionStart.length > 0)
                Events.trigger(engine, "collisionStart", { pairs: pairs.collisionStart });
              var positionDamping = Common.clamp(20 / engine.positionIterations, 0, 1);
              Resolver.preSolvePosition(pairs.list);
              for (i = 0; i < engine.positionIterations; i++) {
                Resolver.solvePosition(pairs.list, delta, positionDamping);
              }
              Resolver.postSolvePosition(allBodies);
              Constraint.preSolveAll(allBodies);
              for (i = 0; i < engine.constraintIterations; i++) {
                Constraint.solveAll(allConstraints, delta);
              }
              Constraint.postSolveAll(allBodies);
              Resolver.preSolveVelocity(pairs.list);
              for (i = 0; i < engine.velocityIterations; i++) {
                Resolver.solveVelocity(pairs.list, delta);
              }
              Engine._bodiesUpdateVelocities(allBodies);
              if (pairs.collisionActive.length > 0)
                Events.trigger(engine, "collisionActive", { pairs: pairs.collisionActive });
              if (pairs.collisionEnd.length > 0)
                Events.trigger(engine, "collisionEnd", { pairs: pairs.collisionEnd });
              Engine._bodiesClearForces(allBodies);
              Events.trigger(engine, "afterUpdate", event);
              engine.timing.lastElapsed = Common.now() - startTime;
              return engine;
            };
            Engine.merge = function(engineA, engineB) {
              Common.extend(engineA, engineB);
              if (engineB.world) {
                engineA.world = engineB.world;
                Engine.clear(engineA);
                var bodies = Composite.allBodies(engineA.world);
                for (var i = 0; i < bodies.length; i++) {
                  var body = bodies[i];
                  Sleeping.set(body, false);
                  body.id = Common.nextId();
                }
              }
            };
            Engine.clear = function(engine) {
              Pairs.clear(engine.pairs);
              Detector.clear(engine.detector);
            };
            Engine._bodiesClearForces = function(bodies) {
              var bodiesLength = bodies.length;
              for (var i = 0; i < bodiesLength; i++) {
                var body = bodies[i];
                body.force.x = 0;
                body.force.y = 0;
                body.torque = 0;
              }
            };
            Engine._bodiesApplyGravity = function(bodies, gravity) {
              var gravityScale = typeof gravity.scale !== "undefined" ? gravity.scale : 1e-3, bodiesLength = bodies.length;
              if (gravity.x === 0 && gravity.y === 0 || gravityScale === 0) {
                return;
              }
              for (var i = 0; i < bodiesLength; i++) {
                var body = bodies[i];
                if (body.isStatic || body.isSleeping)
                  continue;
                body.force.y += body.mass * gravity.y * gravityScale;
                body.force.x += body.mass * gravity.x * gravityScale;
              }
            };
            Engine._bodiesUpdate = function(bodies, delta) {
              var bodiesLength = bodies.length;
              for (var i = 0; i < bodiesLength; i++) {
                var body = bodies[i];
                if (body.isStatic || body.isSleeping)
                  continue;
                Body.update(body, delta);
              }
            };
            Engine._bodiesUpdateVelocities = function(bodies) {
              var bodiesLength = bodies.length;
              for (var i = 0; i < bodiesLength; i++) {
                Body.updateVelocities(bodies[i]);
              }
            };
          })();
        },
        /* 18 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Resolver = {};
          module3.exports = Resolver;
          var Vertices = __webpack_require__(3);
          var Common = __webpack_require__(0);
          var Bounds = __webpack_require__(1);
          (function() {
            Resolver._restingThresh = 2;
            Resolver._restingThreshTangent = Math.sqrt(6);
            Resolver._positionDampen = 0.9;
            Resolver._positionWarming = 0.8;
            Resolver._frictionNormalMultiplier = 5;
            Resolver._frictionMaxStatic = Number.MAX_VALUE;
            Resolver.preSolvePosition = function(pairs) {
              var i, pair, activeCount, pairsLength = pairs.length;
              for (i = 0; i < pairsLength; i++) {
                pair = pairs[i];
                if (!pair.isActive)
                  continue;
                activeCount = pair.activeContacts.length;
                pair.collision.parentA.totalContacts += activeCount;
                pair.collision.parentB.totalContacts += activeCount;
              }
            };
            Resolver.solvePosition = function(pairs, delta, damping) {
              var i, pair, collision, bodyA, bodyB, normal, contactShare, positionImpulse, positionDampen = Resolver._positionDampen * (damping || 1), slopDampen = Common.clamp(delta / Common._baseDelta, 0, 1), pairsLength = pairs.length;
              for (i = 0; i < pairsLength; i++) {
                pair = pairs[i];
                if (!pair.isActive || pair.isSensor)
                  continue;
                collision = pair.collision;
                bodyA = collision.parentA;
                bodyB = collision.parentB;
                normal = collision.normal;
                pair.separation = normal.x * (bodyB.positionImpulse.x + collision.penetration.x - bodyA.positionImpulse.x) + normal.y * (bodyB.positionImpulse.y + collision.penetration.y - bodyA.positionImpulse.y);
              }
              for (i = 0; i < pairsLength; i++) {
                pair = pairs[i];
                if (!pair.isActive || pair.isSensor)
                  continue;
                collision = pair.collision;
                bodyA = collision.parentA;
                bodyB = collision.parentB;
                normal = collision.normal;
                positionImpulse = pair.separation - pair.slop * slopDampen;
                if (bodyA.isStatic || bodyB.isStatic)
                  positionImpulse *= 2;
                if (!(bodyA.isStatic || bodyA.isSleeping)) {
                  contactShare = positionDampen / bodyA.totalContacts;
                  bodyA.positionImpulse.x += normal.x * positionImpulse * contactShare;
                  bodyA.positionImpulse.y += normal.y * positionImpulse * contactShare;
                }
                if (!(bodyB.isStatic || bodyB.isSleeping)) {
                  contactShare = positionDampen / bodyB.totalContacts;
                  bodyB.positionImpulse.x -= normal.x * positionImpulse * contactShare;
                  bodyB.positionImpulse.y -= normal.y * positionImpulse * contactShare;
                }
              }
            };
            Resolver.postSolvePosition = function(bodies) {
              var positionWarming = Resolver._positionWarming, bodiesLength = bodies.length, verticesTranslate = Vertices.translate, boundsUpdate = Bounds.update;
              for (var i = 0; i < bodiesLength; i++) {
                var body = bodies[i], positionImpulse = body.positionImpulse, positionImpulseX = positionImpulse.x, positionImpulseY = positionImpulse.y, velocity = body.velocity;
                body.totalContacts = 0;
                if (positionImpulseX !== 0 || positionImpulseY !== 0) {
                  for (var j = 0; j < body.parts.length; j++) {
                    var part = body.parts[j];
                    verticesTranslate(part.vertices, positionImpulse);
                    boundsUpdate(part.bounds, part.vertices, velocity);
                    part.position.x += positionImpulseX;
                    part.position.y += positionImpulseY;
                  }
                  body.positionPrev.x += positionImpulseX;
                  body.positionPrev.y += positionImpulseY;
                  if (positionImpulseX * velocity.x + positionImpulseY * velocity.y < 0) {
                    positionImpulse.x = 0;
                    positionImpulse.y = 0;
                  } else {
                    positionImpulse.x *= positionWarming;
                    positionImpulse.y *= positionWarming;
                  }
                }
              }
            };
            Resolver.preSolveVelocity = function(pairs) {
              var pairsLength = pairs.length, i, j;
              for (i = 0; i < pairsLength; i++) {
                var pair = pairs[i];
                if (!pair.isActive || pair.isSensor)
                  continue;
                var contacts = pair.activeContacts, contactsLength = contacts.length, collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, normal = collision.normal, tangent = collision.tangent;
                for (j = 0; j < contactsLength; j++) {
                  var contact = contacts[j], contactVertex = contact.vertex, normalImpulse = contact.normalImpulse, tangentImpulse = contact.tangentImpulse;
                  if (normalImpulse !== 0 || tangentImpulse !== 0) {
                    var impulseX = normal.x * normalImpulse + tangent.x * tangentImpulse, impulseY = normal.y * normalImpulse + tangent.y * tangentImpulse;
                    if (!(bodyA.isStatic || bodyA.isSleeping)) {
                      bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                      bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                      bodyA.anglePrev += bodyA.inverseInertia * ((contactVertex.x - bodyA.position.x) * impulseY - (contactVertex.y - bodyA.position.y) * impulseX);
                    }
                    if (!(bodyB.isStatic || bodyB.isSleeping)) {
                      bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                      bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                      bodyB.anglePrev -= bodyB.inverseInertia * ((contactVertex.x - bodyB.position.x) * impulseY - (contactVertex.y - bodyB.position.y) * impulseX);
                    }
                  }
                }
              }
            };
            Resolver.solveVelocity = function(pairs, delta) {
              var timeScale = delta / Common._baseDelta, timeScaleSquared = timeScale * timeScale, timeScaleCubed = timeScaleSquared * timeScale, restingThresh = -Resolver._restingThresh * timeScale, restingThreshTangent = Resolver._restingThreshTangent, frictionNormalMultiplier = Resolver._frictionNormalMultiplier * timeScale, frictionMaxStatic = Resolver._frictionMaxStatic, pairsLength = pairs.length, tangentImpulse, maxFriction, i, j;
              for (i = 0; i < pairsLength; i++) {
                var pair = pairs[i];
                if (!pair.isActive || pair.isSensor)
                  continue;
                var collision = pair.collision, bodyA = collision.parentA, bodyB = collision.parentB, bodyAVelocity = bodyA.velocity, bodyBVelocity = bodyB.velocity, normalX = collision.normal.x, normalY = collision.normal.y, tangentX = collision.tangent.x, tangentY = collision.tangent.y, contacts = pair.activeContacts, contactsLength = contacts.length, contactShare = 1 / contactsLength, inverseMassTotal = bodyA.inverseMass + bodyB.inverseMass, friction = pair.friction * pair.frictionStatic * frictionNormalMultiplier;
                bodyAVelocity.x = bodyA.position.x - bodyA.positionPrev.x;
                bodyAVelocity.y = bodyA.position.y - bodyA.positionPrev.y;
                bodyBVelocity.x = bodyB.position.x - bodyB.positionPrev.x;
                bodyBVelocity.y = bodyB.position.y - bodyB.positionPrev.y;
                bodyA.angularVelocity = bodyA.angle - bodyA.anglePrev;
                bodyB.angularVelocity = bodyB.angle - bodyB.anglePrev;
                for (j = 0; j < contactsLength; j++) {
                  var contact = contacts[j], contactVertex = contact.vertex;
                  var offsetAX = contactVertex.x - bodyA.position.x, offsetAY = contactVertex.y - bodyA.position.y, offsetBX = contactVertex.x - bodyB.position.x, offsetBY = contactVertex.y - bodyB.position.y;
                  var velocityPointAX = bodyAVelocity.x - offsetAY * bodyA.angularVelocity, velocityPointAY = bodyAVelocity.y + offsetAX * bodyA.angularVelocity, velocityPointBX = bodyBVelocity.x - offsetBY * bodyB.angularVelocity, velocityPointBY = bodyBVelocity.y + offsetBX * bodyB.angularVelocity;
                  var relativeVelocityX = velocityPointAX - velocityPointBX, relativeVelocityY = velocityPointAY - velocityPointBY;
                  var normalVelocity = normalX * relativeVelocityX + normalY * relativeVelocityY, tangentVelocity = tangentX * relativeVelocityX + tangentY * relativeVelocityY;
                  var normalOverlap = pair.separation + normalVelocity;
                  var normalForce = Math.min(normalOverlap, 1);
                  normalForce = normalOverlap < 0 ? 0 : normalForce;
                  var frictionLimit = normalForce * friction;
                  if (tangentVelocity < -frictionLimit || tangentVelocity > frictionLimit) {
                    maxFriction = tangentVelocity > 0 ? tangentVelocity : -tangentVelocity;
                    tangentImpulse = pair.friction * (tangentVelocity > 0 ? 1 : -1) * timeScaleCubed;
                    if (tangentImpulse < -maxFriction) {
                      tangentImpulse = -maxFriction;
                    } else if (tangentImpulse > maxFriction) {
                      tangentImpulse = maxFriction;
                    }
                  } else {
                    tangentImpulse = tangentVelocity;
                    maxFriction = frictionMaxStatic;
                  }
                  var oAcN = offsetAX * normalY - offsetAY * normalX, oBcN = offsetBX * normalY - offsetBY * normalX, share = contactShare / (inverseMassTotal + bodyA.inverseInertia * oAcN * oAcN + bodyB.inverseInertia * oBcN * oBcN);
                  var normalImpulse = (1 + pair.restitution) * normalVelocity * share;
                  tangentImpulse *= share;
                  if (normalVelocity < restingThresh) {
                    contact.normalImpulse = 0;
                  } else {
                    var contactNormalImpulse = contact.normalImpulse;
                    contact.normalImpulse += normalImpulse;
                    if (contact.normalImpulse > 0)
                      contact.normalImpulse = 0;
                    normalImpulse = contact.normalImpulse - contactNormalImpulse;
                  }
                  if (tangentVelocity < -restingThreshTangent || tangentVelocity > restingThreshTangent) {
                    contact.tangentImpulse = 0;
                  } else {
                    var contactTangentImpulse = contact.tangentImpulse;
                    contact.tangentImpulse += tangentImpulse;
                    if (contact.tangentImpulse < -maxFriction)
                      contact.tangentImpulse = -maxFriction;
                    if (contact.tangentImpulse > maxFriction)
                      contact.tangentImpulse = maxFriction;
                    tangentImpulse = contact.tangentImpulse - contactTangentImpulse;
                  }
                  var impulseX = normalX * normalImpulse + tangentX * tangentImpulse, impulseY = normalY * normalImpulse + tangentY * tangentImpulse;
                  if (!(bodyA.isStatic || bodyA.isSleeping)) {
                    bodyA.positionPrev.x += impulseX * bodyA.inverseMass;
                    bodyA.positionPrev.y += impulseY * bodyA.inverseMass;
                    bodyA.anglePrev += (offsetAX * impulseY - offsetAY * impulseX) * bodyA.inverseInertia;
                  }
                  if (!(bodyB.isStatic || bodyB.isSleeping)) {
                    bodyB.positionPrev.x -= impulseX * bodyB.inverseMass;
                    bodyB.positionPrev.y -= impulseY * bodyB.inverseMass;
                    bodyB.anglePrev -= (offsetBX * impulseY - offsetBY * impulseX) * bodyB.inverseInertia;
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Pairs = {};
          module3.exports = Pairs;
          var Pair = __webpack_require__(9);
          var Common = __webpack_require__(0);
          (function() {
            Pairs.create = function(options) {
              return Common.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, options);
            };
            Pairs.update = function(pairs, collisions, timestamp) {
              var pairsList = pairs.list, pairsListLength = pairsList.length, pairsTable = pairs.table, collisionsLength = collisions.length, collisionStart = pairs.collisionStart, collisionEnd = pairs.collisionEnd, collisionActive = pairs.collisionActive, collision, pairIndex, pair, i;
              collisionStart.length = 0;
              collisionEnd.length = 0;
              collisionActive.length = 0;
              for (i = 0; i < pairsListLength; i++) {
                pairsList[i].confirmedActive = false;
              }
              for (i = 0; i < collisionsLength; i++) {
                collision = collisions[i];
                pair = collision.pair;
                if (pair) {
                  if (pair.isActive) {
                    collisionActive.push(pair);
                  } else {
                    collisionStart.push(pair);
                  }
                  Pair.update(pair, collision, timestamp);
                  pair.confirmedActive = true;
                } else {
                  pair = Pair.create(collision, timestamp);
                  pairsTable[pair.id] = pair;
                  collisionStart.push(pair);
                  pairsList.push(pair);
                }
              }
              var removePairIndex = [];
              pairsListLength = pairsList.length;
              for (i = 0; i < pairsListLength; i++) {
                pair = pairsList[i];
                if (!pair.confirmedActive) {
                  Pair.setActive(pair, false, timestamp);
                  collisionEnd.push(pair);
                  if (!pair.collision.bodyA.isSleeping && !pair.collision.bodyB.isSleeping) {
                    removePairIndex.push(i);
                  }
                }
              }
              for (i = 0; i < removePairIndex.length; i++) {
                pairIndex = removePairIndex[i] - i;
                pair = pairsList[pairIndex];
                pairsList.splice(pairIndex, 1);
                delete pairsTable[pair.id];
              }
            };
            Pairs.clear = function(pairs) {
              pairs.table = {};
              pairs.list.length = 0;
              pairs.collisionStart.length = 0;
              pairs.collisionActive.length = 0;
              pairs.collisionEnd.length = 0;
              return pairs;
            };
          })();
        },
        /* 20 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Matter = module3.exports = __webpack_require__(21);
          Matter.Axes = __webpack_require__(11);
          Matter.Bodies = __webpack_require__(12);
          Matter.Body = __webpack_require__(4);
          Matter.Bounds = __webpack_require__(1);
          Matter.Collision = __webpack_require__(8);
          Matter.Common = __webpack_require__(0);
          Matter.Composite = __webpack_require__(6);
          Matter.Composites = __webpack_require__(22);
          Matter.Constraint = __webpack_require__(10);
          Matter.Contact = __webpack_require__(16);
          Matter.Detector = __webpack_require__(13);
          Matter.Engine = __webpack_require__(17);
          Matter.Events = __webpack_require__(5);
          Matter.Grid = __webpack_require__(23);
          Matter.Mouse = __webpack_require__(14);
          Matter.MouseConstraint = __webpack_require__(24);
          Matter.Pair = __webpack_require__(9);
          Matter.Pairs = __webpack_require__(19);
          Matter.Plugin = __webpack_require__(15);
          Matter.Query = __webpack_require__(25);
          Matter.Render = __webpack_require__(26);
          Matter.Resolver = __webpack_require__(18);
          Matter.Runner = __webpack_require__(27);
          Matter.SAT = __webpack_require__(28);
          Matter.Sleeping = __webpack_require__(7);
          Matter.Svg = __webpack_require__(29);
          Matter.Vector = __webpack_require__(2);
          Matter.Vertices = __webpack_require__(3);
          Matter.World = __webpack_require__(30);
          Matter.Engine.run = Matter.Runner.run;
          Matter.Common.deprecated(Matter.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Matter = {};
          module3.exports = Matter;
          var Plugin = __webpack_require__(15);
          var Common = __webpack_require__(0);
          (function() {
            Matter.name = "matter-js";
            Matter.version = "0.19.0";
            Matter.uses = [];
            Matter.used = [];
            Matter.use = function() {
              Plugin.use(Matter, Array.prototype.slice.call(arguments));
            };
            Matter.before = function(path, func) {
              path = path.replace(/^Matter./, "");
              return Common.chainPathBefore(Matter, path, func);
            };
            Matter.after = function(path, func) {
              path = path.replace(/^Matter./, "");
              return Common.chainPathAfter(Matter, path, func);
            };
          })();
        },
        /* 22 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Composites = {};
          module3.exports = Composites;
          var Composite = __webpack_require__(6);
          var Constraint = __webpack_require__(10);
          var Common = __webpack_require__(0);
          var Body = __webpack_require__(4);
          var Bodies = __webpack_require__(12);
          var deprecated = Common.deprecated;
          (function() {
            Composites.stack = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
              var stack2 = Composite.create({ label: "Stack" }), x = xx, y = yy, lastBody, i = 0;
              for (var row = 0; row < rows; row++) {
                var maxHeight = 0;
                for (var column = 0; column < columns; column++) {
                  var body = callback(x, y, column, row, lastBody, i);
                  if (body) {
                    var bodyHeight = body.bounds.max.y - body.bounds.min.y, bodyWidth = body.bounds.max.x - body.bounds.min.x;
                    if (bodyHeight > maxHeight)
                      maxHeight = bodyHeight;
                    Body.translate(body, { x: bodyWidth * 0.5, y: bodyHeight * 0.5 });
                    x = body.bounds.max.x + columnGap;
                    Composite.addBody(stack2, body);
                    lastBody = body;
                    i += 1;
                  } else {
                    x += columnGap;
                  }
                }
                y += maxHeight + rowGap;
                x = xx;
              }
              return stack2;
            };
            Composites.chain = function(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) {
              var bodies = composite.bodies;
              for (var i = 1; i < bodies.length; i++) {
                var bodyA = bodies[i - 1], bodyB = bodies[i], bodyAHeight = bodyA.bounds.max.y - bodyA.bounds.min.y, bodyAWidth = bodyA.bounds.max.x - bodyA.bounds.min.x, bodyBHeight = bodyB.bounds.max.y - bodyB.bounds.min.y, bodyBWidth = bodyB.bounds.max.x - bodyB.bounds.min.x;
                var defaults = {
                  bodyA,
                  pointA: { x: bodyAWidth * xOffsetA, y: bodyAHeight * yOffsetA },
                  bodyB,
                  pointB: { x: bodyBWidth * xOffsetB, y: bodyBHeight * yOffsetB }
                };
                var constraint = Common.extend(defaults, options);
                Composite.addConstraint(composite, Constraint.create(constraint));
              }
              composite.label += " Chain";
              return composite;
            };
            Composites.mesh = function(composite, columns, rows, crossBrace, options) {
              var bodies = composite.bodies, row, col, bodyA, bodyB, bodyC;
              for (row = 0; row < rows; row++) {
                for (col = 1; col < columns; col++) {
                  bodyA = bodies[col - 1 + row * columns];
                  bodyB = bodies[col + row * columns];
                  Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA, bodyB }, options)));
                }
                if (row > 0) {
                  for (col = 0; col < columns; col++) {
                    bodyA = bodies[col + (row - 1) * columns];
                    bodyB = bodies[col + row * columns];
                    Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA, bodyB }, options)));
                    if (crossBrace && col > 0) {
                      bodyC = bodies[col - 1 + (row - 1) * columns];
                      Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB }, options)));
                    }
                    if (crossBrace && col < columns - 1) {
                      bodyC = bodies[col + 1 + (row - 1) * columns];
                      Composite.addConstraint(composite, Constraint.create(Common.extend({ bodyA: bodyC, bodyB }, options)));
                    }
                  }
                }
              }
              composite.label += " Mesh";
              return composite;
            };
            Composites.pyramid = function(xx, yy, columns, rows, columnGap, rowGap, callback) {
              return Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y, column, row, lastBody, i) {
                var actualRows = Math.min(rows, Math.ceil(columns / 2)), lastBodyWidth = lastBody ? lastBody.bounds.max.x - lastBody.bounds.min.x : 0;
                if (row > actualRows)
                  return;
                row = actualRows - row;
                var start = row, end = columns - 1 - row;
                if (column < start || column > end)
                  return;
                if (i === 1) {
                  Body.translate(lastBody, { x: (column + (columns % 2 === 1 ? 1 : -1)) * lastBodyWidth, y: 0 });
                }
                var xOffset = lastBody ? column * lastBodyWidth : 0;
                return callback(xx + xOffset + column * columnGap, y, column, row, lastBody, i);
              });
            };
            Composites.newtonsCradle = function(xx, yy, number, size2, length) {
              var newtonsCradle = Composite.create({ label: "Newtons Cradle" });
              for (var i = 0; i < number; i++) {
                var separation = 1.9, circle = Bodies.circle(
                  xx + i * (size2 * separation),
                  yy + length,
                  size2,
                  { inertia: Infinity, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), constraint = Constraint.create({ pointA: { x: xx + i * (size2 * separation), y: yy }, bodyB: circle });
                Composite.addBody(newtonsCradle, circle);
                Composite.addConstraint(newtonsCradle, constraint);
              }
              return newtonsCradle;
            };
            deprecated(Composites, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example");
            Composites.car = function(xx, yy, width, height, wheelSize) {
              var group = Body.nextGroup(true), wheelBase = 20, wheelAOffset = -width * 0.5 + wheelBase, wheelBOffset = width * 0.5 - wheelBase, wheelYOffset = 0;
              var car = Composite.create({ label: "Car" }), body = Bodies.rectangle(xx, yy, width, height, {
                collisionFilter: {
                  group
                },
                chamfer: {
                  radius: height * 0.5
                },
                density: 2e-4
              });
              var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
                collisionFilter: {
                  group
                },
                friction: 0.8
              });
              var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
                collisionFilter: {
                  group
                },
                friction: 0.8
              });
              var axelA = Constraint.create({
                bodyB: body,
                pointB: { x: wheelAOffset, y: wheelYOffset },
                bodyA: wheelA,
                stiffness: 1,
                length: 0
              });
              var axelB = Constraint.create({
                bodyB: body,
                pointB: { x: wheelBOffset, y: wheelYOffset },
                bodyA: wheelB,
                stiffness: 1,
                length: 0
              });
              Composite.addBody(car, body);
              Composite.addBody(car, wheelA);
              Composite.addBody(car, wheelB);
              Composite.addConstraint(car, axelA);
              Composite.addConstraint(car, axelB);
              return car;
            };
            deprecated(Composites, "car", "Composites.car ➤ moved to car example");
            Composites.softBody = function(xx, yy, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions) {
              particleOptions = Common.extend({ inertia: Infinity }, particleOptions);
              constraintOptions = Common.extend({ stiffness: 0.2, render: { type: "line", anchors: false } }, constraintOptions);
              var softBody = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
                return Bodies.circle(x, y, particleRadius, particleOptions);
              });
              Composites.mesh(softBody, columns, rows, crossBrace, constraintOptions);
              softBody.label = "Soft Body";
              return softBody;
            };
            deprecated(Composites, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Grid = {};
          module3.exports = Grid;
          var Pair = __webpack_require__(9);
          var Common = __webpack_require__(0);
          var deprecated = Common.deprecated;
          (function() {
            Grid.create = function(options) {
              var defaults = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return Common.extend(defaults, options);
            };
            Grid.update = function(grid, bodies, engine, forceUpdate) {
              var i, col, row, world = engine.world, buckets = grid.buckets, bucket, bucketId, gridChanged = false;
              for (i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (body.isSleeping && !forceUpdate)
                  continue;
                if (world.bounds && (body.bounds.max.x < world.bounds.min.x || body.bounds.min.x > world.bounds.max.x || body.bounds.max.y < world.bounds.min.y || body.bounds.min.y > world.bounds.max.y))
                  continue;
                var newRegion = Grid._getRegion(grid, body);
                if (!body.region || newRegion.id !== body.region.id || forceUpdate) {
                  if (!body.region || forceUpdate)
                    body.region = newRegion;
                  var union = Grid._regionUnion(newRegion, body.region);
                  for (col = union.startCol; col <= union.endCol; col++) {
                    for (row = union.startRow; row <= union.endRow; row++) {
                      bucketId = Grid._getBucketId(col, row);
                      bucket = buckets[bucketId];
                      var isInsideNewRegion = col >= newRegion.startCol && col <= newRegion.endCol && row >= newRegion.startRow && row <= newRegion.endRow;
                      var isInsideOldRegion = col >= body.region.startCol && col <= body.region.endCol && row >= body.region.startRow && row <= body.region.endRow;
                      if (!isInsideNewRegion && isInsideOldRegion) {
                        if (isInsideOldRegion) {
                          if (bucket)
                            Grid._bucketRemoveBody(grid, bucket, body);
                        }
                      }
                      if (body.region === newRegion || isInsideNewRegion && !isInsideOldRegion || forceUpdate) {
                        if (!bucket)
                          bucket = Grid._createBucket(buckets, bucketId);
                        Grid._bucketAddBody(grid, bucket, body);
                      }
                    }
                  }
                  body.region = newRegion;
                  gridChanged = true;
                }
              }
              if (gridChanged)
                grid.pairsList = Grid._createActivePairsList(grid);
            };
            deprecated(Grid, "update", "Grid.update ➤ replaced by Matter.Detector");
            Grid.clear = function(grid) {
              grid.buckets = {};
              grid.pairs = {};
              grid.pairsList = [];
            };
            deprecated(Grid, "clear", "Grid.clear ➤ replaced by Matter.Detector");
            Grid._regionUnion = function(regionA, regionB) {
              var startCol = Math.min(regionA.startCol, regionB.startCol), endCol = Math.max(regionA.endCol, regionB.endCol), startRow = Math.min(regionA.startRow, regionB.startRow), endRow = Math.max(regionA.endRow, regionB.endRow);
              return Grid._createRegion(startCol, endCol, startRow, endRow);
            };
            Grid._getRegion = function(grid, body) {
              var bounds = body.bounds, startCol = Math.floor(bounds.min.x / grid.bucketWidth), endCol = Math.floor(bounds.max.x / grid.bucketWidth), startRow = Math.floor(bounds.min.y / grid.bucketHeight), endRow = Math.floor(bounds.max.y / grid.bucketHeight);
              return Grid._createRegion(startCol, endCol, startRow, endRow);
            };
            Grid._createRegion = function(startCol, endCol, startRow, endRow) {
              return {
                id: startCol + "," + endCol + "," + startRow + "," + endRow,
                startCol,
                endCol,
                startRow,
                endRow
              };
            };
            Grid._getBucketId = function(column, row) {
              return "C" + column + "R" + row;
            };
            Grid._createBucket = function(buckets, bucketId) {
              var bucket = buckets[bucketId] = [];
              return bucket;
            };
            Grid._bucketAddBody = function(grid, bucket, body) {
              var gridPairs = grid.pairs, pairId = Pair.id, bucketLength = bucket.length, i;
              for (i = 0; i < bucketLength; i++) {
                var bodyB = bucket[i];
                if (body.id === bodyB.id || body.isStatic && bodyB.isStatic)
                  continue;
                var id = pairId(body, bodyB), pair = gridPairs[id];
                if (pair) {
                  pair[2] += 1;
                } else {
                  gridPairs[id] = [body, bodyB, 1];
                }
              }
              bucket.push(body);
            };
            Grid._bucketRemoveBody = function(grid, bucket, body) {
              var gridPairs = grid.pairs, pairId = Pair.id, i;
              bucket.splice(Common.indexOf(bucket, body), 1);
              var bucketLength = bucket.length;
              for (i = 0; i < bucketLength; i++) {
                var pair = gridPairs[pairId(body, bucket[i])];
                if (pair)
                  pair[2] -= 1;
              }
            };
            Grid._createActivePairsList = function(grid) {
              var pair, gridPairs = grid.pairs, pairKeys = Common.keys(gridPairs), pairKeysLength = pairKeys.length, pairs = [], k;
              for (k = 0; k < pairKeysLength; k++) {
                pair = gridPairs[pairKeys[k]];
                if (pair[2] > 0) {
                  pairs.push(pair);
                } else {
                  delete gridPairs[pairKeys[k]];
                }
              }
              return pairs;
            };
          })();
        },
        /* 24 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var MouseConstraint = {};
          module3.exports = MouseConstraint;
          var Vertices = __webpack_require__(3);
          var Sleeping = __webpack_require__(7);
          var Mouse = __webpack_require__(14);
          var Events = __webpack_require__(5);
          var Detector = __webpack_require__(13);
          var Constraint = __webpack_require__(10);
          var Composite = __webpack_require__(6);
          var Common = __webpack_require__(0);
          var Bounds = __webpack_require__(1);
          (function() {
            MouseConstraint.create = function(engine, options) {
              var mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null);
              if (!mouse) {
                if (engine && engine.render && engine.render.canvas) {
                  mouse = Mouse.create(engine.render.canvas);
                } else if (options && options.element) {
                  mouse = Mouse.create(options.element);
                } else {
                  mouse = Mouse.create();
                  Common.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected");
                }
              }
              var constraint = Constraint.create({
                label: "Mouse Constraint",
                pointA: mouse.position,
                pointB: { x: 0, y: 0 },
                length: 0.01,
                stiffness: 0.1,
                angularStiffness: 1,
                render: {
                  strokeStyle: "#90EE90",
                  lineWidth: 3
                }
              });
              var defaults = {
                type: "mouseConstraint",
                mouse,
                element: null,
                body: null,
                constraint,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                }
              };
              var mouseConstraint = Common.extend(defaults, options);
              Events.on(engine, "beforeUpdate", function() {
                var allBodies = Composite.allBodies(engine.world);
                MouseConstraint.update(mouseConstraint, allBodies);
                MouseConstraint._triggerEvents(mouseConstraint);
              });
              return mouseConstraint;
            };
            MouseConstraint.update = function(mouseConstraint, bodies) {
              var mouse = mouseConstraint.mouse, constraint = mouseConstraint.constraint, body = mouseConstraint.body;
              if (mouse.button === 0) {
                if (!constraint.bodyB) {
                  for (var i = 0; i < bodies.length; i++) {
                    body = bodies[i];
                    if (Bounds.contains(body.bounds, mouse.position) && Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
                      for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                        var part = body.parts[j];
                        if (Vertices.contains(part.vertices, mouse.position)) {
                          constraint.pointA = mouse.position;
                          constraint.bodyB = mouseConstraint.body = body;
                          constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y };
                          constraint.angleB = body.angle;
                          Sleeping.set(body, false);
                          Events.trigger(mouseConstraint, "startdrag", { mouse, body });
                          break;
                        }
                      }
                    }
                  }
                } else {
                  Sleeping.set(constraint.bodyB, false);
                  constraint.pointA = mouse.position;
                }
              } else {
                constraint.bodyB = mouseConstraint.body = null;
                constraint.pointB = null;
                if (body)
                  Events.trigger(mouseConstraint, "enddrag", { mouse, body });
              }
            };
            MouseConstraint._triggerEvents = function(mouseConstraint) {
              var mouse = mouseConstraint.mouse, mouseEvents = mouse.sourceEvents;
              if (mouseEvents.mousemove)
                Events.trigger(mouseConstraint, "mousemove", { mouse });
              if (mouseEvents.mousedown)
                Events.trigger(mouseConstraint, "mousedown", { mouse });
              if (mouseEvents.mouseup)
                Events.trigger(mouseConstraint, "mouseup", { mouse });
              Mouse.clearSourceEvents(mouse);
            };
          })();
        },
        /* 25 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Query = {};
          module3.exports = Query;
          var Vector = __webpack_require__(2);
          var Collision = __webpack_require__(8);
          var Bounds = __webpack_require__(1);
          var Bodies = __webpack_require__(12);
          var Vertices = __webpack_require__(3);
          (function() {
            Query.collides = function(body, bodies) {
              var collisions = [], bodiesLength = bodies.length, bounds = body.bounds, collides = Collision.collides, overlaps = Bounds.overlaps;
              for (var i = 0; i < bodiesLength; i++) {
                var bodyA = bodies[i], partsALength = bodyA.parts.length, partsAStart = partsALength === 1 ? 0 : 1;
                if (overlaps(bodyA.bounds, bounds)) {
                  for (var j = partsAStart; j < partsALength; j++) {
                    var part = bodyA.parts[j];
                    if (overlaps(part.bounds, bounds)) {
                      var collision = collides(part, body);
                      if (collision) {
                        collisions.push(collision);
                        break;
                      }
                    }
                  }
                }
              }
              return collisions;
            };
            Query.ray = function(bodies, startPoint, endPoint, rayWidth) {
              rayWidth = rayWidth || 1e-100;
              var rayAngle = Vector.angle(startPoint, endPoint), rayLength = Vector.magnitude(Vector.sub(startPoint, endPoint)), rayX = (endPoint.x + startPoint.x) * 0.5, rayY = (endPoint.y + startPoint.y) * 0.5, ray = Bodies.rectangle(rayX, rayY, rayLength, rayWidth, { angle: rayAngle }), collisions = Query.collides(ray, bodies);
              for (var i = 0; i < collisions.length; i += 1) {
                var collision = collisions[i];
                collision.body = collision.bodyB = collision.bodyA;
              }
              return collisions;
            };
            Query.region = function(bodies, bounds, outside) {
              var result = [];
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i], overlaps = Bounds.overlaps(body.bounds, bounds);
                if (overlaps && !outside || !overlaps && outside)
                  result.push(body);
              }
              return result;
            };
            Query.point = function(bodies, point) {
              var result = [];
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (Bounds.contains(body.bounds, point)) {
                  for (var j = body.parts.length === 1 ? 0 : 1; j < body.parts.length; j++) {
                    var part = body.parts[j];
                    if (Bounds.contains(part.bounds, point) && Vertices.contains(part.vertices, point)) {
                      result.push(body);
                      break;
                    }
                  }
                }
              }
              return result;
            };
          })();
        },
        /* 26 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Render = {};
          module3.exports = Render;
          var Body = __webpack_require__(4);
          var Common = __webpack_require__(0);
          var Composite = __webpack_require__(6);
          var Bounds = __webpack_require__(1);
          var Events = __webpack_require__(5);
          var Vector = __webpack_require__(2);
          var Mouse = __webpack_require__(14);
          (function() {
            var _requestAnimationFrame, _cancelAnimationFrame;
            if (typeof window !== "undefined") {
              _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(function() {
                  callback(Common.now());
                }, 1e3 / 60);
              };
              _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            }
            Render._goodFps = 30;
            Render._goodDelta = 1e3 / 60;
            Render.create = function(options) {
              var defaults = {
                engine: null,
                element: null,
                canvas: null,
                mouse: null,
                frameRequestId: null,
                timing: {
                  historySize: 60,
                  delta: 0,
                  deltaHistory: [],
                  lastTime: 0,
                  lastTimestamp: 0,
                  lastElapsed: 0,
                  timestampElapsed: 0,
                  timestampElapsedHistory: [],
                  engineDeltaHistory: [],
                  engineElapsedHistory: [],
                  elapsedHistory: []
                },
                options: {
                  width: 800,
                  height: 600,
                  pixelRatio: 1,
                  background: "#14151f",
                  wireframeBackground: "#14151f",
                  hasBounds: !!options.bounds,
                  enabled: true,
                  wireframes: true,
                  showSleeping: true,
                  showDebug: false,
                  showStats: false,
                  showPerformance: false,
                  showBounds: false,
                  showVelocity: false,
                  showCollisions: false,
                  showSeparations: false,
                  showAxes: false,
                  showPositions: false,
                  showAngleIndicator: false,
                  showIds: false,
                  showVertexNumbers: false,
                  showConvexHulls: false,
                  showInternalEdges: false,
                  showMousePosition: false
                }
              };
              var render = Common.extend(defaults, options);
              if (render.canvas) {
                render.canvas.width = render.options.width || render.canvas.width;
                render.canvas.height = render.options.height || render.canvas.height;
              }
              render.mouse = options.mouse;
              render.engine = options.engine;
              render.canvas = render.canvas || _createCanvas(render.options.width, render.options.height);
              render.context = render.canvas.getContext("2d");
              render.textures = {};
              render.bounds = render.bounds || {
                min: {
                  x: 0,
                  y: 0
                },
                max: {
                  x: render.canvas.width,
                  y: render.canvas.height
                }
              };
              render.controller = Render;
              render.options.showBroadphase = false;
              if (render.options.pixelRatio !== 1) {
                Render.setPixelRatio(render, render.options.pixelRatio);
              }
              if (Common.isElement(render.element)) {
                render.element.appendChild(render.canvas);
              }
              return render;
            };
            Render.run = function(render) {
              (function loop(time) {
                render.frameRequestId = _requestAnimationFrame(loop);
                _updateTiming(render, time);
                Render.world(render, time);
                if (render.options.showStats || render.options.showDebug) {
                  Render.stats(render, render.context, time);
                }
                if (render.options.showPerformance || render.options.showDebug) {
                  Render.performance(render, render.context, time);
                }
              })();
            };
            Render.stop = function(render) {
              _cancelAnimationFrame(render.frameRequestId);
            };
            Render.setPixelRatio = function(render, pixelRatio) {
              var options = render.options, canvas = render.canvas;
              if (pixelRatio === "auto") {
                pixelRatio = _getPixelRatio(canvas);
              }
              options.pixelRatio = pixelRatio;
              canvas.setAttribute("data-pixel-ratio", pixelRatio);
              canvas.width = options.width * pixelRatio;
              canvas.height = options.height * pixelRatio;
              canvas.style.width = options.width + "px";
              canvas.style.height = options.height + "px";
            };
            Render.lookAt = function(render, objects, padding, center) {
              center = typeof center !== "undefined" ? center : true;
              objects = Common.isArray(objects) ? objects : [objects];
              padding = padding || {
                x: 0,
                y: 0
              };
              var bounds = {
                min: { x: Infinity, y: Infinity },
                max: { x: -Infinity, y: -Infinity }
              };
              for (var i = 0; i < objects.length; i += 1) {
                var object = objects[i], min = object.bounds ? object.bounds.min : object.min || object.position || object, max = object.bounds ? object.bounds.max : object.max || object.position || object;
                if (min && max) {
                  if (min.x < bounds.min.x)
                    bounds.min.x = min.x;
                  if (max.x > bounds.max.x)
                    bounds.max.x = max.x;
                  if (min.y < bounds.min.y)
                    bounds.min.y = min.y;
                  if (max.y > bounds.max.y)
                    bounds.max.y = max.y;
                }
              }
              var width = bounds.max.x - bounds.min.x + 2 * padding.x, height = bounds.max.y - bounds.min.y + 2 * padding.y, viewHeight = render.canvas.height, viewWidth = render.canvas.width, outerRatio = viewWidth / viewHeight, innerRatio = width / height, scaleX = 1, scaleY = 1;
              if (innerRatio > outerRatio) {
                scaleY = innerRatio / outerRatio;
              } else {
                scaleX = outerRatio / innerRatio;
              }
              render.options.hasBounds = true;
              render.bounds.min.x = bounds.min.x;
              render.bounds.max.x = bounds.min.x + width * scaleX;
              render.bounds.min.y = bounds.min.y;
              render.bounds.max.y = bounds.min.y + height * scaleY;
              if (center) {
                render.bounds.min.x += width * 0.5 - width * scaleX * 0.5;
                render.bounds.max.x += width * 0.5 - width * scaleX * 0.5;
                render.bounds.min.y += height * 0.5 - height * scaleY * 0.5;
                render.bounds.max.y += height * 0.5 - height * scaleY * 0.5;
              }
              render.bounds.min.x -= padding.x;
              render.bounds.max.x -= padding.x;
              render.bounds.min.y -= padding.y;
              render.bounds.max.y -= padding.y;
              if (render.mouse) {
                Mouse.setScale(render.mouse, {
                  x: (render.bounds.max.x - render.bounds.min.x) / render.canvas.width,
                  y: (render.bounds.max.y - render.bounds.min.y) / render.canvas.height
                });
                Mouse.setOffset(render.mouse, render.bounds.min);
              }
            };
            Render.startViewTransform = function(render) {
              var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
              render.context.setTransform(
                render.options.pixelRatio / boundsScaleX,
                0,
                0,
                render.options.pixelRatio / boundsScaleY,
                0,
                0
              );
              render.context.translate(-render.bounds.min.x, -render.bounds.min.y);
            };
            Render.endViewTransform = function(render) {
              render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
            };
            Render.world = function(render, time) {
              var startTime = Common.now(), engine = render.engine, world = engine.world, canvas = render.canvas, context = render.context, options = render.options, timing = render.timing;
              var allBodies = Composite.allBodies(world), allConstraints = Composite.allConstraints(world), background = options.wireframes ? options.wireframeBackground : options.background, bodies = [], constraints = [], i;
              var event = {
                timestamp: engine.timing.timestamp
              };
              Events.trigger(render, "beforeRender", event);
              if (render.currentBackground !== background)
                _applyBackground(render, background);
              context.globalCompositeOperation = "source-in";
              context.fillStyle = "transparent";
              context.fillRect(0, 0, canvas.width, canvas.height);
              context.globalCompositeOperation = "source-over";
              if (options.hasBounds) {
                for (i = 0; i < allBodies.length; i++) {
                  var body = allBodies[i];
                  if (Bounds.overlaps(body.bounds, render.bounds))
                    bodies.push(body);
                }
                for (i = 0; i < allConstraints.length; i++) {
                  var constraint = allConstraints[i], bodyA = constraint.bodyA, bodyB = constraint.bodyB, pointAWorld = constraint.pointA, pointBWorld = constraint.pointB;
                  if (bodyA)
                    pointAWorld = Vector.add(bodyA.position, constraint.pointA);
                  if (bodyB)
                    pointBWorld = Vector.add(bodyB.position, constraint.pointB);
                  if (!pointAWorld || !pointBWorld)
                    continue;
                  if (Bounds.contains(render.bounds, pointAWorld) || Bounds.contains(render.bounds, pointBWorld))
                    constraints.push(constraint);
                }
                Render.startViewTransform(render);
                if (render.mouse) {
                  Mouse.setScale(render.mouse, {
                    x: (render.bounds.max.x - render.bounds.min.x) / render.options.width,
                    y: (render.bounds.max.y - render.bounds.min.y) / render.options.height
                  });
                  Mouse.setOffset(render.mouse, render.bounds.min);
                }
              } else {
                constraints = allConstraints;
                bodies = allBodies;
                if (render.options.pixelRatio !== 1) {
                  render.context.setTransform(render.options.pixelRatio, 0, 0, render.options.pixelRatio, 0, 0);
                }
              }
              if (!options.wireframes || engine.enableSleeping && options.showSleeping) {
                Render.bodies(render, bodies, context);
              } else {
                if (options.showConvexHulls)
                  Render.bodyConvexHulls(render, bodies, context);
                Render.bodyWireframes(render, bodies, context);
              }
              if (options.showBounds)
                Render.bodyBounds(render, bodies, context);
              if (options.showAxes || options.showAngleIndicator)
                Render.bodyAxes(render, bodies, context);
              if (options.showPositions)
                Render.bodyPositions(render, bodies, context);
              if (options.showVelocity)
                Render.bodyVelocity(render, bodies, context);
              if (options.showIds)
                Render.bodyIds(render, bodies, context);
              if (options.showSeparations)
                Render.separations(render, engine.pairs.list, context);
              if (options.showCollisions)
                Render.collisions(render, engine.pairs.list, context);
              if (options.showVertexNumbers)
                Render.vertexNumbers(render, bodies, context);
              if (options.showMousePosition)
                Render.mousePosition(render, render.mouse, context);
              Render.constraints(constraints, context);
              if (options.hasBounds) {
                Render.endViewTransform(render);
              }
              Events.trigger(render, "afterRender", event);
              timing.lastElapsed = Common.now() - startTime;
            };
            Render.stats = function(render, context, time) {
              var engine = render.engine, world = engine.world, bodies = Composite.allBodies(world), parts = 0, width = 55, height = 44, x = 0, y = 0;
              for (var i = 0; i < bodies.length; i += 1) {
                parts += bodies[i].parts.length;
              }
              var sections = {
                "Part": parts,
                "Body": bodies.length,
                "Cons": Composite.allConstraints(world).length,
                "Comp": Composite.allComposites(world).length,
                "Pair": engine.pairs.list.length
              };
              context.fillStyle = "#0e0f19";
              context.fillRect(x, y, width * 5.5, height);
              context.font = "12px Arial";
              context.textBaseline = "top";
              context.textAlign = "right";
              for (var key in sections) {
                var section = sections[key];
                context.fillStyle = "#aaa";
                context.fillText(key, x + width, y + 8);
                context.fillStyle = "#eee";
                context.fillText(section, x + width, y + 26);
                x += width;
              }
            };
            Render.performance = function(render, context) {
              var engine = render.engine, timing = render.timing, deltaHistory = timing.deltaHistory, elapsedHistory = timing.elapsedHistory, timestampElapsedHistory = timing.timestampElapsedHistory, engineDeltaHistory = timing.engineDeltaHistory, engineElapsedHistory = timing.engineElapsedHistory, lastEngineDelta = engine.timing.lastDelta;
              var deltaMean = _mean(deltaHistory), elapsedMean = _mean(elapsedHistory), engineDeltaMean = _mean(engineDeltaHistory), engineElapsedMean = _mean(engineElapsedHistory), timestampElapsedMean = _mean(timestampElapsedHistory), rateMean = timestampElapsedMean / deltaMean || 0, fps = 1e3 / deltaMean || 0;
              var graphHeight = 4, gap = 12, width = 60, height = 34, x = 10, y = 69;
              context.fillStyle = "#0e0f19";
              context.fillRect(0, 50, gap * 4 + width * 5 + 22, height);
              Render.status(
                context,
                x,
                y,
                width,
                graphHeight,
                deltaHistory.length,
                Math.round(fps) + " fps",
                fps / Render._goodFps,
                function(i) {
                  return deltaHistory[i] / deltaMean - 1;
                }
              );
              Render.status(
                context,
                x + gap + width,
                y,
                width,
                graphHeight,
                engineDeltaHistory.length,
                lastEngineDelta.toFixed(2) + " dt",
                Render._goodDelta / lastEngineDelta,
                function(i) {
                  return engineDeltaHistory[i] / engineDeltaMean - 1;
                }
              );
              Render.status(
                context,
                x + (gap + width) * 2,
                y,
                width,
                graphHeight,
                engineElapsedHistory.length,
                engineElapsedMean.toFixed(2) + " ut",
                1 - engineElapsedMean / Render._goodFps,
                function(i) {
                  return engineElapsedHistory[i] / engineElapsedMean - 1;
                }
              );
              Render.status(
                context,
                x + (gap + width) * 3,
                y,
                width,
                graphHeight,
                elapsedHistory.length,
                elapsedMean.toFixed(2) + " rt",
                1 - elapsedMean / Render._goodFps,
                function(i) {
                  return elapsedHistory[i] / elapsedMean - 1;
                }
              );
              Render.status(
                context,
                x + (gap + width) * 4,
                y,
                width,
                graphHeight,
                timestampElapsedHistory.length,
                rateMean.toFixed(2) + " x",
                rateMean * rateMean * rateMean,
                function(i) {
                  return (timestampElapsedHistory[i] / deltaHistory[i] / rateMean || 0) - 1;
                }
              );
            };
            Render.status = function(context, x, y, width, height, count, label, indicator, plotY) {
              context.strokeStyle = "#888";
              context.fillStyle = "#444";
              context.lineWidth = 1;
              context.fillRect(x, y + 7, width, 1);
              context.beginPath();
              context.moveTo(x, y + 7 - height * Common.clamp(0.4 * plotY(0), -2, 2));
              for (var i = 0; i < width; i += 1) {
                context.lineTo(x + i, y + 7 - (i < count ? height * Common.clamp(0.4 * plotY(i), -2, 2) : 0));
              }
              context.stroke();
              context.fillStyle = "hsl(" + Common.clamp(25 + 95 * indicator, 0, 120) + ",100%,60%)";
              context.fillRect(x, y - 7, 4, 4);
              context.font = "12px Arial";
              context.textBaseline = "middle";
              context.textAlign = "right";
              context.fillStyle = "#eee";
              context.fillText(label, x + width, y - 5);
            };
            Render.constraints = function(constraints, context) {
              var c = context;
              for (var i = 0; i < constraints.length; i++) {
                var constraint = constraints[i];
                if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                  continue;
                var bodyA = constraint.bodyA, bodyB = constraint.bodyB, start, end;
                if (bodyA) {
                  start = Vector.add(bodyA.position, constraint.pointA);
                } else {
                  start = constraint.pointA;
                }
                if (constraint.render.type === "pin") {
                  c.beginPath();
                  c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                  c.closePath();
                } else {
                  if (bodyB) {
                    end = Vector.add(bodyB.position, constraint.pointB);
                  } else {
                    end = constraint.pointB;
                  }
                  c.beginPath();
                  c.moveTo(start.x, start.y);
                  if (constraint.render.type === "spring") {
                    var delta = Vector.sub(end, start), normal = Vector.perp(Vector.normalise(delta)), coils = Math.ceil(Common.clamp(constraint.length / 5, 12, 20)), offset;
                    for (var j = 1; j < coils; j += 1) {
                      offset = j % 2 === 0 ? 1 : -1;
                      c.lineTo(
                        start.x + delta.x * (j / coils) + normal.x * offset * 4,
                        start.y + delta.y * (j / coils) + normal.y * offset * 4
                      );
                    }
                  }
                  c.lineTo(end.x, end.y);
                }
                if (constraint.render.lineWidth) {
                  c.lineWidth = constraint.render.lineWidth;
                  c.strokeStyle = constraint.render.strokeStyle;
                  c.stroke();
                }
                if (constraint.render.anchors) {
                  c.fillStyle = constraint.render.strokeStyle;
                  c.beginPath();
                  c.arc(start.x, start.y, 3, 0, 2 * Math.PI);
                  c.arc(end.x, end.y, 3, 0, 2 * Math.PI);
                  c.closePath();
                  c.fill();
                }
              }
            };
            Render.bodies = function(render, bodies, context) {
              var c = context;
              render.engine;
              var options = render.options, showInternalEdges = options.showInternalEdges || !options.wireframes, body, part, i, k;
              for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (!body.render.visible)
                  continue;
                for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                  part = body.parts[k];
                  if (!part.render.visible)
                    continue;
                  if (options.showSleeping && body.isSleeping) {
                    c.globalAlpha = 0.5 * part.render.opacity;
                  } else if (part.render.opacity !== 1) {
                    c.globalAlpha = part.render.opacity;
                  }
                  if (part.render.sprite && part.render.sprite.texture && !options.wireframes) {
                    var sprite = part.render.sprite, texture = _getTexture(render, sprite.texture);
                    c.translate(part.position.x, part.position.y);
                    c.rotate(part.angle);
                    c.drawImage(
                      texture,
                      texture.width * -sprite.xOffset * sprite.xScale,
                      texture.height * -sprite.yOffset * sprite.yScale,
                      texture.width * sprite.xScale,
                      texture.height * sprite.yScale
                    );
                    c.rotate(-part.angle);
                    c.translate(-part.position.x, -part.position.y);
                  } else {
                    if (part.circleRadius) {
                      c.beginPath();
                      c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
                    } else {
                      c.beginPath();
                      c.moveTo(part.vertices[0].x, part.vertices[0].y);
                      for (var j = 1; j < part.vertices.length; j++) {
                        if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                          c.lineTo(part.vertices[j].x, part.vertices[j].y);
                        } else {
                          c.moveTo(part.vertices[j].x, part.vertices[j].y);
                        }
                        if (part.vertices[j].isInternal && !showInternalEdges) {
                          c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                        }
                      }
                      c.lineTo(part.vertices[0].x, part.vertices[0].y);
                      c.closePath();
                    }
                    if (!options.wireframes) {
                      c.fillStyle = part.render.fillStyle;
                      if (part.render.lineWidth) {
                        c.lineWidth = part.render.lineWidth;
                        c.strokeStyle = part.render.strokeStyle;
                        c.stroke();
                      }
                      c.fill();
                    } else {
                      c.lineWidth = 1;
                      c.strokeStyle = "#bbb";
                      c.stroke();
                    }
                  }
                  c.globalAlpha = 1;
                }
              }
            };
            Render.bodyWireframes = function(render, bodies, context) {
              var c = context, showInternalEdges = render.options.showInternalEdges, body, part, i, j, k;
              c.beginPath();
              for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (!body.render.visible)
                  continue;
                for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
                  part = body.parts[k];
                  c.moveTo(part.vertices[0].x, part.vertices[0].y);
                  for (j = 1; j < part.vertices.length; j++) {
                    if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                      c.lineTo(part.vertices[j].x, part.vertices[j].y);
                    } else {
                      c.moveTo(part.vertices[j].x, part.vertices[j].y);
                    }
                    if (part.vertices[j].isInternal && !showInternalEdges) {
                      c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                    }
                  }
                  c.lineTo(part.vertices[0].x, part.vertices[0].y);
                }
              }
              c.lineWidth = 1;
              c.strokeStyle = "#bbb";
              c.stroke();
            };
            Render.bodyConvexHulls = function(render, bodies, context) {
              var c = context, body, i, j;
              c.beginPath();
              for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (!body.render.visible || body.parts.length === 1)
                  continue;
                c.moveTo(body.vertices[0].x, body.vertices[0].y);
                for (j = 1; j < body.vertices.length; j++) {
                  c.lineTo(body.vertices[j].x, body.vertices[j].y);
                }
                c.lineTo(body.vertices[0].x, body.vertices[0].y);
              }
              c.lineWidth = 1;
              c.strokeStyle = "rgba(255,255,255,0.2)";
              c.stroke();
            };
            Render.vertexNumbers = function(render, bodies, context) {
              var c = context, i, j, k;
              for (i = 0; i < bodies.length; i++) {
                var parts = bodies[i].parts;
                for (k = parts.length > 1 ? 1 : 0; k < parts.length; k++) {
                  var part = parts[k];
                  for (j = 0; j < part.vertices.length; j++) {
                    c.fillStyle = "rgba(255,255,255,0.2)";
                    c.fillText(i + "_" + j, part.position.x + (part.vertices[j].x - part.position.x) * 0.8, part.position.y + (part.vertices[j].y - part.position.y) * 0.8);
                  }
                }
              }
            };
            Render.mousePosition = function(render, mouse, context) {
              var c = context;
              c.fillStyle = "rgba(255,255,255,0.8)";
              c.fillText(mouse.position.x + "  " + mouse.position.y, mouse.position.x + 5, mouse.position.y - 5);
            };
            Render.bodyBounds = function(render, bodies, context) {
              var c = context;
              render.engine;
              var options = render.options;
              c.beginPath();
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (body.render.visible) {
                  var parts = bodies[i].parts;
                  for (var j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    var part = parts[j];
                    c.rect(part.bounds.min.x, part.bounds.min.y, part.bounds.max.x - part.bounds.min.x, part.bounds.max.y - part.bounds.min.y);
                  }
                }
              }
              if (options.wireframes) {
                c.strokeStyle = "rgba(255,255,255,0.08)";
              } else {
                c.strokeStyle = "rgba(0,0,0,0.1)";
              }
              c.lineWidth = 1;
              c.stroke();
            };
            Render.bodyAxes = function(render, bodies, context) {
              var c = context;
              render.engine;
              var options = render.options, part, i, j, k;
              c.beginPath();
              for (i = 0; i < bodies.length; i++) {
                var body = bodies[i], parts = body.parts;
                if (!body.render.visible)
                  continue;
                if (options.showAxes) {
                  for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    part = parts[j];
                    for (k = 0; k < part.axes.length; k++) {
                      var axis = part.axes[k];
                      c.moveTo(part.position.x, part.position.y);
                      c.lineTo(part.position.x + axis.x * 20, part.position.y + axis.y * 20);
                    }
                  }
                } else {
                  for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                    part = parts[j];
                    for (k = 0; k < part.axes.length; k++) {
                      c.moveTo(part.position.x, part.position.y);
                      c.lineTo(
                        (part.vertices[0].x + part.vertices[part.vertices.length - 1].x) / 2,
                        (part.vertices[0].y + part.vertices[part.vertices.length - 1].y) / 2
                      );
                    }
                  }
                }
              }
              if (options.wireframes) {
                c.strokeStyle = "indianred";
                c.lineWidth = 1;
              } else {
                c.strokeStyle = "rgba(255, 255, 255, 0.4)";
                c.globalCompositeOperation = "overlay";
                c.lineWidth = 2;
              }
              c.stroke();
              c.globalCompositeOperation = "source-over";
            };
            Render.bodyPositions = function(render, bodies, context) {
              var c = context;
              render.engine;
              var options = render.options, body, part, i, k;
              c.beginPath();
              for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (!body.render.visible)
                  continue;
                for (k = 0; k < body.parts.length; k++) {
                  part = body.parts[k];
                  c.arc(part.position.x, part.position.y, 3, 0, 2 * Math.PI, false);
                  c.closePath();
                }
              }
              if (options.wireframes) {
                c.fillStyle = "indianred";
              } else {
                c.fillStyle = "rgba(0,0,0,0.5)";
              }
              c.fill();
              c.beginPath();
              for (i = 0; i < bodies.length; i++) {
                body = bodies[i];
                if (body.render.visible) {
                  c.arc(body.positionPrev.x, body.positionPrev.y, 2, 0, 2 * Math.PI, false);
                  c.closePath();
                }
              }
              c.fillStyle = "rgba(255,165,0,0.8)";
              c.fill();
            };
            Render.bodyVelocity = function(render, bodies, context) {
              var c = context;
              c.beginPath();
              for (var i = 0; i < bodies.length; i++) {
                var body = bodies[i];
                if (!body.render.visible)
                  continue;
                var velocity = Body.getVelocity(body);
                c.moveTo(body.position.x, body.position.y);
                c.lineTo(body.position.x + velocity.x, body.position.y + velocity.y);
              }
              c.lineWidth = 3;
              c.strokeStyle = "cornflowerblue";
              c.stroke();
            };
            Render.bodyIds = function(render, bodies, context) {
              var c = context, i, j;
              for (i = 0; i < bodies.length; i++) {
                if (!bodies[i].render.visible)
                  continue;
                var parts = bodies[i].parts;
                for (j = parts.length > 1 ? 1 : 0; j < parts.length; j++) {
                  var part = parts[j];
                  c.font = "12px Arial";
                  c.fillStyle = "rgba(255,255,255,0.5)";
                  c.fillText(part.id, part.position.x + 10, part.position.y - 10);
                }
              }
            };
            Render.collisions = function(render, pairs, context) {
              var c = context, options = render.options, pair, collision, i, j;
              c.beginPath();
              for (i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                if (!pair.isActive)
                  continue;
                collision = pair.collision;
                for (j = 0; j < pair.activeContacts.length; j++) {
                  var contact = pair.activeContacts[j], vertex = contact.vertex;
                  c.rect(vertex.x - 1.5, vertex.y - 1.5, 3.5, 3.5);
                }
              }
              if (options.wireframes) {
                c.fillStyle = "rgba(255,255,255,0.7)";
              } else {
                c.fillStyle = "orange";
              }
              c.fill();
              c.beginPath();
              for (i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                if (!pair.isActive)
                  continue;
                collision = pair.collision;
                if (pair.activeContacts.length > 0) {
                  var normalPosX = pair.activeContacts[0].vertex.x, normalPosY = pair.activeContacts[0].vertex.y;
                  if (pair.activeContacts.length === 2) {
                    normalPosX = (pair.activeContacts[0].vertex.x + pair.activeContacts[1].vertex.x) / 2;
                    normalPosY = (pair.activeContacts[0].vertex.y + pair.activeContacts[1].vertex.y) / 2;
                  }
                  if (collision.bodyB === collision.supports[0].body || collision.bodyA.isStatic === true) {
                    c.moveTo(normalPosX - collision.normal.x * 8, normalPosY - collision.normal.y * 8);
                  } else {
                    c.moveTo(normalPosX + collision.normal.x * 8, normalPosY + collision.normal.y * 8);
                  }
                  c.lineTo(normalPosX, normalPosY);
                }
              }
              if (options.wireframes) {
                c.strokeStyle = "rgba(255,165,0,0.7)";
              } else {
                c.strokeStyle = "orange";
              }
              c.lineWidth = 1;
              c.stroke();
            };
            Render.separations = function(render, pairs, context) {
              var c = context, options = render.options, pair, collision, bodyA, bodyB, i;
              c.beginPath();
              for (i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                if (!pair.isActive)
                  continue;
                collision = pair.collision;
                bodyA = collision.bodyA;
                bodyB = collision.bodyB;
                var k = 1;
                if (!bodyB.isStatic && !bodyA.isStatic)
                  k = 0.5;
                if (bodyB.isStatic)
                  k = 0;
                c.moveTo(bodyB.position.x, bodyB.position.y);
                c.lineTo(bodyB.position.x - collision.penetration.x * k, bodyB.position.y - collision.penetration.y * k);
                k = 1;
                if (!bodyB.isStatic && !bodyA.isStatic)
                  k = 0.5;
                if (bodyA.isStatic)
                  k = 0;
                c.moveTo(bodyA.position.x, bodyA.position.y);
                c.lineTo(bodyA.position.x + collision.penetration.x * k, bodyA.position.y + collision.penetration.y * k);
              }
              if (options.wireframes) {
                c.strokeStyle = "rgba(255,165,0,0.5)";
              } else {
                c.strokeStyle = "orange";
              }
              c.stroke();
            };
            Render.inspector = function(inspector, context) {
              inspector.engine;
              var selected = inspector.selected, render = inspector.render, options = render.options, bounds;
              if (options.hasBounds) {
                var boundsWidth = render.bounds.max.x - render.bounds.min.x, boundsHeight = render.bounds.max.y - render.bounds.min.y, boundsScaleX = boundsWidth / render.options.width, boundsScaleY = boundsHeight / render.options.height;
                context.scale(1 / boundsScaleX, 1 / boundsScaleY);
                context.translate(-render.bounds.min.x, -render.bounds.min.y);
              }
              for (var i = 0; i < selected.length; i++) {
                var item = selected[i].data;
                context.translate(0.5, 0.5);
                context.lineWidth = 1;
                context.strokeStyle = "rgba(255,165,0,0.9)";
                context.setLineDash([1, 2]);
                switch (item.type) {
                  case "body":
                    bounds = item.bounds;
                    context.beginPath();
                    context.rect(
                      Math.floor(bounds.min.x - 3),
                      Math.floor(bounds.min.y - 3),
                      Math.floor(bounds.max.x - bounds.min.x + 6),
                      Math.floor(bounds.max.y - bounds.min.y + 6)
                    );
                    context.closePath();
                    context.stroke();
                    break;
                  case "constraint":
                    var point = item.pointA;
                    if (item.bodyA)
                      point = item.pointB;
                    context.beginPath();
                    context.arc(point.x, point.y, 10, 0, 2 * Math.PI);
                    context.closePath();
                    context.stroke();
                    break;
                }
                context.setLineDash([]);
                context.translate(-0.5, -0.5);
              }
              if (inspector.selectStart !== null) {
                context.translate(0.5, 0.5);
                context.lineWidth = 1;
                context.strokeStyle = "rgba(255,165,0,0.6)";
                context.fillStyle = "rgba(255,165,0,0.1)";
                bounds = inspector.selectBounds;
                context.beginPath();
                context.rect(
                  Math.floor(bounds.min.x),
                  Math.floor(bounds.min.y),
                  Math.floor(bounds.max.x - bounds.min.x),
                  Math.floor(bounds.max.y - bounds.min.y)
                );
                context.closePath();
                context.stroke();
                context.fill();
                context.translate(-0.5, -0.5);
              }
              if (options.hasBounds)
                context.setTransform(1, 0, 0, 1, 0, 0);
            };
            var _updateTiming = function(render, time) {
              var engine = render.engine, timing = render.timing, historySize = timing.historySize, timestamp = engine.timing.timestamp;
              timing.delta = time - timing.lastTime || Render._goodDelta;
              timing.lastTime = time;
              timing.timestampElapsed = timestamp - timing.lastTimestamp || 0;
              timing.lastTimestamp = timestamp;
              timing.deltaHistory.unshift(timing.delta);
              timing.deltaHistory.length = Math.min(timing.deltaHistory.length, historySize);
              timing.engineDeltaHistory.unshift(engine.timing.lastDelta);
              timing.engineDeltaHistory.length = Math.min(timing.engineDeltaHistory.length, historySize);
              timing.timestampElapsedHistory.unshift(timing.timestampElapsed);
              timing.timestampElapsedHistory.length = Math.min(timing.timestampElapsedHistory.length, historySize);
              timing.engineElapsedHistory.unshift(engine.timing.lastElapsed);
              timing.engineElapsedHistory.length = Math.min(timing.engineElapsedHistory.length, historySize);
              timing.elapsedHistory.unshift(timing.lastElapsed);
              timing.elapsedHistory.length = Math.min(timing.elapsedHistory.length, historySize);
            };
            var _mean = function(values) {
              var result = 0;
              for (var i = 0; i < values.length; i += 1) {
                result += values[i];
              }
              return result / values.length || 0;
            };
            var _createCanvas = function(width, height) {
              var canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              canvas.oncontextmenu = function() {
                return false;
              };
              canvas.onselectstart = function() {
                return false;
              };
              return canvas;
            };
            var _getPixelRatio = function(canvas) {
              var context = canvas.getContext("2d"), devicePixelRatio = window.devicePixelRatio || 1, backingStorePixelRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
              return devicePixelRatio / backingStorePixelRatio;
            };
            var _getTexture = function(render, imagePath) {
              var image = render.textures[imagePath];
              if (image)
                return image;
              image = render.textures[imagePath] = new Image();
              image.src = imagePath;
              return image;
            };
            var _applyBackground = function(render, background) {
              var cssBackground = background;
              if (/(jpg|gif|png)$/.test(background))
                cssBackground = "url(" + background + ")";
              render.canvas.style.background = cssBackground;
              render.canvas.style.backgroundSize = "contain";
              render.currentBackground = background;
            };
          })();
        },
        /* 27 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Runner = {};
          module3.exports = Runner;
          var Events = __webpack_require__(5);
          var Engine = __webpack_require__(17);
          var Common = __webpack_require__(0);
          (function() {
            var _requestAnimationFrame, _cancelAnimationFrame;
            if (typeof window !== "undefined") {
              _requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
              _cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            }
            if (!_requestAnimationFrame) {
              var _frameTimeout;
              _requestAnimationFrame = function(callback) {
                _frameTimeout = setTimeout(function() {
                  callback(Common.now());
                }, 1e3 / 60);
              };
              _cancelAnimationFrame = function() {
                clearTimeout(_frameTimeout);
              };
            }
            Runner.create = function(options) {
              var defaults = {
                fps: 60,
                deltaSampleSize: 60,
                counterTimestamp: 0,
                frameCounter: 0,
                deltaHistory: [],
                timePrev: null,
                frameRequestId: null,
                isFixed: false,
                enabled: true
              };
              var runner = Common.extend(defaults, options);
              runner.delta = runner.delta || 1e3 / runner.fps;
              runner.deltaMin = runner.deltaMin || 1e3 / runner.fps;
              runner.deltaMax = runner.deltaMax || 1e3 / (runner.fps * 0.5);
              runner.fps = 1e3 / runner.delta;
              return runner;
            };
            Runner.run = function(runner, engine) {
              if (typeof runner.positionIterations !== "undefined") {
                engine = runner;
                runner = Runner.create();
              }
              (function run(time) {
                runner.frameRequestId = _requestAnimationFrame(run);
                if (time && runner.enabled) {
                  Runner.tick(runner, engine, time);
                }
              })();
              return runner;
            };
            Runner.tick = function(runner, engine, time) {
              var timing = engine.timing, delta;
              if (runner.isFixed) {
                delta = runner.delta;
              } else {
                delta = time - runner.timePrev || runner.delta;
                runner.timePrev = time;
                runner.deltaHistory.push(delta);
                runner.deltaHistory = runner.deltaHistory.slice(-runner.deltaSampleSize);
                delta = Math.min.apply(null, runner.deltaHistory);
                delta = delta < runner.deltaMin ? runner.deltaMin : delta;
                delta = delta > runner.deltaMax ? runner.deltaMax : delta;
                runner.delta = delta;
              }
              var event = {
                timestamp: timing.timestamp
              };
              Events.trigger(runner, "beforeTick", event);
              runner.frameCounter += 1;
              if (time - runner.counterTimestamp >= 1e3) {
                runner.fps = runner.frameCounter * ((time - runner.counterTimestamp) / 1e3);
                runner.counterTimestamp = time;
                runner.frameCounter = 0;
              }
              Events.trigger(runner, "tick", event);
              Events.trigger(runner, "beforeUpdate", event);
              Engine.update(engine, delta);
              Events.trigger(runner, "afterUpdate", event);
              Events.trigger(runner, "afterTick", event);
            };
            Runner.stop = function(runner) {
              _cancelAnimationFrame(runner.frameRequestId);
            };
            Runner.start = function(runner, engine) {
              Runner.run(runner, engine);
            };
          })();
        },
        /* 28 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var SAT = {};
          module3.exports = SAT;
          var Collision = __webpack_require__(8);
          var Common = __webpack_require__(0);
          var deprecated = Common.deprecated;
          (function() {
            SAT.collides = function(bodyA, bodyB) {
              return Collision.collides(bodyA, bodyB);
            };
            deprecated(SAT, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var Svg = {};
          module3.exports = Svg;
          __webpack_require__(1);
          var Common = __webpack_require__(0);
          (function() {
            Svg.pathToVertices = function(path, sampleLength) {
              if (typeof window !== "undefined" && !("SVGPathSeg" in window)) {
                Common.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              }
              var i, il, total, point, segment, segments, segmentsQueue, lastSegment, lastPoint, segmentIndex, points = [], lx, ly, length = 0, x = 0, y = 0;
              sampleLength = sampleLength || 15;
              var addPoint = function(px, py, pathSegType) {
                var isRelative = pathSegType % 2 === 1 && pathSegType > 1;
                if (!lastPoint || px != lastPoint.x || py != lastPoint.y) {
                  if (lastPoint && isRelative) {
                    lx = lastPoint.x;
                    ly = lastPoint.y;
                  } else {
                    lx = 0;
                    ly = 0;
                  }
                  var point2 = {
                    x: lx + px,
                    y: ly + py
                  };
                  if (isRelative || !lastPoint) {
                    lastPoint = point2;
                  }
                  points.push(point2);
                  x = lx + px;
                  y = ly + py;
                }
              };
              var addSegmentPoint = function(segment2) {
                var segType = segment2.pathSegTypeAsLetter.toUpperCase();
                if (segType === "Z")
                  return;
                switch (segType) {
                  case "M":
                  case "L":
                  case "T":
                  case "C":
                  case "S":
                  case "Q":
                    x = segment2.x;
                    y = segment2.y;
                    break;
                  case "H":
                    x = segment2.x;
                    break;
                  case "V":
                    y = segment2.y;
                    break;
                }
                addPoint(x, y, segment2.pathSegType);
              };
              Svg._svgPathToAbsolute(path);
              total = path.getTotalLength();
              segments = [];
              for (i = 0; i < path.pathSegList.numberOfItems; i += 1)
                segments.push(path.pathSegList.getItem(i));
              segmentsQueue = segments.concat();
              while (length < total) {
                segmentIndex = path.getPathSegAtLength(length);
                segment = segments[segmentIndex];
                if (segment != lastSegment) {
                  while (segmentsQueue.length && segmentsQueue[0] != segment)
                    addSegmentPoint(segmentsQueue.shift());
                  lastSegment = segment;
                }
                switch (segment.pathSegTypeAsLetter.toUpperCase()) {
                  case "C":
                  case "T":
                  case "S":
                  case "Q":
                  case "A":
                    point = path.getPointAtLength(length);
                    addPoint(point.x, point.y, 0);
                    break;
                }
                length += sampleLength;
              }
              for (i = 0, il = segmentsQueue.length; i < il; ++i)
                addSegmentPoint(segmentsQueue[i]);
              return points;
            };
            Svg._svgPathToAbsolute = function(path) {
              var x0, y0, x1, y1, x2, y2, segs = path.pathSegList, x = 0, y = 0, len = segs.numberOfItems;
              for (var i = 0; i < len; ++i) {
                var seg = segs.getItem(i), segType = seg.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(segType)) {
                  if ("x" in seg)
                    x = seg.x;
                  if ("y" in seg)
                    y = seg.y;
                } else {
                  if ("x1" in seg)
                    x1 = x + seg.x1;
                  if ("x2" in seg)
                    x2 = x + seg.x2;
                  if ("y1" in seg)
                    y1 = y + seg.y1;
                  if ("y2" in seg)
                    y2 = y + seg.y2;
                  if ("x" in seg)
                    x += seg.x;
                  if ("y" in seg)
                    y += seg.y;
                  switch (segType) {
                    case "m":
                      segs.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i);
                      break;
                    case "l":
                      segs.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
                      break;
                    case "h":
                      segs.replaceItem(path.createSVGPathSegLinetoHorizontalAbs(x), i);
                      break;
                    case "v":
                      segs.replaceItem(path.createSVGPathSegLinetoVerticalAbs(y), i);
                      break;
                    case "c":
                      segs.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i);
                      break;
                    case "s":
                      segs.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i);
                      break;
                    case "q":
                      segs.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i);
                      break;
                    case "t":
                      segs.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i);
                      break;
                    case "a":
                      segs.replaceItem(path.createSVGPathSegArcAbs(x, y, seg.r1, seg.r2, seg.angle, seg.largeArcFlag, seg.sweepFlag), i);
                      break;
                    case "z":
                    case "Z":
                      x = x0;
                      y = y0;
                      break;
                  }
                }
                if (segType == "M" || segType == "m") {
                  x0 = x;
                  y0 = y;
                }
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(module3, exports3, __webpack_require__) {
          var World = {};
          module3.exports = World;
          var Composite = __webpack_require__(6);
          __webpack_require__(0);
          (function() {
            World.create = Composite.create;
            World.add = Composite.add;
            World.remove = Composite.remove;
            World.clear = Composite.clear;
            World.addComposite = Composite.addComposite;
            World.addBody = Composite.addBody;
            World.addConstraint = Composite.addConstraint;
          })();
        }
        /******/
      ])
    );
  });
})(matter);
var matterExports = matter.exports;
const createHook = (lifecycle) => (hook, target = getCurrentInstance()) => {
  !isInSSRComponentSetup && injectHook(lifecycle, hook, target);
};
const onShareAppMessage = /* @__PURE__ */ createHook(ON_SHARE_APP_MESSAGE);
exports._export_sfc = _export_sfc;
exports.computed = computed;
exports.createSSRApp = createSSRApp;
exports.e = e;
exports.f = f;
exports.getCurrentInstance = getCurrentInstance;
exports.index = index;
exports.matterExports = matterExports;
exports.n = n;
exports.nextTick$1 = nextTick$1;
exports.o = o;
exports.onMounted = onMounted;
exports.onShareAppMessage = onShareAppMessage;
exports.onUnmounted = onUnmounted;
exports.reactive = reactive;
exports.ref = ref;
exports.s = s;
exports.sr = sr;
exports.t = t;
exports.unref = unref;
exports.wx$1 = wx$1;
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map
