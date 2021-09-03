# JSX

### 자바스크립트의 확장 문법이며 XML과 매우 비슷하게 생겼음

```jsx
function App() {
  return (
    <div>
      Hello <b>react</b>
    </div>
  );
}

export default App;
```

위처럼 작성된 코드는 아래와 같이 변환

```javascript
funcion App(){
    return React.createElement("div",null, "Hello", React.createElement("b",null,"react))
}
```

1. 감싸인 요소

   컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다<br>
   why?<br>
   -> Virtual DOM에서 컴포넌트 변화를 감지해 낼 때 효율적으로 비교할 수 있도록 컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다는 규칙이 있기 때문이다.

```
./src/App.js
SyntaxError: C:\Users\User\react\hello-react\src\App.js: Unterminated regular expression (6:21)

  4 | function App() {
  5 |   return (
> 6 |      Hello <b>react</b>
    |                      ^
  7 |   );
  8 | }
  9 |
```

--> `<div></div>` 감싸기 <br/>
--> Fragment라는 컴포넌트 import하고 `<Fragment></Fragment>`로 감싸기<br>
--> Frament는 `<></>` 같은 형태로도 표현 가능

2. 자바스크립트 표현

```jsx
function App() {
  const name = "리액트";
  return (
    <div>
      <h1>{name}</h1>
      <h2>안녕</h2>
    </div>
  );
}
```

3. 조건부 연산자

- JSX 내부의 자바스크립트 표현식에서 if문 사용 X
- JSX 밖에서 if문 사용하거나 {} 안에 조건부 연산자(삼항 연산자) 사용

```jsx
function App() {
  const name = "리액트";
  return (
    <div>{name === "리액트" ? <h1>리액트 맞음</h1> : <h1>리액트 아님</h1>}</div>
  );
}
```

4. AND 연산자(&&)를 사용한 조건부 렌더링

- 특정 조건을 만족할 때 내용을 보여 주고, 만족하지 않을 때는 렌더링 X

```jsx
function App() {
  const name = "리액트";
  return <div>{name === "리액트" && <h1>리액트 맞음</h1>}</div>;
}
```

5. undefined를 렌더링하지 않기

- 리액트 컴포넌트에서는 함수에서 undefined만 반환하는 상황을 만들면 안됨

```jsx
import React from "react";

function App() {
  const name = undefined;
  return name;
}

export default App;
```

```컴파일 오류
Compiled with warnings.

src\App.js
  Line 1:8:  'React' is defined but never used  no-unused-vars

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.
```

```jsx
import React from "react";

function App() {
  const name = undefined;
  return name || "값이 undefined입니다";
}

export default App;
```

- jsx내부에서 undefined를 렌더링 하는 것은 괜찮다

```jsx
import React from "react";

function App() {
  const name = undefined;
  return <div>{name}</div>;
}

export default App;
```

- name 값이 undefined일 때 보여주고 싶은 문구가 있다면 다음과 같이 작성

```jsx
import React from "react";

function App() {
  const name = undefined;
  return <div>{name || "리액트"}</div>;
}

export default App;
```

6. 인라인 스타일링

- 리액트에서 DOM 요소에 스타일 적용 -> 객체 형태로 넣어야 함

```jsx
import React from "react";

function App() {
  const name = "리액트";
  const style = {
    backgroundColor: "black", // 카멜 표기법으로 작성
    color: "aqua",
    fontSize: "48px",
    fontWeight: "bold",
    padding: 16,
  };
  return <div style={style}>{name}</div>;
}

export default App;
```

- 바로 style 값 지정 하는 방법

```jsx
import React from "react";

function App() {
  const name = "리액트";

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "aqua",
        fontSize: "48px",
        fontWeight: "bold",
        padding: 16,
      }}
    >
      {name}
    </div>
  );
}

export default App;
```

7. class 대신 className

```jsx
import React from "react";
import "./App.css";

function App() {
  const name = "리액트";

  return <div className="react">{name}</div>;
}

export default App;
```

8. 꼭 닫아야 하는 태그

HTML에서는 가끔 태그를 닫지 않은 상태로 코드를 작성하기도 하지만 JSX에서는 태그를 닫지 않으면 오류가 발생한다.

```javascript
./src/App.js
SyntaxError: C:\Users\louks\OneDrive\바탕 화면\개인\리액트\2.JSX\hello-react\src\App.js: Unterminated JSX contents (10:10)

   8 |       <input>
   9 |      야호
> 10 |     </div>
     |           ^
  11 |   )
  12 | }
  13 |
```

--> 오류 해결을 위해서는 input 태그를 닫아 주어야 한다.

9. 주석

- JSX 내부에서는 {/_ ....... _/}와 같은 형식으로 작성한다.

```javascript
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div
      // 시작 태그를 여러 줄로 작성할 때는 이런 형태도 가능합니다.
      className=""
    >
      //주석을 이렇게 하면 안됩니다 /*이것도 되지 않습니다 */
      {/*주석을 이렇게 하여야 합니다*/}
    </div>
  );
}

export default App;
```


** JSX는 HTML과 비슷하면서도 같지는 않다. XML 형식이지만 자바스크립트 객체이며, 용도도 다르고 문법도 차이가 있으므로 잘 살펴보자.