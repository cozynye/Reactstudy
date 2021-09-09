Event
===
## 사용자가 웹 브라우저에서 DOM요소들과 상호 작용하는 것을 이벤트라고 한다.


1. 리액트의 이벤트 시스템
    1. 이벤트를 사용할 때 주의 사항
    - 이벤트 이름은 **카멜 표기법**으로 작성(ex. HTML의 onclick->리액트에서는 onClick)
    - 리액트에서는 이벤트에 실행할 함수 형태의 객체를 전달
    - DOM 요소에만 이벤트를 설정할 수 있다(ex. 직접 만든 MyComponent 컴포넌트에는 이벤트를 자체적으로 설정 할 수 없다)

    ```jsx
    # 렌더링 부분 외부에서 만들어 전달해도 됨

    const Say = () => {
    const [message,setMessage]=useState('');   
    const onClickEnter=()=>setMessage('안녕하세요')
   
    return (
        <div>
            <button onClick={onClickEnter}>입장</button>
            <h1 style={{color}}>{message}</h1>
        </div>
    );
    };
    ```

    ```jsx
    # 함수 형태 바로 전달해도 됨

    const Say = () => {
    const [message,setMessage]=useState('');
    const onClickLeave=()=>setMessage('잘가요')

    const [color, setColor]=useState('black')
    return (
        <div>
            <button onClick={()=>setMessage('안녕하세요')}>입장</button>
            <button onClick={onClickLeave}>퇴장</button>
            <h1 style={{color}}>{message}</h1>
        </div>
    );
    };
    ```
    - DOM 요소에만 이벤트를 설정 할 수 있다
        - div, button, input 등의 DOM 요소에는 이벤트 설정 가능
        - 직접 만든 컴포넌트에는 이벤트를 자체적으로 설정 불가
    ```jsx
    App.js에서 Say 컴포넌트에 자체적으로 이벤트 쓰는거 안됨

    const App = () => {
    const doSomething=()=>setMessage('잘가요')
    return (
         <div>
            <Say onClick={doSomething}/>    //이벤트 설정이 아니라 props를 전달해주는 것이다
         </div>
    );
    };
    ```
2. onChange 이벤트 핸들링하기
    1. ohChange 이벤트 설정
    ```js
    App.js

    import React from 'react';
    import EventPractice from './EventPractice'

    const App = () => {
    return (
        <div>
        <EventPractice/>
        </div>
    );
    };

    export default App;
    ```

    ```js
    EventPractice.js

    import React, { Component } from 'react';

    class EventPractice extends Component {
        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        onChange={
                            (e)=>{
                                console.log(e)
                            }
                        }
                    />
                </div>
            );
        }
    }

    export default EventPractice;
    ```
    - 콘솔에 기록되는 e는 SyntheticEvent(웹브라우저의 네이티브 이벤트를 감싸는 객체)의 인스턴스(입력값 x)

    2. state에 input 값 담기

    ```js
    App.js

    import React from 'react';
    import EventPractice from './EventPractice'

    const App = () => {
    return (
        <div>
        <EventPractice/>
        </div>
    );
    };

    export default App;
    ```

    ```js
    EventPractice.js
    import React, { Component } from 'react';

    class EventPractice extends Component {

        state={
            message:''
        }

        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        value={this.state.message}
                        onChange={
                            (e)=>{
                                this.setState({
                                    message:e.target.value
                                })
                            }
                        }
                    />
                </div>
            );
        }
    }

    export default EventPractice;
    ```

    3. 임의 메서드 만들기
        - 리액트에서는 이벤트를 실행할 때 함수 형태의 값을 전달
        - this와 바인딩하는 이유?
        -> 함수가 호출될 때 this는 호출부에 따라 결정, 클래스의 임의 메서드가 특정 HTML 요소의 이벤트로 등록되는 과정에서 메서드와 this의 관계가 끊어짐 -> this를 컴포넌트 자신으로 가리키기 위해 메서드를 this와 바인딩하는 작업이 필요(바인딩 하지 않으면 this가 undefined를 가리키게 된다)
    ```js
    App.js

    import React from 'react';
    import EventPractice from './EventPractice'

    const App = () => {
    return (
        <div>
        <EventPractice/>
        </div>
    );
    };

    export default App;
    ```

    ```js
    EventPractice.js

    import React, { Component } from 'react';

    class EventPractice extends Component {

        state={
            message:''
        }

        constructor(props){
            super(props);
            this.handleChange=this.handleChange.bind(this)
            this.handleClick=this.handleClick.bind(this)
        }
        handleChange(e){
            this.setState({
                message : e.target.value
            })
        }
        handleClick(){
            alert(this.state.message);
            this.setState({
                message:''
            })
        }

        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        value={this.state.message}
                        onChange={this.handleChange }
                    />
                    <button onClick={this.handleClick}>확인</button>
                </div>
            );
        }
    }

    export default EventPractice;
    ```
    
    
    4. Property Initializer Syntax를 사용한 메서드 작성
        - 메서드 바인딩은 생성자 메서드에서 하는 것이 정석<br/>
        하지만 새 메서드 만들 때 마다 constructor 수정해야 하기 때문에 바벨의 transform-class-properties 문법을 사용하여 화살표 함수 형태로 메서드 정의 가능

    ```js
    EventPractice.js
    import React, { Component } from 'react';

    class EventPractice extends Component {

        state={
            message:''
        }

        handleChange=(e)=>{
            this.setState({
                message : e.target.value
            })
        }
        handleClick=(e)=>{
            alert(this.state.message);
            this.setState({
                message:''
            })
        }

        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        value={this.state.message}
                        onChange={this.handleChange }
                    />
                    <button onClick={this.handleClick}>확인</button>
                </div>
            );
        }
    }

    export default EventPractice;
    ```

    5. input 여러 개 다루기
    - event 객체를 활용하여(e.target.name) input 여러개 다루기

    ```js
    import React, { Component } from 'react';

    class EventPractice extends Component {

        state={
            message:'',
            username:''
        }

        handleChange=(e)=>{
            this.setState({
                [e.target.name]:e.target.value  //객체 안에서 key를 []로 감싸면 그 안에 넣은 레퍼런스가 가리키는 실제 값이 key 값으로 사용
            })
        }
        handleClick=(e)=>{
            alert(this.state.username+': '+this.state.message);
            this.setState({
                message:'',
                username:''
            })
        }

        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='username'
                        placeholder='사용자명'
                        value={this.state.username}
                        onChange={this.handleChange }
                    />
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        value={this.state.message}
                        onChange={this.handleChange }
                    />
                    <button onClick={this.handleClick}>확인</button>
                </div>
            );
        }
    }

    export default EventPractice;
    ```

    6. onKeyPress 이벤트 핸들링

    - 두번째 텍스트 인풋에서 enter 누르면 handleClick 메서드가 실행 됨

    ```js
    import React, { Component } from 'react';

    class EventPractice extends Component {

        state={
            message:'',
            username:''
        }

        handleChange=(e)=>{
            this.setState({
                [e.target.name]:e.target.value  
            })
        }
        handleClick=(e)=>{
            alert(this.state.username+': '+this.state.message);
            this.setState({
                message:'',
                username:''
            })
        }
        handleKeyPress=(e)=>{
            if(e.key ==='Enter'){
                this.handleClick();
            }
        }

        render() {
            return (
                <div>
                    <h1>이벤트 연습</h1>
                    <input
                        type="text"
                        name='username'
                        placeholder='사용자명'
                        value={this.state.username}
                        onChange={this.handleChange }
                    />
                    <input
                        type="text"
                        name='message'
                        placeholder='아무것이나 입력'
                        value={this.state.message}
                        onChange={this.handleChange }
                        onKeyPress={this.handleKeyPress}
                    />
                    <button onClick={this.handleClick}>확인</button>
                </div>
            );
        }
    }

    export default EventPractice;
    ```
3. 함수형 컴포넌트로 구현하기
    ```js
    import React,{useState} from 'react';

    const EventPractice = () => {
        const [username,setUsername]=useState('');
        const [message, setMessage]=useState('');
        const onChangeUsername = e => setUsername(e.target.value);
        const onChangeMessage = e => setMessage(e.target.value);
        const onClick=()=>{
            alert(username+': '+message);
            setUsername('');
            setMessage('');
        }
        const onKeyPress = e =>{
            if(e.key==='Enter'){
                onClick();
            }
        }
        return (
            <div>
                <h1>이벤트 연습</h1>
                <input
                    type="text"
                    name="username"
                    placeholder="사용자명"
                    value={username}
                    onChange={onChangeUsername}
                />
                <input
                    type="text"
                    name="message"
                    placeholder="입력하시오"
                    value={message}
                    onChange={onChangeMessage}
                    onKeyPress={onKeyPress}
                />
                <button onClick={onClick}>확인</button>
            </div>
        );
    };

    export default EventPractice;
    ```