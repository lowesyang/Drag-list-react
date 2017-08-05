import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css';
import DragList from '../src/DragList';

const App=()=> {
  const list=[
    {
      id:1,
      name:'sss'
    },{
      id:2,
      name:'dfesss'
    },{
      id:3,
      name:'gfgfdsss'
    },{
      id:4,
      name:'sasdfss'
    },
  ]
  const List=DragList(({name})=><div>{name}</div>);
  return (
    <div className={styles.title}>
      <List list={list}/>
    </div>
  )
};

ReactDOM.render(
  <div>
    <App/>
  </div>,
  document.getElementById("APP")
);