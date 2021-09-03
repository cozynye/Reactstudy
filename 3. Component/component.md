# Component
### UI를 독립적이고 재사용 가능하도록 나눈 조각

------------------------
컴포넌트를 선언하는 방식은 두 가지 이다.
1. 함수형 컴포넌트

```javascript
import React from 'react';
import './App.css';

function App() {
    const name='리액트'
  return (
    <div>
      {name}
    </div>
  );
}
export default App;
```
2. 클래스형 컴포넌트
```javascript
import React, {Component} from 'react';
import './App.css';

class App extends Component { // 클래스형 컴포넌트에는 render 함수가 꼭 필요, 그 안에서 JSX 반환
  render(){
      const name='react';

      return <div>{name}</div>;
  }
}
export default App;
```
------------------------
1. props
- 컴포넌트 속성을 설정할 때 사용하는 요소
- props 값은 해당 컴포넌트를 불러와 부모 컴포넌트에서 설정

```jsx 
MyComponent.jsx

import React from 'react';

const MyComponent = props => {
    return (
        <div>
            안녕하세요, 제 이름은 {props.name} 입니다
        </div>
    );
};

export default MyComponent;
```

```jsx
App.js

import React,{Component} from 'react'
import './App.css'
import MyComponent from './MyComponent'

class App extends Component{
  render(){
    const name='react'
    return <div><MyComponent name='리액트'/></div>;
  }
}

export default App;
```


--부모 컴포넌트에서 값을 지정 안할 때 디폴트 값 지정 가능
```jsx
import React from 'react';

const MyComponent = props => {
    return (
        <div>
            안녕하세요, 제 이름은 {props.name} 입니다
        </div>
    );
  
};
MyComponent.defaultProps={
    name:'설정안함'
    }

export default MyComponent;
```

1.1 children
- 컴포넌트를 사용할 때 컴포넌트 태그 사이의 내용을 보여 주는 props

```jsx
App.js

import React,{Component} from 'react'
import './App.css'
import MyComponent from './MyComponent'

class App extends Component{
  render(){
    const name='react'
    return <div><MyComponent>이 곳은 태그 사이의 내용</MyComponent></div>;
  }
}
export default App;
```

```jsx
MyComponent.jsx

import React from 'react';

const MyComponent = props => {
    return (
        <div>
            안녕하세요, 제 이름은 {props.name} 입니다<br/>
            /{props.children}/
        </div>
    );
  
};
MyComponent.defaultProps={
    name:'설정안함'
    }

export default MyComponent;
```

1.2 비구조화 할당
- props 값 조회 할 때 항상 키워드 붙이는데 더 편하게 할 수 있는 방법

```jsx
import React from 'react';

const MyComponent = props => {
    const {name,children}=props;
    return (
        <div>
            안녕하세요, 제 이름은 {name} 입니다<br/>
            /{children}/
        </div>
    );
  
};
MyComponent.defaultProps={
    name:'설정안함'
    }

export default MyComponent;
```

```jsx
import React from 'react';

const MyComponent = ({name,children}) => { 
    return (
        <div>
            안녕하세요, 제 이름은 {name} 입니다<br/>
            /{children}/
        </div>
    );
  
};
MyComponent.defaultProps={
    name:'설정안함'
    }

export default MyComponent;
```

1.3 propTypes를 통한 props검증
- 컴포넌트 필수 props를 지정, props의 타입을 지정 할 때 씀

```jsx
App.js

import React,{Component} from 'react'
import './App.css'
import MyComponent from './MyComponent'

class App extends Component{
  render(){
    const name='react'
    return <div><MyComponent name={1234} favoriteNumber={555}>이 곳은 태그 사이의 내용</MyComponent></div>;
  }
}
export default App;
```

```jsx
MyComponent.jsx

import React from 'react';
import PropTypes from 'prop-types'

const MyComponent = ({name, children, favoriteNumber}) => {
    return (
        <div>
            안녕하세요, 제 이름은 {name} 입니다<br/>
            /{children}/<br/>
            필수 숫자:{favoriteNumber}
        </div>
    );
  
};
MyComponent.defaultProps={
    name:'설정안함'
    }
MyComponent.propTypes={
    name:PropTypes.string, // 타입이 일치하지 않아도 값이 나타남, 콘솔에서 경고 메시지 출력
    favoriteNumber:PropTypes.number.isRequired
}

export default MyComponent;
```

1.4 클래스형 컴포넌트에서 props 사용하기
- 클래스형 컴포넌트에서는 render함수에서 this.props를 조회하면 된다

```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types'
class MyComponent extends Component {
    render() {
        const {name, favoriteNumber, children} = this.props// 비구조화 할당
        return (
            <div>
                안녕하세요 제 이름은 {name}
                아이 값은 {children}
                <br/>
                좋아하는 숫자는{favoriteNumber}
            </div>
        );
    }
}
MyComponent.defaultProps={
    name: '기본'
};

MyComponent.propTypes={
    name:PropTypes.string,
    favoriteNumber:PropTypes.number.isRequired
}

export default MyComponent;
```

- 클래스 내부에 지정하는 방법도 있다.
```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types'
class MyComponent extends Component {
    static defaultProps={
        name: '기본'
    }
    static propTypes={
        name:PropTypes.string,
        favoriteNumber: PropTypes.number.isRequired
    }
    render() {
        const {name, favoriteNumber, children} = this.props// 비구조화 할당
        return (
            <div>
                안녕하세요 제 이름은 {name}
                아이 값은 {children}
                <br/>
                좋아하는 숫자는{favoriteNumber}
            </div>
        );
    }
}

export default MyComponent;
```

2. state
- 리액트에서 state는 컴포넌트 내부에서 바뀔 수 있는 값

2.1 클래스형에서 state 쓰기
```jsx
App.js

import React from 'react';
import Counter from './Counter'

const App = () => {
  return (
    <div>
      <Counter/>
    </div>
  );
};

export default App;
```

```js
Counter.js

import React, { Component } from 'react';

class Counter extends Component {

    //컴포넌트에 state를 설정할 때는 constructor 메서드를 작성하여 설정
    constructor(props){
        super(props);   //클래스형 컴포넌트에서 constructor를 작성 할 때는 반드시 super(props)를 호출
                        //현재 클래스형 컴포넌트가 상속하고 있는 리액트의 Component 클래스가 지닌 생성자 함수 호출
        
        //state의 초깃값 설정하기, 컴포넌트의 state는 객체 형식이어야 한다
        this.state={
            number:0,
            fixedNumber:0
        }
    }
    render() {
        const{number,fixedNumber}=this.state;   //render 함수에서 현재 state를 조회할 때는 this.state로 조회
        return (
            <div>
                <h1>{number}</h1>
                <button onClick={
                    ()=>{this.setState({number:number+1})}  //this.setState 함수가 state 값을 바꿀 수 있게 해줌
                    }>
                    +1
                </button>
                <h1>바뀌지 않는 값:{fixedNumber}</h1>
            </div>
        );
    }
}

export default Counter;
```


```js
Counter.js
- 화살표 함수에서 값을 바로 반환하고 싶다면 코드 블록 {}를 생략
- 화살표 함수에서 바로 객체를 반환하려면 prevState=>({})

import React, { Component } from 'react';

class Counter extends Component {
       
    state={
        number:0,
        fixedNumber:0
    
}

render() {
    const {number,fixedNumber}=this.state;  
    return (
        <div>
            <h1>{number}</h1>
            <button 
            onClick={()=>{
                //this.setState({number:number+1}); 2씩 더해지지가 않는다
                //this.setState({number:number+1})
                this.setState(prevState=>{
                    return{
                        number:prevState.number+1
                    }
                });
                this.setState(prevState=>({
                    number:prevState.number+1
                }))
            }}>
                +1
            </button>

            <h1>바뀌지 않는 값:{fixedNumber}</h1>
        </div>
    );
}
}

export default Counter;
```

2.2 this.setState 가 끝난 후 특정 작업 실행하기
- setState의 두번째 파라미터로 콜백 함수를 등록하여 작업

```js
Counter.js

import React, { Component } from 'react';

class Counter extends Component {
       
    state={
        number:0,
        fixedNumber:0
    
}

render() {
    const {number,fixedNumber}=this.state;  
    return (
        <div>
            <h1>{number}</h1>
            <button 
            onClick={()=>{
                this.setState({number:number+1}, console.log('두번째인자'))
            }}
            >
                +1
            </button>

            <h1>바뀌지 않는 값:{fixedNumber}</h1>
        </div>
    );
}
}

export default Counter;
```

```javascript
*비구조화 할당
const array=[1,2]
const [one, two] = array;
```


2.3 함수형에서 state 쓰기

```js
App.js

import React from 'react';
import Say from './Say'

const App = () => {
  return (
    <div>
      <Say/>
    </div>
  );
};

export default App;
```

```js
Say.js

import React,{useState} from 'react';

const Say = () => {
    const [message,setMessage]=useState('');    //초기 값의 형태는 자유
    //함수를 호출 하면 배열이 반화느 첫 번째 원소는 현재 상태, 두번째 원소는 상태를 바꾸어주는 함수
    const onClickEnter=()=>setMessage('안녕하세요')
    const onClickLeave=()=>setMessage('잘가요')

    const [color, setColor]=useState('black')
    return (
        <div>
            <button onClick={onClickEnter}>입장</button>
            <button onClick={onClickLeave}>퇴장</button>
            <h1 style={{color}}>{message}</h1>
            <button style={{color:'red'}} onClick={()=>setColor('red')}> 
           {/*스타일 요소는 객체 형태로 넣어주어야 한다*/}
                빨간색
            </button>
            <button style={{color:'green'}} onClick={()=>setColor('green')}>
                초록
            </button>
            <button style={{color:'blue'}} onClick={()=>setColor('blue')}>
                파란
            </button>
        </div>
    );
};

export default Say;
```