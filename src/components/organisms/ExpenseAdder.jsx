import "../../styles/expenseAdder.css";
import { useEffect, useState } from "react";

const ExpenseAdder = ({onClose, onSubmitExpense, documentToEdit}) => {
    
    const [name, setName] = useState("");
    const [amount, setAmount] = useState(0);
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(new Date());
    const [dateDisplay, setDateDisplay] = useState("");
    const [errorText, setErrorText] = useState("");

    useEffect( () => {

        if(documentToEdit) {
            console.log("Editing element");
            const docId = documentToEdit.docId;
            if(docId) {
                
                const currentName = documentToEdit.name;
                const currentAmount = documentToEdit.amount;
                const currentCat = documentToEdit.category;
                const currentDate = new Date(documentToEdit.date);

                currentName ? setName(currentName) : setName("");
                currentAmount ? setAmount(currentAmount) : setAmount(0);
                currentCat ? setCategory(currentCat) : setCategory("");
                currentDate ? (setDate(currentDate), setDateDisplay(currentDate.toISOString().substring(0,10))) : (null);
            }
        }
 
    }, [])

    const addExpense = () => {
        if((amount === null || amount <= 0)) {
            setErrorText("Please enter a valid positive number");
            return;
        }
        setErrorText("");

        if(documentToEdit) {
            if(documentToEdit.docId)
            {
                console.log("Passing edited document");
                const editedDocument = {name: name, amount: amount, category: category, date: date, userId: documentToEdit.userId, docId: documentToEdit.docId};
                onClose();
                onSubmitExpense(documentToEdit, editedDocument);
                return;
            }
        }
        
        console.log("ADDING NEW EXPENSE IN EXPENSE ADDER");
        console.log(date);
        const newExpense = {docId: null, name: name, amount: amount, category: category, date: date, userId: null};
        console.log(newExpense);
        
        onClose();
        onSubmitExpense(newExpense);
    }

    return (
        <div className="adder-parent">
            <div className="adder-header">
                <button className="close-button" onClick={() => {console.log(onClose); onClose()}}>X</button>
            </div>
            <div className="adder-container">
                <label htmlFor="name">Name</label>
                <input onChange={(event) => {setName(event.target.value)}} type="text" className="form-input" name="name" value={name} placeholder="Name"></input>
                <label htmlFor="amount">Amount<span className="red-text">*</span></label>
                <input onChange={(event) => {setAmount(event.target.value)}} type="number" className="form-input" name="amount" value={amount} placeholder="Amount"></input>
                <label htmlFor="category">Category</label>
                <input onChange={(event) => {setCategory(event.target.value)}} type="text" className="form-input" name="category" value={category} placeholder="Category"></input>
                <label htmlFor="date">Date</label>
                <input onChange={(event) => {setDateDisplay(event.target.value), console.log(event.target.value), setDate(new Date(event.target.value + "T00:00:00"))}} type="date" className="form-input" name="date" value={dateDisplay}></input>
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