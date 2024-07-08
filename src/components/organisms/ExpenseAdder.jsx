import { useState } from "react";
import "../../styles/expenseAdder.css";

const ExpenseAdder = ({onClose, addNewExpense}) => {

    const [name, setName] = useState("");

    const [amount, setAmount] = useState(0);

    const [category, setCategory] = useState("");

    const [date, setDate] = useState(new Date());
    const [dateDisplay, setDateDisplay] = useState("");

    const addExpense = () => {
        
        const newExpense = {name: name, amount: amount, category: category, date: date};
        console.log(newExpense);
        addNewExpense(newExpense);
    }

    return (
        <div className="adder-parent">
            <div className="adder-header">
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="adder-container">
                <input onChange={(event) => {setName(event.target.value)}} type="text" className="form-input" name="name" value={name} placeholder="Name"></input>
                <input onChange={(event) => {setAmount(event.target.value)}} type="number" className="form-input" name="amount" value={amount} placeholder="Amount"></input>
                <input onChange={(event) => {setCategory(event.target.value)}} type="text" className="form-input" name="category" value={category} placeholder="Category"></input>
                <input onChange={(event) => {setDateDisplay(event.target.value), setDate(new Date(event.target.value))}} type="date" className="form-input" name="name" value={dateDisplay} placeholder="Name"></input>
                <button onClick={() => addExpense()}>Submit</button>
            </div>
        </div>
    );
}

export default ExpenseAdder;