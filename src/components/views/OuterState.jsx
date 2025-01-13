import { useState } from "react";
import EntryComponent from "./EntryComponent"

const OuterState = () => {
    // const [expenseCache, setExpenseCache] = useState(new Map());
    
    const [expenseCache, setExpenseCache] = useState(new Map());

    return (
        <EntryComponent expenseCache={expenseCache} setExpenseCache={setExpenseCache}/>
    )
}

export default OuterState;