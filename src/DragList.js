import React,{Component} from 'react';
import PropTypes from 'prop-types';
import {getListContainer, getElement,disabledSelection} from './utils';
import {DRAG_CONTAINER, FLOAT_DRAG_ITEM, ITEM_CAN_DRAG} from './constants';
import styles from './DragList.css';

const DragList = (DragItem, Placeholder) => class extends Component {
  static PropTypes = {
    list: PropTypes.array.isRequired
  }

  constructor(props) {
    super();
    this.state = {
      list: props.list
    }
    this.tempItem = null;         //current drag item
    this.isDragBegin = false;
    this.isLongPress = false;
    this.listContainer = null;    //father of list
    this.currDragItem = null;     //current dragging dom nod
    this.floatEl = null;           //current floating dom node
    this.setTime = null;          //setTimeout handler
  }

  componentDidMount() {
    if (window.addEventListener) {
      document.body.addEventListener('mousemove',this.dragging);
      document.body.addEventListener('touchmove',this.dragging);
      document.body.addEventListener('mouseup',this.dragEnd);
      document.body.addEventListener('touchend',this.dragEnd);
    }
    else {
      document.body.attachEvent('onmousemove',this.dragging);
      document.body.attachEvent('ontouchmove',this.dragging);
      document.body.attachEvent('onmouseup',this.dragEnd);
      document.body.attachEvent('ontouchend',this.dragEnd);
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   const currentChildren = this.state.children;
  //   const nextChildren = nextProps.children;
  //   const newChildren = mergeChildren(currentChildren, nextChildren);
  //   this.setState({ children: newChildren });
  // }

  componentWillUnMount() {
    if (window.removeEventListener) {
      document.body.removeEventListener('mousemove',this.dragging);
      document.body.removeEventListener('mouseup',this.dragEnd);
    }
  }

  checkLongPress = () => {
    return !this.props.isLongPress || this.isLongPress;
  }

  longPress = (e) => {
    e.stopPropagation();
    this.mouseY = e.pageY;
    const el = e.target;
    if (this.isLongPress) {
      clearTimeout(this.setTime);
      setTimeout(this.dragBegin.bind(this, el), 300);
      this.isLongPress = true;
    }
    else {
      this.dragBegin(el);
    }
  }

  dragBegin = (el) => {
    if (!this.checkLongPress() || this.isDragBegin) return;
    console.log('dragBegin');
    this.isDragBegin = true;

    const list = this.state.list;
    this.listContainer = this.listContainer || getListContainer(el, DRAG_CONTAINER);
    this.currDragItem = getElement(el, this.listContainer, ITEM_CAN_DRAG);
    const {el: dragEl, ind} = this.currDragItem;
    console.log(this.listContainer)
    console.log('ind '+ind)
    this.currDragItem.tempItem = list[ind];


    list[ind] = {
      id: Date.now(),
      type: 'placeholder'
    }
    this.setState({
      list
    },()=>{
      //onDragBegin callback
      this.props.onDragBegin&&this.props.onDragBegin(this.currDragItem);
    })

    //Save the position of drag item
    this.beginY = dragEl.offsetTop;
    const floatEl = dragEl.cloneNode(true);
    floatEl.className += ` ${FLOAT_DRAG_ITEM}`;
    floatEl.style.top = this.beginY + 'px';
    this.listContainer.appendChild(floatEl);
    this.floatEl = floatEl;
  }

  dragging = (e) => {
    e.stopPropagation();
    if (!this.checkLongPress() || !this.isDragBegin) return;
    //ban selection event
    disabledSelection();
    let {ind} = this.currDragItem.ind;
    const nextY = e.pageY, offsetY = nextY - this.mouseY;
    const mouseClientY = e.clientY;

    //float node follow the mouse
    this.floatEl.style.top = this.beginY + offsetY + 'px';
    const dragList = this.listContainer.childNodes;
    const list=this.state.list;
    for (let i = 0; i < dragList.length; i++) {
      const item = dragList[i];
      if (item.className && item.className.indexOf(FLOAT_DRAG_ITEM) >= 0) continue;
      const itemTop = item.getBoundingClientRect().top;
      const itemHeight = item.offsetHeight;
      if (mouseClientY > itemTop && mouseClientY < itemTop + itemHeight) {
        [list[ind],list[i]]=[list[i],list[ind]];
        ind=this.currDragItem.ind=i;
        this.setState({
          list
        })
        break;
      }
    }
  }

  dragEnd = (e) => {
    e.stopPropagation();
    if(!this.checkLongPress() || !this.isDragBegin) return;
    this.isLongPress=false;
    if(this.isDragBegin){
      this.isDragBegin=false;
      const list=this.state.list;
      const {ind,tempItem} = this.currDragItem;
      list[ind]=tempItem;
      this.setState({
        list
      },()=>{
        // onDragEnd callback
        this.props.onDragEnd&&this.props.onDragEnd(list);
      })
    }
  }

  render() {
    const List = this.state.list.map((item, key) => {
      if(item.type==='placeholder'){
        return Placeholder?
          <Placeholder/>:
          <div key={item.id} style={{width:this.floatEl.offsetWidth,height:this.floatEl.offsetHeight}}></div>
      }
      else{
        return (
          <div
            key={item.id}
            className={ITEM_CAN_DRAG}
          >
            <DragItem
              {...item}
            />
          </div>
        )
      }
    })
    return (
      <div
        onMouseDown={this.longPress}
        className="lowes-drag-list"
      >
        {List}
      </div>
    )
  }

}

export default DragList;