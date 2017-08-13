import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getListContainer, getElement, disabledSelection, isInline, checkMobile, simulateTouchStart} from './utils';
import {DRAG_CONTAINER, FLOAT_DRAG_ITEM, ITEM_CAN_DRAG} from './constants';
import styles from './DragList.css';

const DragList = (DragItem, Placeholder) => class extends Component {
  static PropTypes = {
    list: PropTypes.array.isRequired,
    type: PropTypes.string,
    isLongPress: PropTypes.bool,
    delay: PropTypes.number,
    gutter: PropTypes.number,
    onDragBegin: PropTypes.func,
    onDragEnd: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      list: props.list
    }
    this.isInline = isInline(this.props.type);    //inline,original
    this.isMobile = checkMobile();      //check is mobile or not
    this.mobileEl = null;             //cache e.target, for supporting touch event in mobile device
    this.isDragBegin = false;
    this.isLongPress = false;
    this._container = null;         //real DOM container of list
    this.currDragItem = null;     //current dragging dom nod
    this.floatEl = null;           //current floating dom node
    this.setTime = null;          //setTimeout handler
  }

  componentDidUpdate() {
    console.log('update')
  }

  componentDidMount() {
    if (window.addEventListener) {
      window.addEventListener('mousemove', this.dragging);
      window.addEventListener('mouseup', this.dragEnd);
      window.addEventListener('mouseleave', this.dragEnd);
    }
    else {
      window.attachEvent('onmousemove', this.dragging);
      window.attachEvent('onmouseup', this.dragEnd);
      window.attachEvent('onmouseleave', this.dragEnd);
    }
    if (this.isInline)
      this._container.style.cssText += `
        display:flex;
        flex-direction:row;
      `;
  }

  componentWillUnMount() {
    if (window.removeEventListener) {
      window.removeEventListener('mousemove', this.dragging);
      window.removeEventListener('mouseup', this.dragEnd);
      window.removeEventListener('mouseleave', this.dragEnd);
    }
    else {
      window.detachEvent('onmousemove', this.dragging);
      window.detachEvent('onmouseup', this.dragEnd);
      window.detachEvent('onmouseleave', this.dragEnd);
    }
  }

  checkLongPress = () => {
    return !this.props.isLongPress || this.isLongPress;
  }

  longPress = (e) => {
    if (!this.isMobile && e.button !== 0 || this.props.disabled) return;
    this.mousePos = this.isInline ?
      (e.touches ? e.touches[0].pageX : e.pageX)
      : (e.touches ? e.touches[0].pageY : e.pageY);
    const el = e.target;
    if (this.props.isLongPress) {
      // Long press
      clearTimeout(this.setTime);
      this.setTime = setTimeout(this.dragBegin.bind(this, el), this.props.delay || 300);
      this.isLongPress = true;
    }
    else {
      this.dragBegin(el);
    }
  }

  dragBegin = (el) => {
    if (!this.checkLongPress() || this.isDragBegin) return;
    console.log('dragBegin');
    const listContainer = getListContainer(el, DRAG_CONTAINER);
    //如果经过父级遍历到的容器与真实的容器不一致，则需要将事件交由上一层组件处理
    if (this._container !== listContainer) return;
    this.currDragItem = getElement(el, this._container, ITEM_CAN_DRAG);
    if (!this.currDragItem) return;

    if (this.isMobile) {
      this.mobileEl = el;
      el.addEventListener('touchmove', this.dragging);
      el.addEventListener('touchend', this.dragEnd);
      el.addEventListener('touchcancel', this.dragEnd);
      document.body.style.overflow = 'hidden';
    }
    this.isDragBegin = true;
    const list = this.state.list;
    const {el: dragEl, ind} = this.currDragItem;
    //Save the position of drag item
    this.beginPos = this.isInline ? dragEl.offsetLeft : dragEl.offsetTop;
    //Create float node
    const floatEl = dragEl.cloneNode(true);
    floatEl.className += ` ${FLOAT_DRAG_ITEM}`;
    floatEl.style.width = dragEl.offsetWidth + 'px';
    floatEl.style.height = dragEl.offsetHeight + 'px';
    if (this.isInline) floatEl.style.left = this.beginPos + 'px';
    else floatEl.style.top = this.beginPos + 'px';
    this._container.appendChild(floatEl);
    this.floatEl = floatEl;
    this.currDragItem.item = list[ind];

    list[ind] = {
      id: list[ind].id,
      type: 'placeholder'
    }
    this.setState({
      list
    }, () => {
      //onDragBegin callback
      this.props.onDragBegin
      && this.props.onDragBegin(this.currDragItem.item, this.currDragItem.ind, this.currDragItem.el);
    })

  }

  //get the offset and size info
  getItemRectInfo = (item) => {
    const rect = item.getBoundingClientRect();
    const itemOffset = this.isInline ? rect.left : rect.top;
    const itemSize = this.isInline ? item.offsetWidth : item.offsetHeight;
    return {
      itemOffset,
      itemSize
    }
  }

  dragging = (e) => {
    // debugger;
    e.stopPropagation();
    if (!this.checkLongPress()
      || !this.isDragBegin)
      return;
    //ban selection event
    console.log('dragging')
    disabledSelection();
    let {ind} = this.currDragItem;
    const nextPos = this.isInline ?
      (e.touches ? e.touches[0].pageX : e.pageX)
      : (e.touches ? e.touches[0].pageY : e.pageY),
      offsetDist = nextPos - this.mousePos;
    const mouseClient = this.isInline ?
      (e.touches ? e.touches[0].clientX : e.clientX)
      : (e.touches ? e.touches[0].clientY : e.clientY);

    //float node follow the mouse
    if (this.isInline) this.floatEl.style.left = this.beginPos + offsetDist + 'px';
    else this.floatEl.style.top = this.beginPos + offsetDist + 'px';

    const dragList = this._container.childNodes;
    const list = this.state.list;
    for (let i = 0; i < dragList.length; i++) {
      const item = dragList[i];
      if (item.className && item.className.indexOf(FLOAT_DRAG_ITEM) >= 0) continue;
      const {itemOffset, itemSize} = this.getItemRectInfo(item);
      if (mouseClient > itemOffset && mouseClient < itemOffset + itemSize && ind !== i) {
        [list[ind], list[i]] = [list[i], list[ind]];
        ind = this.currDragItem.ind = i;
        this.setState({
          list
        });
        break;
      }
    }
  }

  dragEnd = (e) => {
    e.stopPropagation();
    if (!this.isMobile && e.button !== 0
      || !this.checkLongPress()
      || !this.isDragBegin)
      return;
    console.log("dragend");
    if (this.isMobile) {
      const el = this.mobileEl;
      if (el) {
        el.removeEventListener('touchmove', this.dragging);
        el.removeEventListener('touchend', this.dragEnd);
        el.removeEventListener('touchcancel', this.dragEnd);
      }
      this.mobileEl = null;
      document.body.style.overflow = null;
    }
    this.mousePos = this.beginPos = null;
    this.isLongPress = false;
    this.isDragBegin = false;
    if (this.currDragItem) {
      const list = this.state.list;
      const {ind, item} = this.currDragItem;
      list[ind] = item;
      this.setState({
        list
      }, () => {
        // onDragEnd callback
        this.props.onDragEnd && this.props.onDragEnd(list);
      })
      this._container.removeChild(this.floatEl);
      this.currDragItem = null;
      this.floatEl = null;
    }
  }

  render() {
    //offset of each item
    const gutter = this.props.gutter;
    const itemStyle = {
      margin: `${gutter}px`,
    };
    const List = this.state.list.map((item, key) => {
      if (item.type === 'placeholder') {
        const placeholderStyle = {
          margin: itemStyle.margin,
          width: this.floatEl.offsetWidth,
          flex: `1 0 ${this.floatEl.offsetWidth}px`,
          height: this.floatEl.offsetHeight
        };
        return Placeholder ?
          <Placeholder key={item.id} style={placeholderStyle}/> :
          <div key={item.id} style={placeholderStyle}></div>
      }
      else {
        return (
          <div
            key={item.id}
            className={ITEM_CAN_DRAG}
            style={itemStyle}
          >
            <DragItem
              parentId={item.id}
              {...item}
            />
          </div>
        )
      }
    });

    //get the props should be passed to real DOM
    const props = {...this.props};
    [
      'list',
      'disabled',
      'gutter',
      'isLongPress',
      'delay',
      'onDragBegin',
      'onDragEnd',
      'type',
      'className'
    ].forEach(key => delete props[key]);

    return (
      <div
        className={(this.props.className || '') + ' ' + DRAG_CONTAINER}
        {...props}
        onMouseDown={this.longPress}
        onTouchStart={this.longPress}
        ref={el => this._container = el}
      >
        {List}
      </div>
    )
  }

}

export default DragList;