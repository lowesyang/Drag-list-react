/**
 * Find the father of drag list
 * @param el          DOM node
 * @param className   String
 * @return {*|Node}
 */
export function getListContainer(el, className) {
  let parent = el.parentNode;
  while (parent) {
    console.log(parent)
    if (parent.className && parent.className.indexOf(className) >= 0) {
      break;
    }
    parent = parent.parentNode;
  }
  if(!parent) throw new Error(`The element with className \'${className}\' is not found`);
  return parent;
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
  let realEl = el;
  while (realEl) {
    if (realEl.className && realEl.className.indexOf(className) >= 0) {
      break;
    }
    realEl = realEl.parentNode;
  }
  if(!realEl) throw new Error(`The element with className \'${className}\' is not found`);
  // const ind = Array.prototype.indexOf.call(container, realEl);
  let ind=0;
  const children=realEl.parentNode.childNodes;
  while(ind<children.length){
    if(realEl === children[ind]) break;
    ind++;
  }
  return {
    el:realEl,
    ind:ind<children.length?ind:-1
  }
}

/**
 * Ban the selection event or not
 * @param flag
 */
export function disabledSelection() {
  window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
}