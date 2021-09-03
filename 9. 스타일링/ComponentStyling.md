# 컴포넌트 스타일링

- 일반 css : 컴포넌트를 스타일링 하는 가장 기본적인 방식
- Sass : 자주 사용되는 css전처리기 중 하나로 확장된 css 문법을 사용하여 css 코드를 더욱 쉽게 작성할 수 있도록 해 준다
- CSS Module : 스타일을 작성할 때 CSS 클래스가 다른 CSS 클래스의 이름과 절대 충돌하지 않도록 파일마다 고유한 이름을 자동으로 생성해 주는 옵션
- styled-components : 스타일을 자바스크립트 파일에 내장시키는 방식, 스타일을 작성함과 동시에 해당 스타일이 적용된 컴포넌트를 만들 수 있게 해줌

---

## 1. 일반 CSS

### 1.1 css 클래스 중복 방지를 위한 2가지 방법

- 클래스 이름에 컴포넌트 이름을 포함시킬믕로써 다른 컴포넌트에서 중복되는 클래스를 만들어 사용하는 것을 방지

```css
.App-header {
  background-color: #282c34;
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

- CSS Selector : 특정 클래스 내부에 있는 경우에만 스타일 적용

```css
/* .App 안에 들어 있는 .logo(클래스네임) */
.App .logo {
  height: 40vmin;
}
/* .App 안에 들어 있는 header 클래스가 아닌 header 태그 자체*/
.App header {
  display: flex;
  color: white;
}
```

---

## 2. Sass

- Sass는 CSS 전처리기로 복잡한 작업을 쉽게 할 수 있도록 해 주고, 스타일 코드의 재활용성을 높여주고, 가독성을 높여 유지 보수를 쉽게 해준다(.scss와 .sass를 지원)

```css
.sass
/* .sass 확장자는 중괄호({})와 세미콜론(;)을 사용하지 않는다 */
$font-stack:Helvetica, sans-serif
$primary-color: #333

body
    font : 100% $font-stack
    color : $primary-color
```

```scss
.scss

$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body{
    font:100% $font-stack;
    color: $primary-color;
}
```

### 2.1. 예제로 보기

```scss
SassComponent.scss

//변수 사용하기
$red: #fa5252;
$orange: #fd7314;
$yellow: #fcc419;
$green: #40c057;
$blue: #339af0;
$indigo: #5c7cfa;
$violet: #7950f2;

//믹스인 만들기(재사용 되는 스타일 블록을 함수처럼 사용
@import "./styles/utils.scss";

.SassComponent {
  display: flex;
  cursor: pointer;
  transition: all 0.3s ease-in;

  .box {
    background: red; // 일반 CSS 에선 .SassComponent .box 와 마찬가지
    cursor: pointer;
    transition: all 0.3s ease-in;
    &.red {
      // .red 클래스가 .box 와 함께 사용 됐을 때
      background: $red;
      @include square(1);
    }
    &.orange {
      background: $orange;
      @include square(2);
    }
    &.yellow {
      background: $yellow;
      @include square(3);
    }
    &.green {
      background: $green;
      @include square(4);
    }
    &.blue {
      background: $blue;
      @include square(5);
    }
    &.indigo {
      background: $indigo;
      @include square(6);
    }
    &.violet {
      background: $violet;
      @include square(7);
    }
    &:hover {
      // .box 에 마우스 올렸을 때
      background: black;
    }
  }
}


```

```js
App.js;

import React, { Component } from "react";
import SassComponent from "./SassComponent";

class App extends Component {
  render() {
    return (
      <div>
        <SassComponent />
      </div>
    );
  }
}

export default App;
```

### 2.2 utils 함수 분리하기

여러 파일에서 사용될 수 있는 Sass 변수 및 믹스인은 다른 파일로 분리하여 필요한 곳에서 쉽게 사용 가능

```scss
./style/utils.scss

//변수 사용하기
$red: #fa5252;
$orange: #fd7314;
$yellow: #fcc419;
$green: #40c057;
$blue: #339af0;
$indigo: #5c7cfa;
$violet: #7950f2;

//믹스인 만들기(재사용 되는 스타일 블록을 함수처럼 사용
@mixin square($size) {
  $calculated: 32px * $size;
  width: $calculated;
  height: $calculated;
}
```

```scss
SassComponent.scss

@import './styles/utils.scss';

.SassComponent {
  display: flex;
  cursor: pointer;
  transition: all 0.3s ease-in;

    .box {
         background: red; // 일반 CSS 에선 .SassComponent .box 와 마찬가지
         (...)
    }
}
```

---

## 3. CSS Module

CSS Module은 CSS를 사용할 때 클래스 이름을 고유한 값([파일이름]_[클래스 이름]_[해시값])형태로 자동으로 만들어서 컴포넌트 스타일 클래스 이름이 중첩되는 현상을 방지하는 기술

```css
CSSModule.module.css

/* 자동으로 고유해질 것이므로 흔히 사용되는 단어를 클래스 이름으로 마음대로 사용가능*/

.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

/* 글로벌 CSS 를 작성하고 싶다면(특정 클래스가 웹 페이지에서 전역적으로 사용되는 경우) */
:global .something {
  font-weight: 800;
  color: aqua;
}
```

-> CSS Module을 사용하면 클래스 이름을 지을 때 고유성에 대해 고민X, <br/>
why? 해당 클래스는 만든 스타일을 직접 불러온 컴포넌트 냅누에서만 작동하기 때문<br>
<br>

### 3.1 예제로 살펴보기

```css
CSSModule.module.css

/* 자동으로 고유해질 것이므로 흔히 사용되는 단어를 클래스 이름으로 마음대로 사용가능*/

.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

/* 글로벌 CSS 를 작성하고 싶다면 */
:global .something {
  font-weight: 800;
  color: aqua;
}
```

```js
CSSModule.js;

import React from "react";
import styles from "./CSSModule.module.css";

const CSSModule = () => {
  return (
    <div className={styles.wrapper}>
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
};

export default CSSModule;
```

CSS Module 파일을 불러오면 객체를 전달 받는데 거기에는 사용한 클래스의 이름과 해당 이름을 고유화한 값이 키-값으로 들어가 있다<br>
**_{wrapper: "CSSModule_wrapper\_\_33HA4}_**
이 고유한 클래스를 적용하고 싶은 JSX 엘리먼트에 **_className={styles.[클래스 이름]}_** 형태로 전달해 주면 된다.<br>

### 3.2 CSS Module을 이용한 클래스 이름을 두 개 이상 적용할 때의 예

```css
CSSModule.module.css

/* 자동으로 고유해질 것이므로 흔히 사용되는 단어를 클래스 이름으로 마음대로 사용가능*/
.wrapper {
  background: black;
  padding: 1rem;
  color: white;
  font-size: 2rem;
}

.inverted {
  color: black;
  background: white;
  border: 1px solid black;
}

/* 글로벌 CSS 를 작성하고 싶다면 */
:global .something {
  font-weight: 800;
  color: aqua;
}
```

```js
CSSModule.js

import React from 'react';
import styles from './CSSModule.module.css';

const CSSModule = () => {
console.log(styles)

  return (
    <div className={`${styles.wrapper} ${styles.inverted}`}>
    <!-->템플릿 리터럴(`)을 사용하면 문자열 안에 자바스크립트 레퍼런스를 쉽게 넣어줄 수 있다 <-->
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
};

export default CSSModule;
```

콘솔<br>
**_inverted: "CSSModule_inverted\_\_3yXne"_**<br>
**_wrapper: "CSSModule_wrapper\_\_33HA4"_**<br>

### 3.3 classnames

classnames는 CSS 클래스를 조건부로 설정할 때 유용한 라이브러리

```js
import classNames from "classnames";

classNames("one", "two"); // = 'one two'
classNames("one", { two: true }); // = 'one two'
classNames("one", { two: false }); // = 'one'
```

-> 여러 가지 종류의 파라미터를 조합해 CSS 클래스를 설정할 수 있기 때문에 컴포넌트에서 조건부로 클래스 설정할 때 매우 편하다

- CSS Module과 함께 사용하면 CSS Module 사용이 훨씬 쉬워짐<br>
  classnames에 내장되어 있는 bind 함수를 사용하면 클래스를 넣어 줄때마다 styles.[클래스 이름] 형태를 사용할 필요가 없다<br>
  ->사전에 styles에서 받아 온 후 cx('클래스 이름1','클래스 이름2') 형태로 사용

```js
CSS.Module.js;

import React from "react";
import classNames from "classnames/bind";
import styles from "./CSSModule.module.scss";

const cx = classNames.bind(styles); // 미리 styles 에서 클래스를 받아오도록 설정하고

const CSSModule = () => {
  return (
    <div className={cx("wrapper", "inverted")}>
      안녕하세요, 저는 <span className="something">CSS Module!</span>
    </div>
  );
};

export default CSSModule;
```

---

## 4. styled-components

- 자바스크립트 파일 하나에 스타일까지 작성 -> .css or .scss 확장자를 가진 스타일 파일을 따로 만들지 않아도 된다는 이점이 있다.

### 4.1 예제로 보기

```js
StyledComponent.js;

import React from "react";
import styled, { css } from "styled-components";

const Box = styled.div`
  /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
  background: ${(props) => props.color || "blue"};
  padding: 1rem;
  display: flex;
`;

const Button = styled.button`
  background: white;
  color: black;
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 1rem;
  font-weight: 600;

  /* & 문자를 사용하여 Sass 처럼 자기 자신 선택 가능 */
  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  /* 다음 코드는 inverted 값이 true 일 때 특정 스타일을 부여해줍니다. */
  ${(props) =>
    props.inverted &&
    css`
      background: none;
      border: 2px solid white;
      color: white;
      &:hover {
        background: white;
        color: black;
      }
    `};
  & + button {
    margin-left: 1rem;
  }
`;

const StyledComponent = () => (
  <Box color="black">
    <Button>안녕하세요</Button>
    <Button inverted={true}>테두리만</Button>
  </Box>
);

export default StyledComponent;
```

styled-components와 CSS/Sass를 비교 했을 때, 가장 큰 장점은 props 값으로 전달해 주는 값을 쉽게 스타일에 적용할 수 있다는 것이다.

```js
import styled from "styled-components";

const MyComponent = styled.div`
  font-size: 2rem;
`;
```

이렇게 styled.div 뒤에 Tagged 템플릿 리터럴 문법을 통해 스타일을 넣어주면 해당 스타일이 적용된 div로 이루어진 리액트 컴포넌트가 생성됨<br>
-> `<MyComponent>Hello</MyComponent>` 같은 형태로 사용 가능

### 4.2 스타일에서 props 조회하기

```js
const Box = styled.div`
  /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
  background: ${(props) => props.color || "blue"};
  padding: 1rem;
  display: flex;
`;
```

background 값에 props를 조회해서 props.color의 값을 사용하게 하고 color 값이 주어지지 않았을 때는 blue 색상으로 설정
<br><br>

`<Box color="blakc">(...)</Box>` ->JSX에서 사용될 때 color 값을 propr로 넣어 줄 수 있다.

### 4.3 반응형 디자인

브라우저의 가로 크기에 따라 다른 스타일을 적용하기 위해서는 일반 css를 사용할 때와 같이 media 쿼리를 사용하면 된다.

```js
const Box = styled.div`
  /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
  background: ${(props) => props.color || "blue"};
  padding: 1rem;
  display: flex;
  width: 1024px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    /*일반 css와 큰 차이가 없다*/
    width: 768px;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;
```

- 여러 컴포넌트에서 반복해야 할 때 이 작업을 함수화 하여 간편하게 사용할 수 있다

```js
// 위에있는 size 객체에 따라 자동으로 media 쿼리 함수를 만들어줍니다.
// 참고: https://www.styled-components.com/docs/advanced#media-templates
const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] / 16}em) {
      ${css(...args)};
    }
  `;

  return acc;
}, {});

const Box = styled.div`
  /* props 로 넣어준 값을 직접 전달해줄 수 있습니다. */
  background: ${props => props.color || 'blue'};
  padding: 1rem;
  display: flex;
  width: 1024px;
  margin: 0 auto;
  ${media.desktop`width: 768px;`}
  ${media.tablet`width: 100%;`};
`;

-> media를 한번 선언하니 스타일 쪽의 코드가 훨씬 간단해짐
```
