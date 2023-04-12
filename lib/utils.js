import * as Uebersicht from 'uebersicht';
import * as Settings from './settings';

export const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error, json);
    return undefined;
  }
};

/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
const hasOwn = {}.hasOwnProperty;

export function classnames() {
  const classes = [];

  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      const inner = classnames.apply(null, arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === 'object') {
      for (const key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

const WIDTH = 20;
const DURATION = 320;

export const clickEffect = (e) => {
  const { body } = document;
  const { clientX, clientY } = e;
  const cursor = Object.assign(document.createElement('div'), {
    id: 'simple-bar-click-effect',
  });
  Object.assign(cursor.style, {
    top: `${clientY - WIDTH / 2}px`,
    left: `${clientX - WIDTH / 2}px`,
    width: `${WIDTH}px`,
    height: `${WIDTH}px`,
    transition: `transform ${DURATION} ease`,
  });
  if (cursor && 'animate' in cursor) {
    body.appendChild(cursor);
    cursor.animate(
      [
        { opacity: 0, transform: 'scale(0)' },
        { opacity: 1, transform: 'scale(2)' },
        { opacity: 0, transform: 'scale(1.6)' },
      ],
      { duration: DURATION },
    );
  }
  setTimeout(() => cursor && body.removeChild(cursor), DURATION);
};

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};

/*!
 * (c) 2019 Chris Ferdinandi & Jascha Brinkmann, MIT License, https://gomakethings.com & https://twitter.com/jaschaio
 */
export const compareObjects = (obj1, obj2) => {
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }
  const diffs = {};
  let key;
  const arraysMatch = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  };
  const compare = (item1, item2, key) => {
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }
    if (type1 === '[object Object]') {
      const objDiff = compareObjects(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  };
  for (key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      compare(obj1[key], obj2[key], key);
    }
  }
  for (key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }
  return diffs;
};

export const filterApps = (app, exclusions, titleExclusions, exclusionsAsRegex) => {
  const {
    'is-native-fullscreen': isNativeFullscreen,
    'native-fullscreen': __legacyIsNativeFullscreen,
    app: appName,
    title: appTitle,
  } = app;

  const isAppNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(appName)
    : exclusions.includes(appName);

  const isAppTitleExcluded = exclusionsAsRegex
    ? titleExclusions.length !== 0 && new RegExp(titleExclusions).test(appTitle)
    : titleExclusions.includes(appTitle);

  return (
    (isNativeFullscreen ?? __legacyIsNativeFullscreen) ||
    (!isAppNameExcluded && !appTitle.length) ||
    (!isAppNameExcluded && !isAppTitleExcluded)
  );
};

export const isSpaceExcluded = (id, exclusions, exclusionsAsRegex) => {
  const isSpaceNameExcluded = exclusionsAsRegex
    ? exclusions.length !== 0 && new RegExp(exclusions).test(id)
    : exclusions.includes(id);

  return exclusions && isSpaceNameExcluded;
};

export const stickyWindowWorkaround = ({
  windows,
  uniqueApps,
  currentDisplay,
  currentSpace,
  exclusions,
  titleExclusions,
  exclusionsAsRegex,
}) => {
  const stickySet = new Set();
  const stickyWindows = windows.filter((app) => {
    const {
      'is-sticky': isSticky,
      sticky: __legacyIsSticky,
      'is-native-fullscreen': isNativeFullscreen,
      'native-fullscreen': __legacyIsNativeFullscreen,
      display,
      app: appName,
      id,
    } = app;
    return (
      (isSticky ?? __legacyIsSticky) &&
      !(isNativeFullscreen ?? __legacyIsNativeFullscreen) &&
      display === currentDisplay &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !stickySet.has(uniqueApps ? appName : id) &&
      stickySet.add(uniqueApps ? appName : id)
    );
  });
  const nonStickySet = new Set();
  const nonStickyWindows = windows.filter((app) => {
    const {
      'is-sticky': isSticky,
      sticky: __legacyIsSticky,
      'is-native-fullscreen': isNativeFullscreen,
      'native-fullscreen': __legacyIsNativeFullscreen,
      space,
      app: appName,
      id,
    } = app;
    return (
      (!(isSticky ?? __legacyIsSticky) || (isNativeFullscreen ?? __legacyIsNativeFullscreen)) &&
      space === currentSpace &&
      filterApps(app, exclusions, titleExclusions, exclusionsAsRegex) &&
      !nonStickySet.has(uniqueApps ? appName : id) &&
      nonStickySet.add(uniqueApps ? appName : id)
    );
  });
  return { nonStickyWindows, stickyWindows };
};

export const sortWindows = (windows) =>
  windows.sort((a, b) => {
    if (a.frame.x !== b.frame.x) return a.frame.x > b.frame.x;
    if (a.frame.y !== b.frame.y) return a.frame.y > b.frame.y;
    if (a['stack-index'] !== b['stack-index']) return a['stack-index'] > b['stack-index'];
    return a.id > b.id;
  });

export const softRefresh = () =>
  Uebersicht.run(
    `osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "simple-bar-index-jsx"'`,
  );

export const hardRefresh = () => Uebersicht.run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh'`);

export const notification = (content, title = 'simple-bar') => {
  const settings = Settings.get();
  const { disableNotifications } = settings.global;
  if (disableNotifications) return;
  Uebersicht.run(`osascript -e 'tell app "System Events" to display notification "${content}" with title "${title}"'`);
};

export const injectStyles = (id, styles = []) => {
  const existingStyles = document.getElementById(id);
  const stylesToInject = styles.join('');
  if (existingStyles) return (existingStyles.innerHTML = stylesToInject);
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      id,
      innerHTML: stylesToInject,
    }),
  );
};

const DEFAULT_PACE = 4;

export const startSliding = (container, innerSelector, sliderSelector) => {
  if (!container) return;
  const settings = Settings.get();
  const { slidingAnimationPace = DEFAULT_PACE } = settings.global;
  const pace = !slidingAnimationPace || slidingAnimationPace < 1 ? DEFAULT_PACE : parseInt(slidingAnimationPace);
  const inner = container.querySelector(innerSelector);
  const slider = container.querySelector(sliderSelector);
  const delta = inner.clientWidth - slider.clientWidth;
  if (delta > 0) return;
  const timing = Math.round((Math.abs(delta) * 100) / pace);
  Object.assign(slider.style, {
    transform: `translateX(${delta}px)`,
    transition: `transform ${timing}ms linear`,
  });
};

export const stopSliding = (container, sliderSelector) => {
  if (!container) return;
  container.querySelector(sliderSelector).removeAttribute('style');
};

export const cleanupOutput = (output) => output?.trim().replace(/(\r\n|\n|\r)/gm, '');

export const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const switchSpace = async (currentIndex, desiredIndex) => {
  const repeats = Math.abs(currentIndex - desiredIndex);
  const left = currentIndex > desiredIndex;
  for (let i = 0; i < repeats; i++) {
    await Uebersicht.run(
      `osascript -e 'tell app "System Events" to key code ${left ? '123' : '124'} using control down'`,
    );
  }
};

export const handleBarFocus = () => {
  const bar = document.querySelector('.simple-bar--spaces');
  if (!bar) return () => {};
  const handleClick = (e) => {
    if (e.target !== bar) return;
    focusBar();
  };
  bar.addEventListener('click', handleClick);
  bar.addEventListener('mouseleave', blurBar);
  return () => {
    bar.removeEventListener('click', handleClick);
    bar.removeEventListener('mouseleave', blurBar);
  };
};

const focusBar = () => {
  const bar = document.querySelector('.simple-bar--spaces');
  if (!bar) return;
  bar.classList.add('simple-bar--focused');
};

export const blurBar = () => {
  const bar = document.querySelector('.simple-bar--spaces');
  if (!bar) return;
  bar.classList.remove('simple-bar--focused');
};

export const getSystem = async () => {
  const [bareArchitecture, bareSystem] = await Promise.all([Uebersicht.run('uname -a'), Uebersicht.run('uname -m')]);
  const architecture = cleanupOutput(bareArchitecture);
  const system = cleanupOutput(bareSystem);
  if (system.startsWith('arm64') || (system.startsWith('x86_64') && architecture.includes('ARM64'))) {
    return 'arm64';
  }
  return 'x86_64';
};

const root = typeof window === 'object' ? window : {};
export function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof root.requestAnimationFrame === 'function';

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  wait = +wait || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      root.cancelAnimationFrame(timerId);
      return root.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id);
    }
    clearTimeout(id);
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;
  return debounced;
}
