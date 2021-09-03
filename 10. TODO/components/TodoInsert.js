import React, { useCallback, useState } from 'react';
import {MdAdd} from 'react-icons/md'
import './TodoInsert.scss';

const TodoInsert = ({onInsert}) => {
    const [value, setValue]=useState('');

    const onChange = useCallback(e=>{
        setValue(e.target.value)
    },[]);//한 번만 함수를 만들고 재사용 하도록(리렌더링 될 때마다 새로 만드는게 아닌)

    const onSubmit=useCallback(
        e=>{
            onInsert(value);
            setValue('')
            e.preventDefault();// submit 이벤트를 새로고침 발생시키기 때문에 이를 방지하기 위해 함수 호출
        },
        [onInsert, value],
    )

    return (
        <div>
            <form className="TodoInsert" onSubmit={onSubmit}>
                <input placeholder="할 일을 입력하세요"
                    value={value}
                    onChange={onChange}
                />
                    <button type="submit">
                        <MdAdd/>
                    </button>
            </form>
        </div>
    );
};

export default TodoInsert;