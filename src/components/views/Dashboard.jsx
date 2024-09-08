import { useEffect, useState, useContext, useRef } from 'react'
import Navbar from "../organisms/Navbar";
import '../../styles/master.css';
import '../../styles/dashboard.css';
import editLogo from "../../assets/edit-icon.svg";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthenticationContext';
import ExpenseAdder from '../organisms/ExpenseAdder';
import { db } from '../../firebase-config';
import { getDocs, setDoc, getDoc, collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

const Dashboard = () => {
  
  // TODO 9-6-24: Implement dynamic refreshing of the expense list to show in the view based on the cache!
  // Right now we have issues with the usestate variables not refreshing

  // MONTH ACCESSES: 1-12 NUMBER
  // YEAR: NUMBER

  const defaultYearList = [2024, 2023, 2021, 2022];
  const expenseCache = useRef(new Map());
  const varSelectedYear = useRef(new Date().getFullYear());
  const varSelectedMonth = useRef(new Date().getMonth() + 1);

  /*

    

    2024: {
      1: {
         [
          {expense},
          {expense},
          {expense}
        ]
      }
    }

    expenseCache[year][month][elementIndex]


    keep a store of all expenses cached
    keep a store of the current expenses in the array


  */

  const navigate = useNavigate();
  const { loading, logOut, user } = useContext(AuthContext);
  const [expenseList, setExpenseList] = useState([]);
  const [yearDropdownEnabled, setYearDropdownEnabled] = useState(false);
  const [monthDropdownEnabled, setMonthDropdownEnabled] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showExpenseAdder, setShowExpenseAdder] = useState(false);
  const [isEditingElement, setIsEditingElement] = useState(false);
  const [elementToEdit, setElementToEdit] = useState(null)
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [years, setYears] = useState(defaultYearList);
  
  // const [expenseCache, setExpenseCache] = useState(null);
  
  
  const categories = ["Food", "Gas", "Grocery", "Personal", "Subscriptions"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  
  /*
    PAGE LOAD PROCESS:

    get the current year
    get all posts from the current year
    store the posts in the cache
    get the current month
    set filter for the current year and month    

  */

  /*
    structure 
    year: {
      month 1-12: {

      }

    }
  */
 
  useEffect(() => {
    if(user === null)
    {
      console.log("Redirecting");
      navigate("/login");
    }
    else {

      let cache = expenseCache.current;

      let yearMap = new Map();

      const testExpense = {
        "docId": "1",
        "name": "testing",
        "amount": "500",
        "category": "food",
        "date": "2024-09-06T17:41:41.938Z",
        "uid": "1234",
      };


      let expensesArray = [testExpense];
      yearMap.set(9, expensesArray);
      
      const testExpense2 = {
        "docId": "2",
        "name": "testing",
        "amount": "500",
        "category": "food",
        "date": "2024-10-06T17:41:41.938Z",
        "uid": "1234",
      };

      let expensesArray2 = [testExpense2];
      yearMap.set(10, expensesArray2);

      cache.set(2024, yearMap);
      expenseCache.current = cache;

      console.log("~~~~CACHE~~~~~")
      console.log(expenseCache.current);
      console.log("~~~~~~~~~~~~~~");

      const testAdd = {
        "id": "3",
        "name": "testing",
        "amount": "500",
        "category": "food",
        "date": "2025-09-06T17:41:41.938Z",
        "uid": "1234",
      };

      refreshExpenseList();

    }
  },[user])

  const handleClearYear = () => {
    varSelectedMonth.current = null;
    varSelectedYear.current = new Date().getFullYear();
    setSelectedMonth(null);
    setSelectedYear(new Date().getFullYear());
    refreshExpenseList();
  }

  const handleClearMonth = () => {
    varSelectedMonth.current = null;
    setSelectedMonth(null);
    refreshExpenseList();
  }

  const refreshExpenseList = () => {
    
    console.log("~~~~REFRESHING~~~~~");
    console.log(selectedMonth);
    console.log(selectedYear);

    const currentMonth = varSelectedMonth.current;
    const currentYear = varSelectedYear.current;

    let refreshedExpenseList = []
    const cache = expenseCache.current
    if(currentMonth !== null && currentYear !== null) { 
      if(monthExistsInCache(currentYear, currentMonth)) 
      {
        console.log("Year and month setting!");
        const yearMap = cache.get(currentYear);
        const monthArr = yearMap.get(currentMonth);
        console.log(yearMap);
        console.log("Month arr")
        console.log(monthArr);
        refreshedExpenseList = [...monthArr];
      }
    }
    else if(currentMonth === null && currentYear !== null) {
      console.log("Checking year");
      if(yearExistsInCache(currentYear)) 
      {
        console.log("Year setting!");
        const yearMap = cache.get(currentYear);

        console.log(yearMap);
        // Creating a Iterator object
        const mapIterator = yearMap.values();
        console.log(mapIterator);
        // Getting values with iterator
        let i = 0;
        while (i < yearMap.size) {
          let val = mapIterator.next().value
          console.log(val);
          refreshedExpenseList = [...refreshedExpenseList, ...val];
          i++;
        }
      }
    }

    setExpenseList(refreshedExpenseList);
    console.log(refreshedExpenseList);
  }

  const yearExistsInCache = (year) => {
    const cache = expenseCache.current;

    let entry = cache.get(year);
    console.log(entry);
    return entry !== null && entry !== undefined;
  }

  const monthExistsInCache = (year, month) => {
    if(!yearExistsInCache(year)) return false;

    const cache = expenseCache.current;

    const yearEntry = cache.get(year);
    const monthEntry = yearEntry.get(month);
    return monthEntry !== null && monthEntry !== undefined; 
  }

  const entryExistsInCache = (expense) => {
    
    const expenseDate = new Date(expense.date);
    const eYear = expenseDate.getFullYear();
    const eMonth = expenseDate.getMonth() + 1;

    if(!monthExistsInCache(eYear, eMonth)) return false;

    const cache = expenseCache.current;

    const yearEntry = cache.get(eYear);
    const monthEntry = yearEntry.get(eMonth);

    return monthEntry.find( (element) => {return element.docId === expense.docId} );
  }
  
  const addToCache = (expenseToAdd) => {
    
    const expenseDate = new Date(expenseToAdd.date);
    
    const eYear = expenseDate.getFullYear();
    const eMonth = expenseDate.getMonth() + 1;

    if(expenseToAdd.docId === null || expenseToAdd.docId === undefined)
    {
      expenseToAdd.docId = String(expenseList.length + 1);
    }

    let cache = expenseCache.current;

    if(monthExistsInCache(eYear, eMonth))
    {
      let yearEntry = cache.get(eYear);
      let monthEntry = yearEntry.get(eMonth);
      
      monthEntry.push(expenseToAdd);
      
      expenseCache.current = cache;
    } 
    else if(yearExistsInCache(eYear))
    {
      let yearEntry = cache.get(eYear);
      let expenseArray = [expenseToAdd];
      yearEntry.set(eMonth, expenseArray);
      expenseCache.current = cache;
    }
    else
    {
      let expenseArray = [expenseToAdd];
      let yearMap = new Map();
      yearMap.set(eMonth, expenseArray);
      cache.set(eYear, yearMap);

      expenseCache.current = cache;
    }

    refreshExpenseList();


  }

  const removeEntryFromCache = (expenseToRemove) => {
    console.log(expenseToRemove);
    const expenseDate = new Date(expenseToRemove.date);
    
    const eYear = expenseDate.getFullYear();
    const eMonth = expenseDate.getMonth() + 1;
    
    let cache = expenseCache.current;

    let yearEntry = cache.get(eYear);
    console.log(yearEntry);
    let monthEntry = yearEntry.get(eMonth);

    if(monthEntry.length === 1)
    {
      if(cache.get(eYear).size === 1)
      {
        cache.delete(eYear);
      }
      yearEntry.delete(eMonth);
      
    }
    else
    {
      let newArray = monthEntry.filter( (element) => {return element.docId !== expenseToRemove.docId} );
      monthEntry = newArray;
    }

    expenseCache.current = cache;
    refreshExpenseList();

  }

  const updateExpenseInCache = (oldExpense, newExpense) => {
    removeEntryFromCache(oldExpense);
    addToCache(newExpense);
  }

  const addNewExpense = (newExpense) => {
    addToCache(newExpense);
    refreshExpenseList();
  }

  const deleteExpense = (expense) => {
    removeEntryFromCache(expense);
  }

  const updateExpense = (oldExpense, expenseToUpdate) => {
    updateExpenseInCache(oldExpense, expenseToUpdate);
    refreshExpenseList();
  }
  
  const handleSelectYear = (yearIndex) => {
    const yearFromArray = years[yearIndex];
    console.log("HANDLE SELECT YEAR");
    console.log(yearFromArray);
    varSelectedYear.current = yearFromArray;
    setSelectedYear(yearFromArray);
    setYearDropdownEnabled(false);
    refreshExpenseList();
  }

  const handleSelectMonth = (monthIndex) => {
    varSelectedMonth.current = monthIndex + 1;
    setSelectedMonth(monthIndex + 1);
    setMonthDropdownEnabled(false);
    refreshExpenseList();
  }

  const renderYears = () => {
    let sortedYears = years.sort();
    sortedYears = sortedYears.reverse();
    return sortedYears.map((element, id) => {
      // console.log("RENDER YEARS");
      // console.log(element);
      // console.log(id);
      return (
        <div key={id} className='year-entry' onClick={() => {handleSelectYear(id)}}>
          <span className='year-entry-text'>{element}</span>
        </div>
      )
    })
  }

  const renderMonths = () => {
    return months.map((element, id) => {
      return (
        <div key={id} className='year-entry' onClick={() => {handleSelectMonth(id)}}>
          <span className='year-entry-text'>{element}</span>
        </div>
      )
    })
  }

  const sortExpenseList = () => {
    let expenseListCopy = expenseList;
    expenseListCopy.sort( (a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    
    return expenseListCopy;
  }

  const renderListItems = () => {

    console.log("Rendering...");
    console.log("Current list: ")
    console.log(expenseList);

    const sortedExpenseList = sortExpenseList();

    return sortedExpenseList.map((element, id) => {
      let elementDate = new Date(element.date)
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
              <button className="edit-logo" onClick={() => {setIsEditingElement(true); setElementToEdit(element); setShowExpenseAdder(true) }}><img src={editLogo}/></button>
            </div>
            <div>
              <button disabled={!isDeleteMode} onClick={() => deleteExpense(element)}>Delete</button>
            </div>
          </div>
          
        </div> 
      )
        
    })
  }

  return (
    <div>
      <Navbar routes={[{name: "Dashboard", path: "/"}, {name: "Other", path: "/"}]}/>
      <div className="container">
        {showExpenseAdder ? 
          <ExpenseAdder 
            onClose={() => {setShowExpenseAdder(false); if(isEditingElement) {setIsEditingElement(false), setElementToEdit(null)} }} 
            onSubmitExpense={isEditingElement ? updateExpense : addNewExpense} 
            documentToEdit={elementToEdit}
              /> : (<></>)}
        <div>
          <h1>Expenses</h1>
        </div>
        
        <div>
          <button className='signout-button' onClick={logOut}>Sign Out</button>
        </div>

        <div>
          <button onClick={() => removeFromCache(expenseList[0])}>Remove first element from the cache</button>

        </div>

        <div className="expense-list-container">
          <h2>{selectedMonth !== null ? months[selectedMonth - 1] : months[new Date().getMonth()]} {selectedYear !== null ? selectedYear : new Date().getFullYear().toString()}</h2>
          <div>
            <button onClick={() => {setShowExpenseAdder(!showExpenseAdder)}}>+</button>
          </div>
          <div>
            <label htmlFor="Delete Mode">Delete Mode</label>
            <input id="Delete Mode" name="Delete Mode" type="checkbox" onChange={() => setDeleteMode(!isDeleteMode)} value={isDeleteMode} />
          </div>
          <div className='header-button-row'>
            {selectedYear ? (<div><button onClick={() => {handleClearYear()}}>{selectedYear} <span style={ {color: "red", fontWeight: "bold"}}>X</span></button></div>) : (<></>)}
            {selectedMonth ? (<div><button onClick={() => {handleClearMonth()}}>{months[selectedMonth - 1]} <span style={ {color: "red", fontWeight: "bold"}}>X</span></button></div>) : (<></>)}
          </div>
          <div className='header-button-row'>
            <div className='year-dropdown'>
              <button className='year-button' onClick={() => {setYearDropdownEnabled(!yearDropdownEnabled )}}>Year</button>
              {yearDropdownEnabled ? (<div className='year-content'>
                {renderYears()}
              </div>) : (<></>)}
            </div>
            {selectedYear ? (
              <div className='year-dropdown'>
                <button className='year-button' onClick={() => {setMonthDropdownEnabled(!monthDropdownEnabled)}}>Month</button>
                {monthDropdownEnabled ? (<div className='year-content'>
                  {renderMonths()}
                </div>) : (<></>)}
              </div>
            ) : (<></>)}
            
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




  

  


  // const filterExpensesByMonth = (monthFilter, allMonths) => {
  //   let monthFilteredExpenses = expenseList.filter( (element, id) => {
  //     if(new Date(element.date).getMonth() === monthFilter || allMonths) return element;
  //   })
  //   setExpenseList(monthFilteredExpenses);
  // }


  


  

}

export default Dashboard;
