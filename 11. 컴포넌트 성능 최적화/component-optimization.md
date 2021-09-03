# 컴포넌트 성능 최적화

## 11.1 많은 데이터 렌더링 하기

```js
App.js;

import React, { Component, useCallback, useRef, useState } from "react";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";
import TodoTemplate from "./components/TodoTemplate";

function createBulkTodos() {
  const array = [];
  for (let i = 1; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할 일${i}`,
      checked: false,
    });
  }
  return array;
}

const App = () => {
  const [todos, setTodos] = useState(createBulkTodos);

  //고윳값으로 사용될 id
  //ref를 사용하여 변수 담기
  const nextId = useRef(2501);

  const onInsert = useCallback(
    (text) => {
      const todo = {
        id: nextId.current,
        text,
        checked: false,
      };
      setTodos(todos.concat(todo));
      nextId.current += 1;
    },
    [todos]
  );

  const onRemove = useCallback(
    (id) => {
      setTodos(todos.filter((todo) => todo.id !== id));
    },
    [todos]
  );

  const onToggle = useCallback(
    (id) => {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo
        )
      );
    },
    [todos]
  );

  return (
    <div>
      <TodoTemplate>
        <TodoInsert onInsert={onInsert} />
        <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
      </TodoTemplate>
    </div>
  );
};

export default App;
```

createBulkTodos라는 함수를 만들어 데이터 2500개를 자동으로 생성 <br/>
-> 확연히 속도 차이를 느낄 수 있는데 정확한 측정을 위해 크롬 개발자 도구를 이용
Performance 탭을 이용해 각 시간대에 어떤 작업이 처리 되었는지 확인 할 수 있다

## 11.2 느려지는 원인 분석

화면에서 '할 일 1' 항목을 체크하면 App 컴포넌트가 리렌더링됨.
그럼 TodoList, TodoItem 등 많은 컴포넌트들이 리렌더링 된다
<br>->하나의 컴포넌트만 리렌더링 되면 되는데 많은 컴포넌트들이 리렌더링 되므로 성능을 최적화해 주는 작업을 해야한다(불필요한 리렌더링을 방지)

## 11.3 React.memo를 사용한 컴포넌트 성능 최적화

컴포넌트의 props가 바뀌지 않았다면, 리렌더링하지 않도록 설정

```js
TodoListItem.js;

import React from "react";
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdRemoveCircleOutline,
} from "react-icons/md";
import cn from "classnames";
import "./TodoListItem.scss";

const TodoListItem = ({ todo, onRemove, onToggle }) => {
  const { id, text, checked } = todo;

  return (
    <div className="TodoListItem">
      <div className={cn("checkbox", { checked })} onClick={() => onToggle(id)}>
        {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
        <div className="text">{text}</div>
      </div>
      <div className="remove" onClick={() => onRemove(id)}>
        <MdRemoveCircleOutline />
      </div>
    </div>
  );
};

export default React.memo(TodoListItem);
```

## 11.4 onToggle, onRemove 함수가 바뀌지 않게 하기

- onRemove, onToggle 함수는 배열 상태를 업데이트하는 과정에서 최신 todos를 참조하기 때문에 todos가 바뀔때마다 새로 만들어지는 상황을 방지하는 방법은 useState의 함수형 업데이트 기능을 사용하는 것과 useReducer를 사용하는 것이다

### 11.4.1 useState의 함수형 업데이트

- 함수형 업데이트 : setTodos를 사용할 때 새로운 상태를 파라미터로 넣는 대신, 상태 업데이트를 어떻게 할지 정의해 주는 업데이트 함수를 넣을 수도 있다

```js
예시 코드

const [number, setNumber] = useState(0);
//prevNumbers는 현재 number 값을 가리킨다.
const onIncrease = useCallback(
  ()=>setNumber(prevNumber =>prevNumber+1), //number+1이 아니라 함수를 넣어준다
                                            // useCallback의 두번째 파라미터에 number 안넣어도 된다
  [],
);
```

- setTodos를 사용할 때 그 안에 todos =>만 앞에 넣어 주면 된다

```js
App.js;

import React, { useState, useRef, useCallback } from "react";
import TodoTemplate from "./components/TodoTemplate";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";

function createBulkTodos() {
  const array = [];
  for (let i = 1; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할 일${i}`,
      checked: false,
    });
  }
  return array;
}
const App = () => {
  const [todos, setTodos] = useState(createBulkTodos);

  // 고유 값으로 사용 될 id
  // ref 를 사용하여 변수 담기
  const nextId = useRef(4);

  const onInsert = useCallback((text) => {
    const todo = {
      id: nextId.current,
      text,
      checked: false,
    };
    setTodos((todos) => todos.concat(todo));
    nextId.current += 1; // nextId 1 씩 더하기
  }, []);

  const onRemove = useCallback((id) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== id));
  }, []);

  const onToggle = useCallback((id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  }, []);

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
};

export default App;
```

### 11.4.2 useReducer 사용하기

- useReducer의 두 번째 파라미터에 초기 상태를 넣어 줘야 한다<br>
  지금은 두 번째 파라미터에 undefined를 넣고, 세 번째 파라미터에 초기 상태를 만들어 주는 createBulkTodos를 넣어주면 처음 렌더링 될때만 createBulkTodos 함수가 호출 된다

```js
App.js;

import React, { useState, useRef, useCallback, useReducer } from "react";
import TodoTemplate from "./components/TodoTemplate";
import TodoInsert from "./components/TodoInsert";
import TodoList from "./components/TodoList";

function createBulkTodos() {
  const array = [];
  for (let i = 1; i <= 2500; i++) {
    array.push({
      id: i,
      text: `할 일${i}`,
      checked: false,
    });
  }
  return array;
}

function todoReducer(todos, action) {
  switch (action.type) {
    case "INSERT": //새로 추가
      //{type:'INSERT', todo: {id:1, text: 'todo', checked: false}}
      return todos.concat(action.todo);
    case "REMOVE": //제거
      //{type : 'REMOVE', id:1}
      return todos.filter((todo) => todo.id !== action.id);
    case "TOGGLE": //토글
      //{type : 'REMOVE', id:1}
      return todos.map((todo) =>
        todo.id === action.id ? { ...todo, checked: !todo.checked } : todo
      );
    default:
      return todos;
  }
}
const App = () => {
  const [todos, dispatch] = useReducer(todoReducer, undefined, createBulkTodos);

  // 고유 값으로 사용 될 id
  // ref 를 사용하여 변수 담기
  const nextId = useRef(2501);

  const onInsert = useCallback((text) => {
    const todo = {
      id: nextId.current,
      text,
      checked: false,
    };
    dispatch({ type: "INSERT", todo });
    nextId.current += 1; // nextId 1 씩 더하기
  }, []);

  const onRemove = useCallback((id) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const onToggle = useCallback((id) => {
    dispatch({ type: "TOGGLE", id });
  }, []);

  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} onToggle={onToggle} />
    </TodoTemplate>
  );
};

export default App;
```

## 11.5 불변성의 중요성

- 기존의 값을 직접 수정하지 않고 새로운 값을 만들어 내는 것을 '**불변성을 지킨다**'라고 한다

```js
예시 코드

const array = [1,2,3,4,5];

const nextArrayBad = array  //배열을 복사하는 것이 아닌 똑같은 배열을 가리킨다
nextArrayBad[0]=100;
console.log(array === nextArrayBad); //똑같기 때문에 true

const nextArrayGood = [...array]; //배열 내부의 값을 모두 복사합니다.
nextArrayGood[0] = 100;
console.log(array === nextArrayGood); //다른 배열이기 때문에 false

const object = {
  foo: 'bar',
  value: 1
};

const nextObjectBad = object ; //객체가 복사되지 않고, 똑같은 객체를 가리킨다
nextObjectBad.value=nextObjectBad.value + 1;
console.log(object === nextObjectBad) // 같은 객체이기 때문에 true

const nextObjectGood = {
  ...object,// 기존에 있던 내용을 모두 복사
  value : object.value+1 // 새로운 값
};

console.log(object === nextObjectGood) // 다른 객체이기 때문에 false
```

<br>
- 전개 연산자(... 문법)은 객체나 배열 내부 값 복사할 때 얕은 복사를 하는데 내부의 값이 완전히 새로 복사되는 것이 아니라 바깥쪽에 있는 값만 복사<br>
-> 내부의 값이 객체 혹은 배열이라면 내부의 값 또한 따로 복사해 주어야 한다

```js
예시 코드

const todos = [{ id:1, checked: true}, {id:2, checked: true}];
const nextTodos = [...todos];

nextTodos[0].checked = false;
console.log(todos[0]===nextTodos[0]);// 똑같은 객체를 가리키기 때문에 true

nextTodos[0] = {
  ...nextTodos[0],
  checked:false
};
console.log(todos[0] === nextTodos[0]); // 새로운 객체 할당했기 때문에 false
```

<br>
- 객체 안에 있는 객체라면 불변성을 지키면서 새 값을 할당해야 하므로 다음과 같이 해야 한다

```js
예시 코드

const nextComplexObject = {
  ...complexObject,
  objectInside:{
    ...complexObject.objectInside,
    enabled:false
  }
};
console.log(complexObject === nextComlexObject); //false
console.log(complexObject.objectInside === nextComplexObject.objectInside); //false
```

## 11.6 react-virtualized를 사용한 렌더링 최적화

2500개의 컴포넌트 중 화면에 보이는 것은 10개 정도인데 2490개도 렌더링 되므로 자원 낭비<br>
-> react-virtualized를 사용하면 스크롤되기 전에 보이지 않는 컴포넌트는 렌더링하지 않고 스크롤되면 해당 스크롤 위치에 보여 주어야 할 컴포넌트를 자연스럽게 렌더링시킨다

- react-virtualized의 List 컴포넌트에서 각 TodoItem을 렌더링할 때 쓰는 rowRenderer 함수를 만들고 List 컴포넌트의 props로 설정

```js
TodoList.js;

import React, { useCallback } from "react";
import TodoListItem from "./TodoListItem";
import "./TodoList.scss";
import { List } from "react-virtualized";

const TodoList = ({ todos, onRemove, onToggle }) => {
  const rowRenderer = useCallback(
    ({ index, key, style }) => {
      const todo = todos[index];
      return (
        <TodoListItem
          todo={todo}
          key={key}
          onRemove={onRemove}
          onToggle={onToggle}
          style={style}
        />
      );
    },
    [onRemove, onToggle, todos]
  );
  return (
    <List
      className="TodoList"
      width={495} // 전체 크기
      height={512} //  전체 높이
      rowCount={todos.length} //항목 개수
      rowHeight={57} // 항목 높이
      rowRenderer={rowRenderer} // 항목을 렌더링할 때 쓰는 함수
      list={todos} //배열
      style={{ outline: "none" }} //List에 기본 적용되는 outline 스타일 제거
    />
  );
};

export default React.memo(TodoList);
```

```js
TodoListItem.js;

import React from "react";
import {
  MdCheckBoxOutlineBlank,
  MdCheckBox,
  MdRemoveCircleOutline,
} from "react-icons/md";
import cn from "classnames";
import "./TodoListItem.scss";

const TodoListItem = ({ todo, onRemove, onToggle, style }) => {
  const { id, text, checked } = todo;

  return (
    <div className="TodoListItem-virtualized" style={style}>
      <div className="TodoListItem">
        <div
          className={cn("checkbox", { checked })}
          onClick={() => onToggle(id)}
        >
          {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <div className="text">{text}</div>
        </div>
        <div className="remove" onClick={() => onRemove(id)}>
          <MdRemoveCircleOutline />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TodoListItem);
```

```css
TodoListItem.scss
.TodoListItem-virtualized {
  & + & {
    border-top: 1px solid #dee2e6;
  }
  &:nth-child(even) {
    background: #f8f9fa;
  }
}
(...)
```
