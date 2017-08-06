import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css';
import DragList from '../src/DragList';

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

const nestedList=[
  {
    id:1,
    name:'Item1',
    subList:[
      {
        id:1,
        name:'Item1'
      },
      {
        id:2,
        name:'Item2'
      },
      {
        id:3,
        name:'Item3'
      }
    ]
  },{
    id:2,
    name:'Item2',
    subList:[
      {
        id:1,
        name:'Item1'
      },
      {
        id:2,
        name:'Item2'
      },
      {
        id:3,
        name:'Item3'
      }
    ]
  },{
    id:3,
    name:'Item3',
    subList:[
      {
        id:1,
        name:'Item1'
      },
      {
        id:2,
        name:'Item2'
      },
      {
        id:3,
        name:'Item3'
      }
    ]
  }
]

const DragItem=({name})=>(
  <div className={styles.nameTag}>{name}</div>
)

const Placeholder=(props)=>(
  <div className={styles.placeholder} {...props}></div>
)

const NestedDragItem=({name,subList,isLongPress})=>{
  const List=DragList(DragItem,Placeholder);
  return <div className={styles.nestedItem}>
    <h4>{name}</h4>
    <List list={subList} gutter={5} isLongPress={isLongPress}/>
  </div>
}

const NestedDragItemInline=({name,subList})=>{
  const List=DragList(DragItem,Placeholder);
  return <div className={styles.nestedItem}>
    <h4>{name}</h4>
    <List list={subList} type="inline" gutter={5}/>
  </div>
}


const App = () => {
  const ListWithoutPlaceholder = DragList(DragItem);
  const ListWithPlaceholder = DragList(DragItem, Placeholder);
  const ListNestedItem = DragList(NestedDragItem, Placeholder);
  const InlineListNestedItem = DragList(NestedDragItemInline, Placeholder);

  const onDragEnd=(list)=>{
    console.log(list)
  }

  const onDragBegin=(currItem)=>{
    console.log(currItem)
  }

  return (
    <div className={styles.demoList}>
      <h3>Without Placeholder</h3>
      <ListWithoutPlaceholder list={list.slice()} gutter={5} onDragBegin={onDragBegin} onDragEnd={onDragEnd}/>
      <h3 className={styles.sectionTitle}>With Placeholder</h3>
      <ListWithPlaceholder list={list.slice()} gutter={5}/>
      <h3 className={styles.sectionTitle}>Without Placeholder with Long Press</h3>
      <ListWithPlaceholder list={list.slice()} gutter={5} isLongPress={true}/>
      <h3 className={styles.sectionTitle}>Nested List</h3>
      <ListNestedItem list={nestedList} gutter={10}/>
      <h3 className={styles.sectionTitle}>Inline Nested List</h3>
      <InlineListNestedItem type="inline" list={nestedList} gutter={10} style={{marginLeft: -100}}/>
    </div>
  )
};

ReactDOM.render(
  <div>
    <App/>
  </div>,
  document.getElementById("APP")
);