import "../../styles/expenseAdder.css";

const ExpenseAdder = ({onClose}) => {
    return (
        <div className="adder-parent">
            <div className="adder-header">
                <button className="close-button" onClick={onClose}>X</button>
            </div>
            <div className="adder-container">
                
            </div>
        </div>
    );
}

export default ExpenseAdder;