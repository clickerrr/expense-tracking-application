import { useEffect, useState, useContext } from 'react'
import Navbar from "../organisms/Navbar";
import '../../styles/master.css';
import '../../styles/dashboard.css';
import editLogo from "../../assets/edit-icon.svg";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthenticationContext';
import ExpenseAdder from '../organisms/ExpenseAdder';
import { db } from '../../firebase-config';
import { getDocs, getDoc, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
  
  const navigate = useNavigate();
  const { loading, logOut, user } = useContext(AuthContext);
  const [expenseList, setExpenseList] = useState([]);
  const [newExpense, setNewExpense] = useState(null);
  const [yearDropdownEnabled, setYearDropdownEnabled] = useState(false);
  const [monthDropdownEnabled, setMonthDropdownEnabled] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [showExpenseAdder, setShowExpenseAdder] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);
  
  const [todos, setTodos] = useState([]);
 
  const categories = ["Food", "Gas", "Grocery", "Personal", "Subscriptions"];
  const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  let dates = []

  const fetchPost = async (year) => {
    await getDocs(collection(db, "expenses", user.uid, year))
      .then((querySnapshot)=>{               
          const newData = querySnapshot.docs.map( (doc) => { return {...doc.data(), docId: doc.id} });
          setExpenseList([...expenseList, ...newData]);
      }).catch( (error) => {console.log(error);})
  }

  const refreshExpenseList = async (year) => {
    await getDocs(collection(db, "expenses", user.uid, year))
      .then((querySnapshot)=>{               
          const newData = querySnapshot.docs.map( (doc) => { return {...doc.data(), docId: doc.id} });
          setExpenseList(newData);
      }).catch( (error) => {console.log(error);})
  }
    
  const addNewExpense = async (expenseItem) => {
    expenseItem.userId = user.uid;
    
    const docRef = await addDoc(collection(db, "expenses", user.uid, expenseItem.date.getFullYear().toString()), {
      name: expenseItem.name,
      amount: expenseItem.amount,
      category: expenseItem.category,
      date: expenseItem.date.toJSON(),
      userId: expenseItem.userId
    }).then( (newDoc) => {
      expenseItem.docId = newDoc.id;
      setExpenseList([...expenseList, expenseItem])
    }).catch( (error) => {console.log(error)});
      
  }

  const deleteExpense = async (expenseToDelete) => {

    const expenseYear = new Date(expenseToDelete.date).getFullYear();
    const docRef = await deleteDoc(doc(db, "expenses", expenseToDelete.userId.toString(), expenseYear.toString(), expenseToDelete.docId.toString()))
    .then( () => {deleteFromExpenseList(expenseToDelete)} ).catch( (error) => {console.error(error)});
  }

  const deleteFromExpenseList = (expense) => {
    let expenseListCopy = [...expenseList];
    let updatedExpenseList = expenseListCopy.filter( (data) => { return data.docId.toString() !== expense.docId.toString() });
    setExpenseList(updatedExpenseList);
  }
  
  useEffect(() => {
    if(user === null)
    {
      console.log("Redirecting");
      navigate("/login");
    }
    else {
      console.log("Fetching");
      fetchPost(new Date().getFullYear().toString());
    }
  },[user])
  
  const handleSelectYear = (yearIndex) => {
    setSelectedYear(years[yearIndex]);
    console.log(yearIndex);
    setYearDropdownEnabled(false);
  }

  const handleSelectMonth = (monthIndex) => {
    setSelectedYear(months[monthIndex]);
    console.log(monthIndex);
    setMonthDropdownEnabled(false);
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

  const renderMonths = () => {
    return months.map((element, id) => {
      return (
        <div className='year-entry' onClick={() => handleSelectMonth(id)}>
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
            
            <h3 className='expense-name'>{element.name}</h3>
            <div className='expense-content'>
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
            
            <div className='edit-delete'>
              <div>
                <button className="edit-logo"><img src={editLogo}/></button>
              </div>
              <div>
                <button disabled={!isDeleteMode} onClick={() => deleteExpense(element)}>Delete</button>
              </div>
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
              
              <h3 className='expense-name'>{element.name}</h3>
              <div className='expense-content'>
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
              
              <div className='edit-delete'>
                <div>
                  <button className="edit-logo"><img src={editLogo}/></button>
                </div>
                <div>
                  <button disabled={!isDeleteMode} onClick={() => deleteExpense(element)}>Delete</button>
                </div>
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
          <div>
            <label htmlFor="Delete Mode">Delete Mode</label>
            <input id="Delete Mode" name="Delete Mode" type="checkbox" onChange={() => setDeleteMode(!isDeleteMode)} value={isDeleteMode} />
          </div>
          <div className='header-button-row'>
            <div className='year-dropdown'>
              <button className='year-button' onClick={() => {setYearDropdownEnabled(!yearDropdownEnabled )}}>Year</button>
              {yearDropdownEnabled ? (<div className='year-content'>
                {renderYears()}
              </div>) : (<></>)}
            </div>
            <div className='year-dropdown'>
              <button className='year-button' onClick={() => {setMonthDropdownEnabled(!monthDropdownEnabled)}}>Month</button>
              {monthDropdownEnabled ? (<div className='year-content'>
                {renderMonths()}
              </div>) : (<></>)}
            </div>
          </div>
          <div className='expense-list-header'>
            <span>Expense Name</span>
            <span>Expense Date</span>
            <span>Expense Category</span>
            <span>Amount</span>
            <span>Options</span>
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
