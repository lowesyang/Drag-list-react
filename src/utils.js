/**
 * Find the father of drag list
 * @param el          DOM node
 * @param className   String
 * @return {*|Node}
 */
export function getListContainer(el, className) {
  el = el.parentNode;
  while (el) {
    if (el.className && el.className.indexOf(className) >= 0) {
      break;
    }
    el = el.parentNode;
  }
  return el;
}

/**
 * Find the real DOM node of list item
 * @param el          DOM node
 * @param container   DOM node
 * @param className   String
 * @return {
 *  el    real DOM node of drag item
 *  ind   index of drag item
 * }
 */
export function getElement(el, container, className) {
  el = el.parentNode;
  while (el) {
    if (el.className && el.className.indexOf(className) >= 0) {
      break;
    }
    el = el.parentNode;
  }
  if (!el) return null;
  const ind = Array.prototype.indexOf.call(container.childNodes, el);
  return {
    el,
    ind
  }
}

/**
 * Ban the selection event or not
 * @param flag
 */
export function disabledSelection() {
  window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}

export function isInline(type) {
  return type === 'inline';
}

export function checkMobile() {
  const agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  const userAgentInfo = navigator.userAgent;
  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.indexOf(agents[i]) > 0) return true;
  }
  return false;
}
