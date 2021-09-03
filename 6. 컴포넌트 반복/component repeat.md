# 컴포넌트 반복

1. 자바스크립트 배열의 map()함수

   1. 문법

   - array.map(callback, [thisArg])

     - callback : 새로운 배열의 요소를 생성하는 함수로 파라미터는 3가지
       - currentValue : 현재 처리하고 있는 요소
       - index : 현재 요소의 index 값
       - array : 현재 처리하고 있는 원본 배열

     ```js
     var numbers=[1,2,3,4,5];

     number.map(function(c,i,a){
                 console.log(c,i,a)})

     1 0 [1, 2, 3, 4, 5]
     2 1 [1, 2, 3, 4, 5]
     3 2 [1, 2, 3, 4, 5]
     4 3 [1, 2, 3, 4, 5]
     5 4 [1, 2, 3, 4, 5]


     ```

2. 데이터 배열을 컴포넌트 배열로 변환

```js
import React from "react";

const IterationSample = () => {
  return (
    <div>
      <ul>
        <li>눈사람</li>
        <li>얼음</li>
        <li>눈</li>
        <li>바람</li>
      </ul>
    </div>
  );
};
export default IterationSample;
```

-> 반복되는 태그를 mpa()이용해서 간단하게 바꿀 수 있다

```js
import React from "react";

const IterationSample = () => {
  const names = ["눈사람", "얼음", "눈", "바람"];
  const nameList = names.map((v) => <li>{v}</li>);
  return (
    <div>
      <ul>{nameList}</ul>
    </div>
  );
};
export default IterationSample;
```

3. key

- 리액트에서 key는 컴포넌트 배열을 렌더링 했을 때 어떤 원소에 변동이 있는지 알아내려고 사용

  1. key 설정
     - key 값을 설정 할 때는 map 함수의 인자로 전달되는 함수 내부에서 props를 설정하듯이 설정(key값은 유일하게)

  ```js
  import React from "react";

  const IterationSample = () => {
    const names = ["눈사람", "얼음", "눈", "바람"];
    const nameList = names.map((v, i) => <li key={i}>{v}</li>);
    return (
      <div>
        <ul>{nameList}</ul>
      </div>
    );
  };
  export default IterationSample;
  ```

4.  응용

    1. 데이터 추가

    ```js
    import React, { useState } from "react";

    const IterationSample = () => {
      const [names, setNames] = useState([
        { id: 1, text: "눈사람" },
        { id: 2, text: "얼음" },
        { id: 3, text: "눈" },
        { id: 4, text: "바람" },
      ]);
      const [inputText, setInputText] = useState("");
      const [nextId, setNextId] = useState(5);

      const onChange = (e) => setInputText(e.target.value);

      const onClick = () => {
        const nextNames = names.concat({
          id: nextId,
          text: inputText,
        });
        setNextId(nextId + 1);
        setNames(nextNames);
        setInputText("");
      };

      const namesList = names.map((name) => <li key={name.id}>{name.text}</li>);
      return (
        <div>
          <input value={inputText} onChange={onChange} />
          <button onClick={onClick}>추가</button>
          <ul>{namesList} </ul>
        </div>
      );
    };
    export default IterationSample;
    ```

        - 배열에 항목 추가할 때 push 안쓰고 concat를 쓴 것은 push 함수는 기존 배열 자체를 변경하고, concat는 새로운 배열을 만들어 준다는 차이
        -> 리액트에서는 상태를 업데이트 할 때는 기존 상태를 그대로 두면서 새로운 값을 상태로 설정해야 하기 때문에

    2. 데이터 제거

       - filter 함수를 사용하면 배열에서 특정 조건을 만족하는 원소들만 분류 가능

       ```js
       const numbers = [1, 2, 3, 4, 5];
       numbers.filter((e) => e > 3)[(4, 5)];
       ```

    ```js
    import React, { useState } from "react";

    const IterationSample = () => {
      const [names, setNames] = useState([
        { id: 1, text: "눈사람" },
        { id: 2, text: "얼음" },
        { id: 3, text: "눈" },
        { id: 4, text: "바람" },
      ]);
      const [inputText, setInputText] = useState("");
      const [nextId, setNextId] = useState(5);

      const onChange = (e) => setInputText(e.target.value);

      const onClick = () => {
        const nextNames = names.concat({
          id: nextId,
          text: inputText,
        });
        setNextId(nextId + 1);
        setNames(nextNames);
        setInputText("");
      };

      const onRemove = (id) => {
        const nextNames = names.filter((name) => name.id !== id);
        setNames(nextNames);
      };

      const namesList = names.map((name) => (
        <li key={name.id} onDoubleClick={() => onRemove(name.id)}>
          {name.text}
        </li>
      ));
      return (
        <div>
          <input value={inputText} onChange={onChange} />
          <button onClick={onClick}>추가</button>
          <ul>{namesList} </ul>
        </div>
      );
    };
    export default IterationSample;
    ```
