import React,{useReducer} from 'react';

function reducer(state, action) {
    //action.type에 따라 다른 작업 수행
    switch(action.type){
        case 'INCREMENT' :
            return {value : state.value + 1};
        case 'DECREMENT' :
            return { value : state.value -1};
        dafault :
            return state;
    }
}

const Counter = () => {
    const [state,dispach]=useReducer(reducer, {value:0});   
    return (
        <div>
            <p>
                현재 카운터값은<b>{state.value}</b>입니다.
            </p>
            <button onClick={()=> dispach({type : 'INCREMENT'})}>+1</button>
            <button onClick={()=> dispach({type : 'DECREMENT'})}>-1</button>

        </div>
    );
};

export default Counter;