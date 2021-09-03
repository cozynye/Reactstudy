# 불변성 유지하기

## 12.1 immer를 설치하고 사용법 알아보기

### 12.1.1 immer를 사용하지 않고 불변성 유지

```js
import React, { useState,useRef, useCallback } from "react";


const App = () => {
  const nextId=useRef(1);
  const [form, setForm] =useState({name:'', username:''});
  const [data,setData] = useState({
    array: [],
    uselessValue:null
  });

  //input 수정을 위한 함수
  const onChange = useCallback(
    e => {
      const {name,value} = e.target;
      setForm({
        ...form,
        [name]: [value]
      });
    },
    [form]
  );

  //form 등록을 위한 함수
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const info = {
        id:nextId.current,
        name: form.name,
        username: form.username
      };

      //array에 새 항목 등록
      setData({
        ...data,
        array: data.array.concat(info)
      });

      //form 초기화
      setForm({
        name:'',
        username:''
      });
      nextId.current+=1;
    },
    [data, form.name, form.username]
  );

  //항목을 삭제하는 함수
  const onRemove = useCallback(
    id =>{
      setData({
        ...data,
        array: data.array.filter(info => info.id!==id)
      });
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
      />
      <input
        name="name"
        placeholder="name"
        value={form.name}
        onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info=>(
            <li key={info.id} onClick={()=> onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```

-> 전개 연산자와 배열 내장 함수를 사용하여 불변성을 유지할 수 있지만, 상태가 복잡하면 귀찮은 작업이 될 수도 있다


### 12.1.2 immer 사용법

```js
import produce from 'immer';
const nextState = produce(originalState, draft =>{
    //바꾸고 싶은 값 바꾸기
    draft.somewhere.deep.inside=5;
})
```
immer 라이브러리의 produce 함수는 두 가지 파라미터를 받는데
- 첫 번째 파라미터는 수정하고 싶은 상태
- 두 번째 파라미터는 상태를 어떻게 업데이트 할지 정의하는 함수<br>
-> 두 번째 파라미터로 전달되는 함수 내부에서 값을 변경 -> produce 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성

```js
예시 코드

import produce from 'immer';

const originalState=[
    {
        id:1,
        todo: '전개 연산자와 배열 내장 함수로 불변성 유지하기',
        checked:true,
    },
    {
        id:2,
        todo: 'immer로 불변성 유지하기',
        checked : false,
    }
];

const nextState = produce(originalState, draft=>{
    //id가 2인 항목의 checked 값을 true로 설정
    const todo = draft.find(t=>t.id===2)//id로 항목 찾기
    todo.checked = true;
    // 혹은 draft[1].checked = true;

    //배열에 새로운 데이터 추가
    draft.push({
        id:3,
        todo:'일정 관리 앱에 immer 적용하기',
        checked : false,
    });
    //id=1인 항목을 제거
    draft.splice(draft.findIndex(t=>t.id===1),1);
});

```

### 12.1.3 App 컴포넌트에 immer 적용하기

```js
import React, { useState,useRef, useCallback } from "react";
import produce from 'immer';


const App = () => {
  const nextId=useRef(1);
  const [form, setForm] =useState({name:'', username:''});
  const [data,setData] = useState({
    array: [],
    uselessValue:null
  });

  //input 수정을 위한 함수
  const onChange = useCallback(
    e => {
      const {name,value} = e.target;
      setForm(
        produce(form, draft=>{
          draft[name] = value;
        })
      );
    },
    [form]
  );

  //form 등록을 위한 함수
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const info = {
        id:nextId.current,
        name: form.name,
        username: form.username
      };

      //array에 새 항목 등록
      setData(
        produce(data, draft=>{
          draft.array.push(info);
        })
      );

      //form 초기화
      setForm({
        name:'',
        username:''
      });
      nextId.current+=1;
    },
    [data, form.name, form.username]
  );

  //항목을 삭제하는 함수
  const onRemove = useCallback(
    id =>{
      setData(
        produce(data,draft=>{
          draft.array.splice(draft.array.findIndex(info => info.id ===id),1);
        })
      );
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
      />
      <input
        name="name"
        placeholder="name"
        value={form.name}
        onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info=>(
            <li key={info.id} onClick={()=> onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```
immer를 사용하여 컴포넌트 상태를 작성할 때는 객체 안에 있는 값을 수정, push,splice 등의 함수를 사용해도 된다


### 12.1.4 useState의 함수형 업데이트와 immer 함께 쓰기

```js
예시 코드

const update = (draft => {
    draft.value=2;
});
const originalState = {
    value: 1,
    foo: 'bar',
};
const nextState= update(originalState);
console.log(nextState); //{value : 2, foo: 'bar'}

```

-> 이러한 immer의 속성과 useState의 함수형 업데이트를 함께 활용하면 코드를 깔끔히 만들 수 있다.

```js
App.js

import React, { useState,useRef, useCallback } from "react";
import produce from 'immer';


const App = () => {
  const nextId=useRef(1);
  const [form, setForm] =useState({name:'', username:''});
  const [data,setData] = useState({
    array: [],
    uselessValue:null
  });

  //input 수정을 위한 함수
  const onChange = useCallback(
    e => {
      const {name,value} = e.target;
      setForm(
        produce(draft=>{
          draft[name] = value;
        })
      );
    },
    [form]
  );

  //form 등록을 위한 함수
  const onSubmit = useCallback(
    e => {
      e.preventDefault();
      const info = {
        id:nextId.current,
        name: form.name,
        username: form.username
      };

      //array에 새 항목 등록
      setData(
        produce(draft=>{
          draft.array.push(info);
        })
      );

      //form 초기화
      setForm({
        name:'',
        username:''
      });
      nextId.current+=1;
    },
    [data, form.name, form.username]
  );

  //항목을 삭제하는 함수
  const onRemove = useCallback(
    id =>{
      setData(
        produce(draft=>{
          draft.array.splice(draft.array.findIndex(info => info.id ===id),1);
        })
      );
    },
    [data]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="아이디"
          value={form.username}
          onChange={onChange}
      />
      <input
        name="name"
        placeholder="name"
        value={form.name}
        onChange={onChange}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        <ul>
          {data.array.map(info=>(
            <li key={info.id} onClick={()=> onRemove(info.id)}>
              {info.username} ({info.name})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```