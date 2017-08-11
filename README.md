# Drag-list-react
[![npm](https://img.shields.io/badge/npm-v1.0.3-green.svg)](https://www.npmjs.com/package/drag-list-react)
[![Build Status](https://travis-ci.org/yyh1102/Drag-list-react.svg?branch=master)](https://travis-ci.org/yyh1102/Drag-list-react)
[![npm](https://img.shields.io/npm/l/express.svg)](https://opensource.org/licenses/mit-license.php)

A HOC component of Drag&Drop,Touch enabled and Reordering list for React.

[demo](http://htmlpreview.github.io/?https://github.com/yyh1102/Drag-list-react/blob/master/demo/index.html)

## Install
```bash
npm install drag-list-react --save
```

## Usage
```javascript
import React from 'react';
import DragList from 'drag-list-react';

// Notice: Every item in your data list must contains property 'id'.
// DragList component uses 'id' as the key of array.
const list=[
  {
    id:1,
    name:'Item1'
  },{
    id:2,
    name:'Item2'
  },{
    id:3,
    name:'Item3'
  },{
    id:4,
    name:'Item4'
  }
]

// list item
// Each properties in data list will be passed to the children
const listItem=({name})=>(
  <div className={styles.nameTag}>{name}</div>
)

// Placeholder when dragging items
// Props is necessary because placeholder will receive style props from component.
const Placeholder=(props)=>(
  <div className={styles.placeholder} {...props}></div>  
)

const App = () => {
  // Use placeholder
  const List = DragList(listItem,Placeholder);
  // Or not use placeholder
  // const List = DragList(listItem);
  return (
    <List  />
  )
};
```

## API
Properties

| name | type | default | description |
|------|------|---------|-------------|
| disabled | Boolean | false | disabled dragging and dropping |
| type | String |       | Type of drag list.The list will be horizontal when it is set ```inline```.|
| isLongPress | Boolean | false | Should dragging be triggered by long pressing or not |
| delay | Number | 300(ms) | The delay time of long pressing |
| gutter | Number | 0 | The spacing between two items |
| onDragBegin | Function(item,index,element) | | Prams: ```item``` is the dragging element of your data array; ```index``` is the index of the dragging item in your data array; ```element``` is the real DOM node of your dragging item.
| onDragEnd | Function(list) | | Param: ```list``` is the final list when dragging ends. |