import React from "react";
import { useState } from "react";
// import changeNumber from "./redux/reducers/incdec";
import { incNumber, decNumber } from "./redux/actions/data";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Data = () => {
  const [todo, setTodo] = useState("");
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  const changedNumber = useSelector((state) => state.changeNumber);
  const dispatch = useDispatch();
  return (
    <>
      <div>
        <button onClick={() => dispatch(incNumber())}> + </button>
        <input type="text" value={changedNumber} />
        <button onClick={() => dispatch(decNumber())}> - </button>
      </div>
    </>
  );
};

export default Data;
