# 5장. ref:DOM에 이름 달기

- ref: HTML에서 id를 사용하여 DOM에 이름을 다는 것처럼 리액트 내부에서 DOM에 이름을 다는 방법

1. 예제

- 자바스크립에서는 이벤트나 스타일 주려면 id나 class 지정 해야하지만 리액트는 굳이 그렇게 하지 않아도 됨

  ```js
  App.js;

  import React, { Component } from "react";
  import ValidationSample from "./ValidationSample";

  class App extends Component {
    render() {
      return <ValidationSample />;
    }
  }

  export default App;
  ```

  ```js
  import React, { Component } from "react";
  import "./ValidationSample.css";

  class ValidationSample extends Component {
    state = {
      password: "",
      clicked: false,
      validated: false,
    };
    handleChange = (e) => {
      this.setState({
        password: e.target.value,
      });
    };
    handleButtonClick = () => {
      this.setState({
        clicked: true,
        validated: this.state.password === "0000",
      });
    };
    render() {
      return (
        <div>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            className={
              this.state.clicked
                ? this.state.validated
                  ? "success"
                  : "failure"
                : ""
            }
          />
          <button onClick={this.handleButtonClick}>검증하기</button>
        </div>
      );
    }
  }

  export default ValidationSample;
  ```

  ```css
  Validation.css .success {
    background-color: red;
  }
  .failure {
    background-color: lightcoral;
  }
  ```

2. ref 사용

- 위의 예제와 다르게 state만으로 해결하지 못할 때 DOM에 접근해야 할 때 ref를 사용

  - 특정 input에 포커스 주기
  - 스크롤 박스 조작
  - Canvas 요소에 그림 그리기 등
<br/><br/>
  1. 콜백 함수를 통한 ref 설정

  - ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달
    `<input ref={(ref) => {this.input=ref}} />`<br/>
    -> this.input은 input 요소의 DOM을 가리킴

  2. createRef를 통한 ref 설정

  - 멤버변수로 React.createRef()를 담고 해당 멤버 변수의 ref를 달고자 하는 요소에 ref props로 넣어주면 ref 설정 완료
  - 설정한 뒤 DOM에 접근하려면 this.input.current를 조회

  ```js
  import React, { Component } from "react";

  class RefSample extends Component {
    input = React.createRef();

    handleFocus = () => {
      this.input.current.focus();
    };
    render() {
      return (
        <div>
          <input ref={this.input} />
        </div>
      );
    }
  }

  export default RefSample;
  ```

  3. ValidationSample.js를 이용한 예제

  - 위의 ValidationSample 예제와 다르게 focus 이벤트를 넣음

  ```js
  import React, { Component } from "react";
  import "./ValidationSample.css";

  class ValidationSample extends Component {
    state = {
      password: "",
      clicked: false,
      validated: false,
    };
    handleChange = (e) => {
      this.setState({
        password: e.target.value,
      });
    };
    handleButtonClick = () => {
      this.setState({
        clicked: true,
        validated: this.state.password === "0000",
      });
      this.input.focus();
    };
    render() {
      return (
        <div>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            ref={(ref) => (this.input = ref)}
             className={this.state.clicked ?
                    (this.state.validated ? 'success':'failure') : ''}
          />
          <button onClick={this.handleButtonClick}>검증하기</button>
        </div>
      );
    }
  }

  export default ValidationSample;
  ```

3. 컴포넌트에 ref 달기

   1. 사용법
      `<MyComponent ref={(ref) => {this.myComponent=ref}}/>`<br/>

   - MyComponent 내부의 메서드 및 멤버 변수에도 접근 가능(내부의 ref에도 접근)

   ```js
   App.js;

   import React, { Component } from "react";
   import ScrollBox from "./ScrollBox";

   class App extends Component {
     render() {
       return (
         <div>
           <ScrollBox ref={(ref) => (this.ScrollBox = ref)} />
           <button onClick={() => this.ScrollBox.scrollToBottom()}>
             맨 밑으로
           </button>
         </div>
       );
     }
   }

   export default App;
   ```

   ```js
   ScrollBox.js;

   import React, { Component } from "react";

   class ScrollBox extends Component {
     scrollToBottom = () => {
       const { scrollHeight, clientHeight } = this.box;
       //const scrollHeight = this.box.scrollHeight;
       //const clientHeight = this.box.clientHeight;
       this.box.scrollTop = scrollHeight - clientHeight;
     };

     render() {
       const style = {
         border: "1px solid black",
         height: "300px",
         width: "300px",
         overflow: "auto",
         position: "relative",
       };
       const innerStyle = {
         width: "100%",
         height: "650px",
         background: "linear-gradient(white, black)",
       };
       return (
         <div
           style={style}
           ref={(ref) => {
             this.box = ref;
           }}
         >
           <div style={innerStyle} />
         </div>
       );
     }
   }

   export default ScrollBox;
   ```
