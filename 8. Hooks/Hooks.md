# Hooks

- Hooks는 리액트 v16.8에 새로 도입된 기능으로 함수형 컴포넌트에서도 상태 관리를 할 수 있는
  **useState**, 렌더링 직후 작업을 설정하는 **useEffect** 등의 기능을 제공

1. useState

useState는 가장 기본적인 Hook이며, 함수형 컴포넌트에서도 가변적인 상태를 지닐 수 있게 해줌.

```js
App.js;

import React from "react";
import Counter from "./Counter";

const App = () => {
  return (
    <div>
      <Counter />
    </div>
  );
};

export default App;
```

```js
Counter.js;

import React, { useState } from "react";

const Counter = () => {
  const [value, setValue] = useState(0); //첫번째 원소는 상태 값, 두번째 원소는 상태를 설정하는 함수
  return (
    <div>
      <p>
        현재 카운터값은<b>{value}</b>입니다.
      </p>
      <button onClick={() => setValue(value + 1)}>+1</button>
      <button onClick={() => setValue(value - 1)}>-1</button>
    </div>
  );
};

export default Counter;
```

- 관리할 상태가 여러개인 것도 useState로 편하게 관리 가능

```js
import React, { useState } from "react";

const Info = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
        <input value={nickname} onChange={onChangeNickname} />
      </div>
      <div>
        <div>
          <b>이름:</b>
          {name}
        </div>
        <div>
          <b>닉네임:</b>
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

---

2. useEffect

   useEffect는 리액트 컴포넌트가 렌더링될 때마다 특정 작업을 수행하도록 설정(componentDidMount와 componentDidUpdate를 합친 형태와 비슷)

```js
import React, { useEffect, useState } from "react";

const Info = () => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    console.log("렌더링이 완료되었습니다"); //렌더링 될때마다 나타남
    console.log({
      name,
      nickname,
    });
  });

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };
  return (
    <div>
      <div>
        <input value={name} onChange={onChangeName} />
        <input value={nickname} onChange={onChangeNickname} />
      </div>
      <div>
        <div>
          <b>이름:</b>
          {name}
        </div>
        <div>
          <b>닉네임:</b>
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

- 함수의 두 번째 파라미터로 비어 있는 배열을 넣어주면 처음 렌더링될 때만 실행, 업데이트 될때는 실행X

```js
useEffect(() => {
  console.log("렌더링이 완료되었습니다");
  console.log({
    name,
    nickname,
  });
}, []);
```

- 특정 값이 업데이트될 때만 실행하고 싶을 때는 두 번째 파라미터에 검사하고 싶은 값을 넣어주면 된다

```js
useEffect(() => {
  console.log("렌더링이 완료되었습니다");
  console.log({
    name,
    nickname,
  });
}, [name]);
```

- 컴포넌트가 언마운트되기 전이나 업데이트되기 직전에 어떤 작업을 수행하고 싶다면 뒷정리(cleanup) 함수를 반환해주어야 한다

```js
useEffect(() => {
  console.log("effect");
  console.log(name);
  return () => {
    console.log("cleanup");
    console.log(name);
  };
});
```

```js
App.js;

import React, { useState } from "react";
import Info from "./Info";

const App = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? "숨기기" : "보이기"}
      </button>
      <hr />
      {visible && <Info />}
    </div>
  );
};

export default App;
```

- 렌더링 될때마다 뒷정리 함수가 계속 나타나는데 언마운트될 때만 뒷정리 함수 호출하고 싶다면 useEffect 함수의 두 번째 파라미터에 비어 있는 배열을 넣으면 된다

```js
useEffect(() => {
  console.log("effect");
  console.log(name);
  return () => {
    console.log("cleanup");
    console.log(name);
  };
}, [name]); //-> name 넣으면 계속 나타남
```

---

3. useReducer

   useReducer는 useState보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook이다

- 리듀서 : **현재 상태**, 그리고 업데이트를 위해 필요한 정보를 담은 **액션(action)** 값을 전달받아 새로운 상태를 반환하는 함수(새로운 상태를 만들 때는 불변성 지켜야 함)

```js
function reducer(state, action){
    return { ... }; //불변성을 지키면서 업데이트한 새로운 상태를 반환
}
```

```js
{
	type:'INCREMENT', //액션 값은 주로 이런 형태
}
```

- Counter.js로 예제보기

```js
import React, { useReducer } from "react";

function reducer(state, action) {
  //action.type에 따라 다른 작업 수행
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + 1 };
    case "DECREMENT":
      return { value: state.value - 1 };
      dafault: return state;
  }
}

const Counter = () => {
  const [state, dispach] = useReducer(reducer, { value: 0 });	//state(현재 가리키고 있는 상태) 값과 dispach(액션을 발생시키는 함수) 함수를 받아옴
  return (
    <div>
      <p>
        현재 카운터값은<b>{state.value}</b>입니다.
      </p>
	  
      <button onClick={() => dispach({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispach({ type: "DECREMENT" })}>-1</button>
    </div>
  );
};

export default Counter;
```

useReducer의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에는 해당 리듀서의 기본값을 넣어준다.

```js
Info.js;

import React, { useEffect, useReducer } from "react";

function reducer(state, action) {
  return {
    ...state,
    [action.name]: action.value,
  };
}

const Info = () => {
  const [state, dispatch] = useReducer(reducer, {
    name: "",
    nickname: "",
  });

  const { name, nickname } = state;
  const onChange = (e) => {
    dispatch(e.target);
  };

  return (
    <div>
      <div>
        <input name="name" value={name} onChange={onChange} />
        <input name="nickname" value={nickname} onChange={onChange} />
      </div>
      <div>
        <div>
          <b>이름:</b>
          {name}
        </div>
        <div>
          <b>닉네임:</b>
          {nickname}
        </div>
      </div>
    </div>
  );
};

export default Info;
```

---

4. useMemo

useMemo를 사용하면 함수형 컴포넌트 내부에서 발생하는 연산을 최적화 할 수 있다.

```js
App.js;

import React from "react";
import Average from "./Average";

const App = () => {
  return (
    <div>
      <Average />
    </div>
  );
};

export default App;
```

```js
Average.js;

import React, { useState } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = (e) => {
    setNumber(e.target.value);
  };
  const onInsert = (e) => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
  };

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b>
        {getAverage(list)}
      </div>
    </div>
  );
};

export default Average;
```

-> 등록 뿐 아니라 인풋 내용이 수정될 때도 getAverage 함수가 호출 됨(낭비)

```js
Average.js;

import React, { useMemo, useState } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = (e) => {
    setNumber(e.target.value);
  };
  const onInsert = (e) => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
  };
  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b>
        {avg}
      </div>
    </div>
  );
};

export default Average;
```

-> 이제는 list 배열의 내용이 바뀔 때만 getAverage 함수가 호출

---

5. useCallback

렌더링 성능을 최적화해야 하는 상황에 사용

- Average.js에서 onChange와 onInsert 함수가 있는데 리렌더링 될때마다 새로 생성됨
  <br/>-> 컴포넌트의 렌더링이 자주 발생하거나 렌더링해야 할 컴포넌트 개수가 많아지면 최적화 해주는게 좋음

```js
Average.js;

import React, { useCallback, useMemo, useState } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");

  const onChange = useCallback((e) => {
    setNumber(e.target.value);
  }, []); //컴포넌트가 처음 렌더링될 때만 함수 생성
  const onInsert = useCallback(() => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
  }, [number, list]); //number 혹은 list가 바뀌었을 때만 함수 생성
  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b>
        {avg}
      </div>
    </div>
  );
};

export default Average;
```

- useCallback의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열(어떤 값이 바뀌었을 때 함수를 새로 생성해야 하는지)을 넣으면됨
- 배열이 비어 있으면 컴포넌트가 렌더링될 때 한번만 함수가 생성

---

6. useRef

useRef는 함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해줌

```js
Average.js;

import React, { useCallback, useMemo, useState, useRef } from "react";

const getAverage = (numbers) => {
  console.log("평균값 계산 중..");
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((a, b) => a + b);
  return sum / numbers.length;
};

const Average = () => {
  const [list, setList] = useState([]);
  const [number, setNumber] = useState("");
  const inputEl = useRef(null);

  const onChange = useCallback((e) => {
    setNumber(e.target.value);
  }, []); //컴포넌트가 처음 렌더링될 때만 함수 생성

  const onInsert = useCallback(() => {
    const nextList = list.concat(parseInt(number));
    setList(nextList);
    setNumber("");
    inputEl.current.focus();
  }, [number, list]); //number 혹은 list가 바뀌었을 때만 함수 생성
  const avg = useMemo(() => getAverage(list), [list]);

  return (
    <div>
      <input value={number} onChange={onChange} ref={inputEl} />
      <button onClick={onInsert}>등록</button>
      <ul>
        {list.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul>
      <div>
        <b>평균값:</b>
        {avg}
      </div>
    </div>
  );
};

export default Average;
```
