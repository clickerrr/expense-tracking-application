import { useState } from "react";
import "../../styles/expenseAdder.css";

const ExpenseAdder = ({onClose, addNewExpense}) => {

    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date());
    const [dateDisplay, setDateDisplay] = useState("");
    const [errorText, setErrorText] = useState("");
    

    const addExpense = () => {
        if((amount === null || amount <= 0)) {
            setErrorText("Please enter a valid positive number");
            return;
        }
        setErrorText("");
            
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
                <label htmlFor="name">Name</label>
                <input onChange={(event) => {setName(event.target.value)}} type="text" className="form-input" name="name" value={name} placeholder="Name"></input>
                <label htmlFor="amount">Amount<span className="red-text">*</span></label>
                <input onChange={(event) => {setAmount(event.target.value)}} type="number" className="form-input" name="amount" value={amount} placeholder="Amount"></input>
                <label htmlFor="category">Category</label>
                <input onChange={(event) => {setCategory(event.target.value)}} type="text" className="form-input" name="category" value={category} placeholder="Category"></input>
                <label htmlFor="date">Date</label>
                <input onChange={(event) => {setDateDisplay(event.target.value), setDate(new Date(event.target.value))}} type="date" className="form-input" name="date" value={dateDisplay}></input>
                <label>{errorText}</label>
                <button onClick={() => addExpense()}>Submit</button>
            </div>
            <div>
                <span>* signify required fields</span>
            </div>
        </div>
    );
}

export default ExpenseAdder;