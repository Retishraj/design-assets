var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key2, value) => key2 in obj ? __defProp(obj, key2, { enumerable: true, configurable: true, writable: true, value }) : obj[key2] = value;
var __publicField = (obj, key2, value) => __defNormalProp(obj, typeof key2 !== "symbol" ? key2 + "" : key2, value);
import { $, o as onTheme, r as reduced, t as theme, c as clamp$2, a as $$, b as asset, I as INVISIBLE, e as ease } from "./theme.js";
import { s as statement, d as dashboard, l as landing, a as landingTablet, b as dashboardPhone } from "./mockups.js";
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, _defaults = {
  duration: 0.5,
  overwrite: false,
  delay: 0
}, _suppressOverwrites, _reverting$1, _context$1, _bigNum$1 = 1e8, _tinyNum = 1 / _bigNum$1, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString = function _isString2(value) {
  return typeof value === "string";
}, _isFunction = function _isFunction2(value) {
  return typeof value === "function";
}, _isNumber = function _isNumber2(value) {
  return typeof value === "number";
}, _isUndefined = function _isUndefined2(value) {
  return typeof value === "undefined";
}, _isObject = function _isObject2(value) {
  return typeof value === "object";
}, _isNotFalse = function _isNotFalse2(value) {
  return value !== false;
}, _windowExists$1 = function _windowExists() {
  return typeof window !== "undefined";
}, _isFuncOrString = function _isFuncOrString2(value) {
  return _isFunction(value) || _isString(value);
}, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
}, _isArray = Array.isArray, _randomExp = /random\([^)]+\)/g, _commaDelimExp = /,\s*/g, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$1, _coreInitted$1, _doc$1, _globals = {}, _installScope = {}, _coreReady, _install = function _install2(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap$1;
}, _missingPlugin = function _missingPlugin2(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
}, _warn = function _warn2(message, suppress) {
  return !suppress && console.warn(message);
}, _addGlobal = function _addGlobal2(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
}, _emptyFunc = function _emptyFunc2() {
  return 0;
}, _startAtRevertConfig = {
  suppressEvents: true,
  isStart: true,
  kill: false
}, _revertConfigNoKill = {
  suppressEvents: true,
  kill: false
}, _revertConfig = {
  suppressEvents: true
}, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness2(targets) {
  var target = targets[0], harnessPlugin, i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);
  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    i = _harnessPlugins.length;
    while (i-- && !_harnessPlugins[i].targetTest(target)) {
    }
    harnessPlugin = _harnessPlugins[i];
  }
  i = targets.length;
  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }
  return targets;
}, _getCache = function _getCache2(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
}, _getProperty = function _getProperty2(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
}, _forEachName = function _forEachName2(names, func) {
  return (names = names.split(",")).forEach(func) || names;
}, _round = function _round2(value) {
  return Math.round(value * 1e5) / 1e5 || 0;
}, _roundPrecise = function _roundPrecise2(value) {
  return Math.round(value * 1e7) / 1e7 || 0;
}, _parseRelative = function _parseRelative2(start2, value) {
  var operator = value.charAt(0), end = parseFloat(value.substr(2));
  start2 = parseFloat(start2);
  return operator === "+" ? start2 + end : operator === "-" ? start2 - end : operator === "*" ? start2 * end : start2 / end;
}, _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
  var l = toFind.length, i = 0;
  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {
  }
  return i < l;
}, _lazyRender = function _lazyRender2() {
  var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
  _lazyLookup = {};
  _lazyTweens.length = 0;
  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
}, _isRevertWorthy = function _isRevertWorthy2(animation) {
  return !!(animation._initted || animation._startAt || animation.add);
}, _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
  _lazyTweens.length && !_reverting$1 && _lazyRender();
  animation.render(time, suppressEvents, !!(_reverting$1 && time < 0 && _isRevertWorthy(animation)));
  _lazyTweens.length && !_reverting$1 && _lazyRender();
}, _numericIfPossible = function _numericIfPossible2(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
}, _passThrough = function _passThrough2(p) {
  return p;
}, _setDefaults = function _setDefaults2(obj, defaults2) {
  for (var p in defaults2) {
    p in obj || (obj[p] = defaults2[p]);
  }
  return obj;
}, _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
  return function(obj, defaults2) {
    for (var p in defaults2) {
      p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults2[p]);
    }
  };
}, _merge = function _merge2(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }
  return base;
}, _mergeDeep = function _mergeDeep2(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }
  return base;
}, _copyExcluding = function _copyExcluding2(obj, excluding) {
  var copy = {}, p;
  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }
  return copy;
}, _inheritDefaults = function _inheritDefaults2(vars) {
  var parent = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }
  return vars;
}, _arraysMatch = function _arraysMatch2(a1, a2) {
  var i = a1.length, match = i === a2.length;
  while (match && i-- && a1[i] === a2[i]) {
  }
  return i < 0;
}, _addLinkedListItem = function _addLinkedListItem2(parent, child, firstProp, lastProp, sortBy) {
  var prev = parent[lastProp], t2;
  if (sortBy) {
    t2 = child[sortBy];
    while (prev && prev[sortBy] > t2) {
      prev = prev._prev;
    }
  }
  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }
  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }
  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
}, _removeLinkedListItem = function _removeLinkedListItem2(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }
  if (lastProp === void 0) {
    lastProp = "_last";
  }
  var prev = child._prev, next = child._next;
  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }
  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }
  child._next = child._prev = child.parent = null;
}, _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
  child._act = 0;
}, _uncache = function _uncache2(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    var a = animation;
    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }
  return animation;
}, _recacheAncestors = function _recacheAncestors2(animation) {
  var parent = animation.parent;
  while (parent && parent.parent) {
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }
  return animation;
}, _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
  return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
}, _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
}, _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
}, _animationCycle = function _animationCycle2(tTime, cycleDuration) {
  var whole = Math.floor(tTime = _roundPrecise(tTime / cycleDuration));
  return tTime && whole === tTime ? whole - 1 : whole;
}, _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
}, _setEnd = function _setEnd2(animation) {
  return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
}, _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
  var parent = animation._dp;
  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _roundPrecise(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
    _setEnd(animation);
    parent._dirty || _uncache(parent, animation);
  }
  return animation;
}, _postAddChecks = function _postAddChecks2(timeline3, child) {
  var t2;
  if (child._time || !child._dur && child._initted || child._start < timeline3._time && (child._dur || !child.add)) {
    t2 = _parentToChildTotalTime(timeline3.rawTime(), child);
    if (!child._dur || _clamp(0, child.totalDuration(), t2) - child._tTime > _tinyNum) {
      child.render(t2, true);
    }
  }
  if (_uncache(timeline3, child)._dp && timeline3._initted && timeline3._time >= timeline3._dur && timeline3._ts) {
    if (timeline3._dur < timeline3.duration()) {
      t2 = timeline3;
      while (t2._dp) {
        t2.rawTime() >= 0 && t2.totalTime(t2._tTime);
        t2 = t2._dp;
      }
    }
    timeline3._zTime = -_tinyNum;
  }
}, _addToTimeline = function _addToTimeline2(timeline3, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _roundPrecise((_isNumber(position) ? position : position || timeline3 !== _globalTimeline ? _parsePosition(timeline3, position, child) : timeline3._time) + child._delay);
  child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
  _addLinkedListItem(timeline3, child, "_first", "_last", timeline3._sort ? "_start" : 0);
  _isFromOrFromStart(child) || (timeline3._recent = child);
  skipChecks || _postAddChecks(timeline3, child);
  timeline3._ts < 0 && _alignPlayhead(timeline3, timeline3._tTime);
  return timeline3;
}, _scrollTrigger = function _scrollTrigger2(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
}, _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
  _initTween(tween, time, tTime);
  if (!tween._initted) {
    return 1;
  }
  if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);
    tween._lazy = [tTime, suppressEvents];
    return 1;
  }
}, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent));
}, _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
  var data = _ref2.data;
  return data === "isFromStart" || data === "isStart";
}, _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
  if (repeatDelay && tween._repeat) {
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
    if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }
  if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
      return;
    }
    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
    suppressEvents || (suppressEvents = totalTime && !prevIteration);
    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    pt = tween._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
    totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);
      if (!suppressEvents && !_reverting$1) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
}, _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
  var child;
  if (time > prevTime) {
    child = animation._first;
    while (child && child._start <= time) {
      if (child.data === "isPause" && child._start > prevTime) {
        return child;
      }
      child = child._next;
    }
  } else {
    child = animation._last;
    while (child && child._start >= time) {
      if (child.data === "isPause" && child._start < prevTime) {
        return child;
      }
      child = child._prev;
    }
  }
}, _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
  animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
}, _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
}, _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc,
  totalDuration: _emptyFunc
}, _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
  var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$1 ? recent.endTime(false) : animation._dur, i, offset, isPercent;
  if (_isString(position) && (isNaN(position) || position in labels)) {
    offset = position.charAt(0);
    isPercent = position.substr(-1) === "%";
    i = position.indexOf("=");
    if (offset === "<" || offset === ">") {
      i >= 0 && (position = position.replace(/=/, ""));
      return (offset === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
    }
    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }
    offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
    if (isPercent && percentAnimation) {
      offset = offset / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
    }
    return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset : clippedDuration + offset;
  }
  return position == null ? clippedDuration : +position;
}, _createTweenType = function _createTweenType2(type, params, timeline3) {
  var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent;
  isLegacy && (vars.duration = params[1]);
  vars.parent = timeline3;
  if (type) {
    irVars = vars;
    parent = timeline3;
    while (parent && !("immediateRender" in irVars)) {
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }
    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
  }
  return new Tween(params[0], vars, params[varsIndex + 1]);
}, _conditionalReturn = function _conditionalReturn2(value, func) {
  return value || value === 0 ? func(value) : func;
}, _clamp = function _clamp2(min, max, value) {
  return value < min ? min : value > max ? max : value;
}, getUnit = function getUnit2(value, v) {
  return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
}, clamp$1 = function clamp(min, max, value) {
  return _conditionalReturn(value, function(v) {
    return _clamp(min, max, v);
  });
}, _slice = [].slice, _isArrayLike = function _isArrayLike2(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win$1;
}, _flatten = function _flatten2(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }
  return ar.forEach(function(value) {
    var _accumulator;
    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
}, toArray = function toArray2(value, scope, leaveStrings) {
  return _context$1 && !scope && _context$1.selector ? _context$1.selector(value) : _isString(value) && !leaveStrings && (_coreInitted$1 || !_wake()) ? _slice.call((scope || _doc$1).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
}, selector = function selector2(value) {
  value = toArray(value)[0] || _warn("Invalid scope") || {};
  return function(v) {
    var el2 = value.current || value.nativeElement || value;
    return toArray(v, el2.querySelectorAll ? el2 : el2 === value ? _warn("Invalid scope") || _doc$1.createElement("div") : value);
  };
}, shuffle = function shuffle2(a) {
  return a.sort(function() {
    return 0.5 - Math.random();
  });
}, distribute = function distribute2(v) {
  if (_isFunction(v)) {
    return v;
  }
  var vars = _isObject(v) ? v : {
    each: v
  }, ease2 = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
  if (_isString(from)) {
    ratioX = ratioY = {
      center: 0.5,
      edges: 0.5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }
  return function(i, target, a) {
    var l = (a || vars).length, distances = cache[l], originX, originY, x, y, d, j, max, min, wrapAt;
    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
      if (!wrapAt) {
        max = -_bigNum$1;
        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
        }
        wrapAt < l && wrapAt--;
      }
      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
      originY = wrapAt === _bigNum$1 ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum$1;
      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }
      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0;
      ease2 = ease2 && l < 0 ? _invertEase(ease2) : ease2;
    }
    l = (distances[i] - distances.min) / distances.max || 0;
    return _roundPrecise(distances.b + (ease2 ? ease2(l) : l) * distances.v) + distances.u;
  };
}, _roundModifier = function _roundModifier2(v) {
  var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
  return function(raw) {
    var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
  };
}, snap = function snap2(snapTo, value) {
  var isArray = _isArray(snapTo), radius, is2D;
  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum$1;
    if (snapTo.values) {
      snapTo = toArray(snapTo.values);
      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius;
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }
  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function(raw) {
    var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum$1, closest = 0, i = snapTo.length, dx, dy;
    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }
      if (dx < min) {
        min = dx;
        closest = i;
      }
    }
    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
}, random = function random2(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
}, pipe = function pipe2() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }
  return function(value) {
    return functions.reduce(function(v, f) {
      return f(v);
    }, value);
  };
}, unitize = function unitize2(func, unit2) {
  return function(value) {
    return func(parseFloat(value)) + (unit2 || getUnit(value));
  };
}, normalize = function normalize2(min, max, value) {
  return mapRange(min, max, 0, 1, value);
}, _wrapArray = function _wrapArray2(a, wrapper, value) {
  return _conditionalReturn(value, function(index) {
    return a[~~wrapper(index)];
  });
}, wrap = function wrap2(min, max, value) {
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
    return (range + (value2 - min) % range) % range + min;
  });
}, wrapYoyo = function wrapYoyo2(min, max, value) {
  var range = max - min, total2 = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
    value2 = (total2 + (value2 - min) % total2) % total2 || 0;
    return min + (value2 > range ? total2 - value2 : value2);
  });
}, _replaceRandom = function _replaceRandom2(s) {
  return s.replace(_randomExp, function(match) {
    var arIndex = match.indexOf("[") + 1, values = match.substring(arIndex || 7, arIndex ? match.indexOf("]") : match.length - 1).split(_commaDelimExp);
    return random(arIndex ? values : +values[0], arIndex ? 0 : +values[1], +values[2] || 1e-5);
  });
}, mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin, outRange = outMax - outMin;
  return _conditionalReturn(value, function(value2) {
    return outMin + ((value2 - inMin) / inRange * outRange || 0);
  });
}, interpolate = function interpolate2(start2, end, progress, mutate) {
  var func = isNaN(start2 + end) ? 0 : function(p2) {
    return (1 - p2) * start2 + p2 * end;
  };
  if (!func) {
    var isString = _isString(start2), master2 = {}, p, i, interpolators, l, il;
    progress === true && (mutate = 1) && (progress = null);
    if (isString) {
      start2 = {
        p: start2
      };
      end = {
        p: end
      };
    } else if (_isArray(start2) && !_isArray(end)) {
      interpolators = [];
      l = start2.length;
      il = l - 2;
      for (i = 1; i < l; i++) {
        interpolators.push(interpolate2(start2[i - 1], start2[i]));
      }
      l--;
      func = function func2(p2) {
        p2 *= l;
        var i2 = Math.min(il, ~~p2);
        return interpolators[i2](p2 - i2);
      };
      progress = end;
    } else if (!mutate) {
      start2 = _merge(_isArray(start2) ? [] : {}, start2);
    }
    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master2, start2, p, "get", end[p]);
      }
      func = function func2(p2) {
        return _renderPropTweens(p2, master2) || (isString ? start2.p : start2);
      };
    }
  }
  return _conditionalReturn(progress, func);
}, _getLabelInDirection = function _getLabelInDirection2(timeline3, fromTime, backward) {
  var labels = timeline3.labels, min = _bigNum$1, p, distance, label;
  for (p in labels) {
    distance = labels[p] - fromTime;
    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }
  return label;
}, _callback = function _callback2(animation, type, executeLazyFirst) {
  var v = animation.vars, callback = v[type], prevContext = _context$1, context3 = animation._ctx, params, scope, result;
  if (!callback) {
    return;
  }
  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender();
  context3 && (_context$1 = context3);
  result = params ? callback.apply(scope, params) : callback.call(scope);
  _context$1 = prevContext;
  return result;
}, _interrupt = function _interrupt2(animation) {
  _removeFromParent(animation);
  animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
}, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin2(config3) {
  if (!config3) return;
  config3 = !config3.name && config3["default"] || config3;
  if (_windowExists$1() || config3.headless) {
    var name = config3.name, isFunc = _isFunction(config3), Plugin = name && !isFunc && config3.init ? function() {
      this._props = [];
    } : config3, instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    }, statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };
    _wake();
    if (config3 !== Plugin) {
      if (_plugins[name]) {
        return;
      }
      _setDefaults(Plugin, _setDefaults(_copyExcluding(config3, instanceDefaults), statics));
      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
      _plugins[Plugin.prop = name] = Plugin;
      if (config3.targetTest) {
        _harnessPlugins.push(Plugin);
        _reservedProps[name] = 1;
      }
      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }
    _addGlobal(name, Plugin);
    config3.register && config3.register(gsap$1, Plugin, PropTween);
  } else {
    _registerPluginQueue.push(config3);
  }
}, _255 = 255, _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
}, _hue = function _hue2(h, m1, m2) {
  h += h < 0 ? 1 : h > 1 ? -1 : 0;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
}, splitColor = function splitColor2(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
  if (!a) {
    if (v.substr(-1) === ",") {
      v = v.substr(0, v.length - 1);
    }
    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }
      if (v.length === 9) {
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }
      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);
      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1);
        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }
    a = a.map(Number);
  }
  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    a[0] = ~~(h + 0.5);
    a[1] = ~~(s * 100 + 0.5);
    a[2] = ~~(l * 100 + 0.5);
  }
  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
}, _colorOrderData = function _colorOrderData2(v) {
  var values = [], c = [], i = -1;
  v.split(_colorExp).forEach(function(v2) {
    var a = v2.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
}, _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
  var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
  if (!colors) {
    return s;
  }
  colors = colors.map(function(color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });
  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;
    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;
      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }
  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;
    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }
  return result + shell[l];
}, _colorExp = (function() {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }
  return new RegExp(s + ")", "gi");
})(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter2(a) {
  var combined = a.join(" "), toHSL;
  _colorExp.lastIndex = 0;
  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
    return true;
  }
}, _tickerActive, _ticker = (function() {
  var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick2(v) {
    var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame2;
    (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;
    if (overlap > 0 || manual) {
      frame2 = ++_self.frame;
      _delta = time - _self.time * 1e3;
      _self.time = time = time / 1e3;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }
    manual || (_id = _req(_tick2));
    if (dispatch) {
      for (_i = 0; _i < _listeners2.length; _i++) {
        _listeners2[_i](time, _delta, frame2, v);
      }
    }
  };
  _self = {
    time: 0,
    frame: 0,
    tick: function tick2() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1e3 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted$1 && _windowExists$1()) {
          _win$1 = _coreInitted$1 = window;
          _doc$1 = _win$1.document || {};
          _globals.gsap = gsap$1;
          (_win$1.gsapVersions || (_win$1.gsapVersions = [])).push(gsap$1.version);
          _install(_installScope || _win$1.GreenSockGlobals || !_win$1.gsap && _win$1 || {});
          _registerPluginQueue.forEach(_createPlugin);
        }
        _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
        _id && _self.sleep();
        _req = _raf || function(f) {
          return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
        };
        _tickerActive = 1;
        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || Infinity;
      _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
    },
    fps: function fps(_fps) {
      _gap = 1e3 / (_fps || 240);
      _nextTime = _self.time * 1e3 + _gap;
    },
    add: function add(callback, once, prioritize) {
      var func = once ? function(t2, d, f, v) {
        callback(t2, d, f, v);
        _self.remove(func);
      } : callback;
      _self.remove(callback);
      _listeners2[prioritize ? "unshift" : "push"](func);
      _wake();
      return func;
    },
    remove: function remove(callback, i) {
      ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners2
  };
  return _self;
})(), _wake = function _wake2() {
  return !_tickerActive && _ticker.wake();
}, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString2(value) {
  var obj = {}, split = value.substr(1, value.length - 3).split(":"), key2 = split[0], i = 1, l = split.length, index, val, parsedVal;
  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key2] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key2 = val.substr(index + 1).trim();
  }
  return obj;
}, _valueInParentheses = function _valueInParentheses2(value) {
  var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
}, _configEaseFromString = function _configEaseFromString2(name) {
  var split = (name + "").split("("), ease2 = _easeMap[split[0]];
  return ease2 && split.length > 1 && ease2.config ? ease2.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease2;
}, _invertEase = function _invertEase2(ease2) {
  return function(p) {
    return 1 - ease2(1 - p);
  };
}, _parseEase = function _parseEase2(ease2, defaultEase) {
  return !ease2 ? defaultEase : (_isFunction(ease2) ? ease2 : _easeMap[ease2] || _configEaseFromString(ease2)) || defaultEase;
}, _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut2(p) {
      return 1 - easeIn(1 - p);
    };
  }
  if (easeInOut === void 0) {
    easeInOut = function easeInOut2(p) {
      return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }
  var ease2 = {
    easeIn,
    easeOut,
    easeInOut
  }, lowercaseName;
  _forEachName(names, function(name) {
    _easeMap[name] = _globals[name] = ease2;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
    for (var p in ease2) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease2[p];
    }
  });
  return ease2;
}, _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
  return function(p) {
    return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
  };
}, _configElastic = function _configElastic2(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  }, ease2 = type === "out" ? easeOut : type === "in" ? function(p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);
  p2 = _2PI / p2;
  ease2.config = function(amplitude2, period2) {
    return _configElastic2(type, amplitude2, period2);
  };
  return ease2;
}, _configBack = function _configBack2(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }
  var easeOut = function easeOut2(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  }, ease2 = type === "out" ? easeOut : type === "in" ? function(p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);
  ease2.config = function(overshoot2) {
    return _configBack2(type, overshoot2);
  };
  return ease2;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
  var power = i < 5 ? i + 1 : i;
  _insertEase(name + ",Power" + (power - 1), i ? function(p) {
    return Math.pow(p, power);
  } : function(p) {
    return p;
  }, function(p) {
    return 1 - Math.pow(1 - p, power);
  }, function(p) {
    return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function(n, c) {
  var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
  };
  _insertEase("Bounce", function(p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function(p) {
  return Math.pow(2, 10 * (p - 1)) * p + p * p * p * p * p * p * (1 - p);
});
_insertEase("Circ", function(p) {
  return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function(p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps2, immediateStart) {
    if (steps2 === void 0) {
      steps2 = 1;
    }
    var p1 = 1 / steps2, p2 = steps2 + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
    return function(p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
  return _callbackNames += name + "," + name + "Params,";
});
var GSCache = function GSCache2(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /* @__PURE__ */ (function() {
  function Animation2(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;
    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }
    this._ts = 1;
    _setDuration(this, +vars.duration, 1, 1);
    this.data = vars.data;
    if (_context$1) {
      this._ctx = _context$1;
      _context$1.data.push(this);
    }
    _tickerActive || _ticker.wake();
  }
  var _proto = Animation2.prototype;
  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }
    return this._delay;
  };
  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };
  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }
    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };
  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();
    if (!arguments.length) {
      return this._tTime;
    }
    var parent = this._dp;
    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);
      !parent._dp || parent.parent || _postAddChecks(parent, this);
      while (parent && parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }
        parent = parent.parent;
      }
      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }
    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !this._initted && this._dur && _totalTime || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      this._ts || (this._pTime = _totalTime);
      _lazySafeRender(this, _totalTime, suppressEvents);
    }
    return this;
  };
  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
  };
  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  };
  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  };
  _proto.timeScale = function timeScale(value, suppressEvents) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts;
    }
    if (this._rts === value) {
      return this;
    }
    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
    this.totalTime(_clamp(-Math.abs(this._delay), this.totalDuration(), tTime), suppressEvents !== false);
    _setEnd(this);
    return _recacheAncestors(this);
  };
  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }
    if (this._ps !== value) {
      this._ps = value;
      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
        this._ts = this._act = 0;
      } else {
        _wake();
        this._ts = this._rts;
        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
      }
    }
    return this;
  };
  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = _roundPrecise(value);
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, this._start - this._delay);
      return this;
    }
    return this._start;
  };
  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };
  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp;
    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };
  _proto.revert = function revert(config3) {
    if (config3 === void 0) {
      config3 = _revertConfig;
    }
    var prevIsReverting = _reverting$1;
    _reverting$1 = config3;
    if (_isRevertWorthy(this)) {
      this.timeline && this.timeline.revert(config3);
      this.totalTime(-0.01, config3.suppressEvents);
    }
    this.data !== "nested" && config3.kill !== false && this.kill();
    _reverting$1 = prevIsReverting;
    return this;
  };
  _proto.globalTime = function globalTime(rawTime) {
    var animation = this, time = arguments.length ? rawTime : animation.rawTime();
    while (animation) {
      time = animation._start + time / (Math.abs(animation._ts) || 1);
      animation = animation._dp;
    }
    return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
  };
  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }
    return this._repeat === -2 ? Infinity : this._repeat;
  };
  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;
      _onUpdateTotalDuration(this);
      return time ? this.time(time) : this;
    }
    return this._rDelay;
  };
  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }
    return this._yoyo;
  };
  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };
  _proto.restart = function restart(includeDelay, suppressEvents) {
    this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
    this._dur || (this._zTime = -_tinyNum);
    return this;
  };
  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };
  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };
  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };
  _proto.resume = function resume() {
    return this.paused(false);
  };
  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
      return this;
    }
    return this._rts < 0;
  };
  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };
  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp, start2 = this._start, rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start2 && rawTime < this.endTime(true) - _tinyNum);
  };
  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;
    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }
      return this;
    }
    return vars[type];
  };
  _proto.then = function then(onFulfilled) {
    var self = this, prevProm = self._prom;
    return new Promise(function(resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
        var _then = self.then;
        self.then = null;
        prevProm && prevProm();
        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };
      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };
  _proto.kill = function kill() {
    _interrupt(this);
  };
  return Animation2;
})();
_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
var Timeline = /* @__PURE__ */ (function(_Animation) {
  _inheritsLoose(Timeline2, _Animation);
  function Timeline2(vars, position) {
    var _this;
    if (vars === void 0) {
      vars = {};
    }
    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }
  var _proto2 = Timeline2.prototype;
  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);
    return this;
  };
  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);
    return this;
  };
  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);
    return this;
  };
  _proto2.set = function set2(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };
  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  };
  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };
  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }
      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;
      if (crossingStart) {
        dur || (prevTime = this._zTime);
        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }
      if (this._repeat) {
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration);
          iteration = ~~prevIteration;
          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime;
          !suppressEvents && this.parent && _callback(this, "onRepeat");
          if (this.vars.repeatRefresh && !isYoyo) {
            this.invalidate()._lock = 1;
            prevIteration = iteration;
          }
          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            return this;
          }
          dur = this._dur;
          tDur = this._tDur;
          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -1e-4;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }
          this._lock = 0;
          if (!this._ts && !prevPaused) {
            return this;
          }
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }
      this._tTime = tTime;
      this._time = time;
      this._act = !!timeScale;
      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0;
      }
      if (!prevTime && tTime && dur && !suppressEvents && !prevIteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      if (time >= prevTime && totalTime >= 0) {
        child = this._first;
        while (child) {
          next = child._next;
          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum);
              break;
            }
          }
          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time;
        while (child) {
          next = child._prev;
          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && _isRevertWorthy(child));
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
              break;
            }
          }
          child = next;
        }
      }
      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
        if (this._ts) {
          this._start = prevStart;
          _setEnd(this);
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
        if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
          if (!this._lock) {
            (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
              _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
              this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
            }
          }
        }
      }
    }
    return this;
  };
  _proto2.add = function add(child, position) {
    var _this2 = this;
    _isNumber(position) || (position = _parsePosition(this, position, child));
    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function(obj) {
          return _this2.add(obj, position);
        });
        return this;
      }
      if (_isString(child)) {
        return this.addLabel(child, position);
      }
      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }
    return this !== child ? _addToTimeline(this, child, position) : this;
  };
  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }
    if (tweens === void 0) {
      tweens = true;
    }
    if (timelines === void 0) {
      timelines = true;
    }
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum$1;
    }
    var a = [], child = this._first;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }
      child = child._next;
    }
    return a;
  };
  _proto2.getById = function getById2(id) {
    var animations = this.getChildren(1, 1, 1), i = animations.length;
    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };
  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }
    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }
    child.parent === this && _removeLinkedListItem(this, child);
    if (child === this._recent) {
      this._recent = this._last;
    }
    return _uncache(this);
  };
  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }
    this._forcing = 1;
    if (!this._dp && this._ts) {
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }
    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    this._forcing = 0;
    return this;
  };
  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };
  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };
  _proto2.addPause = function addPause(position, callback, params) {
    var t2 = Tween.delayedCall(0, callback || _emptyFunc, params);
    t2.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t2, _parsePosition(this, position));
  };
  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);
    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }
      child = child._next;
    }
  };
  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }
    return this;
  };
  _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
    var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children;
    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }
      child = child._next;
    }
    return a;
  };
  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};
    var tl = this, endTime = _parsePosition(tl, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl, _setDefaults({
      ease: vars.ease || "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        if (!initted) {
          var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          initted = 1;
        }
        _onStart && _onStart.apply(tween, onStartParams || []);
      }
    }, vars));
    return immediateRender ? tween.render(0) : tween;
  };
  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };
  _proto2.recent = function recent() {
    return this._recent;
  };
  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };
  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };
  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };
  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }
    var child = this._first, labels = this.labels, p;
    amount = _roundPrecise(amount);
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }
      child = child._next;
    }
    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }
    return _uncache(this);
  };
  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;
    while (child) {
      child.invalidate(soft);
      child = child._next;
    }
    return _Animation.prototype.invalidate.call(this, soft);
  };
  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }
    var child = this._first, next;
    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }
    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };
  _proto2.totalDuration = function totalDuration(value) {
    var max = 0, self = this, child = self._last, prevStart = _bigNum$1, prev, start2, parent;
    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }
    if (self._dirty) {
      parent = self.parent;
      while (child) {
        prev = child._prev;
        child._dirty && child.totalDuration();
        start2 = child._start;
        if (start2 > prevStart && self._sort && child._ts && !self._lock) {
          self._lock = 1;
          _addToTimeline(self, child, start2 - child._delay, 1)._lock = 0;
        } else {
          prevStart = start2;
        }
        if (start2 < 0 && child._ts) {
          max -= start2;
          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += _roundPrecise(start2 / self._ts);
            self._time -= start2;
            self._tTime -= start2;
          }
          self.shiftChildren(-start2, false, -Infinity);
          prevStart = 0;
        }
        child._end > max && child._ts && (max = child._end);
        child = prev;
      }
      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);
      self._dirty = 0;
    }
    return self._tDur;
  };
  Timeline2.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
      _lastRenderedFrame = _ticker.frame;
    }
    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) {
        if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }
          child || _ticker.sleep();
        }
      }
    }
  };
  return Timeline2;
})(Animation);
_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop2, start2, end, setter, stringFilter, funcParam) {
  var pt = new PropTween(this._pt, target, prop2, 0, 1, _renderComplexString, null, setter), index = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
  pt.b = start2;
  pt.e = end;
  start2 += "";
  end += "";
  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }
  if (stringFilter) {
    a = [start2, end];
    stringFilter(a, target, prop2);
    start2 = a[0];
    end = a[1];
  }
  startNums = start2.match(_complexStringNumExp) || [];
  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);
    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }
    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0;
      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }
  pt.c = index < end.length ? end.substring(index, end.length) : "";
  pt.fp = funcParam;
  if (_relExp.test(end) || hasRandom) {
    pt.e = 0;
  }
  this._pt = pt;
  return pt;
}, _addPropTween = function _addPropTween2(target, prop2, start2, end, index, targets, modifier, stringFilter, funcParam, optional) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop2], parsedStart = start2 !== "get" ? start2 : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop2.indexOf("set") || !_isFunction(target["get" + prop2.substr(3)]) ? prop2 : "get" + prop2.substr(3)](funcParam) : target[prop2](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (end.charAt(1) === "=") {
      pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
      if (pt || pt === 0) {
        end = pt;
      }
    }
  }
  if (!optional || parsedStart !== end || _forceAllPropTweens) {
    if (!isNaN(parsedStart * end) && end !== "") {
      pt = new PropTween(this._pt, target, prop2, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }
    !currentValue && !(prop2 in target) && _missingPlugin(prop2, end);
    return _addComplexStringPropTween.call(this, target, prop2, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
}, _processVars = function _processVars2(vars, index, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));
  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }
  var copy = {}, p;
  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }
  return copy;
}, _checkPlugin = function _checkPlugin2(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;
  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
      i = plugin._props.length;
      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }
  return plugin;
}, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween2(tween, time, tTime) {
  var vars = tween.vars, ease2 = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent = tween.parent, fullTargets = parent && parent.data === "nested" ? parent.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl = tween.timeline, reverseEase = vars.easeReverse || yoyoEase, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index, harnessVars, overwritten;
  tl && (!keyframes || !ease2) && (ease2 = "none");
  tween._ease = _parseEase(ease2, _defaults.ease);
  tween._rEase = reverseEase && (_parseEase(reverseEase) || tween._ease);
  tween._from = !tl && !!vars.runBackwards;
  if (tween._from) tween.ratio = 1;
  if (!tl || keyframes && !vars.stagger) {
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop];
    cleanVars = _copyExcluding(vars, _reservedProps);
    if (prevStartAt) {
      prevStartAt._zTime < 0 && prevStartAt.progress(1);
      time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
      prevStartAt._lazy = 0;
    }
    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent,
        immediateRender: true,
        lazy: !prevStartAt && _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate && function() {
          return _callback(tween, "onUpdate");
        },
        stagger: 0
      }, startAt)));
      tween._startAt._dp = 0;
      tween._startAt._sat = tween;
      time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
      if (immediateRender) {
        if (dur && time <= 0 && tTime <= 0) {
          time && (tween._zTime = time);
          return;
        }
      }
    } else if (runBackwards && dur) {
      if (!prevStartAt) {
        time && (immediateRender = false);
        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
          immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent
          //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars);
        _removeFromParent(tween._startAt = Tween.set(targets, p));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
        tween._zTime = time;
        if (!immediateRender) {
          _initTween2(tween._startAt, _tinyNum, _tinyNum);
        } else if (!time) {
          return;
        }
      }
    }
    tween._pt = tween._ptCache = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;
    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
      index = fullTargets === targets ? i : fullTargets.indexOf(target);
      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
        plugin._props.forEach(function(name) {
          ptLookup[name] = pt;
        });
        plugin.priority && (hasPriority = 1);
      }
      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }
      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;
        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
        overwritten = !tween.parent;
        _overwritingTween = 0;
      }
      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }
    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween);
  }
  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten;
  keyframes && time <= 0 && tl.render(_bigNum$1, true, true);
}, _updatePropTweens = function _updatePropTweens2(tween, property, value, start2, startIsRelative, ratio, time, skipRecursion) {
  var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
  if (!ptCache) {
    ptCache = tween._ptCache[property] = [];
    lookup = tween._ptLookup;
    i = tween._targets.length;
    while (i--) {
      pt = lookup[i][property];
      if (pt && pt.d && pt.d._pt) {
        pt = pt.d._pt;
        while (pt && pt.p !== property && pt.fp !== property) {
          pt = pt._next;
        }
      }
      if (!pt) {
        _forceAllPropTweens = 1;
        tween.vars[property] = "+=0";
        _initTween(tween, time);
        _forceAllPropTweens = 0;
        return skipRecursion ? _warn(property + " not eligible for reset. Try splitting into individual properties") : 1;
      }
      ptCache.push(pt);
    }
  }
  i = ptCache.length;
  while (i--) {
    rootPT = ptCache[i];
    pt = rootPT._pt || rootPT;
    pt.s = (start2 || start2 === 0) && !startIsRelative ? start2 : pt.s + (start2 || 0) + ratio * pt.c;
    pt.c = value - pt.s;
    rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
    rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
  }
}, _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
  if (!propertyAliases) {
    return vars;
  }
  copy = _merge({}, vars);
  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;
      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }
  return copy;
}, _parseKeyframe = function _parseKeyframe2(prop2, obj, allProps, easeEach) {
  var ease2 = obj.ease || easeEach || "power1.inOut", p, a;
  if (_isArray(obj)) {
    a = allProps[prop2] || (allProps[prop2] = []);
    obj.forEach(function(value, i) {
      return a.push({
        t: i / (obj.length - 1) * 100,
        v: value,
        e: ease2
      });
    });
  } else {
    for (p in obj) {
      a = allProps[p] || (allProps[p] = []);
      p === "ease" || a.push({
        t: parseFloat(prop2),
        v: obj[p],
        e: ease2
      });
    }
  }
}, _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
}, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert", _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
  return _staggerPropsToSkip[name] = 1;
});
var Tween = /* @__PURE__ */ (function(_Animation2) {
  _inheritsLoose(Tween2, _Animation2);
  function Tween2(targets, vars, position, skipInherit) {
    var _this3;
    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }
    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults2 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, parent = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = [];
    _this3._overwrite = overwrite;
    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      var easeReverse = vars.easeReverse || vars.yoyoEase;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults2 || {},
        targets: parent && parent.data === "nested" ? parent.vars.targets : parsedTargets
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;
      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);
        if (_isObject(stagger)) {
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }
        for (i = 0; i < l; i++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          easeReverse && (copy.easeReverse = easeReverse);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i];
          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
          if (!stagger && l === 1 && copy.delay) {
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }
          tl.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
          tl._ease = _easeMap.none;
        }
        tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
      } else if (keyframes) {
        _inheritDefaults(_setDefaults(tl.vars.defaults, {
          ease: "none"
        }));
        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0, a, kf, v;
        if (_isArray(keyframes)) {
          keyframes.forEach(function(frame2) {
            return tl.to(parsedTargets, frame2, ">");
          });
          tl.duration();
        } else {
          copy = {};
          for (p in keyframes) {
            p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
          }
          for (p in copy) {
            a = copy[p].sort(function(a2, b) {
              return a2.t - b.t;
            });
            time = 0;
            for (i = 0; i < a.length; i++) {
              kf = a[i];
              v = {
                ease: kf.e,
                duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
              };
              v[p] = kf.v;
              tl.to(parsedTargets, v, time);
              time += v.duration;
            }
          }
          tl.duration() < duration && tl.to({}, {
            duration: duration - tl.duration()
          });
        }
      }
      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0;
    }
    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);
      _globalTimeline.killTweensOf(parsedTargets);
      _overwritingTween = 0;
    }
    _addToTimeline(parent, _assertThisInitialized(_this3), position);
    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);
    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum;
      _this3.render(Math.max(0, -delay) || 0);
    }
    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }
  var _proto3 = Tween2.prototype;
  _proto3.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline3;
    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative || this._lazy) {
      time = tTime;
      timeline3 = this.timeline;
      if (this._repeat) {
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && isNegative) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          prevIteration = _roundPrecise(tTime / cycleDuration);
          iteration = ~~prevIteration;
          if (iteration && iteration === prevIteration) {
            time = dur;
            iteration--;
          } else if (time > dur) {
            time = dur;
          }
        }
        isYoyo = this._yoyo && iteration & 1;
        if (isYoyo) time = dur - time;
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        if (time === prevTime && !force && this._initted && iteration === prevIteration) {
          this._tTime = tTime;
          return this;
        }
        if (iteration !== prevIteration) {
          if (this.vars.repeatRefresh && !isYoyo && !this._lock && time !== cycleDuration && this._initted) {
            this._lock = force = 1;
            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }
      if (!this._initted) {
        if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
          this._tTime = 0;
          return this;
        }
        if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
          return this;
        }
        if (dur !== this._dur) {
          return this.render(totalTime, suppressEvents, force);
        }
      }
      if (this._rEase) {
        var inv = time < prevTime;
        if (inv !== this._inv) {
          var segDur = inv ? prevTime : dur - prevTime;
          this._inv = inv;
          if (this._from) this.ratio = 1 - this.ratio;
          this._invRatio = this.ratio;
          this._invTime = prevTime;
          this._invRecip = segDur ? (inv ? -1 : 1) / segDur : 0;
          this._invScale = inv ? -this.ratio : 1 - this.ratio;
          this._invEase = inv ? this._rEase : this._ease;
        }
        this.ratio = ratio = this._invRatio + this._invScale * this._invEase((time - this._invTime) * this._invRecip);
      } else {
        this.ratio = ratio = this._ease(time / dur);
      }
      if (this._from) this.ratio = ratio = 1 - ratio;
      this._tTime = tTime;
      this._time = time;
      if (!this._act && this._ts) {
        this._act = 1;
        this._lazy = 0;
      }
      if (!prevTime && tTime && !suppressEvents && !prevIteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      pt = this._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      timeline3 && timeline3.render(totalTime < 0 ? totalTime : timeline3._dur * timeline3._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
        _callback(this, "onUpdate");
      }
      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
        if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto3.targets = function targets() {
    return this._targets;
  };
  _proto3.invalidate = function invalidate(soft) {
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };
  _proto3.resetTo = function resetTo(property, value, start2, startIsRelative, skipRecursion) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur);
    if (_updatePropTweens(this, property, value, start2, startIsRelative, ratio, time, skipRecursion)) {
      return this.resetTo(property, value, start2, startIsRelative, 1);
    }
    _alignPlayhead(this, 0);
    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };
  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }
    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      this.parent ? _interrupt(this) : this.scrollTrigger && this.scrollTrigger.kill(!!_reverting$1);
      return this;
    }
    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
      return this;
    }
    var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }
    overwrittenProps = this._op = this._op || [];
    if (vars !== "all") {
      if (_isString(vars)) {
        p = {};
        _forEachName(vars, function(name) {
          return p[name] = 1;
        });
        vars = p;
      }
      vars = _addAliasesToVars(parsedTargets, vars);
    }
    i = parsedTargets.length;
    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];
        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }
        for (p in props) {
          pt = curLookup && curLookup[p];
          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }
            delete curLookup[p];
          }
          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }
    this._initted && !this._pt && firstPT && _interrupt(this);
    return this;
  };
  Tween2.to = function to(targets, vars) {
    return new Tween2(targets, vars, arguments[2]);
  };
  Tween2.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };
  Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween2(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };
  Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };
  Tween2.set = function set2(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween2(targets, vars);
  };
  Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };
  return Tween2;
})(Animation);
_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
  Tween[name] = function() {
    var tl = new Timeline(), params = _slice.call(arguments, 0);
    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
var _setterPlain = function _setterPlain2(target, property, value) {
  return target[property] = value;
}, _setterFunc = function _setterFunc2(target, property, value) {
  return target[property](value);
}, _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
  return target[property](data.fp, value);
}, _setterAttribute = function _setterAttribute2(target, property, value) {
  return target.setAttribute(property, value);
}, _getSetter = function _getSetter2(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
}, _renderPlain = function _renderPlain2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
}, _renderBoolean = function _renderBoolean2(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
}, _renderComplexString = function _renderComplexString2(ratio, data) {
  var pt = data._pt, s = "";
  if (!ratio && data.b) {
    s = data.b;
  } else if (ratio === 1 && data.e) {
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
      pt = pt._next;
    }
    s += data.c;
  }
  data.set(data.t, data.p, s, data);
}, _renderPropTweens = function _renderPropTweens2(ratio, data) {
  var pt = data._pt;
  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
}, _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
  var pt = this._pt, next;
  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
}, _killPropTweensOf = function _killPropTweensOf2(property) {
  var pt = this._pt, hasNonDependentRemaining, next;
  while (pt) {
    next = pt._next;
    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }
    pt = next;
  }
  return !hasNonDependentRemaining;
}, _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
}, _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
  var pt = parent._pt, next, pt2, first, last2;
  while (pt) {
    next = pt._next;
    pt2 = first;
    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }
    if (pt._prev = pt2 ? pt2._prev : last2) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }
    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last2 = pt;
    }
    pt = next;
  }
  parent._pt = first;
};
var PropTween = /* @__PURE__ */ (function() {
  function PropTween2(next, target, prop2, start2, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start2;
    this.c = change;
    this.p = prop2;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;
    if (next) {
      next._prev = this;
    }
  }
  var _proto4 = PropTween2.prototype;
  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set;
    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target;
    this.tween = tween;
  };
  return PropTween2;
})();
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse", function(name) {
  return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
var _media = [], _listeners = {}, _emptyArray$1 = [], _lastMediaTime = 0, _contextID = 0, _dispatch = function _dispatch2(type) {
  return (_listeners[type] || _emptyArray$1).map(function(f) {
    return f();
  });
}, _onMediaChange = function _onMediaChange2() {
  var time = Date.now(), matches = [];
  if (time - _lastMediaTime > 2) {
    _dispatch("matchMediaInit");
    _media.forEach(function(c) {
      var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
      for (p in queries) {
        match = _win$1.matchMedia(queries[p]).matches;
        match && (anyMatch = 1);
        if (match !== conditions[p]) {
          conditions[p] = match;
          toggled = 1;
        }
      }
      if (toggled) {
        c.revert();
        anyMatch && matches.push(c);
      }
    });
    _dispatch("matchMediaRevert");
    matches.forEach(function(c) {
      return c.onMatch(c, function(func) {
        return c.add(null, func);
      });
    });
    _lastMediaTime = time;
    _dispatch("matchMedia");
  }
};
var Context = /* @__PURE__ */ (function() {
  function Context2(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = [];
    this.isReverted = false;
    this.id = _contextID++;
    func && this.add(func);
  }
  var _proto5 = Context2.prototype;
  _proto5.add = function add(name, func, scope) {
    if (_isFunction(name)) {
      scope = func;
      func = name;
      name = _isFunction;
    }
    var self = this, f = function f2() {
      var prev = _context$1, prevSelector = self.selector, result;
      prev && prev !== self && prev.data.push(self);
      scope && (self.selector = selector(scope));
      _context$1 = self;
      result = func.apply(self, arguments);
      _isFunction(result) && self._r.push(result);
      _context$1 = prev;
      self.selector = prevSelector;
      self.isReverted = false;
      return result;
    };
    self.last = f;
    return name === _isFunction ? f(self, function(func2) {
      return self.add(null, func2);
    }) : name ? self[name] = f : f;
  };
  _proto5.ignore = function ignore(func) {
    var prev = _context$1;
    _context$1 = null;
    func(this);
    _context$1 = prev;
  };
  _proto5.getTweens = function getTweens() {
    var a = [];
    this.data.forEach(function(e) {
      return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
    });
    return a;
  };
  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };
  _proto5.kill = function kill(revert, matchMedia3) {
    var _this4 = this;
    if (revert) {
      (function() {
        var tweens = _this4.getTweens(), i2 = _this4.data.length, t2;
        while (i2--) {
          t2 = _this4.data[i2];
          if (t2.data === "isFlip") {
            t2.revert();
            t2.getChildren(true, true, false).forEach(function(tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        }
        tweens.map(function(t3) {
          return {
            g: t3._dur || t3._delay || t3._sat && !t3._sat.vars.immediateRender ? t3.globalTime(0) : -Infinity,
            t: t3
          };
        }).sort(function(a, b) {
          return b.g - a.g || -Infinity;
        }).forEach(function(o) {
          return o.t.revert(revert);
        });
        i2 = _this4.data.length;
        while (i2--) {
          t2 = _this4.data[i2];
          if (t2 instanceof Timeline) {
            if (t2.data !== "nested") {
              t2.scrollTrigger && t2.scrollTrigger.revert();
              t2.kill();
            }
          } else {
            !(t2 instanceof Tween) && t2.revert && t2.revert(revert);
          }
        }
        _this4._r.forEach(function(f) {
          return f(revert, _this4);
        });
        _this4.isReverted = true;
      })();
    } else {
      this.data.forEach(function(e) {
        return e.kill && e.kill();
      });
    }
    this.clear();
    if (matchMedia3) {
      var i = _media.length;
      while (i--) {
        _media[i].id === this.id && _media.splice(i, 1);
      }
    }
  };
  _proto5.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  return Context2;
})();
var MatchMedia = /* @__PURE__ */ (function() {
  function MatchMedia2(scope) {
    this.contexts = [];
    this.scope = scope;
    _context$1 && _context$1.data.push(this);
  }
  var _proto6 = MatchMedia2.prototype;
  _proto6.add = function add(conditions, func, scope) {
    _isObject(conditions) || (conditions = {
      matches: conditions
    });
    var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
    _context$1 && !context3.selector && (context3.selector = _context$1.selector);
    this.contexts.push(context3);
    func = context3.add("onMatch", func);
    context3.queries = conditions;
    for (p in conditions) {
      if (p === "all") {
        active = 1;
      } else {
        mq = _win$1.matchMedia(conditions[p]);
        if (mq) {
          _media.indexOf(context3) < 0 && _media.push(context3);
          (cond[p] = mq.matches) && (active = 1);
          mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
        }
      }
    }
    active && func(context3, function(f) {
      return context3.add(null, f);
    });
    return this;
  };
  _proto6.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  _proto6.kill = function kill(revert) {
    this.contexts.forEach(function(c) {
      return c.kill(revert, true);
    });
  };
  return MatchMedia2;
})();
var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    args.forEach(function(config3) {
      return _createPlugin(config3);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit2, uncache) {
    _isString(target) && (target = toArray(target)[0]);
    var getter = _getCache(target || {}).get, format = unit2 ? _passThrough : _numericIfPossible;
    unit2 === "native" && (unit2 = "");
    return !target ? target : !property ? function(property2, unit3, uncache2) {
      return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit3, uncache2));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit2, uncache));
  },
  quickSetter: function quickSetter(target, property, unit2) {
    target = toArray(target);
    if (target.length > 1) {
      var setters = target.map(function(t2) {
        return gsap$1.quickSetter(t2, property, unit2);
      }), l = setters.length;
      return function(value) {
        var i = l;
        while (i--) {
          setters[i](value);
        }
      };
    }
    target = target[0] || {};
    var Plugin = _plugins[property], cache = _getCache(target), p = cache.harness && (cache.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
      var p2 = new Plugin();
      _quickTween._pt = 0;
      p2.init(target, unit2 ? value + unit2 : value, _quickTween, 0, [target]);
      p2.render(1, p2);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);
    return Plugin ? setter : function(value) {
      return setter(target, p, unit2 ? value + unit2 : value, cache, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _setDefaults22;
    var tween = gsap$1.to(target, _setDefaults((_setDefaults22 = {}, _setDefaults22[property] = "+=0.1", _setDefaults22.paused = true, _setDefaults22.stagger = 0, _setDefaults22), vars || {})), func = function func2(value, start2, startIsRelative) {
      return tween.resetTo(property, value, start2, startIsRelative);
    };
    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config2(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults2 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function(pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });
    _effects[name] = function(targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults2), tl);
    };
    if (extendTimeline) {
      Timeline.prototype[name] = function(targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease2) {
    _easeMap[name] = _parseEase(ease2);
  },
  parseEase: function parseEase(ease2, defaultEase) {
    return arguments.length ? _parseEase(ease2, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }
    var tl = new Timeline(vars), child, next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    _globalTimeline.remove(tl);
    tl._dp = 0;
    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;
    while (child) {
      next = child._next;
      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }
      child = next;
    }
    _addToTimeline(_globalTimeline, tl, 0);
    return tl;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context$1;
  },
  matchMedia: function matchMedia2(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return _media.forEach(function(c) {
      var cond = c.conditions, found, p;
      for (p in cond) {
        if (cond[p]) {
          cond[p] = false;
          found = 1;
        }
      }
      found && c.revert();
    }) || _onMediaChange();
  },
  addEventListener: function addEventListener2(type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a = _listeners[type], i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
  },
  utils: {
    wrap,
    wrapYoyo,
    distribute,
    random,
    snap,
    normalize,
    getUnit,
    clamp: clamp$1,
    splitColor,
    toArray,
    selector,
    mapRange,
    pipe,
    unitize,
    interpolate,
    shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween,
    globals: _addGlobal,
    Tween,
    Timeline,
    Animation,
    getCache: _getCache,
    _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting$1;
    },
    context: function context2(toAdd) {
      if (toAdd && _context$1) {
        _context$1.data.push(toAdd);
        toAdd._ctx = _context$1;
      }
      return _context$1;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
  return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, {
  duration: 0
});
var _getPluginPropTween = function _getPluginPropTween2(plugin, prop2) {
  var pt = plugin._pt;
  while (pt && pt.p !== prop2 && pt.op !== prop2 && pt.fp !== prop2) {
    pt = pt._next;
  }
  return pt;
}, _addModifiers = function _addModifiers2(tween, modifiers) {
  var targets = tween._targets, p, i, pt;
  for (p in modifiers) {
    i = targets.length;
    while (i--) {
      pt = tween._ptLookup[i][p];
      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          pt = _getPluginPropTween(pt, p);
        }
        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
}, _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
  return {
    name,
    headless: 1,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init4(target, vars, tween) {
      tween._onInit = function(tween2) {
        var temp, p;
        if (_isString(vars)) {
          temp = {};
          _forEachName(vars, function(name2) {
            return temp[name2] = 1;
          });
          vars = temp;
        }
        if (modifier) {
          temp = {};
          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }
          vars = temp;
        }
        _addModifiers(tween2, vars);
      };
    }
  };
};
var gsap$1 = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt, v;
    this.tween = tween;
    for (p in vars) {
      v = target.getAttribute(p) || "";
      pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index, targets, 0, 0, p);
      pt.op = p;
      pt.b = v;
      this._props.push(p);
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt;
    while (pt) {
      _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
      pt = pt._next;
    }
  }
}, {
  name: "endArray",
  headless: 1,
  init: function init2(target, value) {
    var i = value.length;
    while (i--) {
      this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
Tween.version = Timeline.version = gsap$1.version = "3.15.0";
_coreReady = 1;
_windowExists$1() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
/*!
 * CSSPlugin 3.15.0
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/
var _win, _doc, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, _reverting, _windowExists2 = function _windowExists3() {
  return typeof window !== "undefined";
}, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, _bigNum = 1e8, _capsExp = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, _renderCSSProp = function _renderCSSProp2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderCSSPropWithBeginningAndEnd = function _renderCSSPropWithBeginningAndEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
}, _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
}, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
}, _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
  return target.style[property] = value;
}, _setterCSSProp = function _setterCSSProp2(target, property, value) {
  return target.style.setProperty(property, value);
}, _setterTransform = function _setterTransform2(target, property, value) {
  return target._gsap[property] = value;
}, _setterScale = function _setterScale2(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
}, _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
}, _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
}, _transformProp = "transform", _transformOriginProp = _transformProp + "Origin", _saveStyle = function _saveStyle2(property, isNotCSS) {
  var _this = this;
  var target = this.target, style = target.style, cache = target._gsap;
  if (property in _transformProps && style) {
    this.tfm = this.tfm || {};
    if (property !== "transform") {
      property = _propertyAliases[property] || property;
      ~property.indexOf(",") ? property.split(",").forEach(function(a) {
        return _this.tfm[a] = _get(target, a);
      }) : this.tfm[property] = cache.x ? cache[property] : _get(target, property);
      property === _transformOriginProp && (this.tfm.zOrigin = cache.zOrigin);
    } else {
      return _propertyAliases.transform.split(",").forEach(function(p) {
        return _saveStyle2.call(_this, p, isNotCSS);
      });
    }
    if (this.props.indexOf(_transformProp) >= 0) {
      return;
    }
    if (cache.svg) {
      this.svgo = target.getAttribute("data-svg-origin");
      this.props.push(_transformOriginProp, isNotCSS, "");
    }
    property = _transformProp;
  }
  (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
}, _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
  if (style.translate) {
    style.removeProperty("translate");
    style.removeProperty("scale");
    style.removeProperty("rotate");
  }
}, _revertStyle = function _revertStyle2() {
  var props = this.props, target = this.target, style = target.style, cache = target._gsap, i, p;
  for (i = 0; i < props.length; i += 3) {
    if (!props[i + 1]) {
      props[i + 2] ? style[props[i]] = props[i + 2] : style.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
    } else if (props[i + 1] === 2) {
      target[props[i]](props[i + 2]);
    } else {
      target[props[i]] = props[i + 2];
    }
  }
  if (this.tfm) {
    for (p in this.tfm) {
      cache[p] = this.tfm[p];
    }
    if (cache.svg) {
      cache.renderTransform();
      target.setAttribute("data-svg-origin", this.svgo || "");
    }
    i = _reverting();
    if ((!i || !i.isStart) && !style[_transformProp]) {
      _removeIndependentTransforms(style);
      if (cache.zOrigin && style[_transformOriginProp]) {
        style[_transformOriginProp] += " " + cache.zOrigin + "px";
        cache.zOrigin = 0;
        cache.renderTransform();
      }
      cache.uncache = 1;
    }
  }
}, _getStyleSaver = function _getStyleSaver2(target, properties) {
  var saver = {
    target,
    props: [],
    revert: _revertStyle,
    save: _saveStyle
  };
  target._gsap || gsap$1.core.getCache(target);
  properties && target.style && target.nodeType && properties.split(",").forEach(function(p) {
    return saver.save(p);
  });
  return saver;
}, _supports3D, _createElement = function _createElement2(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type);
  return e && e.style ? e : _doc.createElement(type);
}, _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
}, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
  var e = element || _tempDiv, s = e.style, i = 5;
  if (property in s && !preferPrefix) {
    return property;
  }
  property = property.charAt(0).toUpperCase() + property.substr(1);
  while (i-- && !(_prefixes[i] + property in s)) {
  }
  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
}, _initCore = function _initCore2() {
  if (_windowExists2() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _transformProp + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
    _supports3D = !!_checkPropPrefix("perspective");
    _reverting = gsap$1.core.reverting;
    _pluginInitted = 1;
  }
}, _getReparentedCloneBBox = function _getReparentedCloneBBox2(target) {
  var owner = target.ownerSVGElement, svg = _createElement("svg", owner && owner.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), clone = target.cloneNode(true), bbox;
  clone.style.display = "block";
  svg.appendChild(clone);
  _docElement.appendChild(svg);
  try {
    bbox = clone.getBBox();
  } catch (e) {
  }
  svg.removeChild(clone);
  _docElement.removeChild(svg);
  return bbox;
}, _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
  var i = attributesArray.length;
  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
}, _getBBox = function _getBBox2(target) {
  var bounds, cloned;
  try {
    bounds = target.getBBox();
  } catch (error) {
    bounds = _getReparentedCloneBBox(target);
    cloned = 1;
  }
  bounds && (bounds.width || bounds.height) || cloned || (bounds = _getReparentedCloneBBox(target));
  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
}, _isSVG = function _isSVG2(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
}, _removeProperty = function _removeProperty2(target, property) {
  if (property) {
    var style = target.style, first2Chars;
    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp;
    }
    if (style.removeProperty) {
      first2Chars = property.substr(0, 2);
      if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
        property = "-" + property;
      }
      style.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      style.removeAttribute(property);
    }
  }
}, _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;
  plugin._props.push(property);
  return pt;
}, _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
}, _nonStandardLayouts = {
  grid: 1,
  flex: 1
}, _convertToUnit = function _convertToUnit2(target, property, value, unit2) {
  var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit2 === "px", toPercent = unit2 === "%", px, parent, cache, isSVG;
  if (unit2 === curUnit || !curValue || _nonConvertibleUnits[unit2] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }
  curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);
  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
  }
  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit2);
  parent = unit2 !== "rem" && ~property.indexOf("adius") || unit2 === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }
  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }
  cache = parent._gsap;
  if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time && !cache.uncache) {
    return _round(curValue / cache.width * amount);
  } else {
    if (toPercent && (property === "height" || property === "width")) {
      var v = target.style[property];
      target.style[property] = amount + unit2;
      px = target[measureProperty];
      v ? target.style[property] = v : _removeProperty(target, property);
    } else {
      (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent, "display")] && (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";
    }
    if (horizontal && toPercent) {
      cache = _getCache(parent);
      cache.time = _ticker.time;
      cache.width = parent[measureProperty];
    }
  }
  return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
}, _get = function _get2(target, property, unit2, uncache) {
  var value;
  _pluginInitted || _initCore();
  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];
    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }
  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];
    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit2) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
    }
  }
  return unit2 && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit2) + unit2 : value;
}, _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop2, start2, end) {
  if (!start2 || start2 === "none") {
    var p = _checkPropPrefix(prop2, target, 1), s = p && _getComputedProperty(target, p, 1);
    if (s && s !== start2) {
      prop2 = p;
      start2 = s;
    } else if (prop2 === "borderColor") {
      start2 = _getComputedProperty(target, "borderTopColor");
    }
  }
  var pt = new PropTween(this._pt, target.style, prop2, 0, 1, _renderComplexString), index = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
  pt.b = start2;
  pt.e = end;
  start2 += "";
  end += "";
  if (end.substring(0, 6) === "var(--") {
    end = _getComputedProperty(target, end.substring(4, end.indexOf(")")));
  }
  if (end === "auto") {
    startValue = target.style[prop2];
    target.style[prop2] = end;
    end = _getComputedProperty(target, prop2) || end;
    startValue ? target.style[prop2] = startValue : _removeProperty(target, prop2);
  }
  a = [start2, end];
  _colorStringFilter(a);
  start2 = a[0];
  end = a[1];
  startValues = start2.match(_numWithUnitExp) || [];
  endValues = end.match(_numWithUnitExp) || [];
  if (endValues.length) {
    while (result = _numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }
      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _numWithUnitExp.lastIndex - endUnit.length;
        if (!endUnit) {
          endUnit = endUnit || _config.units[prop2] || startUnit;
          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }
        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop2, startValue, endUnit) || 0;
        }
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum - startNum,
          m: color && color < 4 || prop2 === "zIndex" ? Math.round : 0
        };
      }
    }
    pt.c = index < end.length ? end.substring(index, end.length) : "";
  } else {
    pt.r = prop2 === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }
  _relExp.test(end) && (pt.e = 0);
  this._pt = pt;
  return pt;
}, _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
  var split = value.split(" "), x = split[0], y = split[1] || "50%";
  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    value = x;
    x = y;
    y = value;
  }
  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
}, _renderClearProps = function _renderClearProps2(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t, style = target.style, props = data.u, cache = target._gsap, prop2, clearTransforms, i;
    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;
      while (--i > -1) {
        prop2 = props[i];
        if (_transformProps[prop2]) {
          clearTransforms = 1;
          prop2 = prop2 === "transformOrigin" ? _transformOriginProp : _transformProp;
        }
        _removeProperty(target, prop2);
      }
    }
    if (clearTransforms) {
      _removeProperty(target, _transformProp);
      if (cache) {
        cache.svg && target.removeAttribute("transform");
        style.scale = style.rotate = style.translate = "none";
        _parseTransform(target, 1);
        cache.uncache = 1;
        _removeIndependentTransforms(style);
      }
    }
  }
}, _specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;
      plugin._props.push(property);
      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, _identity2DMatrix = [1, 0, 0, 1, 0, 0], _rotationalProperties = {}, _isNullTransform = function _isNullTransform2(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
}, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
  var matrixString = _getComputedProperty(target, _transformProp);
  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
}, _getMatrix = function _getMatrix2(target, force2D) {
  var cache = target._gsap || _getCache(target), style = target.style, matrix2 = _getComputedTransformMatrixAsArray(target), parent, nextSibling, temp, addedToDOM;
  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix;
    matrix2 = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix2.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix2;
  } else if (matrix2 === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;
    if (!parent || !target.offsetParent && !target.getBoundingClientRect().width) {
      addedToDOM = 1;
      nextSibling = target.nextElementSibling;
      _docElement.appendChild(target);
    }
    matrix2 = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");
    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }
  return force2D && matrix2.length > 6 ? [matrix2[0], matrix2[1], matrix2[4], matrix2[5], matrix2[12], matrix2[13]] : matrix2;
}, _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth2, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap, matrix2 = matrixArray || _getMatrix(target, true), xOriginOld = cache.xOrigin || 0, yOriginOld = cache.yOrigin || 0, xOffsetOld = cache.xOffset || 0, yOffsetOld = cache.yOffset || 0, a = matrix2[0], b = matrix2[1], c = matrix2[2], d = matrix2[3], tx = matrix2[4], ty = matrix2[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix2 !== _identity2DMatrix && (determinant = a * d - b * c)) {
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }
  if (smooth2 || smooth2 !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }
  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth2;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px";
  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }
  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
}, _parseTransform = function _parseTransform2(target, uncache) {
  var cache = target._gsap || new GSCache(target);
  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }
  var style = target.style, invertedScaleX = cache.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix2, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  if (cs.translate) {
    if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
      style[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
    }
    style.scale = style.rotate = style.translate = "none";
  }
  matrix2 = _getMatrix(target, cache.svg);
  if (cache.svg) {
    if (cache.uncache) {
      t2 = target.getBBox();
      origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
      t1 = "";
    } else {
      t1 = !uncache && target.getAttribute("data-svg-origin");
    }
    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix2);
  }
  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;
  if (matrix2 !== _identity2DMatrix) {
    a = matrix2[0];
    b = matrix2[1];
    c = matrix2[2];
    d = matrix2[3];
    x = a12 = matrix2[4];
    y = a22 = matrix2[5];
    if (matrix2.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      }
    } else {
      a32 = matrix2[6];
      a42 = matrix2[7];
      a13 = matrix2[8];
      a23 = matrix2[9];
      a33 = matrix2[10];
      a43 = matrix2[11];
      x = matrix2[12];
      y = matrix2[13];
      z = matrix2[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      }
      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      }
      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }
      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }
      scaleX = _round(Math.sqrt(a * a + b * b + c * c));
      scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }
    if (cache.svg) {
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }
  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }
  uncache = uncache || cache.uncache;
  cache.x = x - ((cache.xPercent = x && (!uncache && cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
  cache.y = y - ((cache.yPercent = y && (!uncache && cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
  cache.z = z + px;
  cache.scaleX = _round(scaleX);
  cache.scaleY = _round(scaleY);
  cache.rotation = _round(rotation) + deg;
  cache.rotationX = _round(rotationX) + deg;
  cache.rotationY = _round(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;
  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache.zOrigin || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }
  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
}, _firstTwoOnly = function _firstTwoOnly2(value) {
  return (value = value.split(" "))[0] + " " + value[1];
}, _addPxTranslate = function _addPxTranslate2(target, start2, value) {
  var unit2 = getUnit(start2);
  return _round(parseFloat(start2) + parseFloat(_convertToUnit(target, "x", value + "px", unit2))) + unit2;
}, _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;
  _renderCSSTransforms(ratio, cache);
}, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
  var _ref = cache || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }
  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }
  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }
  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }
  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }
  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }
  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }
  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }
  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }
  target.style[_transformProp] = transforms || "translate(0, 0)";
}, _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
  var _ref2 = cache || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);
  if (skewY) {
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }
  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;
    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;
      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }
    a11 = _round(a11);
    a21 = _round(a21);
    a12 = _round(a12);
    a22 = _round(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }
  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }
  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }
  if (xPercent || yPercent) {
    temp = target.getBBox();
    tx = _round(tx + xPercent / 100 * temp.width);
    ty = _round(ty + yPercent / 100 * temp.height);
  }
  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp] = temp);
}, _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
  var cap = 360, isString = _isString(endValue), endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
  if (isString) {
    direction = endValue.split("_")[1];
    if (direction === "short") {
      change %= cap;
      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }
    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }
  plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";
  plugin._props.push(property);
  return pt;
}, _assign = function _assign2(target, source) {
  for (var p in source) {
    target[p] = source[p];
  }
  return target;
}, _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
  var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
  if (startCache.svg) {
    startValue = target.getAttribute("transform");
    target.setAttribute("transform", "");
    style[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);
    _removeProperty(target, _transformProp);
    target.setAttribute("transform", startValue);
  } else {
    startValue = getComputedStyle(target)[_transformProp];
    style[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);
    style[_transformProp] = startValue;
  }
  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];
    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      startUnit = getUnit(startValue);
      endUnit = getUnit(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;
      plugin._props.push(p);
    }
  }
  _assign(endCache, startCache);
};
_forEachName("padding,margin,Width,Radius", function(name, index) {
  var t2 = "Top", r = "Right", b = "Bottom", l = "Left", props = (index < 3 ? [t2, r, b, l] : [t2 + l, t2 + r, b + r, b + l]).map(function(side) {
    return index < 2 ? name + side : "border" + side + name;
  });
  _specialProps[index > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
    var a, vars;
    if (arguments.length < 4) {
      a = props.map(function(prop2) {
        return _get(plugin, prop2, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }
    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function(prop2, i) {
      return vars[prop2] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init3(target, vars, tween, index, targets) {
    var props = this._props, style = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache, smooth2, hasPriority, inlineProps, finalTransformValue;
    _pluginInitted || _initCore();
    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;
    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }
      endValue = vars[p];
      if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
        continue;
      }
      type = typeof endValue;
      specialProp = _specialProps[p];
      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }
      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = _replaceRandom(endValue);
      }
      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        _colorExp.lastIndex = 0;
        if (!_colorExp.test(startValue)) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
          endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        }
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
        props.push(p);
        inlineProps.push(p, 0, style[p]);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
          _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
          getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
        } else {
          startValue = _get(target, p);
        }
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);
        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              startNum = 0;
            }
            inlineProps.push("visibility", 0, style.visibility);
            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }
          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }
        isTransformRelated = p in _transformProps;
        if (isTransformRelated) {
          this.styles.save(p);
          finalTransformValue = endValue;
          if (type === "string" && endValue.substring(0, 6) === "var(--") {
            endValue = _getComputedProperty(target, endValue.substring(4, endValue.indexOf(")")));
            if (endValue.substring(0, 5) === "calc(") {
              var origPerspective = target.style.perspective;
              target.style.perspective = endValue;
              endValue = _getComputedProperty(target, "perspective");
              origPerspective ? target.style.perspective = origPerspective : _removeProperty(target, "perspective");
            }
            endNum = parseFloat(endValue);
          }
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
            smooth2 = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
            transformPropTween.dep = 1;
          }
          if (p === "scale") {
            this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, (relative ? _parseRelative(cache.scaleY, relative + endNum) : endNum) - cache.scaleY || 0, _renderCSSProp);
            this._pt.u = 0;
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            inlineProps.push(_transformOriginProp, 0, style[_transformOriginProp]);
            endValue = _convertKeywordsToPercentages(endValue);
            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth2, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0;
              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }
            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth2, 0, this);
            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);
            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }
        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0);
          endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;
          if (isTransformRelated && finalTransformValue !== endValue) {
            this._pt.b = startValue;
            this._pt.e = finalTransformValue;
            this._pt.r = _renderCSSPropWithBeginningAndEnd;
          } else if (startUnit !== endUnit && endUnit !== "%") {
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index, targets);
          } else if (p !== "parseTransform") {
            _missingPlugin(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
        }
        isTransformRelated || (p in style ? inlineProps.push(p, 0, style[p]) : typeof target[p] === "function" ? inlineProps.push(p, 2, target[p]()) : inlineProps.push(p, 1, startValue || target[p]));
        props.push(p);
      }
    }
    hasPriority && _sortPropTweensByPriority(this);
  },
  render: function render2(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
  },
  core: {
    _removeProperty,
    _getMatrix
  }
};
gsap$1.utils.checkPrefix = _checkPropPrefix;
gsap$1.core.getStyleSaver = _getStyleSaver;
(function(positionAndScale, rotation, others, aliases) {
  var all = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
    _transformProps[name] = 1;
  });
  _forEachName(rotation, function(name) {
    _config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  _forEachName(aliases, function(name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
  _config.units[name] = "px";
});
gsap$1.registerPlugin(CSSPlugin);
var gsapWithCSS = gsap$1.registerPlugin(CSSPlugin) || gsap$1;
gsapWithCSS.core.Tween;
var STATION = [
  [0, 0, 0],
  // 1 Pack
  [0, 0, 0],
  // 2 Drop: the same place, the burst comes out of the pouch
  [2400, 0, -450],
  // 3 Host
  [4800, 0, -1050],
  // 4 Protect
  [7200, 0, -300],
  // 5 Update
  [9600, 0, -1200]
  // 6 Ship
];
function at$1(i, pose) {
  var s = STATION[i], o = Object.assign({}, pose);
  o.x = (o.x || 0) + s[0];
  o.y = (o.y || 0) + s[1];
  o.z = (o.z || 0) + s[2];
  return o;
}
function atPoint(i, x, y, z) {
  var s = STATION[i];
  return [x + s[0], y + s[1], 0 + s[2]];
}
function travel(u) {
  u = u < 0 ? 0 : u > 1 ? 1 : u;
  return u * u * (3 - 2 * u);
}
var camera$2 = $("#camera");
var floors = STATION.filter(function(s, i) {
  return i !== 1;
}).map(function(s) {
  var f = document.createElement("canvas");
  f.className = "floorplane";
  f.width = 900;
  f.height = 675;
  f.setAttribute("aria-hidden", "true");
  f.style.transform = "translate3d(" + s[0] + "px,0," + s[2] + "px) rotateX(90deg) translateY(-1800px)";
  camera$2.insertBefore(f, camera$2.firstChild);
  return f;
});
function paintFloors() {
  floors.forEach(paintFloor);
}
function paintFloor(floor) {
  var c = floor.getContext("2d"), W2 = floor.width, H2 = floor.height, dark = theme() === "dark";
  c.clearRect(0, 0, W2, H2);
  var g = c.createRadialGradient(W2 / 2, H2 * 0.62, 0, W2 / 2, H2 * 0.62, W2 * 0.5);
  if (dark) {
    g.addColorStop(0, "rgba(70,130,255,0.20)");
    g.addColorStop(0.45, "rgba(40,90,220,0.07)");
    g.addColorStop(1, "rgba(10,12,17,0)");
  } else {
    g.addColorStop(0, "rgba(255,255,255,0.85)");
    g.addColorStop(0.5, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(238,240,243,0)");
  }
  c.fillStyle = g;
  c.fillRect(0, 0, W2, H2);
  c.save();
  c.globalAlpha = dark ? 0.12 : 0.07;
  c.strokeStyle = dark ? "#7FA8FF" : "#2A3550";
  c.lineWidth = 0.6;
  for (var x = 0; x <= W2; x += 37.5) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, H2);
    c.stroke();
  }
  for (var y = 0; y <= H2; y += 37.5) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(W2, y);
    c.stroke();
  }
  c.restore();
  c.globalCompositeOperation = "destination-in";
  var f = c.createLinearGradient(0, 0, 0, H2);
  f.addColorStop(0, "rgba(0,0,0,0)");
  f.addColorStop(0.35, "rgba(0,0,0,0.6)");
  f.addColorStop(0.7, "rgba(0,0,0,1)");
  f.addColorStop(0.86, "rgba(0,0,0,0.7)");
  f.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = f;
  c.fillRect(0, 0, W2, H2);
  var s = c.createLinearGradient(0, 0, W2, 0);
  s.addColorStop(0, "rgba(0,0,0,0)");
  s.addColorStop(1 / 3, "rgba(0,0,0,1)");
  s.addColorStop(2 / 3, "rgba(0,0,0,1)");
  s.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = s;
  c.fillRect(0, 0, W2, H2);
  c.globalCompositeOperation = "source-over";
}
paintFloors();
onTheme(paintFloors);
function contact(obj, x, w, bottom, depth) {
  var s = document.createElement("div");
  s.className = "contact";
  s.style.left = x - w / 2 + "px";
  s.style.top = bottom + "px";
  s.style.width = w + "px";
  s.style.height = (depth || w * 0.34) + "px";
  obj.appendChild(s);
  return s;
}
(function() {
  var last2 = STATION[STATION.length - 1], N2 = 36, seed = 7;
  function rnd() {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  }
  for (var i = 0; i < N2; i++) {
    var m = document.createElement("i");
    m.className = "mote";
    var x = -400 + rnd() * (last2[0] + 1900), z = -1500 + rnd() * 1500 + last2[2] * (x / last2[0]) * 0.6, y = 40 + rnd() * 520, s = 2 + rnd() * 4;
    m.style.width = m.style.height = s + "px";
    m.style.transform = "translate3d(" + x.toFixed(0) + "px," + y.toFixed(0) + "px," + z.toFixed(0) + "px)";
    m.style.setProperty("--o", (0.25 + rnd() * 0.55).toFixed(2));
    if (!reduced) m.style.animationDelay = (-rnd() * 6).toFixed(2) + "s";
    camera$2.appendChild(m);
  }
})();
var Z0 = 6, Z1 = 128;
var T = [[136, 182], [262, 340], [420, 528], [592, 700], [858, 940]];
var R = [0, 232, 372, 552, 806, 1020];
var END = 1090;
var COPY = [[-1e9, 150], [176, 284], [318, 448], [502, 620], [672, 880], [918, 1e9]];
var scroller = $("#scroller"), stage$1 = $("#stage");
var vh = innerHeight, unit = vh / 100, total = 0;
function measure() {
  vh = stage$1.clientHeight || innerHeight;
  unit = vh / 100;
  total = END * unit;
  scroller.style.height = total + vh + "px";
}
function posOf(y) {
  return clamp$2((y - scroller.offsetTop) / unit, 0, END);
}
function pos() {
  return posOf(window.scrollY);
}
function yOf(p) {
  return Math.round(scroller.offsetTop + p * unit);
}
function chapterAt(p) {
  var i = 0;
  while (i < T.length && p >= (T[i][0] + T[i][1]) / 2) i++;
  return i;
}
function tu(i, p) {
  return clamp$2((p - T[i][0]) / (T[i][1] - T[i][0]));
}
function railFrac(p) {
  if (p <= R[0]) return 0;
  for (var i = 0; i < R.length - 1; i++) if (p < R[i + 1]) return (i + (p - R[i]) / (R[i + 1] - R[i])) / (R.length - 1);
  return 1;
}
var F = { w: 1100 };
var SUBJ_TOP = 40, SUBJ_BOT = 650;
var fit = { s: 1, x: 0, y: 0, vw: 0, vh: 0, narrow: false, top: 0, copyTop: 0 };
var frame$1 = $("#frame"), bar$2 = $("#bar"), copies = $$(".copy"), hooks = [];
function onLayout(fn) {
  hooks.push(fn);
}
function toScreen(x, y) {
  return { x: fit.x + x * fit.s, y: fit.y + y * fit.s };
}
function layoutAll() {
  var vw = stage$1.clientWidth, vh2 = stage$1.clientHeight;
  fit.vw = vw;
  fit.vh = vh2;
  fit.narrow = vw / vh2 < 0.95;
  var barBottom = bar$2.getBoundingClientRect().bottom;
  var copyH = 0;
  copies.forEach(function(c) {
    copyH = Math.max(copyH, c.offsetHeight);
  });
  var bottomGap = 44;
  fit.top = barBottom + (fit.narrow ? 10 : 16);
  var s, used;
  if (!fit.narrow) {
    fit.copyTop = vh2 - bottomGap - copyH;
    var avail = Math.max(120, fit.copyTop - 18 - fit.top);
    s = Math.min(avail / (SUBJ_BOT - SUBJ_TOP), vw * 0.92 / F.w);
    used = (SUBJ_BOT - SUBJ_TOP) * s;
    fit.y = Math.round(fit.top + Math.max(0, (avail - used) / 2) - SUBJ_TOP * s);
  } else {
    var room = vh2 - fit.top - 28 - copyH - 20;
    s = Math.min(room / (SUBJ_BOT - SUBJ_TOP), vw * 1.4 / F.w);
    used = (SUBJ_BOT - SUBJ_TOP) * s;
    var start2 = fit.top + Math.max(0, (room - used) / 2);
    fit.y = Math.round(start2 - SUBJ_TOP * s);
    bottomGap = Math.max(28, vh2 - (start2 + used + 20 + copyH));
    fit.copyTop = vh2 - bottomGap - copyH;
  }
  stage$1.style.setProperty("--copy-bottom", Math.round(bottomGap) + "px");
  fit.s = s;
  fit.x = Math.round((vw - F.w * s) / 2);
  frame$1.style.transform = "translate(" + fit.x + "px," + fit.y + "px) scale(" + s + ")";
  var root = stage$1.style;
  root.setProperty("--fs", s);
  root.setProperty("--horizon", clamp$2((fit.y + 560 * s) / vh2 * 100, 40, 92) + "%");
  hooks.forEach(function(fn) {
    fn();
  });
}
var version = "1.3.26";
function clamp2(min, input, max) {
  return Math.max(min, Math.min(input, max));
}
function lerp(x, y, t2) {
  return (1 - t2) * x + t2 * y;
}
function damp(x, y, lambda, deltaTime) {
  return lerp(x, y, 1 - Math.exp(-lambda * deltaTime));
}
function modulo(n, d) {
  return (n % d + d) % d;
}
var Animate = class {
  constructor() {
    __publicField(this, "isRunning", false);
    __publicField(this, "value", 0);
    __publicField(this, "from", 0);
    __publicField(this, "to", 0);
    __publicField(this, "currentTime", 0);
    __publicField(this, "lerp");
    __publicField(this, "duration");
    __publicField(this, "easing");
    __publicField(this, "onUpdate");
  }
  /**
  * Advance the animation by the given delta time
  *
  * @param deltaTime - The time in seconds to advance the animation
  */
  advance(deltaTime) {
    if (!this.isRunning) return;
    let completed = false;
    if (this.duration && this.easing) {
      this.currentTime += deltaTime;
      const linearProgress = clamp2(0, this.currentTime / this.duration, 1);
      completed = linearProgress >= 1;
      const easedProgress = completed ? 1 : this.easing(linearProgress);
      this.value = this.from + (this.to - this.from) * easedProgress;
    } else if (this.lerp) {
      this.value = damp(this.value, this.to, this.lerp * 60, deltaTime);
      if (Math.round(this.value) === Math.round(this.to)) {
        this.value = this.to;
        completed = true;
      }
    } else {
      this.value = this.to;
      completed = true;
    }
    if (completed) this.stop();
    this.onUpdate?.(this.value, completed);
  }
  /** Stop the animation */
  stop() {
    this.isRunning = false;
  }
  /**
  * Set up the animation from a starting value to an ending value
  * with optional parameters for lerping, duration, easing, and onUpdate callback
  *
  * @param from - The starting value
  * @param to - The ending value
  * @param options - Options for the animation
  */
  fromTo(from, to, { lerp: lerp2, duration, easing, onStart, onUpdate }) {
    this.from = this.value = from;
    this.to = to;
    this.lerp = lerp2;
    this.duration = duration;
    this.easing = easing;
    this.currentTime = 0;
    this.isRunning = true;
    onStart?.();
    this.onUpdate = onUpdate;
  }
};
function debounce(callback, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = void 0;
      callback.apply(this, args);
    }, delay);
  };
}
var Dimensions = class {
  constructor(wrapper, content, { autoResize = true, debounce: debounceValue = 250 } = {}) {
    __publicField(this, "width", 0);
    __publicField(this, "height", 0);
    __publicField(this, "scrollHeight", 0);
    __publicField(this, "scrollWidth", 0);
    __publicField(this, "debouncedResize");
    __publicField(this, "wrapperResizeObserver");
    __publicField(this, "contentResizeObserver");
    __publicField(this, "resize", () => {
      this.onWrapperResize();
      this.onContentResize();
    });
    __publicField(this, "onWrapperResize", () => {
      if (this.wrapper instanceof Window) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      } else {
        this.width = this.wrapper.clientWidth;
        this.height = this.wrapper.clientHeight;
      }
    });
    __publicField(this, "onContentResize", () => {
      if (this.wrapper instanceof Window) {
        this.scrollHeight = this.content.scrollHeight;
        this.scrollWidth = this.content.scrollWidth;
      } else {
        this.scrollHeight = this.wrapper.scrollHeight;
        this.scrollWidth = this.wrapper.scrollWidth;
      }
    });
    this.wrapper = wrapper;
    this.content = content;
    if (autoResize) {
      this.debouncedResize = debounce(this.resize, debounceValue);
      if (this.wrapper instanceof Window) window.addEventListener("resize", this.debouncedResize);
      else {
        this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize);
        this.wrapperResizeObserver.observe(this.wrapper);
      }
      this.contentResizeObserver = new ResizeObserver(this.debouncedResize);
      this.contentResizeObserver.observe(this.content);
    }
    this.resize();
  }
  destroy() {
    this.wrapperResizeObserver?.disconnect();
    this.contentResizeObserver?.disconnect();
    if (this.wrapper === window && this.debouncedResize) window.removeEventListener("resize", this.debouncedResize);
  }
  get limit() {
    return {
      x: this.scrollWidth - this.width,
      y: this.scrollHeight - this.height
    };
  }
};
var Emitter = class {
  constructor() {
    __publicField(this, "events", {});
  }
  /**
  * Emit an event with the given data
  * @param event Event name
  * @param args Data to pass to the event handlers
  */
  emit(event, ...args) {
    const callbacks = this.events[event] || [];
    for (let i = 0, length = callbacks.length; i < length; i++) callbacks[i]?.(...args);
  }
  /**
  * Add a callback to the event
  * @param event Event name
  * @param cb Callback function
  * @returns Unsubscribe function
  */
  on(event, cb) {
    if (this.events[event]) this.events[event].push(cb);
    else this.events[event] = [cb];
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i);
    };
  }
  /**
  * Remove a callback from the event
  * @param event Event name
  * @param callback Callback function
  */
  off(event, callback) {
    this.events[event] = this.events[event]?.filter((i) => callback !== i);
  }
  /**
  * Remove all event listeners and clean up
  */
  destroy() {
    this.events = {};
  }
};
const LINE_HEIGHT = 100 / 6;
const listenerOptions = { passive: false };
function getDeltaMultiplier(deltaMode, size) {
  if (deltaMode === 1) return LINE_HEIGHT;
  if (deltaMode === 2) return size;
  return 1;
}
var VirtualScroll = class {
  constructor(element, options = {
    wheelMultiplier: 1,
    touchMultiplier: 1
  }) {
    __publicField(this, "touchStart", {
      x: 0,
      y: 0
    });
    __publicField(this, "lastDelta", {
      x: 0,
      y: 0
    });
    __publicField(this, "window", {
      width: 0,
      height: 0
    });
    __publicField(this, "emitter", new Emitter());
    /**
    * Event handler for 'touchstart' event
    *
    * @param event Touch event
    */
    __publicField(this, "onTouchStart", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: 0,
        y: 0
      };
      this.emitter.emit("scroll", {
        deltaX: 0,
        deltaY: 0,
        event
      });
    });
    /** Event handler for 'touchmove' event */
    __publicField(this, "onTouchMove", (event) => {
      const { clientX, clientY } = event.targetTouches ? event.targetTouches[0] : event;
      const deltaX = -(clientX - this.touchStart.x) * this.options.touchMultiplier;
      const deltaY = -(clientY - this.touchStart.y) * this.options.touchMultiplier;
      this.touchStart.x = clientX;
      this.touchStart.y = clientY;
      this.lastDelta = {
        x: deltaX,
        y: deltaY
      };
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    });
    __publicField(this, "onTouchEnd", (event) => {
      this.emitter.emit("scroll", {
        deltaX: this.lastDelta.x,
        deltaY: this.lastDelta.y,
        event
      });
    });
    /** Event handler for 'wheel' event */
    __publicField(this, "onWheel", (event) => {
      let { deltaX, deltaY, deltaMode } = event;
      const multiplierX = getDeltaMultiplier(deltaMode, this.window.width);
      const multiplierY = getDeltaMultiplier(deltaMode, this.window.height);
      deltaX *= multiplierX;
      deltaY *= multiplierY;
      deltaX *= this.options.wheelMultiplier;
      deltaY *= this.options.wheelMultiplier;
      this.emitter.emit("scroll", {
        deltaX,
        deltaY,
        event
      });
    });
    __publicField(this, "onWindowResize", () => {
      this.window = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    });
    this.element = element;
    this.options = options;
    window.addEventListener("resize", this.onWindowResize);
    this.onWindowResize();
    this.element.addEventListener("wheel", this.onWheel, listenerOptions);
    this.element.addEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.addEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.addEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
  /**
  * Add an event listener for the given event and callback
  *
  * @param event Event name
  * @param callback Callback function
  */
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  /** Remove all event listeners and clean up */
  destroy() {
    this.emitter.destroy();
    window.removeEventListener("resize", this.onWindowResize);
    this.element.removeEventListener("wheel", this.onWheel, listenerOptions);
    this.element.removeEventListener("touchstart", this.onTouchStart, listenerOptions);
    this.element.removeEventListener("touchmove", this.onTouchMove, listenerOptions);
    this.element.removeEventListener("touchend", this.onTouchEnd, listenerOptions);
  }
};
const defaultEasing = (t2) => Math.min(1, 1.001 - 2 ** (-10 * t2));
var Lenis = class {
  constructor({ wrapper = window, content = document.documentElement, eventsTarget = wrapper, smoothWheel = true, syncTouch = false, syncTouchLerp = 0.075, touchInertiaExponent = 1.7, duration, easing, lerp: lerp2 = 0.1, infinite = false, orientation = "vertical", gestureOrientation = orientation === "horizontal" ? "both" : "vertical", touchMultiplier = 1, wheelMultiplier = 1, autoResize = true, prevent, virtualScroll, overscroll = true, autoRaf = false, anchors: anchors2 = false, autoToggle = false, allowNestedScroll = false, __experimental__naiveDimensions = false, naiveDimensions = __experimental__naiveDimensions, stopInertiaOnNavigate = false, respectReducedMotion = true } = {}) {
    __publicField(this, "_isScrolling", false);
    __publicField(this, "_isStopped", false);
    __publicField(this, "_isLocked", false);
    __publicField(this, "_preventNextNativeScrollEvent", false);
    __publicField(this, "_resetVelocityTimeout", null);
    __publicField(this, "_rafId", null);
    __publicField(this, "_isDraggingSelection", false);
    __publicField(this, "reducedMotionMediaQuery", window.matchMedia("(prefers-reduced-motion: reduce)"));
    /**
    * Whether or not the user is touching the screen
    */
    __publicField(this, "isTouching");
    /**
    * Whether or not the device is running iOS
    */
    __publicField(this, "isIos");
    /**
    * The time in ms since the lenis instance was created
    */
    __publicField(this, "time", 0);
    /**
    * User data that will be forwarded through the scroll event
    *
    * @example
    * lenis.scrollTo(100, {
    *   userData: {
    *     foo: 'bar'
    *   }
    * })
    */
    __publicField(this, "userData", {});
    /**
    * The last velocity of the scroll
    */
    __publicField(this, "lastVelocity", 0);
    /**
    * The current velocity of the scroll
    */
    __publicField(this, "velocity", 0);
    /**
    * The direction of the scroll
    */
    __publicField(this, "direction", 0);
    /**
    * The options passed to the lenis instance
    */
    __publicField(this, "options");
    /**
    * The target scroll value
    */
    __publicField(this, "targetScroll");
    /**
    * The animated scroll value
    */
    __publicField(this, "animatedScroll");
    __publicField(this, "animate", new Animate());
    __publicField(this, "emitter", new Emitter());
    __publicField(this, "dimensions");
    __publicField(this, "virtualScroll");
    __publicField(this, "onScrollEnd", (e) => {
      if (!(e instanceof CustomEvent)) {
        if (this.isScrolling === "smooth" || this.isScrolling === false) e.stopPropagation();
      }
    });
    __publicField(this, "dispatchScrollendEvent", () => {
      this.options.wrapper.dispatchEvent(new CustomEvent("scrollend", {
        bubbles: this.options.wrapper === window,
        detail: { lenisScrollEnd: true }
      }));
    });
    __publicField(this, "onTransitionEnd", (event) => {
      if (event.propertyName?.includes("overflow") && event.target === this.rootElement) this.checkOverflow();
    });
    __publicField(this, "onClick", (event) => {
      const linkElementsUrls = event.composedPath().filter((node) => node instanceof HTMLAnchorElement && node.href).map((element) => new URL(element.href));
      const currentUrl = new URL(window.location.href);
      if (this.options.anchors) {
        const anchorElementUrl = linkElementsUrls.find((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname === targetUrl.pathname && targetUrl.hash);
        if (anchorElementUrl) {
          const options = typeof this.options.anchors === "object" && this.options.anchors ? this.options.anchors : void 0;
          const target = decodeURIComponent(anchorElementUrl.hash);
          this.scrollTo(target, options);
          return;
        }
      }
      if (this.options.stopInertiaOnNavigate) {
        if (linkElementsUrls.some((targetUrl) => currentUrl.host === targetUrl.host && currentUrl.pathname !== targetUrl.pathname)) {
          this.reset();
          return;
        }
      }
    });
    __publicField(this, "onPointerDown", (event) => {
      if (event.button === 1) this.reset();
    });
    __publicField(this, "onVirtualScroll", (data) => {
      if (typeof this.options.virtualScroll === "function" && this.options.virtualScroll(data) === false) return;
      const { deltaX, deltaY, event } = data;
      this.emitter.emit("virtual-scroll", {
        deltaX,
        deltaY,
        event
      });
      if (event.ctrlKey) return;
      if (event.lenisStopPropagation) return;
      const isTouch = event.type.includes("touch");
      const isWheel = event.type.includes("wheel");
      if (isTouch && this.isIos) {
        if (event.type === "touchstart") this._isDraggingSelection = this.isTouchOnSelectionHandle(event);
        if (this._isDraggingSelection) {
          if (event.type === "touchend") this._isDraggingSelection = false;
          return;
        }
      }
      this.isTouching = event.type === "touchstart" || event.type === "touchmove";
      const isClickOrTap = deltaX === 0 && deltaY === 0;
      if (this.options.syncTouch && isTouch && event.type === "touchstart" && isClickOrTap && !this.isStopped && !this.isLocked) {
        this.reset();
        return;
      }
      const isUnknownGesture = this.options.gestureOrientation === "vertical" && deltaY === 0 || this.options.gestureOrientation === "horizontal" && deltaX === 0;
      if (isClickOrTap || isUnknownGesture) return;
      let composedPath = event.composedPath();
      composedPath = composedPath.slice(0, composedPath.indexOf(this.rootElement));
      const prevent = this.options.prevent;
      const gestureOrientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
      if (composedPath.find((node) => node instanceof HTMLElement && (typeof prevent === "function" && prevent?.(node) || node.hasAttribute?.("data-lenis-prevent") || gestureOrientation === "vertical" && node.hasAttribute?.("data-lenis-prevent-vertical") || gestureOrientation === "horizontal" && node.hasAttribute?.("data-lenis-prevent-horizontal") || isTouch && node.hasAttribute?.("data-lenis-prevent-touch") || isWheel && node.hasAttribute?.("data-lenis-prevent-wheel") || this.options.allowNestedScroll && this.hasNestedScroll(node, {
        deltaX,
        deltaY
      })))) return;
      if (this.isStopped || this.isLocked) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      if (!(this.options.syncTouch && isTouch || this.options.smoothWheel && isWheel)) {
        this.isScrolling = "native";
        this.animate.stop();
        event.lenisStopPropagation = true;
        return;
      }
      let delta = deltaY;
      if (this.options.gestureOrientation === "both") delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
      else if (this.options.gestureOrientation === "horizontal") delta = deltaX;
      if (!this.options.overscroll || this.options.infinite || this.options.wrapper !== window && this.limit > 0 && (this.animatedScroll > 0 && this.animatedScroll < this.limit || this.animatedScroll === 0 && deltaY > 0 || this.animatedScroll === this.limit && deltaY < 0)) event.lenisStopPropagation = true;
      if (event.cancelable) event.preventDefault();
      const isSyncTouch = isTouch && this.options.syncTouch;
      const hasTouchInertia = isTouch && event.type === "touchend";
      if (hasTouchInertia) delta = Math.sign(delta) * Math.abs(this.velocity) ** this.options.touchInertiaExponent;
      this.scrollTo(this.targetScroll + delta, {
        programmatic: false,
        ...isSyncTouch ? { lerp: hasTouchInertia ? this.options.syncTouchLerp : 1 } : {
          lerp: this.options.lerp,
          duration: this.options.duration,
          easing: this.options.easing
        }
      });
    });
    __publicField(this, "onNativeScroll", () => {
      if (this._resetVelocityTimeout !== null) {
        clearTimeout(this._resetVelocityTimeout);
        this._resetVelocityTimeout = null;
      }
      if (this._preventNextNativeScrollEvent) {
        this._preventNextNativeScrollEvent = false;
        return;
      }
      if (this.isScrolling === false || this.isScrolling === "native") {
        const lastScroll = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll;
        this.lastVelocity = this.velocity;
        this.velocity = this.animatedScroll - lastScroll;
        this.direction = Math.sign(this.animatedScroll - lastScroll);
        if (!this.isStopped) this.isScrolling = "native";
        this.emit();
        if (this.velocity !== 0) this._resetVelocityTimeout = setTimeout(() => {
          this.lastVelocity = this.velocity;
          this.velocity = 0;
          this.isScrolling = false;
          this.emit();
        }, 400);
      }
    });
    /**
    * RequestAnimationFrame for lenis
    *
    * @param time The time in ms from an external clock like `requestAnimationFrame` or Tempus
    */
    __publicField(this, "raf", (time) => {
      const deltaTime = time - (this.time || time);
      this.time = time;
      this.animate.advance(deltaTime * 1e-3);
      if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
    });
    window.lenisVersion = version;
    if (!window.lenis) window.lenis = {};
    window.lenis.version = version;
    if (orientation === "horizontal") window.lenis.horizontal = true;
    if (syncTouch === true) window.lenis.touch = true;
    this.isIos = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    if (!wrapper || wrapper === document.documentElement) wrapper = window;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.options = {
      wrapper,
      content,
      eventsTarget,
      smoothWheel,
      syncTouch,
      syncTouchLerp,
      touchInertiaExponent,
      duration,
      easing,
      lerp: lerp2,
      infinite,
      gestureOrientation,
      orientation,
      touchMultiplier,
      wheelMultiplier,
      autoResize,
      prevent,
      virtualScroll,
      overscroll,
      autoRaf,
      anchors: anchors2,
      autoToggle,
      allowNestedScroll,
      naiveDimensions,
      stopInertiaOnNavigate,
      respectReducedMotion
    };
    this.dimensions = new Dimensions(wrapper, content, { autoResize });
    this.updateClassName();
    this.targetScroll = this.animatedScroll = this.actualScroll;
    this.options.wrapper.addEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.addEventListener("scrollend", this.onScrollEnd, { capture: true });
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.addEventListener("click", this.onClick);
    this.options.wrapper.addEventListener("pointerdown", this.onPointerDown);
    this.virtualScroll = new VirtualScroll(eventsTarget, {
      touchMultiplier,
      wheelMultiplier
    });
    this.virtualScroll.on("scroll", this.onVirtualScroll);
    if (this.options.autoToggle) {
      this.checkOverflow();
      this.rootElement.addEventListener("transitionend", this.onTransitionEnd);
    }
    if (this.options.autoRaf) this._rafId = requestAnimationFrame(this.raf);
  }
  /**
  * Destroy the lenis instance, remove all event listeners and clean up the class name
  */
  destroy() {
    this.emitter.destroy();
    this.options.wrapper.removeEventListener("scroll", this.onNativeScroll);
    this.options.wrapper.removeEventListener("scrollend", this.onScrollEnd, { capture: true });
    this.options.wrapper.removeEventListener("pointerdown", this.onPointerDown);
    if (this.options.anchors || this.options.stopInertiaOnNavigate) this.options.wrapper.removeEventListener("click", this.onClick);
    this.virtualScroll.destroy();
    this.dimensions.destroy();
    this.cleanUpClassName();
    if (this._rafId) cancelAnimationFrame(this._rafId);
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  off(event, callback) {
    return this.emitter.off(event, callback);
  }
  get overflow() {
    const property = this.isHorizontal ? "overflow-x" : "overflow-y";
    return getComputedStyle(this.rootElement)[property];
  }
  checkOverflow() {
    if (["hidden", "clip"].includes(this.overflow)) this.internalStop();
    else this.internalStart();
  }
  setScroll(scroll) {
    if (this.isHorizontal) this.options.wrapper.scrollTo({
      left: scroll,
      behavior: "instant"
    });
    else this.options.wrapper.scrollTo({
      top: scroll,
      behavior: "instant"
    });
  }
  isTouchOnSelectionHandle(event) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
    const touch = event.targetTouches[0] ?? event.changedTouches[0];
    if (!touch) return false;
    const rects = selection.getRangeAt(0).getClientRects();
    if (rects.length === 0) return false;
    const first = rects[0];
    const last2 = rects[rects.length - 1];
    const HANDLE_RADIUS = 40;
    const nearStart = Math.hypot(touch.clientX - first.left, touch.clientY - first.top) <= HANDLE_RADIUS;
    const nearEnd = Math.hypot(touch.clientX - last2.right, touch.clientY - last2.bottom) <= HANDLE_RADIUS;
    return nearStart || nearEnd;
  }
  /**
  * Force lenis to recalculate the dimensions
  */
  resize() {
    this.dimensions.resize();
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.emit();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = false;
    this.isScrolling = false;
    this.animatedScroll = this.targetScroll = this.actualScroll;
    this.lastVelocity = this.velocity = 0;
    this.animate.stop();
  }
  /**
  * Start lenis scroll after it has been stopped
  */
  start() {
    if (!this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.removeProperty("overflow");
      return;
    }
    this.internalStart();
  }
  internalStart() {
    if (!this.isStopped) return;
    this.reset();
    this.isStopped = false;
    this.emit();
  }
  /**
  * Stop lenis scroll
  */
  stop() {
    if (this.isStopped) return;
    if (this.options.autoToggle) {
      this.rootElement.style.setProperty("overflow", "clip");
      return;
    }
    this.internalStop();
  }
  internalStop() {
    if (this.isStopped) return;
    this.reset();
    this.isStopped = true;
    this.emit();
  }
  /**
  * Scroll to a target value
  *
  * @param target The target value to scroll to
  * @param options The options for the scroll
  *
  * @example
  * lenis.scrollTo(100, {
  *   offset: 100,
  *   duration: 1,
  *   easing: (t) => 1 - Math.cos((t * Math.PI) / 2),
  *   lerp: 0.1,
  *   onStart: () => {
  *     console.log('onStart')
  *   },
  *   onComplete: () => {
  *     console.log('onComplete')
  *   },
  * })
  */
  scrollTo(_target, { offset = 0, immediate = false, lock = false, programmatic = true, lerp: lerp2 = programmatic ? this.options.lerp : void 0, duration = programmatic ? this.options.duration : void 0, easing = programmatic ? this.options.easing : void 0, onStart, onComplete, force = false, userData } = {}) {
    if (this.prefersReducedMotion) if (programmatic) immediate = true;
    else {
      lerp2 = 1;
      duration = void 0;
      easing = void 0;
    }
    if ((this.isStopped || this.isLocked) && !force) return;
    let target = _target;
    let adjustedOffset = offset;
    if (typeof target === "string" && [
      "top",
      "left",
      "start",
      "#"
    ].includes(target)) target = 0;
    else if (typeof target === "string" && [
      "bottom",
      "right",
      "end"
    ].includes(target)) target = this.limit;
    else {
      let node = null;
      if (typeof target === "string") {
        node = target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector(target);
        if (!node) if (target === "#top") target = 0;
        else console.warn("Lenis: Target not found", target);
      } else if (target instanceof HTMLElement && target?.nodeType) node = target;
      if (node) {
        if (this.options.wrapper !== window) {
          const wrapperRect = this.rootElement.getBoundingClientRect();
          adjustedOffset -= this.isHorizontal ? wrapperRect.left : wrapperRect.top;
        }
        const rect = node.getBoundingClientRect();
        const targetStyle = getComputedStyle(node);
        const scrollMargin = this.isHorizontal ? Number.parseFloat(targetStyle.scrollMarginLeft) : Number.parseFloat(targetStyle.scrollMarginTop);
        const containerStyle = getComputedStyle(this.rootElement);
        const scrollPadding = this.isHorizontal ? Number.parseFloat(containerStyle.scrollPaddingLeft) : Number.parseFloat(containerStyle.scrollPaddingTop);
        target = (this.isHorizontal ? rect.left : rect.top) + this.animatedScroll - (Number.isNaN(scrollMargin) ? 0 : scrollMargin) - (Number.isNaN(scrollPadding) ? 0 : scrollPadding);
      }
    }
    if (typeof target !== "number") return;
    target += adjustedOffset;
    if (this.options.infinite) {
      if (programmatic) {
        this.targetScroll = this.animatedScroll = this.scroll;
        const distance = target - this.animatedScroll;
        if (distance > this.limit / 2) target -= this.limit;
        else if (distance < -this.limit / 2) target += this.limit;
      }
    } else target = clamp2(0, target, this.limit);
    if (target === this.targetScroll) {
      onStart?.(this);
      onComplete?.(this);
      return;
    }
    this.userData = userData ?? {};
    if (immediate) {
      this.animatedScroll = this.targetScroll = target;
      this.setScroll(this.scroll);
      this.reset();
      this.preventNextNativeScrollEvent();
      this.emit();
      onComplete?.(this);
      this.userData = {};
      requestAnimationFrame(() => {
        this.dispatchScrollendEvent();
      });
      return;
    }
    if (!programmatic) this.targetScroll = target;
    if (typeof duration === "number" && typeof easing !== "function") easing = defaultEasing;
    else if (typeof easing === "function" && typeof duration !== "number") duration = 1;
    this.animate.fromTo(this.animatedScroll, target, {
      duration,
      easing,
      lerp: lerp2,
      onStart: () => {
        if (lock) this.isLocked = true;
        this.isScrolling = "smooth";
        onStart?.(this);
      },
      onUpdate: (value, completed) => {
        this.isScrolling = "smooth";
        this.lastVelocity = this.velocity;
        this.velocity = value - this.animatedScroll;
        this.direction = Math.sign(this.velocity);
        this.animatedScroll = value;
        this.setScroll(this.scroll);
        if (programmatic) this.targetScroll = value;
        if (!completed) this.emit();
        if (completed) {
          this.reset();
          this.emit();
          onComplete?.(this);
          this.userData = {};
          requestAnimationFrame(() => {
            this.dispatchScrollendEvent();
          });
          this.preventNextNativeScrollEvent();
        }
      }
    });
  }
  preventNextNativeScrollEvent() {
    this._preventNextNativeScrollEvent = true;
    requestAnimationFrame(() => {
      this._preventNextNativeScrollEvent = false;
    });
  }
  hasNestedScroll(node, { deltaX, deltaY }) {
    const time = Date.now();
    if (!node._lenis) node._lenis = {};
    const cache = node._lenis;
    let hasOverflowX;
    let hasOverflowY;
    let isScrollableX;
    let isScrollableY;
    let hasOverscrollBehaviorX;
    let hasOverscrollBehaviorY;
    let scrollWidth;
    let scrollHeight;
    let clientWidth;
    let clientHeight;
    if (time - (cache.time ?? 0) > 2e3) {
      cache.time = Date.now();
      const computedStyle = window.getComputedStyle(node);
      cache.computedStyle = computedStyle;
      hasOverflowX = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowX);
      hasOverflowY = [
        "auto",
        "overlay",
        "scroll"
      ].includes(computedStyle.overflowY);
      hasOverscrollBehaviorX = ["auto"].includes(computedStyle.overscrollBehaviorX);
      hasOverscrollBehaviorY = ["auto"].includes(computedStyle.overscrollBehaviorY);
      cache.hasOverflowX = hasOverflowX;
      cache.hasOverflowY = hasOverflowY;
      if (!(hasOverflowX || hasOverflowY)) return false;
      scrollWidth = node.scrollWidth;
      scrollHeight = node.scrollHeight;
      clientWidth = node.clientWidth;
      clientHeight = node.clientHeight;
      isScrollableX = scrollWidth > clientWidth;
      isScrollableY = scrollHeight > clientHeight;
      cache.isScrollableX = isScrollableX;
      cache.isScrollableY = isScrollableY;
      cache.scrollWidth = scrollWidth;
      cache.scrollHeight = scrollHeight;
      cache.clientWidth = clientWidth;
      cache.clientHeight = clientHeight;
      cache.hasOverscrollBehaviorX = hasOverscrollBehaviorX;
      cache.hasOverscrollBehaviorY = hasOverscrollBehaviorY;
    } else {
      isScrollableX = cache.isScrollableX;
      isScrollableY = cache.isScrollableY;
      hasOverflowX = cache.hasOverflowX;
      hasOverflowY = cache.hasOverflowY;
      scrollWidth = cache.scrollWidth;
      scrollHeight = cache.scrollHeight;
      clientWidth = cache.clientWidth;
      clientHeight = cache.clientHeight;
      hasOverscrollBehaviorX = cache.hasOverscrollBehaviorX;
      hasOverscrollBehaviorY = cache.hasOverscrollBehaviorY;
    }
    if (!(hasOverflowX && isScrollableX || hasOverflowY && isScrollableY)) return false;
    const orientation = Math.abs(deltaX) >= Math.abs(deltaY) ? "horizontal" : "vertical";
    let scroll;
    let maxScroll;
    let delta;
    let hasOverflow;
    let isScrollable;
    let hasOverscrollBehavior;
    if (orientation === "horizontal") {
      scroll = Math.round(node.scrollLeft);
      maxScroll = scrollWidth - clientWidth;
      delta = deltaX;
      hasOverflow = hasOverflowX;
      isScrollable = isScrollableX;
      hasOverscrollBehavior = hasOverscrollBehaviorX;
    } else if (orientation === "vertical") {
      scroll = Math.round(node.scrollTop);
      maxScroll = scrollHeight - clientHeight;
      delta = deltaY;
      hasOverflow = hasOverflowY;
      isScrollable = isScrollableY;
      hasOverscrollBehavior = hasOverscrollBehaviorY;
    } else return false;
    if (!hasOverscrollBehavior && (scroll >= maxScroll || scroll <= 0)) return true;
    return (delta > 0 ? scroll < maxScroll : scroll > 0) && hasOverflow && isScrollable;
  }
  /**
  * The root element on which lenis is instanced
  */
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  /**
  * The limit which is the maximum scroll value
  */
  get limit() {
    if (this.options.naiveDimensions) {
      if (this.isHorizontal) return this.rootElement.scrollWidth - this.rootElement.clientWidth;
      return this.rootElement.scrollHeight - this.rootElement.clientHeight;
    }
    return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  /**
  * Whether or not the scroll is horizontal
  */
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  /**
  * The actual scroll value
  */
  get actualScroll() {
    const wrapper = this.options.wrapper;
    return this.isHorizontal ? wrapper.scrollX ?? wrapper.scrollLeft : wrapper.scrollY ?? wrapper.scrollTop;
  }
  /**
  * The current scroll value
  */
  get scroll() {
    return this.options.infinite ? modulo(this.animatedScroll, this.limit) : this.animatedScroll;
  }
  /**
  * The progress of the scroll relative to the limit
  */
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  /**
  * Current scroll state
  */
  get isScrolling() {
    return this._isScrolling;
  }
  set isScrolling(value) {
    if (this._isScrolling !== value) {
      this._isScrolling = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is stopped
  */
  get isStopped() {
    return this._isStopped;
  }
  set isStopped(value) {
    if (this._isStopped !== value) {
      this._isStopped = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is locked
  */
  get isLocked() {
    return this._isLocked;
  }
  set isLocked(value) {
    if (this._isLocked !== value) {
      this._isLocked = value;
      this.updateClassName();
    }
  }
  /**
  * Check if lenis is smooth scrolling
  */
  get isSmooth() {
    return this.isScrolling === "smooth";
  }
  /**
  * Whether the user prefers reduced motion and lenis is honoring it (see `respectReducedMotion` option)
  */
  get prefersReducedMotion() {
    return this.options.respectReducedMotion && this.reducedMotionMediaQuery.matches;
  }
  /**
  * The class name applied to the wrapper element
  */
  get className() {
    let className = "lenis";
    if (this.options.autoToggle) className += " lenis-autoToggle";
    if (this.isStopped) className += " lenis-stopped";
    if (this.isLocked) className += " lenis-locked";
    if (this.isScrolling) className += " lenis-scrolling";
    if (this.isScrolling === "smooth") className += " lenis-smooth";
    return className;
  }
  updateClassName() {
    this.cleanUpClassName();
    this.className.split(" ").forEach((className) => {
      this.rootElement.classList.add(className);
    });
  }
  cleanUpClassName() {
    for (const className of Array.from(this.rootElement.classList)) if (className === "lenis" || className.startsWith("lenis-")) this.rootElement.classList.remove(className);
  }
};
var lenis = reduced ? null : new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.9, autoRaf: false });
var frameFns = [];
function onFrame(fn) {
  frameFns.push(fn);
}
var last$1 = 0;
gsapWithCSS.ticker.lagSmoothing(0);
gsapWithCSS.ticker.add(function(time) {
  var now2 = time * 1e3;
  if (lenis) lenis.raf(now2);
  var dt = last$1 ? Math.min(0.05, (now2 - last$1) / 1e3) : 1 / 60;
  last$1 = now2;
  for (var i = 0; i < frameFns.length; i++) frameFns[i](dt, now2);
});
function scrollToY(y, glide) {
  if (!lenis) {
    window.scrollTo({ top: y, behavior: glide && !reduced ? "smooth" : "auto" });
    return;
  }
  if (glide) lenis.scrollTo(y, { duration: Math.min(2.6, 1 + Math.abs(y - window.scrollY) / 5e3), easing: function(t2) {
    return t2 < 0.5 ? 4 * t2 * t2 * t2 : 1 - Math.pow(-2 * t2 + 2, 3) / 2;
  }, force: true });
  else lenis.scrollTo(y, { immediate: true, force: true });
}
const layers = { "pouch": { "file": "art/pouch", "w": 2001, "h": 2262, "x": 579, "y": 175 }, "pouch-pull": { "file": "art/pouch-pull", "w": 279, "h": 860, "x": 200, "y": 81 }, "tile-0": { "file": "art/tile-0", "w": 584, "h": 655, "x": 82, "y": 662 }, "tile-1": { "file": "art/tile-1", "w": 467, "h": 591, "x": 676, "y": 642 }, "tile-2": { "file": "art/tile-2", "w": 533, "h": 701, "x": 1171, "y": 701 }, "tile-3": { "file": "art/tile-3", "w": 498, "h": 676, "x": 1767, "y": 656 }, "tile-4": { "file": "art/tile-4", "w": 510, "h": 685, "x": 2372, "y": 667 }, "tile-5": { "file": "art/tile-5", "w": 517, "h": 666, "x": 2896, "y": 687 }, "padlock": { "file": "art/padlock", "w": 869, "h": 1410, "x": 293, "y": 199 }, "phone": { "file": "art/phone", "w": 576, "h": 996, "x": 170, "y": 663 }, "laptop": { "file": "art/laptop", "w": 1684, "h": 1238, "x": 838, "y": 437 }, "tablet": { "file": "art/tablet", "w": 1009, "h": 1276, "x": 2729, "y": 488 }, "bag": { "file": "art/bag", "w": 2010, "h": 1531, "x": 328, "y": 348 }, "bag-front": { "file": "art/bag-front", "w": 2010, "h": 1531, "x": 328, "y": 348 } };
const anchors = { "pouch": { "seamTop": 995.3, "seamBottom": 1003.7, "zipTop": 58.4, "zipBottom": 2201.5, "teethHalfWidth": 29.2 }, "pouch-pull": { "seat": { "x": 139.5, "y": 80.9 }, "tab": { "x": 139.5, "y": 552.8, "w": 270.5, "h": 605 } }, "tile-0": { "center": { "x": 292.1, "y": 327.6 }, "cobalt": false }, "tile-1": { "center": { "x": 233.6, "y": 295.7 }, "cobalt": false }, "tile-2": { "center": { "x": 266.4, "y": 350.6 }, "cobalt": false }, "tile-3": { "center": { "x": 248.8, "y": 337.9 }, "cobalt": true }, "tile-4": { "center": { "x": 255.2, "y": 342.4 }, "cobalt": false }, "tile-5": { "center": { "x": 258.3, "y": 333 }, "cobalt": false }, "phone": { "screen": [[45.4, 47.2], [415.8, 22.9], [563.7, 906.1], [190.1, 970.2]], "attach": { "x": 231, "y": 14 } }, "laptop": { "screen": [[424.1, 51.4], [1641.1, 86.1], [1576.2, 848.6], [349.8, 789.7]], "attach": { "x": 1033, "y": 23 } }, "tablet": { "screen": [[209.5, 50.1], [941.9, 102.2], [774.9, 1218.2], [46.7, 1102.5]], "attach": { "x": 576, "y": 30 } }, "bag": { "mouth": { "x": 1005, "y": 65.4 }, "apex": { "x": 998.3, "y": 968.2 }, "corners": [[301.7, 21.6], [1700.7, 14.1]], "backTop": 212.8, "tab": null, "profile": [[14.1, 699.5], [108.9, 861.2], [202.8, 888.6], [297.6, 896.9], [392.4, 900.2], [486.3, 905.2], [581, 912.7], [675, 922.7], [769.7, 934.3], [864.5, 946.8], [958.4, 960.1], [1053.2, 973.4], [1148, 985], [1241.9, 995], [1336.7, 997.5], [1430.6, 973.4], [1525.4, 0]] } };
const ART = {
  layers,
  anchors
};
var WARP = [
  "uniform vec2 size;",
  // the layer (px)
  "uniform vec2 frm;",
  // the canvas margin each side (px), the canvas width (px)
  "uniform vec4 sa; uniform vec2 sb;",
  // the seam: (x, y) at its top and where it bends, (x, y) at its bottom (px)
  "uniform vec2 zip;",
  // the zipper's top (px), the slider's lowest point (px)
  "uniform vec2 open;",
  // the slider (px), the V's half gap at the top (px)
  "uniform float slump;",
  // 0 open pouch .. 1 the bag's shape
  "uniform vec3 sl;",
  // the middle x, the pouch's half width, how far the top sinks toward the slider
  "uniform float prof[17]; uniform vec2 profY;",
  // the bag's half width at 17 heights, from profY.x to profY.y
  "float seamX(float y){ if (y < sa.w) return mix(sa.x, sa.z, clamp((y - sa.y) / (sa.w - sa.y), 0.0, 1.0)); return mix(sa.z, sb.x, clamp((y - sa.w) / (sb.y - sa.w), 0.0, 1.0)); }",
  "float bagHalf(float y){ float f = clamp((y - profY.x) / (profY.y - profY.x), 0.0, 1.0) * 16.0; int i = int(min(floor(f), 15.0)); return mix(prof[i], prof[i + 1], f - float(i)); }",
  // the V's half gap at height y (0 at the slider, open.y at the top); straight sides once slumped
  "float gapAt(float y){ float h = clamp((open.x - y) / max(open.x - zip.x, 1.0), 0.0, 1.0); return open.y * pow(h, mix(0.85, 1.0, slump)); }",
  "vec2 relax(vec2 p){",
  "  if (p.y < open.x) p.y = open.x - (open.x - p.y) * mix(1.0, sl.z, slump);",
  "  p.x = sl.x + (p.x - sl.x) * mix(1.0, bagHalf(p.y) / sl.y, slump);",
  "  return p;",
  "}",
  "vec4 clip(vec2 p){ return vec4((p.x + frm.x) / frm.y * 2.0 - 1.0, 1.0 - p.y / size.y * 2.0, 0.0, 1.0); }"
].join("\n");
var VS$1 = [
  "attribute vec2 uv;",
  WARP,
  "varying vec2 vUv; varying float vOpen; varying float vNear; varying float vCrease;",
  "void main(){",
  "  float side = uv.x < 0.0 ? -1.0 : 1.0;",
  // the halves are passed with the left half flagged by u < 0
  "  vec2 t = vec2(abs(uv.x), uv.y);",
  "  vec2 p = t * size;",
  "  float sx = seamX(p.y);",
  "  float W = side < 0.0 ? sx : size.x - sx;",
  "  float r = clamp(abs(p.x - sx) / W, 0.0, 1.0);",
  "  float a = gapAt(p.y);",
  // the flap moves out most at its cut edge; the exponent eases toward 1 as the gap grows, so it never folds over
  "  float pe = min(1.7, 0.95 * W / max(a, 1.0));",
  "  float fall = pow(1.0 - r, pe);",
  "  p.x += side * a * fall;",
  "  vCrease = clamp(a * pe * pow(max(1.0 - r, 1e-3), pe - 1.0) / W, 0.0, 1.0);",
  // how squeezed the fabric is here
  "  vOpen = a * fall; vNear = 1.0 - r;",
  "  vUv = t;",
  "  gl_Position = clip(relax(p));",
  "}"
].join("\n");
var FS = [
  "precision mediump float;",
  "uniform sampler2D tex; uniform vec2 sheen; uniform float gap;",
  "varying vec2 vUv; varying float vOpen; varying float vNear; varying float vCrease;",
  "void main(){",
  "  vec4 c = texture2D(tex, vUv);",
  // premultiplied
  "  float o = clamp(vOpen / max(gap, 1.0), 0.0, 1.0);",
  // the cut edge curls in: a little darker, lit cobalt from inside, its very edge (the plastic's thickness) catching
  // the light
  "  float edge = smoothstep(0.82, 1.0, vNear) * clamp(o * 1.6, 0.0, 1.0);",
  "  c.rgb *= 1.0 - 0.18 * edge;",
  "  c.rgb += vec3(0.10, 0.26, 0.85) * 0.45 * edge * c.a;",
  "  float lip = smoothstep(0.975, 1.0, vNear) * clamp(o * 3.0, 0.0, 1.0);",
  "  c.rgb += vec3(0.55, 0.70, 1.0) * 0.32 * lip * c.a;",
  // where the flap is squeezed toward the side, the fabric bunches: soft shade
  "  c.rgb *= 1.0 - 0.2 * vCrease * vCrease;",
  // the intro's light sweep: a soft diagonal band
  "  float d = (vUv.x * 0.55 + vUv.y * 0.45) - sheen.x;",
  "  c.rgb += vec3(1.0) * sheen.y * exp(-d * d * 90.0) * c.a * 0.55;",
  "  gl_FragColor = c;",
  "}"
].join("\n");
var VS2 = [
  "attribute vec2 uv;",
  // u across the opening (-1..1), v from the layer's top (0) to the slider (1)
  WARP,
  "varying vec2 vP; varying vec2 vI;",
  "void main(){",
  "  float y = open.x * uv.y;",
  "  vec2 p = relax(vec2(seamX(y) + uv.x * gapAt(y), y));",
  "  vP = p; vI = vec2(uv.x, clamp((y - zip.x) / max(open.x - zip.x, 1.0), 0.0, 1.0));",
  "  gl_Position = clip(p);",
  "}"
].join("\n");
var FS2 = [
  "precision mediump float;",
  "uniform sampler2D card0; uniform sampler2D card1; uniform sampler2D card2;",
  "uniform vec4 box0; uniform vec4 box1; uniform vec4 box2;",
  // each file: x, y (top left), w, h, after the slump (px)
  "uniform float cardA; uniform float glow; uniform float backEdge;",
  "varying vec2 vP; varying vec2 vI;",
  // a file standing inside: tinted by the light in there, darker the deeper it is, shaded next to the cut edges
  "vec4 file(vec4 o, sampler2D t, vec4 b, float shade){",
  "  vec2 q = (vP - b.xy) / b.zw;",
  "  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);",
  "  vec4 c = texture2D(t, clamp(q, 0.0, 1.0)) * inside * cardA;",
  "  c.rgb *= mix(vec3(1.0), vec3(0.64, 0.80, 1.0), 0.55) * shade;",
  "  return c + o * (1.0 - c.a);",
  "}",
  "void main(){",
  "  float u = vI.x, v = vI.y;",
  // the back wall: lit cobalt from within, paler high up where the light reaches the back panel, deeper toward the
  // slider; in shadow while the opening is still a slit
  "  vec3 hi = vec3(0.40, 0.61, 0.98), lo = vec3(0.09, 0.42, 0.99), dark = vec3(0.03, 0.10, 0.36);",
  "  vec3 col = mix(dark, mix(hi, lo, smoothstep(0.0, 1.0, v)), glow);",
  "  float edge = smoothstep(0.55, 1.0, abs(u));",
  "  float shade = (1.0 - 0.32 * edge) * mix(1.0, 0.78, smoothstep(0.35, 1.0, v));",
  "  col *= 1.0 - 0.32 * edge;",
  // the back panel's top edge: a pale lit rim, open air above it
  "  float above = smoothstep(backEdge + 3.0, backEdge - 3.0, vP.y);",
  "  float rim = smoothstep(backEdge - 2.0, backEdge + 3.0, vP.y) * smoothstep(backEdge + 18.0, backEdge + 5.0, vP.y);",
  "  col = mix(col, vec3(0.82, 0.90, 1.0), rim * 0.55 * glow);",
  "  vec4 o = vec4(col, 1.0) * (1.0 - above);",
  "  o = file(o, card0, box0, shade); o = file(o, card1, box1, shade); o = file(o, card2, box2, shade);",
  "  gl_FragColor = o;",
  "}"
].join("\n");
function compile(gl2, type, src) {
  var s = gl2.createShader(type);
  gl2.shaderSource(s, src);
  gl2.compileShader(s);
  if (!gl2.getShaderParameter(s, gl2.COMPILE_STATUS)) throw new Error(gl2.getShaderInfoLog(s));
  return s;
}
function program(gl2, vs, fs) {
  var p = gl2.createProgram();
  gl2.attachShader(p, compile(gl2, gl2.VERTEX_SHADER, vs));
  gl2.attachShader(p, compile(gl2, gl2.FRAGMENT_SHADER, fs));
  gl2.linkProgram(p);
  if (!gl2.getProgramParameter(p, gl2.LINK_STATUS)) throw new Error(gl2.getProgramInfoLog(p));
  return p;
}
function smooth(a, b, x) {
  var t2 = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t2 * t2 * (3 - 2 * t2);
}
function seamAt(S, y) {
  var a = y < S[1][1] ? S[0] : S[1], b = y < S[1][1] ? S[1] : S[2], k2 = Math.min(1, Math.max(0, (y - a[1]) / (b[1] - a[1])));
  return a[0] + (b[0] - a[0]) * k2;
}
function PouchGL(canvas2, layer, A) {
  this.canvas = canvas2;
  this.L = layer;
  this.A = A;
  this.state = { q: 0, s: 0, sheen: -1, sheenA: 0 };
  this.dirty = true;
  this.ok = false;
  this.cards = [];
  var opts = { premultipliedAlpha: true, alpha: true, antialias: true };
  var gl2 = canvas2.getContext("webgl2", opts) || canvas2.getContext("webgl", opts);
  if (!gl2) return;
  this.gl = gl2;
  this.gl2 = typeof WebGL2RenderingContext !== "undefined" && gl2 instanceof WebGL2RenderingContext;
  try {
    this.front = program(gl2, VS$1, FS);
    this.inside = program(gl2, VS2, FS2);
  } catch (e) {
    console.warn("pouch:", e.message);
    return;
  }
  var NX = 28, NY = 72, verts = [], idx = [];
  var self = this;
  function seamU(v) {
    return seamAt(A.seam, v * layer.h) / layer.w;
  }
  [-1, 1].forEach(function(side) {
    var base = verts.length / 2;
    for (var j2 = 0; j2 <= NY; j2++) {
      var v = j2 / NY, su = seamU(v);
      for (var i2 = 0; i2 <= NX; i2++) {
        var f = i2 / NX;
        var g = 1 - Math.pow(1 - f, 1.8);
        var u = side < 0 ? g * su : 1 - g * (1 - su);
        verts.push(side < 0 ? -Math.max(u, 1e-5) : u, v);
      }
    }
    for (j2 = 0; j2 < NY; j2++) for (i2 = 0; i2 < NX; i2++) {
      var a = base + j2 * (NX + 1) + i2, b = a + 1, c = a + NX + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  });
  this.n = idx.length;
  this.vb = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vb);
  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(verts), gl2.STATIC_DRAW);
  this.ib = gl2.createBuffer();
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.ib);
  this.ext = this.gl2 || gl2.getExtension("OES_element_index_uint");
  gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, this.n > 65535 ? new Uint32Array(idx) : new Uint16Array(idx), gl2.STATIC_DRAW);
  this.idxType = this.n > 65535 ? gl2.UNSIGNED_INT : gl2.UNSIGNED_SHORT;
  var IU = 10, IV = 64, iv = [], ii = [], i, j;
  for (j = 0; j <= IV; j++) for (i = 0; i <= IU; i++) iv.push((i / IU * 2 - 1) * 1.02, j / IV);
  for (j = 0; j < IV; j++) for (i = 0; i < IU; i++) {
    var q0 = j * (IU + 1) + i;
    ii.push(q0, q0 + IU + 1, q0 + 1, q0 + 1, q0 + IU + 1, q0 + IU + 2);
  }
  this.ni = ii.length;
  this.ivb = gl2.createBuffer();
  gl2.bindBuffer(gl2.ARRAY_BUFFER, this.ivb);
  gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array(iv), gl2.STATIC_DRAW);
  this.iib = gl2.createBuffer();
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.iib);
  gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, new Uint16Array(ii), gl2.STATIC_DRAW);
  this.tex = gl2.createTexture();
  this.ok = true;
  canvas2.addEventListener("webglcontextlost", function(e) {
    e.preventDefault();
    self.ok = false;
  });
}
function upload(gl2, gl22, tex, img) {
  gl2.bindTexture(gl2.TEXTURE_2D, tex);
  gl2.pixelStorei(gl2.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.RGBA, gl2.UNSIGNED_BYTE, img);
  if (gl22) gl2.generateMipmap(gl2.TEXTURE_2D);
  gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl22 ? gl2.LINEAR_MIPMAP_LINEAR : gl2.LINEAR);
  var an = gl2.getExtension("EXT_texture_filter_anisotropic");
  if (an) gl2.texParameterf(gl2.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, gl2.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
  gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.LINEAR);
  gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
  gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
}
PouchGL.prototype.setImage = function(img) {
  var gl2 = this.gl;
  if (!gl2) return;
  upload(gl2, this.gl2, this.tex, img);
  this.hasImage = true;
  var st = this.state, keep = [st.q, st.s];
  this.set(0.4, -1, 0, 0);
  this.draw();
  this.set(1, -1, 0, 0.6);
  this.draw();
  this.set(keep[0], -1, 0, keep[1]);
  this.dirty = true;
  this.draw();
};
PouchGL.prototype.setCards = function(imgs) {
  var gl2 = this.gl, self = this;
  if (!gl2) return;
  this.cards = imgs.map(function(img) {
    var t2 = gl2.createTexture();
    upload(gl2, self.gl2, t2, img);
    return t2;
  });
  var st = this.state, keep = [st.q, st.sheen, st.sheenA, st.s];
  this.set(1, -1, 0, 0);
  this.dirty = true;
  this.draw();
  this.set(keep[0], keep[1], keep[2], keep[3]);
  this.dirty = true;
  this.draw();
};
PouchGL.prototype.resize = function(cssW, cssH, dpr2) {
  var w = Math.max(2, Math.round(cssW * dpr2)), h = Math.max(2, Math.round(cssH * dpr2));
  if (this.canvas.width !== w || this.canvas.height !== h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.dirty = true;
  }
};
PouchGL.prototype.set = function(q, sheenPos, sheenA, s) {
  var st = this.state;
  s = s || 0;
  if (Math.abs(q - st.q) > 1e-4 || Math.abs(s - st.s) > 1e-4 || sheenPos !== st.sheen || sheenA !== st.sheenA) {
    st.q = q;
    st.s = s;
    st.sheen = sheenPos;
    st.sheenA = sheenA;
    this.dirty = true;
  }
};
PouchGL.prototype.geometry = function(q, s) {
  var A = this.A, L = this.L, ys = A.zipTop + (A.zipEnd - A.zipTop) * q;
  var gq = Math.min(L.w * 0.2, (ys - A.zipTop) * 0.36) * Math.min(1, q * 6);
  var flap = Math.min(A.seam[0][0], L.w - A.seam[0][0]);
  return { ys, gap: gq + (flap * 0.985 - gq) * smooth(0, 1, s) };
};
PouchGL.prototype.draw = function() {
  if (!this.ok || !this.hasImage || !this.dirty) return;
  this.dirty = false;
  var gl2 = this.gl, L = this.L, A = this.A, st = this.state, SL2 = A.slump;
  var g = this.geometry(st.q, st.s), s = st.s;
  gl2.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl2.clearColor(0, 0, 0, 0);
  gl2.clear(gl2.COLOR_BUFFER_BIT);
  gl2.enable(gl2.BLEND);
  gl2.blendFunc(gl2.ONE, gl2.ONE_MINUS_SRC_ALPHA);
  var S = A.seam, sa = [S[0][0], S[0][1], S[1][0], S[1][1]], sb = [S[2][0], S[2][1]];
  function common(p3) {
    var u3 = function(n) {
      return gl2.getUniformLocation(p3, n);
    };
    gl2.uniform2f(u3("size"), L.w, L.h);
    gl2.uniform2f(u3("frm"), A.margin, L.w + 2 * A.margin);
    gl2.uniform4fv(u3("sa"), sa);
    gl2.uniform2fv(u3("sb"), sb);
    gl2.uniform2f(u3("zip"), A.zipTop, A.zipEnd);
    gl2.uniform2f(u3("open"), g.ys, g.gap);
    gl2.uniform1f(u3("slump"), s);
    gl2.uniform3f(u3("sl"), SL2.cx, SL2.half, SL2.sink);
    gl2.uniform1fv(u3("prof"), SL2.prof);
    gl2.uniform2fv(u3("profY"), SL2.profY);
    return u3;
  }
  if (g.gap > 0.5) {
    var p2 = this.inside;
    gl2.useProgram(p2);
    var u2 = common(p2);
    gl2.uniform1f(u2("glow"), smooth(0, 0.7, st.q));
    gl2.uniform1f(u2("backEdge"), A.zipTop - 4 + (SL2.backEdge - A.zipTop + 4) * s);
    var rise = smooth(0.4, 1, st.q), cardA = this.cards.length === 3 ? 1 - smooth(0.55, 0.9, s) : 0;
    gl2.uniform1f(u2("cardA"), cardA);
    for (var c = 0; c < 3; c++) {
      var cd = A.cards[c], top = cd.low + (cd.high - cd.low) * rise - cd.lift * s;
      gl2.uniform4f(u2("box" + c), SL2.cx + cd.dx * (1 + 0.08 * s) - cd.w / 2, top, cd.w, cd.h);
      gl2.activeTexture(gl2.TEXTURE1 + c);
      gl2.bindTexture(gl2.TEXTURE_2D, this.cards[c] || this.tex);
      gl2.uniform1i(u2("card" + c), 1 + c);
    }
    gl2.bindBuffer(gl2.ARRAY_BUFFER, this.ivb);
    var a2 = gl2.getAttribLocation(p2, "uv");
    gl2.enableVertexAttribArray(a2);
    gl2.vertexAttribPointer(a2, 2, gl2.FLOAT, false, 0, 0);
    gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.iib);
    gl2.drawElements(gl2.TRIANGLES, this.ni, gl2.UNSIGNED_SHORT, 0);
  }
  var p = this.front;
  gl2.useProgram(p);
  var u = common(p);
  gl2.activeTexture(gl2.TEXTURE0);
  gl2.bindTexture(gl2.TEXTURE_2D, this.tex);
  gl2.uniform1i(u("tex"), 0);
  gl2.uniform1f(u("gap"), Math.max(g.gap, 1));
  gl2.uniform2f(u("sheen"), st.sheen, st.sheenA);
  gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vb);
  var a = gl2.getAttribLocation(p, "uv");
  gl2.enableVertexAttribArray(a);
  gl2.vertexAttribPointer(a, 2, gl2.FLOAT, false, 0, 0);
  gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.ib);
  gl2.drawElements(gl2.TRIANGLES, this.n, this.idxType, 0);
};
PouchGL.prototype.slider = function(q, s) {
  var A = this.A, SL2 = A.slump, y = A.zipTop + (A.zipEnd - A.zipTop) * q, x = seamAt(A.seam, y);
  if (s) {
    var f = Math.min(1, Math.max(0, (y - SL2.profY[0]) / (SL2.profY[1] - SL2.profY[0]))) * 16, i = Math.min(15, Math.floor(f));
    var half = SL2.prof[i] + (SL2.prof[i + 1] - SL2.prof[i]) * (f - i);
    x = SL2.cx + (x - SL2.cx) * (1 + (half / SL2.half - 1) * s);
  }
  return { x, y };
};
var SITE = {
  url: "previewly.cc/northvale",
  // the link, as the bar shows it; Copy link copies it with https://
  zip: "northvale.zip",
  // what the pouch uploads
  // the six file tiles, left to right on plate 02. The cobalt tile carries the entry page
  files: ["statement.pdf", "styles.css", "app.js", "index.html", "dashboard.html", "assets/"],
  entry: "index.html",
  fileCount: 38,
  // files checked in chapter 2
  versions: { 1: "12 Oct", 2: "19 Oct" },
  // the version panes and the switcher in chapter 5
  latest: "updated just now",
  // how the bar describes v3
  passcode: "2026"
  // the keypad's demo code in chapter 4
};
var cam = document.getElementById("camera");
cam.style.transformOrigin = "0 0 0";
var EX = 550, EY = 302.4, EZ = 1800, DEG = Math.PI / 180;
function square(i, o) {
  var s = STATION[i], p = { fx: EX + s[0], fy: EY + s[1], fz: s[2], d: EZ, yaw: 0, pitch: 0, roll: 0 };
  for (var k2 in o || {}) p[k2] += o[k2];
  return p;
}
var DRIFT = reduced ? 0 : 1;
function hold(i, side) {
  return square(i, { yaw: 3 * side * DRIFT, d: 45 * side * DRIFT });
}
var K = reduced ? 0 : 1;
var burst$1 = square(0, { d: 600 * K, pitch: 10 * K, yaw: -8 * K, roll: -1 * K, fy: -60 * K });
var SEG = [
  [0, Z1, square(0), square(0), "sine"],
  // still: the zipper is in hand
  [Z1, T[0][1], square(0), burst$1, "sine"],
  // the burst: back, up, round
  [T[0][1], 240, burst$1, hold(1, 1), "sine"],
  // settling in front of the bag
  [240, T[1][0], hold(1, 1), hold(1, -1), "sine"],
  // 2 → 3: follows the files as they fly to the next set: far back and high over the studio, orbiting left
  [T[1][0], T[1][1], hold(1, -1), hold(2, 1), "travel", { d: 2200, pitch: 20, yaw: -30, roll: -3, fy: -230 }],
  [T[1][1], T[2][0], hold(2, 1), hold(2, -1), "sine"],
  // 3 → 4: carries the landing page along, orbiting right round it as it pulls away and dives back in
  [T[2][0], T[2][1], hold(2, -1), hold(3, 1), "travel", { d: 1900, pitch: 14, yaw: 32, roll: 3, fy: -190 }],
  [T[2][1], T[3][0], hold(3, 1), hold(3, -1), "sine"],
  // 4 → 5: back out and round the other way, rising, into the versions' line-up
  [T[3][0], T[3][1], hold(3, -1), hold(4, 1), "travel", { d: 2e3, pitch: 18, yaw: -28, roll: -2.5, fy: -210 }],
  // chapter 5 holds through the update: in closer while the beam runs, back out after
  [T[3][1], 752, hold(4, 1), square(4, { d: -120 * K, pitch: -1 * K }), "sine"],
  [752, T[4][0], square(4, { d: -120 * K, pitch: -1 * K }), hold(4, -1), "sine"],
  // 5 → 6: the biggest: up and far back over the whole studio, orbiting right, then down onto the devices
  [T[4][0], T[4][1], hold(4, -1), hold(5, 1), "travel", { d: 2400, pitch: 24, yaw: 20, roll: 2.5, fy: -270 }],
  [T[4][1], END, hold(5, 1), hold(5, -1), "sine"]
];
var CH = ["fx", "fy", "fz", "d", "yaw", "pitch", "roll"];
function poseAt(p) {
  var i = 0;
  while (i < SEG.length - 1 && p > SEG[i][1]) i++;
  var g = SEG[i], u = Math.min(1, Math.max(0, (p - g[0]) / (g[1] - g[0] || 1)));
  var e = g[4] === "travel" ? travel(u) : 0.5 - 0.5 * Math.cos(Math.PI * u);
  var zoom = travel(Math.min(u, 1 - u) / 0.45), orbit = Math.sin(Math.PI * u);
  orbit *= orbit;
  var out = {}, x = g[5] || {};
  CH.forEach(function(k2) {
    out[k2] = g[2][k2] + (g[3][k2] - g[2][k2]) * e + (x[k2] || 0) * (k2 === "yaw" || k2 === "roll" ? orbit : zoom) * K;
  });
  return out;
}
function matrix(P2) {
  var cy = Math.cos(P2.yaw * DEG), sy = Math.sin(P2.yaw * DEG), cp = Math.cos(P2.pitch * DEG), sp = Math.sin(P2.pitch * DEG);
  var ex = P2.fx + P2.d * sy * cp, ey = P2.fy - P2.d * sp, ez = P2.fz + P2.d * cy * cp;
  var zx = ex - P2.fx, zy = ey - P2.fy, zz = ez - P2.fz, zl = Math.hypot(zx, zy, zz);
  zx /= zl;
  zy /= zl;
  zz /= zl;
  var xx = zz, xz = -zx, xl = Math.hypot(xx, xz);
  xx /= xl;
  xz /= xl;
  var yx = zy * xz, yy = zz * xx - zx * xz, yz = -zy * xx;
  var cr = Math.cos(P2.roll * DEG), sr = Math.sin(P2.roll * DEG);
  var Xx = xx * cr + yx * sr, Xy = yy * sr, Xz = xz * cr + yz * sr;
  var Yx = yx * cr - xx * sr, Yy = yy * cr, Yz = yz * cr - xz * sr;
  var tx = EX - (Xx * ex + Xy * ey + Xz * ez), ty = EY - (Yx * ex + Yy * ey + Yz * ez), tz = EZ - (zx * ex + zy * ey + zz * ez);
  return [Xx, Yx, zx, 0, Xy, Yy, zy, 0, Xz, Yz, zz, 0, tx, ty, tz, 1];
}
var M$1 = matrix(square(0)), str = "", lastP$1 = NaN;
var camState = { version: 0, p: 0 };
function applyCamera(p) {
  if (p === lastP$1) return;
  lastP$1 = p;
  camState.p = p;
  M$1 = matrix(poseAt(p));
  var s = "matrix3d(" + M$1.map(function(v, i) {
    return i === 12 || i === 13 || i === 14 ? v.toFixed(2) : +v.toFixed(7);
  }).join(",") + ")";
  if (s !== str) {
    str = s;
    cam.style.transform = s;
    camState.version++;
  }
}
function project(x, y, z) {
  var vx = M$1[0] * x + M$1[4] * y + M$1[8] * z + M$1[12], vy = M$1[1] * x + M$1[5] * y + M$1[9] * z + M$1[13], vz = M$1[2] * x + M$1[6] * y + M$1[10] * z + M$1[14];
  var k2 = EZ / Math.max(1, EZ - vz);
  return { x: fit.x + (EX + (vx - EX) * k2) * fit.s, y: fit.y + (EY + (vy - EY) * k2) * fit.s, s: k2 * fit.s, k: k2 };
}
const LOGO = '<svg viewBox="0 0 26.1 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M26.1 36H0V0H26.1V36ZM23.776 33.66H2.32397V2.34H23.776V33.66Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.9179 27.2677C15.184 24.8913 17.2975 21.4577 17.9573 18.0277C18.8904 13.2218 17.662 9.25698 17.5857 8.98503C17.5254 8.78692 17.4944 8.65545 17.5219 8.64104C17.591 8.60593 18.0691 9.46769 18.3901 10.1539C19.019 11.4794 19.701 13.6225 19.6629 16.0854C19.6105 19.1407 18.5445 22.179 16.5995 24.5239C15.9174 25.3352 15.1405 26.0556 14.2758 26.6607C13.7028 27.0515 12.729 27.5918 12.6953 27.536C12.6731 27.5072 12.784 27.4144 12.9179 27.2677"/><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8468 27.3419C14.3467 25.5734 15.6991 23.0667 16.029 20.6282C16.4933 17.2077 15.4674 14.4687 15.3989 14.2786C15.3489 14.1432 15.3234 14.0526 15.3471 14.041C15.3884 14.0132 15.7614 14.6006 16.022 15.0696C16.5152 15.9745 17.0796 17.4561 17.1533 19.1861C17.2428 21.343 16.6135 23.5241 15.3234 25.2514C14.8846 25.8532 14.3677 26.3949 13.778 26.8549C13.3883 27.1554 12.7248 27.5769 12.6959 27.5374C12.6748 27.5132 12.7555 27.4495 12.8468 27.3419Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M10.9996 21.3968C11.2805 13.6525 15.4143 6.79536 21.6308 2.34001H17.5006C12.4691 6.75508 9.08691 12.9579 8.94687 19.8508C8.83165 25.3213 9.87661 29.4696 12.742 33.66H13.795C11.5535 29.8035 10.8418 25.7582 10.9996 21.3968"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.6725 33.66C9.16136 30.9986 6.13241 25.9766 5.77469 20.5517C5.34096 13.9197 7.52392 7.45687 11.9489 2.34001H15.374C9.96175 7.71209 7.22165 14.8259 7.85033 21.8941C8.25098 26.411 10.0279 29.7485 12.7492 33.66H11.6725Z"/></svg>\n';
var CX$1 = 550, FLOOR$1 = 612;
var camera$1 = $("#camera"), ui = $("#ui");
function el$1(tag, cls) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  return e;
}
function cut$1(name) {
  var L = ART.layers[name], img = el$1("img", "cut");
  img.alt = "";
  img.decoding = "async";
  img.draggable = false;
  img.src = asset(L.file + ".avif");
  img.onerror = function() {
    if (!img.dataset.fb) {
      img.dataset.fb = 1;
      img.src = asset(L.file + ".webp");
    }
  };
  img.onload = function() {
    if (img.decode) img.decode().catch(function() {
    });
  };
  return img;
}
function box(e, x, y, w, h) {
  e.style.left = x + "px";
  e.style.top = y + "px";
  e.style.width = w + "px";
  e.style.height = h + "px";
  return e;
}
var PL = ART.layers.pouch, PA = ART.anchors.pouch, PP = ART.layers["pouch-pull"], PPA = ART.anchors["pouch-pull"];
var PS = 500 / PL.h, PX = CX$1 - PL.w * PS / 2, PY = FLOOR$1 - PL.h * PS;
var QS = 30 / PPA.tab.w;
var BL = ART.layers.bag, BA = ART.anchors.bag;
var BS = 430 / BL.w, BW = BL.w * BS, BH = BL.h * BS, BX = CX$1 - BW / 2, BY = FLOOR$1 - BH;
var M = Math.round(PL.w * 0.07);
var pouchRig = box(el$1("div", "obj rig pouchrig"), PX, PY, PL.w * PS, PL.h * PS);
var canvas = box(el$1("canvas", "pouchgl"), -M * PS, 0, (PL.w + 2 * M) * PS, PL.h * PS);
pouchRig.appendChild(canvas);
var still$1 = cut$1("pouch");
still$1.classList.add("pouchstill");
still$1.style.width = "100%";
still$1.style.height = "100%";
pouchRig.appendChild(still$1);
function makePull() {
  var w = el$1("div", "pullsprite");
  w.style.width = PP.w * QS + "px";
  w.style.height = PP.h * QS + "px";
  var im = cut$1("pouch-pull");
  im.style.width = "100%";
  im.style.height = "100%";
  w.appendChild(im);
  var lw = PPA.tab.w * QS * 0.56, lh = lw * 36 / 26.1, lg = el$1("span", "pulllogo");
  lg.innerHTML = LOGO;
  lg.style.width = lw + "px";
  lg.style.height = lh + "px";
  lg.style.left = PPA.tab.x * QS - lw / 2 + "px";
  lg.style.top = PPA.tab.y * QS - lh / 2 + "px";
  w.appendChild(lg);
  return w;
}
var pullImg = makePull();
pouchRig.appendChild(pullImg);
var pouchShadow = contact(pouchRig, PL.w * PS / 2, PL.w * PS * 0.95, PL.h * PS - 4, 86);
camera$1.appendChild(pouchRig);
var SEAT = [PPA.seat.x * QS, 0];
var toL = function(fy) {
  return (fy - PY) / PS;
};
var zipEnd = toL(BY + BA.apex.y * BS);
var cornerY = toL(BY + Math.min(BA.corners[0][1], BA.corners[1][1]) * BS);
var prof = BA.profile.map(function(r, i, a) {
  return (r[1] || a[i - 1][1]) * BS / PS;
});
var cardOf = function(name, dx, high, lift) {
  var T2 = ART.layers[name], w = 520;
  return { name, dx, w, h: w * T2.h / T2.w, low: zipEnd + 60, high, lift };
};
var span = zipEnd - PA.zipTop;
var gl = new PouchGL(canvas, { w: PL.w, h: PL.h }, {
  // the seam runs straight down the middle of the render
  seam: [[PA.seamTop, PA.zipTop], [(PA.seamTop + PA.seamBottom) / 2, (PA.zipTop + PA.zipBottom) / 2], [PA.seamBottom, PA.zipBottom]],
  zipTop: PA.zipTop,
  zipEnd,
  margin: M,
  slump: {
    cx: PL.w / 2,
    half: (PL.w - 12) / 2,
    sink: (zipEnd - cornerY) / span,
    prof,
    profY: [toL(BY + BA.profile[0][0] * BS), toL(BY + BA.profile[16][0] * BS)],
    backEdge: toL(BY + BA.backTop * BS)
  },
  // the files inside, back to front: two plain tiles behind, the cobalt one (index.html) in front
  cards: [cardOf("tile-1", -250, zipEnd - span * 0.6, 140), cardOf("tile-4", 240, zipEnd - span * 0.57, 160), cardOf("tile-3", -15, zipEnd - span * 0.5, 220)]
});
gl.ok;
var heroDone, heroLeft = 2;
var heroReady = new Promise(function(r) {
  heroDone = function() {
    if (--heroLeft === 0) r();
  };
});
if (gl.ok) {
  var src = new Image();
  src.decoding = "async";
  var up = function(b) {
    gl.setImage(b);
    still$1.style.visibility = "hidden";
    heroDone();
  };
  src.onload = function() {
    (window.createImageBitmap ? createImageBitmap(src) : Promise.resolve(src)).then(up).catch(function() {
      up(src);
    });
  };
  src.onerror = function() {
    if (!src.dataset.fb) {
      src.dataset.fb = 1;
      src.src = asset(PL.file + ".webp");
    }
  };
  src.src = asset(PL.file + ".avif");
  Promise.all(gl.A.cards.map(function(c) {
    return new Promise(function(res) {
      var im = new Image();
      im.decoding = "async";
      im.onload = function() {
        (window.createImageBitmap ? createImageBitmap(im) : Promise.resolve(im)).then(res).catch(function() {
          res(im);
        });
      };
      im.onerror = function() {
        if (!im.dataset.fb) {
          im.dataset.fb = 1;
          im.src = asset(ART.layers[c.name].file + ".webp");
        } else res(null);
      };
      im.src = asset(ART.layers[c.name].file + ".avif");
    });
  })).then(function(ims) {
    if (ims.every(Boolean)) gl.setCards(ims);
    heroDone();
  });
} else {
  canvas.style.display = "none";
  heroLeft = 1;
  heroDone();
}
var bagRig = box(el$1("div", "obj rig bagrig"), 0, 0, 1, 1);
var bagBase = el$1("div", "bagbase");
bagRig.appendChild(bagBase);
var bagShadow = contact(bagBase, CX$1, BW * 1.02, FLOOR$1 - 3, 90);
var bagBox = el$1("div", "bagbox");
bagBase.appendChild(bagBox);
var bagImg = box(cut$1("bag"), BX, BY, BW, BH);
bagBox.appendChild(bagImg);
var mouth = [BX + BA.mouth.x * BS, BY + BA.mouth.y * BS];
var landed = gl.slider(1, 1), bagPull = [PX + landed.x * PS - SEAT[0], PY + landed.y * PS];
var ARC = [[214, 352, 150], [342, 214, 150], [470, 318, 150], [604, 176, 158], [738, 216, 150], [868, 350, 150]];
var tiles = [];
for (var i = 0; i < 6; i++) {
  var name = "tile-" + i, L = ART.layers[name], A = ART.anchors[name];
  var s = ARC[i][2] / L.h, w = L.w * s, h = L.h * s;
  var ox = ARC[i][0] - A.center.x * s, oy = ARC[i][1] - A.center.y * s;
  var outer = box(el$1("div", "tile"), ox, oy, w, h), inner = el$1("div", "tilein");
  var im = cut$1(name);
  im.style.width = "100%";
  im.style.height = "100%";
  inner.appendChild(im);
  outer.appendChild(inner);
  bagRig.appendChild(outer);
  tiles.push({ i, outer, inner, file: SITE.files[i], cx: ARC[i][0], cy: ARC[i][1], w, h, cobalt: !!A.cobalt });
}
var bagTop = el$1("div", "bagtop");
bagRig.appendChild(bagTop);
var frontBox = el$1("div", "bagbox");
bagTop.appendChild(frontBox);
var bagFront = box(cut$1("bag-front"), BX, BY, BW, BH);
frontBox.appendChild(bagFront);
var bagPullEl = makePull();
bagPullEl.style.transform = "translate(" + bagPull[0] + "px," + bagPull[1] + "px)";
frontBox.appendChild(bagPullEl);
var pullMark = el$1("i", "anchor");
pullMark.style.left = bagPull[0] + SEAT[0] + "px";
pullMark.style.top = bagPull[1] + PP.h * QS * 0.5 + "px";
frontBox.appendChild(pullMark);
camera$1.appendChild(bagRig);
var chips = tiles.map(function(t2) {
  var c = el$1("div", "filechip" + (t2.file === SITE.entry ? " entry" : ""));
  c.setAttribute("aria-hidden", "true");
  c.innerHTML = "<i></i>" + t2.file + (t2.file === SITE.entry ? '<span class="tag">entry page</span>' : "");
  ui.appendChild(c);
  return c;
});
var counter = $("#counter"), counterText = $("#counterText");
var SL = { s: 0 };
var burst = gsapWithCSS.timeline({ paused: true });
(function() {
  burst.fromTo(SL, { s: 0 }, { s: 1.04, duration: 0.42, ease: "power2.in" }, 0);
  burst.to(SL, { s: 1, duration: 0.2, ease: "sine.out" }, 0.42);
  burst.fromTo(bagShadow, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" }, 0.25);
  burst.fromTo([bagBox, frontBox], { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power1.inOut" }, 0.36);
  burst.to([canvas, still$1, pullImg, pouchShadow], { opacity: 0, duration: 0.1, ease: "none" }, 0.56);
  tiles.forEach(function(t2, j) {
    var dx = mouth[0] - t2.cx + (j - 2.5) * 14, dy = mouth[1] - t2.cy + 70;
    var spin = (j % 2 ? 1 : -1) * (7 + j * 2);
    burst.fromTo(
      t2.inner,
      { x: dx, y: dy, z: -60, scale: 0.62, rotation: spin, opacity: 0 },
      { x: 0, y: 0, z: 0, scale: 1, rotation: 0, opacity: 1, duration: 1.35, ease: "expo.out" },
      0.48 + j * 0.05
    );
  });
  burst.to({}, { duration: 0.2 });
})();
var BURST_LEN = burst.duration();
gsapWithCSS.set([bagBox, frontBox], { transformOrigin: mouth[0] + "px " + FLOOR$1 + "px" });
var sheen = { pos: -1, a: 0 };
function setSheen(pos2, a) {
  sheen.pos = pos2;
  sheen.a = a;
}
var dpr$2 = Math.min(2, window.devicePixelRatio || 1);
onLayout(function() {
  dpr$2 = Math.min(2, window.devicePixelRatio || 1);
  gl.resize((PL.w + 2 * M) * PS * fit.s, PL.h * PS * fit.s, dpr$2);
  gl.dirty = true;
});
pullImg.style.transformOrigin = SEAT[0] + "px 0px";
function renderHero(q, k2, tug2) {
  if (burst.progress() !== k2) burst.progress(k2);
  var sl = SL.s;
  gl.set(clamp$2(q), sheen.pos, sheen.a, sl);
  gl.draw();
  var s = gl.slider(clamp$2(q), sl);
  pullImg.style.transform = "translate(" + (s.x * PS - SEAT[0]) + "px," + (s.y * PS - SEAT[1]) + "px)";
  pouchRig.style.translate = "0 " + tug2 + "px";
  bagRig.style.translate = "0 " + tug2 + "px";
}
var burstLength = BURST_LEN;
function pullScreen(q, k2) {
  var s = gl.slider(clamp$2(q));
  var a = project(PX + s.x * PS - SEAT[0] + PP.w * QS / 2, PY + s.y * PS - SEAT[1] + PP.h * QS / 2, 0);
  if (k2 > 0) {
    var m = pullMark.getBoundingClientRect(), sr = document.getElementById("stage").getBoundingClientRect();
    a.x += (m.left + 1 - sr.left - a.x) * k2;
    a.y += (m.top + 1 - sr.top - a.y) * k2;
  }
  return a;
}
function track$1() {
  var a = gl.slider(0), b = gl.slider(1);
  var p0 = project(PX + a.x * PS, PY + a.y * PS, 0), p1 = project(PX + b.x * PS, PY + b.y * PS, 0);
  var dx = p1.x - p0.x, dy = p1.y - p0.y, L = Math.hypot(dx, dy) || 1;
  return { x0: p0.x, y0: p0.y, ux: dx / L, uy: dy / L, L };
}
function pointerP(e, t2) {
  return ((e.clientX - t2.x0) * t2.ux + (e.clientY - t2.y0) * t2.uy) / t2.L;
}
var chipOn = [], chipOk = [], chipW = [], lastCount = -1, camV = -1, counterOn = -1, counterAt = -1;
function updateChips(k2, checkU, fade) {
  var moved = camState.version !== camV;
  camV = camState.version;
  tiles.forEach(function(t2, j) {
    var c = chips[j];
    var show2 = clamp$2((k2 - 0.62 - j * 0.04) / 0.18) * (1 - fade);
    if (chipOn[j] !== show2 || moved && show2 > 0) {
      if (chipOn[j] !== show2) c.style.opacity = show2;
      chipOn[j] = show2;
      var p2 = project(t2.cx, t2.cy + t2.h * 0.3, 0);
      var lo = (fit.vw <= 700 ? 30 : 12) + chipW[j] / 2, hi = fit.vw - 12 - chipW[j] / 2;
      p2.x = Math.max(lo, Math.min(hi, p2.x));
      c.style.transform = "translate(-50%,-50%) translate(" + p2.x + "px," + p2.y + "px) translateY(" + (1 - show2) * 8 + "px)";
    }
    var ok = checkU >= (j + 1) / (tiles.length + 1);
    if (chipOk[j] !== ok) {
      chipOk[j] = ok;
      c.classList.toggle("ok", ok);
    }
  });
  var n = Math.round(SITE.fileCount * checkU), vis2 = clamp$2((k2 - 0.7) / 0.2) * (1 - fade);
  if (n !== lastCount) {
    lastCount = n;
    counterText.textContent = n + " / " + SITE.fileCount + " files checked";
  }
  if (vis2 !== counterOn) {
    counterOn = vis2;
    counter.style.opacity = vis2;
  }
  if (vis2 > 0 && counterAt !== camState.version) {
    counterAt = camState.version;
    var p = project(CX$1, FLOOR$1 + 30, 0);
    counter.style.transform = "translate(-50%,-50%) translate(" + p.x + "px," + p.y + "px)";
  }
}
onLayout(function() {
  chipOn = [];
  camV = -1;
  counterAt = -1;
  chipW = chips.map(function(c) {
    return c.offsetWidth;
  });
});
function tileFrames() {
  var o = {};
  tiles.forEach(function(t2) {
    o[t2.file] = { x: t2.cx, y: t2.cy, w: t2.w, outer: t2.outer };
  });
  return o;
}
({ pouch: { w: PL.w * PS * 0.9 } });
var UPD = [714, 784];
var LAUNCH = [[904, 950], [916, 962], [928, 974]];
var camera = $("#camera");
function el(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}
function screen(html, w, h, mw, mh) {
  var s = el("div", "screen");
  s.style.width = w + "px";
  s.style.height = h + "px";
  var inner = el("div", "mkwrap", html);
  inner.style.transform = "scale(" + w / mw + "," + h / mh + ")";
  s.appendChild(inner);
  return s;
}
var PW = 636, PH = 411, SW = 600, SH = 375;
var RIM = 'url("' + asset("art/glass-rim.avif") + '")';
function pane(name, tagHtml) {
  var p = el("div", "obj pane " + name);
  p.style.width = PW + "px";
  p.style.height = PH + "px";
  var face = el("div", "face");
  var slot = el("div", "slot");
  face.appendChild(slot);
  face.appendChild(el("div", "sheen"));
  var rim = el("div", "rim");
  rim.style.borderImageSource = RIM;
  face.appendChild(rim);
  p.appendChild(face);
  p.appendChild(el("div", "edge r"));
  p.appendChild(el("div", "edge b"));
  if (tagHtml) p.appendChild(el("div", "ptag", tagHtml));
  contact(p, PW / 2, PW * 0.9, PH + 78, 70).classList.add("far");
  camera.appendChild(p);
  return { root: p, face, slot, tag: p.querySelector(".ptag") };
}
function addScreen(pn, html, mw, mh, cls) {
  var s = screen(html, SW, SH, mw || 1440, mh || 900);
  if (cls) s.classList.add(cls);
  pn.slot.appendChild(s);
  return s;
}
function cut(name, extra) {
  var L = ART.layers[name];
  var img = el("img", "cut ");
  img.alt = "";
  img.decoding = "async";
  img.draggable = false;
  img.src = asset(L.file + ".avif");
  img.onerror = function() {
    if (!img.dataset.fb) {
      img.dataset.fb = 1;
      img.src = asset(L.file + ".webp");
    }
  };
  img.onload = function() {
    if (img.decode) img.decode().catch(function() {
    });
  };
  return img;
}
var P = {};
P.pdf = pane("p-pdf", "<b>statement.pdf</b><span>PDF</span>");
addScreen(P.pdf, statement());
P.dash = pane("p-dash", "<b>dashboard.html</b><span>Dashboard</span>");
addScreen(P.dash, dashboard(1));
P.hero = pane("p-hero", "<b>index.html</b><span>Landing page</span>");
addScreen(P.hero, landing(), 1440, 900, "land");
var heroFrost = addScreen(P.hero, landing(), 1440, 900, "frost");
P.hero.slot.appendChild(el("div", "veil"));
var heroV2 = addScreen(P.hero, dashboard(2), 1440, 900, "v2");
var wipe = el("div", "wipe"), wipeIn = el("div", "wipein");
wipeIn.appendChild(screen(dashboard(3), SW, SH, 1440, 900));
wipe.appendChild(wipeIn);
P.hero.slot.appendChild(wipe);
var beam = el("div", "beam");
P.hero.slot.appendChild(beam);
var rings = el("div", "rings");
P.hero.slot.appendChild(rings);
var pickV = { 1: addScreen(P.hero, dashboard(1), 1440, 900, "pick"), 2: addScreen(P.hero, dashboard(2), 1440, 900, "pick") };
function drawRings() {
  var root = wipeIn.querySelector(".mk"), k2 = SW / 1440, boxes = [], mono = null;
  if (!root) return;
  function at2(e) {
    var x = 0, y = 0, n = e;
    while (n && n !== root && n !== wipeIn) {
      x += n.offsetLeft;
      y += n.offsetTop;
      n = n.offsetParent;
    }
    return { x, y, w: e.offsetWidth, h: e.offsetHeight };
  }
  root.querySelectorAll('[data-new="3"]').forEach(function(e) {
    var b = at2(e);
    if (e.classList.contains("nv-monogram")) {
      mono = mono ? { x: Math.min(mono.x, b.x), y: Math.min(mono.y, b.y), r: Math.max(mono.r, b.x + b.w), b: Math.max(mono.b, b.y + b.h) } : { x: b.x, y: b.y, r: b.x + b.w, b: b.y + b.h };
    } else boxes.push(b);
  });
  if (mono) boxes.push({ x: mono.x, y: mono.y, w: mono.r - mono.x, h: mono.b - mono.y });
  rings.innerHTML = "";
  boxes.forEach(function(b, i) {
    var r = el("div", "ring");
    var pad = 6;
    r.style.left = (b.x - pad) * k2 + "px";
    r.style.top = (b.y - pad) * k2 + "px";
    r.style.width = (b.w + 2 * pad) * k2 + "px";
    r.style.height = (b.h + 2 * pad) * k2 + "px";
    r.style.animationDelay = i * 0.25 + "s";
    r.appendChild(el("span", "", "New"));
    rings.appendChild(r);
  });
}
P.v1 = pane("p-v1", "<b>v1</b><span>12 Oct</span>");
addScreen(P.v1, dashboard(1));
P.v2 = pane("p-v2", "<b>v2</b><span>19 Oct</span>");
addScreen(P.v2, dashboard(2));
var padlock = el("div", "obj padlock");
(function() {
  var L = ART.layers.padlock, k2 = 176 / L.h;
  padlock.style.width = L.w * k2 + "px";
  padlock.style.height = L.h * k2 + "px";
  var im = cut("padlock");
  im.style.width = "100%";
  im.style.height = "100%";
  padlock.appendChild(im);
  contact(padlock, L.w * k2 / 2, L.w * k2 * 1.25, L.h * k2 - 3, 46);
  camera.appendChild(padlock);
})();
var K6 = 1, devs = {}, devWrap = el("div", "obj devices");
camera.appendChild(devWrap);
var DEV = [
  // k: the page is painted at k of its size, about what it measures on screen, so its layer stays small (a full-size
  // page under a perspective transform is rasterised at full size, a 330 ms first paint)
  // drawn back to front as on the plate (art.json stacks): the phone stands in front of the laptop
  // fit: the screen quad grown (or, for the phone, whose rounded corners its quad overshoots, shrunk) about its centre
  { name: "laptop", html: dashboard(3), mw: 1440, mh: 900, k: 0.36, fit: 1.004 },
  { name: "tablet", html: landingTablet(), mw: 820, mh: 1180, k: 0.5, fit: 1.004 },
  { name: "phone", html: dashboardPhone(), mw: 390, mh: 844, k: 0.45, fit: 0.988, notch: true }
];
(function() {
  var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  DEV.forEach(function(d) {
    var L = ART.layers[d.name];
    minX = Math.min(minX, L.x);
    maxX = Math.max(maxX, L.x + L.w);
    minY = Math.min(minY, L.y);
    maxY = Math.max(maxY, L.y + L.h);
  });
  K6 = 820 / (maxX - minX);
  var w = (maxX - minX) * K6, h = (maxY - minY) * K6;
  devWrap.style.width = w + "px";
  devWrap.style.height = h + "px";
  devWrap.dataset.w = w;
  devWrap.dataset.h = h;
  DEV.forEach(function(d) {
    var L = ART.layers[d.name], A = ART.anchors[d.name] || {};
    var box2 = el("div", "device " + d.name);
    box2.style.left = (L.x - minX) * K6 + "px";
    box2.style.top = (L.y - minY) * K6 + "px";
    box2.style.width = L.w * K6 + "px";
    box2.style.height = L.h * K6 + "px";
    var im = cut(d.name);
    im.style.width = "100%";
    im.style.height = "100%";
    box2.appendChild(im);
    contact(devWrap, (L.x - minX + L.w / 2) * K6, L.w * K6 * 0.95, h + 56, 44).classList.add("far");
    var q = A.screen && overscan(A.screen, d.fit);
    var at2 = A.attach && (Array.isArray(A.attach) ? A.attach : [A.attach.x, A.attach.y]);
    var sw = d.mw * d.k, sh = d.mh * d.k;
    var scr = el("div", "dscreen");
    scr.style.width = sw + "px";
    scr.style.height = sh + "px";
    var page = el("div", "dpage", d.html);
    scr.appendChild(page);
    page.style.width = d.mw + "px";
    page.style.height = d.mh + "px";
    page.style.transform = "scale(" + d.k + ")";
    scr.appendChild(el("div", "boot"));
    scr.appendChild(el("div", "flash"));
    if (d.notch) {
      var n = el("div", "notch");
      n.style.transform = "scale(" + d.k + ")";
      scr.appendChild(n);
    }
    if (q) scr.style.transform = matrix3d(sw, sh, q.map(function(pt) {
      return [pt[0] * K6, pt[1] * K6];
    }));
    box2.appendChild(scr);
    devWrap.appendChild(box2);
    var mark = el("i", "anchor");
    mark.style.left = (at2 ? at2[0] : L.w / 2) * K6 + "px";
    mark.style.top = (at2 ? at2[1] : 0) * K6 + "px";
    box2.appendChild(mark);
    devs[d.name] = { box: box2, screen: scr, page, mark, attach: at2 ? [(L.x - minX + at2[0]) * K6, (L.y - minY + at2[1]) * K6] : [L.w * K6 / 2 + (L.x - minX) * K6, (L.y - minY) * K6] };
  });
})();
function overscan(q, k2) {
  var cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
  return q.map(function(p) {
    return [cx + (p[0] - cx) * k2, cy + (p[1] - cy) * k2];
  });
}
function matrix3d(w, h, q) {
  var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
  var dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
  var den = dx1 * dy2 - dx2 * dy1, g = (sx * dy2 - dx2 * sy) / den, hh = (dx1 * sy - sx * dy1) / den;
  var a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  a /= w;
  d /= w;
  g /= w;
  b /= h;
  e /= h;
  hh /= h;
  return "matrix3d(" + [a, d, 0, g, b, e, 0, hh, 0, 0, 1, 0, c, f, 0, 1].map(function(v) {
    return +v.toFixed(9);
  }).join(",") + ")";
}
var CX = F.w / 2, FLOOR = 612;
var HOST = {
  pdf: at$1(2, { x: CX - 340, y: 330, z: -240, rotationY: 38, rotationX: 0 }),
  dash: at$1(2, { x: CX + 340, y: 330, z: -240, rotationY: -38, rotationX: 0 }),
  hero: at$1(2, { x: CX, y: 338, z: 0, rotationY: 0, rotationX: 0 })
};
var PROTECT = { hero: at$1(3, { x: CX, y: 324, z: 30, rotationY: 0, rotationX: 0 }) };
var UPDATE = {
  v1: at$1(4, { x: CX - 150, y: 300, z: -280, rotationY: -22, rotationX: 0 }),
  v2: at$1(4, { x: CX - 10, y: 312, z: -140, rotationY: -22, rotationX: 0 }),
  hero: at$1(4, { x: CX + 140, y: 326, z: 0, rotationY: -22, rotationX: 0 })
};
var TRAVEL = function(u) {
  return travel(u);
};
function initSets(tl, tiles2) {
  var all = [P.pdf, P.dash, P.hero, P.v1, P.v2];
  all.forEach(function(pn, i) {
    gsapWithCSS.set(pn.root, Object.assign({ xPercent: -50, yPercent: -50, opacity: 0 }, at$1(i < 3 ? 2 : 4, { x: CX, y: 330, z: -400 })));
  });
  gsapWithCSS.set([P.v1.root, P.v2.root], { opacity: INVISIBLE });
  var veil = P.hero.slot.querySelector(".veil");
  gsapWithCSS.set([heroFrost, heroV2, veil], { opacity: INVISIBLE });
  gsapWithCSS.set([pickV[1], pickV[2]], { autoAlpha: 0 });
  gsapWithCSS.set(rings, { opacity: 0 });
  gsapWithCSS.set(wipe, { xPercent: -100 });
  gsapWithCSS.set(wipeIn, { xPercent: 100 });
  gsapWithCSS.set(beam, { opacity: 0, x: 0 });
  gsapWithCSS.set(padlock, Object.assign({ xPercent: -50, yPercent: -100, opacity: INVISIBLE }, at$1(3, { x: CX + 250, y: FLOOR - 4, z: 70 })));
  var DS = fit.narrow ? 0.8 : 1;
  gsapWithCSS.set(devWrap, Object.assign({ xPercent: -50, yPercent: -50, opacity: INVISIBLE, scale: 0.92 * DS }, at$1(5, { x: CX, y: 460, z: 0 })));
  var a = T[1][0], b = T[1][1], d = b - a;
  [["pdf", "statement.pdf"], ["dash", "dashboard.html"], ["hero", "index.html"]].forEach(function(pair, i) {
    var pn = P[pair[0]], from = tiles2 && tiles2[pair[1]];
    var start2 = from ? { x: from.x, y: from.y, z: 40, rotationY: 0, rotationX: 0, rotationZ: from.rot || 0, scale: from.w / PW } : { x: CX, y: 330, z: -200, scale: 0.3 };
    tl.fromTo(pn.root, start2, Object.assign({ rotationZ: 0, scale: 1, ease: TRAVEL, duration: d * 0.84, immediateRender: false }, HOST[pair[0]]), a + d * (0.1 + i * 0.03));
    tl.fromTo(pn.root, { opacity: 0 }, { opacity: 1, duration: d * 0.12, ease: "none", immediateRender: false }, a + d * (0.1 + i * 0.03));
  });
  a = T[2][0];
  b = T[2][1];
  d = b - a;
  tl.to(P.pdf.root, { x: "-=220", z: "-=220", rotationY: 60, opacity: 0, duration: d * 0.45, ease: "power2.in" }, a);
  tl.to(P.dash.root, { x: "+=220", z: "-=220", rotationY: -60, opacity: 0, duration: d * 0.45, ease: "power2.in" }, a + d * 0.03);
  tl.to(P.hero.root, Object.assign({ duration: d, ease: TRAVEL }, PROTECT.hero), a);
  tl.to(P.hero.tag, { opacity: 0, duration: d * 0.2 }, a);
  tl.fromTo([heroFrost, veil], { opacity: INVISIBLE }, { opacity: 1, duration: d * 0.35, ease: "none", immediateRender: false }, a + d * 0.42);
  tl.fromTo(padlock, { y: FLOOR - 4 - 300, opacity: INVISIBLE, rotationZ: -8 }, { y: FLOOR - 4, opacity: 1, rotationZ: 0, duration: d * 0.34, ease: reduced ? "power2.out" : "bounce.out", immediateRender: false }, a + d * 0.62);
  a = T[3][0];
  b = T[3][1];
  d = b - a;
  tl.to(padlock, { z: STATION[3][2] - 280, x: "+=60", opacity: 0, duration: d * 0.34, ease: "power2.in" }, a + d * 0.22);
  tl.fromTo(heroV2, { opacity: INVISIBLE }, { opacity: 1, duration: d * 0.3, ease: "none", immediateRender: false }, a + d * 0.35);
  tl.fromTo([heroFrost, veil], { opacity: 1 }, { opacity: INVISIBLE, duration: d * 0.3, ease: "none", immediateRender: false }, a + d * 0.45);
  tl.to(P.hero.root, Object.assign({ duration: d, ease: TRAVEL }, UPDATE.hero), a);
  tl.to(P.hero.tag, { opacity: 1, duration: d * 0.2 }, a + d * 0.8);
  tl.fromTo(P.v1.root, at$1(4, { x: CX - 520, y: 300, z: -420, rotationY: -22, opacity: INVISIBLE }), Object.assign({ opacity: 1, duration: d * 0.5, ease: "power3.out", immediateRender: false }, UPDATE.v1), a + d * 0.5);
  a = UPD[0];
  b = UPD[1];
  d = b - a;
  tl.fromTo(beam, { opacity: 0 }, { opacity: 1, duration: d * 0.08, ease: "none", immediateRender: false }, a + d * 0.1);
  tl.fromTo(beam, { x: 0 }, { x: SW, duration: d * 0.7, ease: "power1.inOut", immediateRender: false }, a + d * 0.1);
  tl.fromTo(wipe, { xPercent: -100 }, { xPercent: 0, duration: d * 0.7, ease: "power1.inOut", immediateRender: false }, a + d * 0.1);
  tl.fromTo(wipeIn, { xPercent: 100 }, { xPercent: 0, duration: d * 0.7, ease: "power1.inOut", immediateRender: false }, a + d * 0.1);
  tl.to(beam, { opacity: 0, duration: d * 0.1, ease: "none" }, a + d * 0.8);
  drawRings();
  tl.fromTo(rings, { opacity: 0 }, { opacity: 1, duration: 8, ease: "none", immediateRender: false }, b + 2);
  tl.to(rings, { opacity: 0, duration: 8, ease: "none" }, T[4][0]);
  tl.fromTo(P.v2.root, Object.assign({ opacity: INVISIBLE }, UPDATE.hero), Object.assign({ opacity: 1, duration: d * 0.4, ease: "power3.out", immediateRender: false }, UPDATE.v2), a + d * 0.72);
  a = T[4][0];
  b = T[4][1];
  d = b - a;
  tl.to([P.v1.root, P.v2.root], { z: "-=320", x: "-=120", opacity: 0, duration: d * 0.45, ease: "power2.in", stagger: d * 0.05 }, a);
  tl.fromTo(devWrap, { y: 460, opacity: INVISIBLE, scale: 0.92 * DS }, { y: 360, opacity: 1, scale: DS, duration: d * 0.6, ease: "power3.out", immediateRender: false }, a + d * 0.25);
  tl.to(P.hero.root, at$1(5, { x: CX + 6, y: 352, z: -40, rotationY: 0, rotationX: 0, scale: 0.46, duration: d * 0.95, ease: TRAVEL }), a + d * 0.05);
  tl.to(P.hero.root, { opacity: 0, duration: d * 0.18, ease: "none" }, a + d * 0.7);
  ["laptop", "phone", "tablet"].forEach(function(name, i) {
    var dv = devs[name], lands = LAUNCH[i][1];
    tl.fromTo(dv.screen.querySelector(".flash"), { opacity: 0 }, { opacity: 0.85, duration: 3, ease: "none", immediateRender: false }, lands - 2);
    tl.to(dv.screen.querySelector(".flash"), { opacity: 0, duration: 9, ease: "power2.out" }, lands + 1);
    tl.fromTo(dv.screen.querySelector(".boot"), { opacity: 1 }, { opacity: 0, duration: 6, ease: "none", immediateRender: false }, lands + 1);
  });
}
var tagState = "", picked = 3;
function updateSets(p) {
  var t2 = p < T[3][0] ? "host" : p < UPD[1] ? "v2" : "v3";
  var key2 = t2 + picked;
  if (key2 === tagState) return;
  tagState = key2;
  P.hero.tag.innerHTML = t2 === "host" ? "<b>index.html</b><span>Landing page</span>" : t2 === "v2" ? "<b>v2</b><span>Live</span>" : picked === 3 ? "<b>v3</b><span>Live</span>" : "<b>v" + picked + "</b><span>" + (picked === 1 ? "12 Oct" : "19 Oct") + "</span>";
}
function pickVersion(v, instant) {
  picked = v;
  var d = instant || reduced ? 0 : 0.5;
  gsapWithCSS.to(pickV[1], { autoAlpha: v === 1 ? 1 : 0, duration: d, ease: "power2.out", overwrite: "auto" });
  gsapWithCSS.to(pickV[2], { autoAlpha: v === 2 ? 1 : 0, duration: d, ease: "power2.out", overwrite: "auto" });
  rings.style.visibility = v === 3 ? "" : "hidden";
  P.v1.root.classList.toggle("viewing", v === 1);
  P.v2.root.classList.toggle("viewing", v === 2);
}
var soundOn = false, actx = null, noise = null, lastTick = 0, toothCount = 0;
var soundBtn = $("#sound");
soundBtn.addEventListener("click", function() {
  soundOn = !soundOn;
  soundBtn.setAttribute("aria-pressed", String(soundOn));
  soundBtn.setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
  ensureAudio();
});
function ensureAudio() {
  if (!soundOn) return;
  if (!actx) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    noise = actx.createBuffer(1, Math.floor(actx.sampleRate * 0.03), actx.sampleRate);
    var ch = noise.getChannelData(0);
    for (var i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / ch.length, 3);
  }
  if (actx.state === "suspended") actx.resume();
}
function tick(intensity) {
  var now2 = performance.now();
  if (soundOn && actx && actx.state === "running" && now2 - lastTick > 14) {
    lastTick = now2;
    var t2 = actx.currentTime, src = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain();
    src.buffer = noise;
    bp.type = "bandpass";
    bp.frequency.value = 2800 + Math.random() * 1400;
    bp.Q.value = 5;
    g.gain.setValueAtTime(1e-4, t2);
    g.gain.exponentialRampToValueAtTime(0.05 + 0.12 * intensity, t2 + 2e-3);
    g.gain.exponentialRampToValueAtTime(1e-4, t2 + 0.03);
    src.connect(bp);
    bp.connect(g);
    g.connect(actx.destination);
    src.start(t2);
    src.stop(t2 + 0.035);
  }
  var activated = !navigator.userActivation || navigator.userActivation.hasBeenActive;
  toothCount++;
  if (navigator.vibrate && activated && toothCount % 3 === 0) {
    try {
      navigator.vibrate(4);
    } catch (e) {
    }
  }
}
document.addEventListener("pointerdown", ensureAudio, { once: true });
var demo = { unlocked: false, ver: 3, copied: false };
var VLABEL = { 1: "v1, " + SITE.versions[1], 2: "v2, " + SITE.versions[2], 3: "v3, " + SITE.latest };
var statusEl = $("#status");
function Spring(v) {
  this.x = v;
  this.v = 0;
  this.t = v;
}
Spring.prototype.step = function(dt, response, damping) {
  if (response <= 1e-3) {
    this.x = this.t;
    this.v = 0;
    return;
  }
  var w = 2 * Math.PI / response, k2 = w * w, c = 2 * damping * w, n = Math.max(1, Math.ceil(dt / 4e-3)), h = dt / n;
  for (var i = 0; i < n; i++) {
    this.v += (k2 * (this.t - this.x) - c * this.v) * h;
    this.x += this.v * h;
  }
};
Spring.prototype.settled = function(eps) {
  eps = eps || 1e-4;
  return Math.abs(this.t - this.x) < eps && Math.abs(this.v) < eps * 20;
};
var pull = new Spring(0), body = new Spring(0), tug = new Spring(0);
var tune = { lag: 0.17, detent: 0.55, flick: 0.9, breakPx: 17 }, TEETH = 74;
var CLOSE_S = 0.6;
var handle = $("#pull");
var mode = "scroll", dragging = false, grab = null, pKey = 0, momentumDamp = 1, opened = false, k = 0, lastSetScroll = -1;
function zipScrollY(p) {
  return yOf(Z0 + p * (Z1 - Z0));
}
function pFromScroll() {
  var p = pos();
  if (chapterAt(p) > 0) return 1;
  return clamp$2((p - Z0) / (Z1 - Z0));
}
function syncScroll(p) {
  var y = zipScrollY(p);
  if (Math.abs(y - window.scrollY) > 1) {
    lastSetScroll = y;
    scrollToY(y, false);
  }
}
addEventListener("scroll", function() {
  if (dragging) return;
  if (lastSetScroll < 0 || Math.abs(window.scrollY - lastSetScroll) > 2) {
    mode = "scroll";
    lastSetScroll = -1;
  }
}, { passive: true });
addEventListener("wheel", function() {
  if (!dragging) {
    mode = "scroll";
    lastSetScroll = -1;
  }
}, { passive: true });
handle.addEventListener("pointerdown", function(e) {
  if (e.button > 0) return;
  e.preventDefault();
  try {
    handle.setPointerCapture(e.pointerId);
  } catch (_) {
  }
  ensureAudio();
  var trk = track$1(), t2 = pointerP(e, trk);
  dragging = true;
  mode = "drag";
  grab = { trk, offset: t2 - pull.x, start: pull.x, raw: pull.x, locked: pull.x < 3e-3 && tune.breakPx > 0, catchUp: 0, hist: [] };
  pull.v = 0;
  pull.t = pull.x;
  document.body.classList.add("dragging");
});
handle.addEventListener("pointermove", function(e) {
  if (!dragging || !grab) return;
  grab.raw = pointerP(e, grab.trk) - grab.offset;
});
var release = function() {
  if (!dragging) return;
  dragging = false;
  document.body.classList.remove("dragging");
  ensureAudio();
  var v = 0, h = grab ? grab.hist : [];
  if (h.length > 1) {
    var a = h[0], b = h[h.length - 1], dt = (b.t - a.t) / 1e3;
    if (dt > 8e-3) v = (b.p - a.p) / dt;
  }
  v = clamp$2(v, -12, 12);
  var basePos = pull.x;
  if (grab && (!grab.locked || Math.abs(grab.raw - grab.start) * grab.trk.L >= tune.breakPx)) basePos = clamp$2(grab.raw);
  var rate = 0.985 + tune.flick * 0.012, end = clamp$2(basePos + v * (rate / (1 - rate)) / 1e3);
  if (end > 0.955) end = 1;
  else if (end < 0.03 && pull.x < 0.12) end = 0;
  mode = "momentum";
  pull.t = end;
  pull.v = v;
  momentumDamp = end === 1 || end === 0 ? 0.72 : 1;
  tug.t = 0;
  grab = null;
};
handle.addEventListener("pointerup", release);
handle.addEventListener("pointercancel", release);
handle.addEventListener("lostpointercapture", release);
handle.addEventListener("keydown", function(e) {
  var base = mode === "key" ? pKey : pull.x, n = null;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") n = base + 0.04;
  else if (e.key === "ArrowUp" || e.key === "ArrowLeft") n = base - 0.04;
  else if (e.key === "PageDown") n = base + 0.2;
  else if (e.key === "PageUp") n = base - 0.2;
  else if (e.key === "Home") n = 0;
  else if (e.key === "End") n = 1;
  if (n === null) return;
  e.preventDefault();
  pKey = clamp$2(n);
  mode = "key";
});
function scrollMode() {
  mode = "scroll";
  lastSetScroll = -1;
}
var lastTooth = 0, ariaVal = -1, live$1 = null;
function stepZipper(dt, now2, onHero) {
  if (mode === "drag" && grab) {
    var target = grab.raw, prev = pull.x;
    if (grab.locked) {
      var travel2 = Math.abs(target - grab.start) * grab.trk.L;
      if (travel2 >= tune.breakPx) {
        grab.locked = false;
        grab.catchUp = target - pull.x;
      } else {
        pull.x = clamp$2(grab.start + (target - grab.start) * 0.22);
        tug.t = -Math.sign(target - grab.start) * 0.06 * (travel2 / Math.max(1, tune.breakPx));
      }
    }
    if (!grab.locked) {
      grab.catchUp *= Math.exp(-dt / 0.05);
      var desired = target - grab.catchUp;
      pull.x = clamp$2(desired);
      var over = desired - pull.x, ow = Math.abs(over) * 2.7;
      tug.t = -Math.sign(over) * 0.2 * ow / (0.35 + ow);
    }
    pull.v = (pull.x - prev) / dt;
    pull.t = pull.x;
    grab.hist.push({ t: now2, p: pull.x });
    while (grab.hist.length > 2 && now2 - grab.hist[0].t > 90) grab.hist.shift();
    syncScroll(pull.x);
  } else if (mode === "momentum") {
    pull.step(dt, reduced ? 1e-3 : 0.32, momentumDamp);
    if (pull.x > 1) {
      pull.x = 1;
      pull.v = -Math.abs(pull.v) * 0.25;
    }
    if (pull.x < 0) {
      pull.x = 0;
      pull.v = Math.abs(pull.v) * 0.25;
    }
    syncScroll(pull.x);
    if (pull.settled(2e-4)) {
      pull.x = pull.t;
      pull.v = 0;
      mode = "idle";
    }
  } else if (mode === "key") {
    pull.t = pKey;
    pull.step(dt, reduced ? 1e-3 : 0.16, 1);
    syncScroll(pull.x);
    if (pull.settled(2e-4)) {
      pull.x = pull.t;
      mode = "idle";
    }
  } else if (mode === "scroll") {
    pull.t = pFromScroll();
    pull.step(dt, reduced ? 1e-3 : 0.12, 1);
  }
  pull.x = clamp$2(pull.x);
  var p = pull.x;
  var q = Math.round(pull.x * TEETH) / TEETH;
  body.t = clamp$2(pull.x + tune.detent * 0.9 * (q - pull.x));
  if (k > 0) body.t = 1;
  body.step(dt, reduced ? 1e-3 : tune.lag, 0.82);
  body.x = clamp$2(body.x, -0.01, 1.01);
  var tooth = Math.floor(clamp$2(body.x) * TEETH + 0.5);
  if (tooth !== lastTooth) {
    if (onHero) tick(Math.min(1, Math.abs(body.v) * 1.5));
    lastTooth = tooth;
  }
  if (!opened && body.x > 0.985 && pull.x > 0.95) {
    opened = true;
    statusEl.textContent = "Unzipped. Six files are out.";
  } else if (opened && pull.x < 0.93) {
    opened = false;
    statusEl.textContent = "Zipper closing.";
  }
  k = clamp$2(k + (opened ? dt / (reduced ? 0.3 : burstLength) : -dt / (reduced ? 0.2 : CLOSE_S)));
  tug.step(dt, 0.2, reduced ? 1 : 0.6);
  renderHero(body.x, k, -tug.x * 140);
  if (onHero !== live$1) {
    live$1 = onHero;
    handle.style.visibility = onHero ? "visible" : "hidden";
  }
  if (onHero) {
    var sp = pullScreen(dragging ? pull.x : body.x, dragging ? 0 : k);
    handle.style.transform = "translate(" + (sp.x - handle.offsetWidth / 2) + "px," + (sp.y - handle.offsetHeight / 2) + "px)";
  }
  var av = Math.round(pull.x * 100);
  if (av !== ariaVal) {
    ariaVal = av;
    handle.setAttribute("aria-valuenow", av);
    handle.setAttribute("aria-valuetext", av === 0 ? "Zipped closed" : av === 100 ? "Fully open" : av + "% open");
  }
  return { p, k };
}
var CHECK = [184, 208], TYPE = [208, 224];
var bar$1 = $("#bar"), barUrl = $("#barUrl"), barStatus = $("#barStatus"), prog = $("#barProg"), glint = prog.querySelector(".prog-glint"), barShackle = $("#barShackle"), key = "";
var URL_TXT = SITE.url, N = SITE.fileCount;
var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function chip(cls, html) {
  return '<span class="chip ' + cls + '">' + html + "</span>";
}
function set(st) {
  var k2 = JSON.stringify(st);
  if (k2 === key) return;
  key = k2;
  barUrl.className = "url" + (st.muted ? " muted" : "");
  barUrl.innerHTML = st.url + (st.caret ? '<span class="caret"></span>' : "");
  barStatus.innerHTML = st.status || "";
  bar$1.classList.toggle("locked", !!st.locked);
  barShackle.setAttribute("d", st.locked ? "M8 10.5V7.5a4 4 0 0 1 8 0v3" : "M8 10.5V7.5a4 4 0 0 1 7.6-1.8");
}
function invalidateBar() {
  key = "";
}
var now = { p: -1, c: -1, o: -1, r: null }, still = 1, phase = 0;
function line$1(fill2, check, shown2, busy, dt) {
  still = Math.abs(fill2 - now.p) > 1e-4 ? 0 : still + dt;
  if (fill2 !== now.p) {
    now.p = fill2;
    prog.style.setProperty("--p", fill2.toFixed(4));
  }
  if (check !== now.c) {
    now.c = check;
    prog.style.setProperty("--c", check.toFixed(4));
  }
  if (shown2 !== now.o) {
    now.o = shown2;
    prog.style.opacity = shown2.toFixed(3);
  }
  var running = busy && !reduced && still < 0.4;
  if (running !== now.r) {
    now.r = running;
    prog.classList.toggle("running", running);
  }
  if (running) {
    phase = (phase + dt / 1.4) % 1;
    glint.style.transform = "translateX(" + ((phase * 2 - 1) * 100).toFixed(2) + "%)";
  }
}
function updateBar(p, zp, c, dt) {
  var fill2 = 0, check = 0, shown2 = 0, running = false, st;
  if (c === 0) {
    if (zp < 0.015) st = { url: "previewly.cc/", muted: true, caret: true, status: chip("", "Waiting for a ZIP") };
    else {
      fill2 = zp;
      shown2 = 1;
      running = zp < 0.999;
      st = { url: zp < 0.999 ? "Uploading " + SITE.zip : SITE.zip + " uploaded", status: chip("blue", Math.round(zp * 100) + "%") };
    }
  } else if (c === 1) {
    var u = clamp$2((p - CHECK[0]) / (CHECK[1] - CHECK[0])), w = ease((p - TYPE[0]) / (TYPE[1] - TYPE[0]));
    fill2 = 1;
    check = u;
    shown2 = 1 - ease(clamp$2(w * 1.6));
    st = p < CHECK[1] ? { url: "Checking files", status: chip("blue", Math.round(N * u) + " / " + N) } : { url: URL_TXT.slice(0, Math.round(URL_TXT.length * w)), caret: w < 1, status: chip("ok", TICK + N + " / " + N + " checked") };
  } else if (c === 2) st = { url: URL_TXT, status: chip("ok", TICK + "Live") };
  else if (c === 3) st = { url: URL_TXT, locked: !demo.unlocked, status: demo.unlocked ? chip("ok", TICK + "Unlocked for you") : chip("blue", "Passcode on") };
  else if (c === 4) {
    var up = clamp$2((p - UPD[0]) / (UPD[1] - UPD[0]));
    var after = p - UPD[1];
    if (up > 0) {
      fill2 = up;
      check = clamp$2(after / 8);
      shown2 = 1 - clamp$2((after - 10) / 10);
      running = up < 1;
    }
    if (up > 0 && up < 1) st = { url: URL_TXT, locked: true, status: chip("blue", "Updating to v3") };
    else st = { url: URL_TXT, locked: true, status: chip("ok", TICK + "URL unchanged") + chip("", "<span>v" + demo.ver + '<span class="long">, ' + VLABEL[demo.ver].slice(4) + "</span></span>") };
  } else st = { url: URL_TXT, locked: true, status: '<button type="button" class="copybtn" data-copy>' + (demo.copied ? "Copied" : "Copy link") + "</button>" };
  set(st);
  line$1(fill2, check, shown2, running, dt || 1 / 60);
}
function streakColours() {
  return theme() === "dark" ? { a: "#2B6CF6", b: "#2FE4FF", glow: "#2FB8FF", core: "#F2FFFF", mode: "lighter", light: false } : { a: "#2B6CF6", b: "#00A6E6", glow: "#22B5F2", core: "#FFFFFF", mode: "source-over", light: true };
}
var RGB = {};
function rgba(hex, a) {
  var c = RGB[hex] || (RGB[hex] = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]);
  return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + clamp$2(a).toFixed(3) + ")";
}
function hash(n) {
  n = n << 13 ^ n;
  return 1 - (n * (n * n * 15731 + 789221) + 1376312589 & 2147483647) / 1073741824;
}
function Streak(colours) {
  this.c = colours;
  this.sparks = [];
  this.acc = 0;
}
function at(pts, t2) {
  var L = pts.total * clamp$2(t2), i = 1;
  while (i < pts.length - 1 && pts.len[i] < L) i++;
  var a = pts[i - 1], b = pts[i], seg = pts.len[i] - pts.len[i - 1] || 1, k2 = (L - pts.len[i - 1]) / seg;
  return { x: a.x + (b.x - a.x) * k2, y: a.y + (b.y - a.y) * k2, dx: (b.x - a.x) / seg, dy: (b.y - a.y) / seg };
}
Streak.prep = function(pts) {
  pts.len = [0];
  var s = 0;
  for (var i = 1; i < pts.length; i++) {
    s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    pts.len.push(s);
  }
  pts.total = s || 1;
  return pts;
};
function line(ctx2, pts, t0, t1) {
  if (t1 - t0 < 1e-4) return false;
  var a = at(pts, t0), b = at(pts, t1), L0 = pts.total * t0, L1 = pts.total * t1;
  ctx2.beginPath();
  ctx2.moveTo(a.x, a.y);
  for (var i = 1; i < pts.length; i++) if (pts.len[i] > L0 && pts.len[i] < L1) ctx2.lineTo(pts[i].x, pts[i].y);
  ctx2.lineTo(b.x, b.y);
  return true;
}
Streak.prototype.draw = function(ctx2, pts, t2, o) {
  var c = this.c, k2 = o.k == null ? 1 : o.k, W2 = o.width || 1.5, base = o.base == null ? 0.25 : o.base;
  ctx2.save();
  ctx2.lineCap = "round";
  ctx2.lineJoin = "round";
  if (o.guide && line(ctx2, pts, 0, 1)) {
    ctx2.strokeStyle = c.a;
    ctx2.globalAlpha = o.guide;
    ctx2.lineWidth = W2 * 0.7;
    ctx2.stroke();
  }
  ctx2.globalCompositeOperation = c.mode;
  var h = null;
  if (t2 > 0) {
    var tail = Math.min(t2, o.tail || 1), t0 = t2 - tail, s = at(pts, t0);
    h = at(pts, t2);
    if (t0 > 0 && line(ctx2, pts, 0, t0)) {
      ctx2.strokeStyle = c.a;
      ctx2.globalAlpha = base * 0.8 * k2;
      ctx2.lineWidth = W2;
      ctx2.stroke();
    }
    if (line(ctx2, pts, t0, t2)) {
      var ramp = function(c0, c1, a0, a1) {
        var g3 = ctx2.createLinearGradient(s.x, s.y, h.x, h.y);
        g3.addColorStop(0, rgba(c0, a0));
        g3.addColorStop(1, rgba(c1, a1));
        return g3;
      };
      ctx2.globalAlpha = k2;
      ctx2.strokeStyle = ramp(c.glow, c.glow, 0, c.light ? 0.14 : 0.2);
      ctx2.lineWidth = W2 * 7;
      ctx2.stroke();
      ctx2.strokeStyle = ramp(c.glow, c.glow, base * 0.15, c.light ? 0.3 : 0.42);
      ctx2.lineWidth = W2 * 3;
      ctx2.stroke();
      ctx2.strokeStyle = ramp(c.a, c.b, base, 1);
      ctx2.lineWidth = W2 * 1.3;
      ctx2.stroke();
      ctx2.strokeStyle = ramp(c.core, c.core, base * 0.5, c.light ? 0.95 : 1);
      ctx2.lineWidth = W2 * 0.5;
      ctx2.stroke();
    }
    var tc = Math.max(t0, t2 - 26 / pts.total);
    if (line(ctx2, pts, tc, t2)) {
      var hc = at(pts, tc), g2 = ctx2.createLinearGradient(hc.x, hc.y, h.x, h.y);
      g2.addColorStop(0, rgba(c.core, 0));
      g2.addColorStop(1, rgba(c.core, 1));
      ctx2.globalAlpha = k2;
      ctx2.strokeStyle = g2;
      ctx2.lineWidth = W2 * 1.1;
      ctx2.stroke();
    }
    var len = pts.total * tail, n = Math.min(90, Math.round(len / 100 * (o.dust || 30) * (c.light ? 0.3 : 0.55))), time = o.time || 0;
    ctx2.fillStyle = c.light ? c.b : c.core;
    for (var d = 0; d < n; d++) {
      var r1 = hash(d * 3 + 1), r2 = hash(d * 7 + 5), r3 = (hash(d * 11 + 9) + 1) / 2;
      var f = Math.pow((r1 + 1) / 2, 0.45), p = at(pts, t0 + tail * f), off = r2 * W2 * (1.2 + 1.4 * (1 - f));
      var tw = 0.5 + 0.5 * Math.sin(time * (1.6 + r3 * 2.4) + d * 1.7);
      ctx2.globalAlpha = (0.2 + 0.8 * tw) * f * f * k2 * (c.light ? 0.7 : 0.9);
      ctx2.beginPath();
      ctx2.arc(p.x - p.dy * off, p.y + p.dx * off, (0.35 + 0.5 * r3) * (0.75 + 0.5 * f), 0, Math.PI * 2);
      ctx2.fill();
    }
    var R2 = (o.head || 10) * k2 * (c.light ? 0.75 : 1);
    if (R2 > 0.5) {
      var g = ctx2.createRadialGradient(h.x, h.y, 0, h.x, h.y, R2);
      g.addColorStop(0, rgba(c.core, 1));
      g.addColorStop(0.18, rgba(c.core, 0.9));
      g.addColorStop(0.32, rgba(c.b, c.light ? 0.5 : 0.65));
      g.addColorStop(1, rgba(c.b, 0));
      ctx2.globalAlpha = k2;
      ctx2.fillStyle = g;
      ctx2.beginPath();
      ctx2.arc(h.x, h.y, R2, 0, Math.PI * 2);
      ctx2.fill();
    }
  }
  if (h && o.shed && o.dt) {
    this.acc += o.shed * o.dt * (c.light ? 0.4 : 1);
    while (this.acc >= 1 && this.sparks.length < 120) {
      this.acc -= 1;
      var s1 = Math.random(), s2 = Math.random() * 2 - 1;
      this.sparks.push({
        x: h.x,
        y: h.y,
        vx: -h.dx * (24 + 60 * s1) + h.dy * 22 * s2,
        vy: -h.dy * (24 + 60 * s1) - h.dx * 22 * s2,
        life: 0.3 + 0.5 * Math.random(),
        age: 0,
        size: 0.4 + Math.random() * 0.7
      });
    }
  }
  if (o.dt && this.sparks.length) {
    ctx2.fillStyle = c.light ? c.b : c.core;
    for (var i = this.sparks.length - 1; i >= 0; i--) {
      var sp = this.sparks[i];
      sp.age += o.dt;
      if (sp.age >= sp.life) {
        this.sparks.splice(i, 1);
        continue;
      }
      sp.x += sp.vx * o.dt;
      sp.y += sp.vy * o.dt;
      sp.vx *= 0.93;
      sp.vy *= 0.93;
      var q = 1 - sp.age / sp.life;
      ctx2.globalAlpha = q * q * k2;
      ctx2.beginPath();
      ctx2.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx2.fill();
    }
  }
  ctx2.restore();
  return this.sparks.length > 0;
};
Streak.prototype.at = at;
var rail = $("#rail"), fill = $("#railFill"), head = $("#railHead"), track = $(".rail .track"), btns = $$("#rail button");
var H$1 = 0, cur = -1, glow = 0, lastF = -1;
var fx = document.createElement("canvas");
fx.className = "railfx";
fx.setAttribute("aria-hidden", "true");
rail.insertBefore(fx, rail.firstChild);
var fctx = fx.getContext("2d"), streak = new Streak(streakColours()), dpr$1 = 1, path = null, live = true, t = 0, PAD = 18;
onTheme(function() {
  streak.c = streakColours();
  live = true;
});
function measureRail() {
  H$1 = track.clientHeight;
  lastF = -1;
  dpr$1 = Math.min(2, window.devicePixelRatio || 1);
  var w = PAD * 2, h = H$1 + PAD * 2;
  fx.style.left = track.offsetLeft + track.offsetWidth / 2 - PAD + "px";
  fx.style.top = track.offsetTop - PAD + "px";
  fx.style.width = w + "px";
  fx.style.height = h + "px";
  fx.width = Math.round(w * dpr$1);
  fx.height = Math.round(h * dpr$1);
  path = Streak.prep([{ x: PAD, y: PAD }, { x: PAD, y: PAD + H$1 }]);
  live = true;
}
function drawRail(f, moving, dt) {
  if (!path || !live && !moving) return;
  t += dt;
  fctx.setTransform(dpr$1, 0, 0, dpr$1, 0, 0);
  fctx.clearRect(0, 0, PAD * 2, H$1 + PAD * 2);
  live = streak.draw(fctx, path, Math.max(f, 1e-4), { width: 1.5, guide: 0, tail: 1, dust: 40, head: 7 + glow * 9, shed: glow * 90, time: t, dt, k: 0.8 + glow * 0.2 }) || glow > 0.01;
}
function updateRail(p, dt) {
  var f = railFrac(p);
  var speed = lastF < 0 ? 0 : Math.abs(f - lastF) / Math.max(dt, 1 / 240);
  glow += (clamp$2(speed * 9) - glow) * (speed * 9 > glow ? 0.35 : 0.06);
  var moving = lastF !== f || glow > 2e-3;
  drawRail(f, moving, dt);
  if (moving) {
    fill.style.transform = "scaleY(" + f + ")";
    head.style.transform = "translateY(" + f * H$1 + "px)";
    rail.style.setProperty("--glow", glow.toFixed(3));
    rail.style.setProperty("--tail", Math.min(72, f * H$1).toFixed(1) + "px");
    lastF = f;
  }
  var c = chapterAt(p);
  if (c !== cur) {
    cur = c;
    btns.forEach(function(b, i) {
      if (i === c) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
      b.classList.toggle("done", i < c);
    });
  }
  return c;
}
var goFns = [];
function onGo(fn) {
  goFns.push(fn);
}
function go(i) {
  goFns.forEach(function(fn) {
    fn(i);
  });
  scrollToY(yOf(R[i]), true);
}
btns.forEach(function(b) {
  b.addEventListener("click", function() {
    go(parseInt(b.dataset.go, 10));
  });
});
/*!
 * SplitText 3.15.0
 * https://gsap.com
 *
 * @license Copyright 2026, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license.
 * @author: Jack Doyle
 */
let gsap, _fonts, _splitProp = typeof Symbol === "function" ? Symbol() : "_split", _coreInitted, _initIfNecessary = () => _coreInitted || SplitText.register(window.gsap), _charSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter() : 0, _toArray = (r) => !r ? [] : typeof r === "string" ? _toArray(document.querySelectorAll(r)) : "length" in r ? Array.from(r).reduce((acc, cur2) => {
  typeof cur2 === "string" ? acc.push(..._toArray(cur2)) : acc.push(cur2);
  return acc;
}, []) : [r], _elements = (targets) => _toArray(targets).filter((e) => e && e.nodeType === 1), _emptyArray = [], _context = function() {
}, _defaultContext = { add: (f) => f() }, _spacesRegEx = /\s+/g, _emojiSafeRegEx = new RegExp("\\p{RI}\\p{RI}|\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?(\\u{200D}\\p{Emoji}(\\p{EMod}|\\u{FE0F}\\u{20E3}?|[\\u{E0020}-\\u{E007E}]+\\u{E007F})?)*|.", "gu"), _emptyBounds = { left: 0, top: 0, width: 0, height: 0 }, _findNextValidBounds = (allBounds, startIndex) => {
  while (++startIndex < allBounds.length && allBounds[startIndex] === _emptyBounds) {
  }
  return allBounds[startIndex] || _emptyBounds;
}, _revertOriginal = ({ element, html, ariaL, ariaH }) => {
  element.innerHTML = html;
  ariaL ? element.setAttribute("aria-label", ariaL) : element.removeAttribute("aria-label");
  ariaH ? element.setAttribute("aria-hidden", ariaH) : element.removeAttribute("aria-hidden");
}, _stretchToFitSpecialChars = (collection, specialCharsRegEx) => {
  if (specialCharsRegEx) {
    let charsFound = new Set(collection.join("").match(specialCharsRegEx) || _emptyArray), i = collection.length, slots, word, char, combined;
    if (charsFound.size) {
      while (--i > -1) {
        word = collection[i];
        for (char of charsFound) {
          if (char.startsWith(word) && char.length > word.length) {
            slots = 0;
            combined = word;
            while (char.startsWith(combined += collection[i + ++slots]) && combined.length < char.length) {
            }
            if (slots && combined.length === char.length) {
              collection[i] = char;
              collection.splice(i + 1, slots);
              break;
            }
          }
        }
      }
    }
  }
  return collection;
}, _disallowInline = (element) => window.getComputedStyle(element).display === "inline" && (element.style.display = "inline-block"), _insertNodeBefore = (newChild, parent, existingChild) => parent.insertBefore(typeof newChild === "string" ? document.createTextNode(newChild) : newChild, existingChild), _getWrapper = (type, config3, collection) => {
  let className = config3[type + "sClass"] || "", { tag = "div", aria = "auto", propIndex = false } = config3, display = type === "line" ? "block" : "inline-block", incrementClass = className.indexOf("++") > -1, wrapper = (text) => {
    let el2 = document.createElement(tag), i = collection.length + 1;
    className && (el2.className = className + (incrementClass ? " " + className + i : ""));
    propIndex && el2.style.setProperty("--" + type, i + "");
    aria !== "none" && el2.setAttribute("aria-hidden", "true");
    if (tag !== "span") {
      el2.style.position = "relative";
      el2.style.display = display;
    }
    el2.textContent = text;
    collection.push(el2);
    return el2;
  };
  incrementClass && (className = className.replace("++", ""));
  wrapper.collection = collection;
  return wrapper;
}, _getLineWrapper = (element, nodes, config3, collection) => {
  let lineWrapper = _getWrapper("line", config3, collection), textAlign = window.getComputedStyle(element).textAlign || "left";
  return (startIndex, endIndex) => {
    let newLine = lineWrapper("");
    newLine.style.textAlign = textAlign;
    element.insertBefore(newLine, nodes[startIndex]);
    for (; startIndex < endIndex; startIndex++) {
      newLine.appendChild(nodes[startIndex]);
    }
    newLine.normalize();
  };
}, _splitWordsAndCharsRecursively = (element, config3, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, isNested) => {
  var _a;
  let nodes = Array.from(element.childNodes), i = 0, { wordDelimiter, reduceWhiteSpace = true, prepareText } = config3, elementBounds = element.getBoundingClientRect(), lastBounds = elementBounds, isPreformatted = !reduceWhiteSpace && window.getComputedStyle(element).whiteSpace.substring(0, 3) === "pre", ignoredPreviousSibling = 0, wordsCollection = wordWrapper.collection, wordDelimIsNotSpace, wordDelimString, wordDelimSplitter, curNode, words, curWordEl, startsWithSpace, endsWithSpace, j, bounds, curWordChars, clonedNode, curSubNode, tempSubNode, curTextContent, wordText, lastWordText, k2;
  if (typeof wordDelimiter === "object") {
    wordDelimSplitter = wordDelimiter.delimiter || wordDelimiter;
    wordDelimString = wordDelimiter.replaceWith || "";
  } else {
    wordDelimString = wordDelimiter === "" ? "" : wordDelimiter || " ";
  }
  wordDelimIsNotSpace = wordDelimString !== " ";
  for (; i < nodes.length; i++) {
    curNode = nodes[i];
    if (curNode.nodeType === 3) {
      curTextContent = curNode.textContent || "";
      if (reduceWhiteSpace) {
        curTextContent = curTextContent.replace(_spacesRegEx, " ");
      } else if (isPreformatted) {
        curTextContent = curTextContent.replace(/\n/g, wordDelimString + "\n");
      }
      prepareText && (curTextContent = prepareText(curTextContent, element));
      curNode.textContent = curTextContent;
      words = wordDelimString || wordDelimSplitter ? curTextContent.split(wordDelimSplitter || wordDelimString) : curTextContent.match(charSplitRegEx) || _emptyArray;
      lastWordText = words[words.length - 1];
      endsWithSpace = wordDelimIsNotSpace ? lastWordText.slice(-1) === " " : !lastWordText;
      lastWordText || words.pop();
      lastBounds = elementBounds;
      startsWithSpace = wordDelimIsNotSpace ? words[0].charAt(0) === " " : !words[0];
      startsWithSpace && _insertNodeBefore(" ", element, curNode);
      words[0] || words.shift();
      _stretchToFitSpecialChars(words, specialCharsRegEx);
      deepSlice && isNested || (curNode.textContent = "");
      for (j = 1; j <= words.length; j++) {
        wordText = words[j - 1];
        if (!reduceWhiteSpace && isPreformatted && wordText.charAt(0) === "\n") {
          (_a = curNode.previousSibling) == null ? void 0 : _a.remove();
          _insertNodeBefore(document.createElement("br"), element, curNode);
          wordText = wordText.slice(1);
        }
        if (!reduceWhiteSpace && wordText === "") {
          _insertNodeBefore(wordDelimString, element, curNode);
        } else if (wordText === " ") {
          element.insertBefore(document.createTextNode(" "), curNode);
        } else {
          wordDelimIsNotSpace && wordText.charAt(0) === " " && _insertNodeBefore(" ", element, curNode);
          if (ignoredPreviousSibling && j === 1 && !startsWithSpace && wordsCollection.indexOf(ignoredPreviousSibling.parentNode) > -1) {
            curWordEl = wordsCollection[wordsCollection.length - 1];
            curWordEl.appendChild(document.createTextNode(charWrapper ? "" : wordText));
          } else {
            curWordEl = wordWrapper(charWrapper ? "" : wordText);
            _insertNodeBefore(curWordEl, element, curNode);
            ignoredPreviousSibling && j === 1 && !startsWithSpace && curWordEl.insertBefore(ignoredPreviousSibling, curWordEl.firstChild);
          }
          if (charWrapper) {
            curWordChars = _charSegmenter ? _stretchToFitSpecialChars([..._charSegmenter.segment(wordText)].map((s) => s.segment), specialCharsRegEx) : wordText.match(charSplitRegEx) || _emptyArray;
            for (k2 = 0; k2 < curWordChars.length; k2++) {
              curWordEl.appendChild(curWordChars[k2] === " " ? document.createTextNode(" ") : charWrapper(curWordChars[k2]));
            }
          }
          if (deepSlice && isNested) {
            curTextContent = curNode.textContent = curTextContent.substring(wordText.length + 1, curTextContent.length);
            bounds = curWordEl.getBoundingClientRect();
            if (bounds.top > lastBounds.top && bounds.left <= lastBounds.left) {
              clonedNode = element.cloneNode();
              curSubNode = element.childNodes[0];
              while (curSubNode && curSubNode !== curWordEl) {
                tempSubNode = curSubNode;
                curSubNode = curSubNode.nextSibling;
                clonedNode.appendChild(tempSubNode);
              }
              element.parentNode.insertBefore(clonedNode, element);
              prepForCharsOnly && _disallowInline(clonedNode);
            }
            lastBounds = bounds;
          }
          if (j < words.length || endsWithSpace) {
            _insertNodeBefore(j >= words.length ? " " : wordDelimIsNotSpace && wordText.slice(-1) === " " ? " " + wordDelimString : wordDelimString, element, curNode);
          }
        }
      }
      element.removeChild(curNode);
      ignoredPreviousSibling = 0;
    } else if (curNode.nodeType === 1) {
      if (ignore && ignore.indexOf(curNode) > -1) {
        wordsCollection.indexOf(curNode.previousSibling) > -1 && wordsCollection[wordsCollection.length - 1].appendChild(curNode);
        ignoredPreviousSibling = curNode;
      } else {
        _splitWordsAndCharsRecursively(curNode, config3, wordWrapper, charWrapper, prepForCharsOnly, deepSlice, ignore, charSplitRegEx, specialCharsRegEx, true);
        ignoredPreviousSibling = 0;
      }
      prepForCharsOnly && _disallowInline(curNode);
    }
  }
};
const _SplitText = class _SplitText2 {
  constructor(elements, config3) {
    this.isSplit = false;
    _initIfNecessary();
    this.elements = _elements(elements);
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.masks = [];
    this.vars = config3;
    this.elements.forEach((el2) => {
      var _a;
      config3.overwrite !== false && ((_a = el2[_splitProp]) == null ? void 0 : _a._data.orig.filter(({ element }) => element === el2).forEach(_revertOriginal));
      el2[_splitProp] = this;
    });
    this._split = () => this.isSplit && this.split(this.vars);
    let orig = [], timerId, checkWidths = () => {
      let i = orig.length, o;
      while (i--) {
        o = orig[i];
        let w = o.element.offsetWidth;
        if (w !== o.width) {
          o.width = w;
          this._split();
          return;
        }
      }
    };
    this._data = { orig, obs: typeof ResizeObserver !== "undefined" && new ResizeObserver(() => {
      clearTimeout(timerId);
      timerId = setTimeout(checkWidths, 200);
    }) };
    _context(this);
    this.split(config3);
  }
  split(config3) {
    (this._ctx || _defaultContext).add(() => {
      this.isSplit && this.revert();
      this.vars = config3 = config3 || this.vars || {};
      let { type = "chars,words,lines", aria = "auto", deepSlice = true, smartWrap, onSplit, autoSplit = false, specialChars, mask } = this.vars, splitLines = type.indexOf("lines") > -1, splitCharacters = type.indexOf("chars") > -1, splitWords = type.indexOf("words") > -1, onlySplitCharacters = splitCharacters && !splitWords && !splitLines, specialCharsRegEx = specialChars && ("push" in specialChars ? new RegExp("(?:" + specialChars.join("|") + ")", "gu") : specialChars), finalCharSplitRegEx = specialCharsRegEx ? new RegExp(specialCharsRegEx.source + "|" + _emojiSafeRegEx.source, "gu") : _emojiSafeRegEx, ignore = !!config3.ignore && _elements(config3.ignore), { orig, animTime, obs } = this._data, onSplitResult;
      if (splitCharacters || splitWords || splitLines) {
        this.elements.forEach((element, index) => {
          orig[index] = {
            element,
            html: element.innerHTML,
            ariaL: element.getAttribute("aria-label"),
            ariaH: element.getAttribute("aria-hidden")
          };
          aria === "auto" ? element.setAttribute("aria-label", (element.textContent || "").trim()) : aria === "hidden" && element.setAttribute("aria-hidden", "true");
          let chars = [], words = [], lines = [], charWrapper = splitCharacters ? _getWrapper("char", config3, chars) : null, wordWrapper = _getWrapper("word", config3, words), i, curWord, smartWrapSpan, nextSibling;
          _splitWordsAndCharsRecursively(element, config3, wordWrapper, charWrapper, onlySplitCharacters, deepSlice && (splitLines || onlySplitCharacters), ignore, finalCharSplitRegEx, specialCharsRegEx, false);
          if (splitLines) {
            let nodes = _toArray(element.childNodes), wrapLine = _getLineWrapper(element, nodes, config3, lines), curNode, toRemove = [], lineStartIndex = 0, allBounds = nodes.map((n) => n.nodeType === 1 ? n.getBoundingClientRect() : _emptyBounds), lastBounds = _emptyBounds, curBounds;
            for (i = 0; i < nodes.length; i++) {
              curNode = nodes[i];
              if (curNode.nodeType === 1) {
                if (curNode.nodeName === "BR") {
                  if (!i || nodes[i - 1].nodeName !== "BR") {
                    toRemove.push(curNode);
                    wrapLine(lineStartIndex, i + 1);
                  }
                  lineStartIndex = i + 1;
                  lastBounds = _findNextValidBounds(allBounds, i);
                } else {
                  curBounds = allBounds[i];
                  if (i && curBounds.top > lastBounds.top && curBounds.left < lastBounds.left + lastBounds.width - 1) {
                    wrapLine(lineStartIndex, i);
                    lineStartIndex = i;
                  }
                  lastBounds = curBounds;
                }
              }
            }
            lineStartIndex < i && wrapLine(lineStartIndex, i);
            toRemove.forEach((el2) => {
              var _a;
              return (_a = el2.parentNode) == null ? void 0 : _a.removeChild(el2);
            });
          }
          if (!splitWords) {
            for (i = 0; i < words.length; i++) {
              curWord = words[i];
              if (splitCharacters || !curWord.nextSibling || curWord.nextSibling.nodeType !== 3) {
                if (smartWrap && !splitLines) {
                  smartWrapSpan = document.createElement("span");
                  smartWrapSpan.style.whiteSpace = "nowrap";
                  while (curWord.firstChild) {
                    smartWrapSpan.appendChild(curWord.firstChild);
                  }
                  curWord.replaceWith(smartWrapSpan);
                } else {
                  curWord.replaceWith(...curWord.childNodes);
                }
              } else {
                nextSibling = curWord.nextSibling;
                if (nextSibling && nextSibling.nodeType === 3) {
                  nextSibling.textContent = (curWord.textContent || "") + (nextSibling.textContent || "");
                  curWord.remove();
                }
              }
            }
            words.length = 0;
            element.normalize();
          }
          this.lines.push(...lines);
          this.words.push(...words);
          this.chars.push(...chars);
        });
        mask && this[mask] && this.masks.push(...this[mask].map((el2) => {
          let maskEl = el2.cloneNode();
          el2.replaceWith(maskEl);
          maskEl.appendChild(el2);
          el2.className && (maskEl.className = el2.className.trim().split(" ").map((s) => s + "-mask").join(" "));
          maskEl.style.overflow = "clip";
          return maskEl;
        }));
      }
      this.isSplit = true;
      _fonts && splitLines && autoSplit && _fonts.addEventListener("loadingdone", this._split);
      if ((onSplitResult = onSplit && onSplit(this)) && onSplitResult.totalTime) {
        this._data.anim = animTime ? onSplitResult.totalTime(animTime) : onSplitResult;
      }
      splitLines && autoSplit && this.elements.forEach((element, index) => {
        orig[index].width = element.offsetWidth;
        obs && obs.observe(element);
      });
    });
    return this;
  }
  kill() {
    let { obs } = this._data;
    obs && obs.disconnect();
    _fonts == null ? void 0 : _fonts.removeEventListener("loadingdone", this._split);
  }
  revert() {
    var _a, _b;
    if (this.isSplit) {
      let { orig, anim } = this._data;
      this.kill();
      orig.forEach(_revertOriginal);
      this.chars.length = this.words.length = this.lines.length = orig.length = this.masks.length = 0;
      this.isSplit = false;
      if (anim) {
        this._data.animTime = anim.totalTime();
        anim.revert();
      }
      (_b = (_a = this.vars).onRevert) == null ? void 0 : _b.call(_a, this);
    }
    return this;
  }
  static create(elements, config3) {
    return new _SplitText2(elements, config3);
  }
  static register(core) {
    gsap = gsap || core || window.gsap;
    if (gsap) {
      _toArray = gsap.utils.toArray;
      _context = gsap.core.context || _context;
    }
    if (!_coreInitted && window.innerWidth > 0) {
      _fonts = document.fonts;
      _coreInitted = true;
    }
  }
};
_SplitText.version = "3.15.0";
let SplitText = _SplitText;
gsapWithCSS.registerPlugin(SplitText);
var blocks = $$(".copy").map(function(el2) {
  return { el: el2, tl: null, on: false };
});
function timeline2(b, lines, words) {
  var el2 = b.el, eb = el2.querySelector(".eyebrow"), rest = el2.querySelectorAll(".hint,.ctas");
  var tl = gsapWithCSS.timeline({ paused: true, onReverseComplete: function() {
    el2.classList.remove("on");
    el2.inert = true;
  } });
  if (reduced) return tl.fromTo(el2, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "none" });
  tl.fromTo(eb, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0).fromTo(lines, { yPercent: 115 }, { yPercent: 0, duration: 1.05, ease: "expo.out", stagger: 0.09 }, 0.06).fromTo(words, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.014 }, 0.3);
  if (rest.length) tl.fromTo(rest, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07 }, 0.44);
  return tl;
}
function initReveal() {
  blocks.forEach(function(b) {
    var el2 = b.el, h = el2.querySelector("h1,h2"), lead = el2.querySelector(".lead");
    el2.inert = true;
    if (reduced) {
      b.tl = timeline2(b);
      return;
    }
    var words = SplitText.create(lead, { type: "words", wordsClass: "wd" }).words;
    SplitText.create(h, { type: "lines", mask: "lines", linesClass: "ln", autoSplit: true, onSplit: function(self) {
      var at2 = b.tl ? b.tl.progress() : 0, rev = b.tl ? b.tl.reversed() : false;
      if (b.tl) b.tl.kill();
      b.tl = timeline2(b, self.lines, words);
      b.tl.progress(b.on ? rev ? at2 : Math.max(at2, 0.999) : 0);
    } });
  });
}
function show(b) {
  b.on = true;
  b.el.classList.add("on");
  b.el.inert = false;
  b.tl.timeScale(1).play();
}
function hide(b) {
  b.on = false;
  b.tl.timeScale(reduced ? 1.5 : 2.4).reverse();
}
function updateReveal(p, hold2) {
  if (hold2) return;
  blocks.forEach(function(b, i) {
    var want = p >= COPY[i][0] && p <= COPY[i][1];
    if (want !== b.on) (want ? show : hide)(b);
  });
}
var keypad = $("#keypad"), code = "", dots = $$(".dots i", keypad);
function renderDots() {
  dots.forEach(function(d, i) {
    d.classList.toggle("on", i < code.length);
  });
}
function press(k2) {
  if (demo.unlocked) return;
  if (k2 === "del") code = code.slice(0, -1);
  else if (code.length < 4) code += k2;
  renderDots();
  if (code.length === 4) {
    if (code === SITE.passcode) {
      demo.unlocked = true;
      keypad.classList.add("good");
      $("#kpTitle").textContent = "Preview unlocked";
      $("#kpSub").textContent = "Welcome in. Only people with the code see this.";
      statusEl.textContent = "Preview unlocked.";
      invalidateBar();
      P.hero.root.classList.add("unlocked");
    } else {
      keypad.classList.remove("shake");
      void keypad.offsetWidth;
      if (!reduced) keypad.classList.add("shake");
      $("#kpSub").textContent = "That code didn’t match. Try " + SITE.passcode + ".";
      setTimeout(function() {
        code = "";
        renderDots();
      }, 260);
    }
  }
}
$$(".keys button", keypad).forEach(function(b) {
  b.addEventListener("click", function() {
    press(b.classList.contains("del") ? "del" : b.textContent);
  });
});
keypad.addEventListener("keydown", function(e) {
  if (/^[0-9]$/.test(e.key)) {
    press(e.key);
    e.preventDefault();
  } else if (e.key === "Backspace") {
    press("del");
    e.preventDefault();
  }
});
$("#relock").addEventListener("click", function() {
  demo.unlocked = false;
  code = "";
  renderDots();
  keypad.classList.remove("good");
  $("#kpTitle").textContent = "This preview is private";
  $("#kpSub").textContent = "Enter the 4-digit passcode";
  invalidateBar();
  P.hero.root.classList.remove("unlocked");
});
var deploy = $("#deploy"), deployBar = $("#deployBar"), deployPct = $("#deployPct"), steps = $$("#deploySteps li"), versions = $("#versions");
var vbtns = $$("#versions button");
function choose(v, quiet) {
  demo.ver = v;
  vbtns.forEach(function(x) {
    x.setAttribute("aria-pressed", String(+x.dataset.ver === v));
  });
  pickVersion(v, quiet);
  invalidateBar();
  if (!quiet) statusEl.textContent = "Showing " + VLABEL[v] + ". The link is unchanged.";
}
vbtns.forEach(function(b) {
  b.addEventListener("click", function() {
    choose(parseInt(b.dataset.ver, 10));
  });
});
var LINK = "https://" + SITE.url, toastT = null, toast = $("#toast");
function doCopy() {
  try {
    if (navigator.clipboard) navigator.clipboard.writeText(LINK).catch(function() {
    });
  } catch (e) {
  }
  demo.copied = true;
  invalidateBar();
  $$("[data-copy]").forEach(function(b) {
    b.textContent = "Copied";
  });
  toast.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function() {
    toast.classList.remove("show");
  }, 2200);
  statusEl.textContent = "Link copied.";
}
document.addEventListener("click", function(e) {
  var b = e.target.closest && e.target.closest("[data-copy]");
  if (b) doCopy();
});
$("#replay").addEventListener("click", function() {
  go(0);
});
$("#home").addEventListener("click", function(e) {
  e.preventDefault();
  go(0);
});
$("#skip").addEventListener("click", function(e) {
  e.preventDefault();
  go(5);
  var ship = $("#ship"), to = function() {
    $("a, button", ship).focus({ preventScroll: true });
  };
  if (ship.classList.contains("on")) return to();
  var mo = new MutationObserver(function() {
    if (ship.classList.contains("on")) {
      mo.disconnect();
      to();
    }
  });
  mo.observe(ship, { attributes: true, attributeFilter: ["class"] });
});
var VS = atPoint(4, 550, 600), DP = atPoint(4, 190, 240), TO = { x: 550, y: 640 };
var KZ = 1800 / (1800 - 30);
var place = {};
onLayout(function() {
  var s = clamp$2(fit.s * 1.05, 0.72, 1);
  keypad.classList.toggle("compact", fit.s < 0.62);
  place.kpS = s;
  deploy.classList.toggle("compact", fit.narrow);
  if (fit.narrow) {
    var br = $("#bar").getBoundingClientRect();
    place.dp = { x: br.left + br.width / 2, y: br.bottom + 30 };
  }
  var t2 = toScreen(TO.x, TO.y);
  toast.style.transform = "translate(-50%,-50%) translate(" + t2.x + "px," + t2.y + "px)";
  last = {};
});
function prop(e, k2) {
  return gsapWithCSS.getProperty(e, k2);
}
var last = {};
function vis(elm, key2, o, liveCls) {
  if (last[key2] === o) return;
  last[key2] = o;
  elm.style.opacity = o;
  elm.style.visibility = o > 0.01 ? "visible" : "hidden";
  if (liveCls) elm.classList.toggle("live", o > 0.6);
}
function updateUI(p, c) {
  var inK = ease((p - (T[2][0] + 0.8 * (T[2][1] - T[2][0]))) / 22), outU = tu(3, p), sink = ease(outU / 0.3);
  var ko = inK * (1 - ease((outU - 0.15) / 0.15));
  vis(keypad, "kp", +ko.toFixed(3), true);
  if (ko > 0) {
    var h = P.hero.root, kp = project(prop(h, "x"), prop(h, "y"), prop(h, "z"));
    var pd = sink > 0 ? project(prop(padlock, "x"), prop(padlock, "y") - 138, prop(padlock, "z")) : kp;
    var x = kp.x + (pd.x - kp.x) * sink, y = kp.y + (pd.y - kp.y) * sink;
    var sc = place.kpS * (kp.k / KZ) * (0.94 + 0.06 * inK) * (1 - 0.82 * sink);
    keypad.style.transform = "translate(-50%,-50%) translate(" + x + "px," + y + "px) scale(" + sc + ")";
  }
  var u = clamp$2((p - UPD[0]) / (UPD[1] - UPD[0]));
  var dO = ease((p - (UPD[0] - 12)) / 10) * (1 - ease((p - T[4][0]) / 16));
  vis(deploy, "dp", +dO.toFixed(3));
  if (dO > 0) {
    var dp = fit.narrow ? place.dp : project(DP[0], DP[1], DP[2]);
    deploy.style.transform = "translate(-50%,-50%) translate(" + dp.x + "px," + dp.y + "px) translateY(" + (1 - Math.min(1, dO)) * 10 + "px)" + (fit.narrow ? "" : " scale(" + place.kpS + ")");
    var pct = Math.round(u * 100);
    if (last.pct !== pct) {
      last.pct = pct;
      deployBar.style.transform = "scaleX(" + u + ")";
      deployPct.textContent = pct + "%";
    }
    steps.forEach(function(li, i) {
      var on = u >= [0.3, 0.68, 1][i];
      if (li._on !== on) {
        li._on = on;
        li.classList.toggle("on", on);
      }
    });
  }
  var vO = ease((p - (UPD[1] - 4)) / 14) * (1 - ease((p - T[4][0]) / 12));
  vis(versions, "vs", +vO.toFixed(3), true);
  if (vO > 0) {
    var v = project(VS[0], VS[1], VS[2]);
    versions.style.transform = "translate(-50%,-50%) translate(" + v.x + "px," + v.y + "px)";
  }
  if (c !== 4 && demo.ver !== 3) choose(3, true);
}
var ORDER = ["laptop", "phone", "tablet"];
var bar = $("#bar"), stage = $("#stage");
var cv = document.createElement("canvas");
cv.className = "streams";
cv.setAttribute("aria-hidden", "true");
stage.insertBefore(cv, $("#ui"));
var ctx = cv.getContext("2d"), W = 0, H = 0, dpr = 1;
onTheme(function() {
  streaks = null;
});
onLayout(function() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  W = stage.clientWidth;
  H = stage.clientHeight;
  cv.width = Math.round(W * dpr);
  cv.height = Math.round(H * dpr);
  cv.style.width = W + "px";
  cv.style.height = H + "px";
  barRect = null;
  curves = null;
  ctx.fillStyle = "rgba(0,0,0,0.01)";
  ctx.fillRect(0, 0, 2, 2);
  ctx.clearRect(0, 0, cv.width, cv.height);
});
var shown = false, barRect = null, curves = null, curveKey = "";
function curve(a, b) {
  var dy = b.y - a.y, pts = [];
  var c1 = { x: a.x, y: a.y + dy * 0.52 }, c2 = { x: b.x, y: b.y - dy * 0.58 };
  for (var i = 0; i <= 96; i++) {
    var t2 = i / 96, u = 1 - t2;
    pts.push({ x: u * u * u * a.x + 3 * u * u * t2 * c1.x + 3 * u * t2 * t2 * c2.x + t2 * t2 * t2 * b.x, y: u * u * u * a.y + 3 * u * u * t2 * c1.y + 3 * u * t2 * t2 * c2.y + t2 * t2 * t2 * b.y });
  }
  pts.a = a;
  pts.b = b;
  return pts;
}
var streaks = null, packets = null, packetHead = 9, lastNow = 0;
function updateStreams(p, now2, active) {
  var on = active && p > LAUNCH[0][0] - 2;
  if (!on) {
    if (shown) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      shown = false;
      bar.classList.remove("beaming");
    }
    return;
  }
  var dt = lastNow ? Math.min(0.05, (now2 - lastNow) / 1e3) : 1 / 60;
  lastNow = now2;
  var launch = LAUNCH.map(function(r) {
    var x = clamp$2((p - r[0]) / (r[1] - r[0]));
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  });
  var cam2 = document.getElementById("camera").style.transform, wy = gsapWithCSS.getProperty(devWrap, "y"), ws = gsapWithCSS.getProperty(devWrap, "scale");
  shown = true;
  bar.classList.toggle("beaming", launch[0] > 0.02);
  if (!streaks) {
    var c = streakColours();
    var pc = c.light ? Object.assign({}, c, { a: c.b }) : c;
    streaks = ORDER.map(function() {
      return new Streak(c);
    });
    packets = ORDER.map(function() {
      return [new Streak(pc), new Streak(pc)];
    });
    packetHead = pc === c ? 9 : 6;
  }
  if (!barRect) barRect = bar.getBoundingClientRect();
  var br = barRect, ck = wy + "," + ws + "," + cam2;
  if (ck !== curveKey || !curves) {
    curveKey = ck;
    var wx = gsapWithCSS.getProperty(devWrap, "x"), wz = gsapWithCSS.getProperty(devWrap, "z"), W2 = +devWrap.dataset.w / 2, H2 = +devWrap.dataset.h / 2;
    curves = ORDER.map(function(name, i) {
      var d = devs[name];
      if (!d) return null;
      var a = { x: br.left + br.width * [0.5, 0.36, 0.64][i], y: br.bottom - 3 };
      var m = project(wx + (d.attach[0] - W2) * ws, wy + (d.attach[1] - H2) * ws, wz);
      return Streak.prep(curve(a, { x: m.x, y: m.y }));
    });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var time = now2 / 1e3;
  curves.forEach(function(pts, i) {
    if (!pts) return;
    var L = launch[i];
    if (L <= 0) return;
    streaks[i].draw(ctx, pts, L, { width: 2, guide: 0.1, tail: 1, base: L < 1 ? 0.3 : 0.6, dust: 26, head: L < 1 ? 18 : 10, shed: L < 1 ? 70 : 4, time: time + i, dt, k: 1 });
    if (L >= 1 && !reduced) {
      for (var j = 0; j < 2; j++) {
        var t2 = (now2 / 1800 + j * 0.5 + i * 0.21) % 1, kk = Math.sin(Math.PI * t2);
        packets[i][j].draw(ctx, pts, t2, { width: 1.8, guide: 0, tail: 0.16, base: 0, dust: 40, head: packetHead, shed: 24 * kk, time, dt, k: 0.35 + 0.65 * kk });
      }
    }
  });
}
function playIntro(copyIn, done) {
  var body2 = document.body, halo = $("#halo"), rail2 = $("#rail"), track2 = $("#rail .track"), nodes = $$("#rail li");
  var top = $$(".top .brand, .top .tools > *"), bar2 = $("#bar");
  body2.classList.remove("booting");
  if (reduced) {
    gsapWithCSS.fromTo([top, bar2, rail2, ".copies"], { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" });
    gsapWithCSS.set(halo, { opacity: 1, scale: 1 });
    copyIn();
    return;
  }
  var sw = { p: -0.4, a: 0 };
  var tl = gsapWithCSS.timeline({ defaults: { ease: "expo.out" }, onComplete: function() {
    setSheen(-1, 0);
    tilt();
  } });
  tl.fromTo(top, { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.06 }, 0.05).fromTo(halo, { opacity: 0, scale: 0.35 }, { opacity: 1, scale: 1, duration: 2.6, ease: "power3.out" }, 0).fromTo(
    pouchRig,
    { rotationY: -38, rotationX: 9, rotationZ: -3, y: 70, z: -260, opacity: 0 },
    { rotationY: 0, rotationX: 0, rotationZ: 0, y: 0, z: 0, opacity: 1, duration: 2.3, ease: "expo.out" },
    0.1
  ).fromTo(sw, { p: -0.4, a: 0 }, { p: 1.4, a: 1, duration: 1.5, ease: "power2.inOut", onUpdate: function() {
    setSheen(sw.p, Math.sin(Math.min(1, (sw.p + 0.4) / 1.8) * Math.PI) * sw.a);
  } }, 0.55).fromTo(bar2, { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, 0.45).set(".copies", { opacity: 1 }, 0.7).add(copyIn, 0.75).fromTo(rail2, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, 1).fromTo(track2, { scaleY: 0, transformOrigin: "50% 0" }, { scaleY: 1, duration: 1.2, ease: "power3.inOut" }, 1).fromTo(nodes, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.06 }, 1.15);
}
function tilt() {
  if (reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  var rx = gsapWithCSS.quickTo(pouchRig, "rotationX", { duration: 1.4, ease: "power3.out" }), ry = gsapWithCSS.quickTo(pouchRig, "rotationY", { duration: 1.4, ease: "power3.out" });
  addEventListener("pointermove", function(e) {
    if (document.body.classList.contains("dragging")) return;
    var nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
    ry(nx * 7);
    rx(-ny * 4);
  }, { passive: true });
}
var master = gsapWithCSS.timeline({ paused: true, defaults: { ease: "none" } });
var haloRig = document.getElementById("haloRig");
function build() {
  initSets(master, tileFrames());
  var a = T[1][0], b = T[1][1], d = b - a;
  master.to([bagBase, bagTop], { y: 110, opacity: 0, duration: d * 0.3, ease: "power2.in" }, a);
  tiles.forEach(function(t2, i) {
    var becomes = ["statement.pdf", "dashboard.html", "index.html"].indexOf(t2.file) >= 0;
    if (becomes) master.to(t2.outer, { opacity: 0, scale: 1.25, duration: d * 0.12, ease: "power1.in" }, a + d * (0.1 + i * 0.01));
    else master.to(t2.outer, { y: -120 - i * 12, x: (i - 2.5) * 40, opacity: 0, rotation: (i - 2.5) * 6, duration: d * 0.45, ease: "power2.in" }, a + d * 0.06);
  });
  master.set(haloRig, { opacity: 1, scale: 1, y: 0 }, 0).to(haloRig, { scale: 1.15, y: -40, opacity: 0.85, duration: T[0][1] - T[0][0] }, T[0][0]);
  [[1.3, -10, 0.45], [0.95, 0, 0.75], [1.35, -20, 0.5], [1.5, -150, 0.8]].forEach(function(h, i) {
    var a0 = T[i + 1][0], d0 = T[i + 1][1] - a0;
    master.to(haloRig, { scale: h[0], y: h[1], duration: d0 }, a0).to(haloRig, { opacity: 0.15, duration: d0 * 0.45, ease: "sine.inOut" }, a0).to(haloRig, { opacity: h[2], duration: d0 * 0.45, ease: "sine.inOut" }, a0 + d0 * 0.55);
  });
  master.set({}, {}, END);
}
function layout() {
  measure();
  layoutAll();
  measureRail();
}
onLayout(function() {
  var c = toScreen(550, 330), st = haloRig.style;
  st.setProperty("--hx", c.x + "px");
  st.setProperty("--hy", c.y + "px");
  st.setProperty("--hs", Math.round(980 * fit.s) + "px");
});
var started = false, lastP = -1, introDone = false;
function frame(dt, now2) {
  var p = pos(), c = chapterAt(p);
  if (p !== lastP) {
    master.time(p);
    applyCamera(p);
    lastP = p;
  }
  var z = stepZipper(dt, now2, p < T[1][1]);
  var fade = ease((p - T[1][0]) / ((T[1][1] - T[1][0]) * 0.3));
  updateChips(z.k, clamp$2((p - CHECK[0]) / (CHECK[1] - CHECK[0])), fade);
  updateBar(p, z.p, c, dt);
  updateRail(p, dt);
  updateReveal(p, !introDone);
  updateSets(p);
  updateUI(p, c);
  updateStreams(p, now2, c === 5);
}
function nextFrame(cb) {
  var called = false, go2 = function() {
    if (!called) {
      called = true;
      cb();
    }
  };
  requestAnimationFrame(function() {
    requestAnimationFrame(go2);
  });
  setTimeout(go2, 120);
}
function prime(done) {
  var fr = document.getElementById("frame"), stops = [R[1], R[2], R[3], 780, R[4], R[5]], i = 0;
  if (reduced) {
    fr.style.opacity = "";
    done();
    return;
  }
  fr.style.opacity = 4e-3;
  (function next() {
    if (i < stops.length) {
      if (stops[i] === R[1]) renderHero(1, 1, 0);
      master.time(stops[i]);
      applyCamera(stops[i++]);
      nextFrame(next);
      return;
    }
    master.time(pos());
    applyCamera(pos());
    lastP = -1;
    nextFrame(function() {
      fr.style.opacity = "";
      done();
    });
  })();
}
function start() {
  if (started) return;
  started = true;
  layout();
  build();
  initReveal();
  prime(function() {
    master.time(pos());
    onFrame(frame);
    playIntro(function() {
      introDone = true;
    });
  });
}
var lastW = 0, lastH = 0, rT = 0;
addEventListener("resize", function() {
  clearTimeout(rT);
  rT = setTimeout(function() {
    var st = document.getElementById("stage");
    if (st.clientWidth === lastW && Math.abs(st.clientHeight - lastH) < 80) return;
    lastW = st.clientWidth;
    lastH = st.clientHeight;
    var p = pos();
    layout();
    master.time(p);
    lastP = -1;
  }, 120);
});
onGo(function() {
  scrollMode();
});
var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([Promise.all([fontsReady, heroReady]), new Promise(function(r) {
  setTimeout(r, 2500);
})]).then(function() {
  requestAnimationFrame(start);
});
