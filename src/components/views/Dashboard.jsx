import { useEffect, useState, useContext } from 'react'
import Navbar from "../organisms/Navbar";
import '../../styles/master.css';
import '../../styles/dashboard.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthenticationContext';
import ExpenseAdder from '../organisms/ExpenseAdder';
import { db } from '../../firebase-config';
import { getDocs, collection, addDoc } from 'firebase/firestore';

const Dashboard = () => {
  
  const navigate = useNavigate();
  const { loading, logOut, user } = useContext(AuthContext);
  const [expenseList, setExpenseList] = useState([]);
  const [newExpense, setNewExpense] = useState(null);
  const [yearDropdownEnabled, setYearDropdownEnabled] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showExpenseAdder, setShowExpenseAdder] = useState(false);
  
  const [todos, setTodos] = useState([]);
 
  const fetchPost = async (year) => {
    await getDocs(collection(db, "expenses", user.uid, year))
      .then((querySnapshot)=>{               
          const newData = querySnapshot.docs.map( (doc) => { return {...doc.data(), docId: doc.id} });
          console.log(newData);
          console.log(`FETCHPOST Current Expense List `);
          console.log(expenseList);
          setExpenseList([...expenseList, ...newData]);
          // setExpenseList([...expenseList, ...sampleExpenseList]);
      }).catch( (error) => {console.log(error);})
  }
    
  const addNewExpense = async (expenseItem) => {
    
    console.log(user.uid)
    console.log(expenseItem);
    
    // Add a new document with a generated id.
    const docRef = await addDoc(collection(db, "expenses", user.uid, expenseItem.date.getFullYear().toString()), {
      name: expenseItem.name,
      amount: expenseItem.amount,
      category: expenseItem.category,
      date: expenseItem.date.toJSON(),
      userId: user.uid,
    }).then( () => {fetchPost(new Date().getFullYear().toString())}).catch( (error) => {console.log(error)});
      
  }
   
  useEffect(()=>{
      
      fetchPost(new Date().getFullYear().toString());
  }, [])


  const categories = ["Food", "Gas", "Grocery", "Personal", "Subscriptions"];
  const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
  let dates = []
  
  useEffect(()=>{
    // console.log(user);
    
    if(user === null)
    {
      console.log("Redirecting");
      navigate("/login");
    }
  },[user])
  
  const handleSelectYear = (yearIndex) => {
    setSelectedYear(years[yearIndex]);
    console.log(yearIndex);
    setYearDropdownEnabled(false);
  }

  const renderYears = () => {
    return years.map((element, id) => {
      return (
        <div className='year-entry' onClick={() => handleSelectYear(id)}>
          <span className='year-entry-text'>{element}</span>
        </div>
      )
    })
  }


  const renderListItems = () => {
    
    
    if(!selectedYear)
    {
      return expenseList.map((element, id) => {
        let elementDate = new Date(element.date)
        console.log(element);
        console.log(elementDate.getFullYear());
        console.log(selectedYear);
        return( 
          <div key={id} className="element">
            <div>
              <h3>{element.name}</h3>
            </div>
            <div>
              <span>{`${elementDate.getMonth() + 1}-${elementDate.getDate()}-${elementDate.getFullYear()}`}</span>
            </div>
            <div>
              <span>{`${element.category}`}</span>
            </div>
            <div>
              <span>{`$${element.amount}`}</span>
            </div>
          </div> 
        )
      })
    }
    else {
      return expenseList.map((element, id) => {
        let elementDate = new Date(element.date)
        console.log(element);
        console.log(elementDate.getFullYear());
        console.log(selectedYear);
        if(elementDate.getFullYear() == selectedYear)
        {
          return(
            <div key={id} className="element">
              <div>
                <h3>{element.name}</h3>
              </div>
              <div>
                <span>{`${elementDate.getMonth() + 1}-${elementDate.getDate()}-${elementDate.getFullYear()}`}</span>
              </div>
              <div>
                <span>{`${element.category}`}</span>
              </div>
              <div>
                <span>{`$${element.amount}`}</span>
              </div>
            </div> 
          )
        }
        else
        {
          return(<></>)
        }
        
      })
    }
  }

  return (
    <div>
      <Navbar routes={[{name: "Dashboard", path: "/"}, {name: "Other", path: "/"}]}/>
      <div className="container">
        {showExpenseAdder ? <ExpenseAdder onClose={() => setShowExpenseAdder(false)} addNewExpense={addNewExpense}/> : (<></>)}
        <div>
          <h1>Expenses</h1>
        </div>
        
        <div>
          <button className='signout-button' onClick={logOut}>Sign Out</button>
        </div>

        <div className="expense-list-container">
          <h2>This Year {selectedYear !== null ? selectedYear : "All"}</h2>
          <h2>This Month</h2>
          <div>
            <button onClick={() => {setShowExpenseAdder(!showExpenseAdder)}}>+</button>
          </div>
          <div className='header-button-row'>
            <div className='year-dropdown'>
              <button className='year-button' onClick={() => {setYearDropdownEnabled(!yearDropdownEnabled )}}>Year</button>
              {yearDropdownEnabled ? (<div className='year-content'>
                {renderYears()}
              </div>) : (<></>)}
            </div>
          </div>
          <div className='expense-list-header'>
            <span>Expense Name</span>
            <span>Expense Category</span>
            <span>Amount</span>
          </div>
          <div className='list-of-expenses'>
            {renderListItems()}
          </div>
        </div>

        <div>
          <p>Add expense</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
