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
  
  // TODO: Separate bloated component into smaller helper components
  // TODO: When filters are active, and a new expense is added that is not part of the filters, the displayed list wipes ? may have been resolved somehow?
  // TODO: Sort elements by latest to earliest date

  // MONTH ACCESSES: 1-12 NUMBER
  // YEAR: NUMBER

  const expenseCache = useRef(null);
  /*

    structure 
    year: {
      month 1-12: {

      }

    }

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
  const [isDeleteMode, setDeleteMode] = useState(false);
  const [years, setYears] = useState([]);
  
  // const [expenseCache, setExpenseCache] = useState(null);
  
  
  const categories = ["Food", "Gas", "Grocery", "Personal", "Subscriptions"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
  
  const cacheExpense = (expenseToCache) => { 

    let expenseCacheCopy = null;

    if(expenseCache.current == null) {
      expenseCacheCopy = {};      
    }
    else {
      expenseCacheCopy = expenseCache.current;
    }
    
    const expenseYear = expenseToCache.date.getFullYear();
    const expenseMonth = expenseToCache.date.getMonth() + 1;

    const subYear = expenseCacheCopy[expenseYear];
    if(subYear != undefined)
    {
      const subMonth = subYear[expenseMonth];
      if(subMonth != undefined)
      {
        // this check is in place because there is already a possibility of the element being in the array, and will repopulate because of react strict mode, since this is called by query and that does it twice through strict mode
        if(!expenseCacheCopy[expenseYear][expenseMonth].some(element => element.docId === expenseToCache.docId)) {
          expenseCacheCopy[expenseYear][expenseMonth] = [...expenseCacheCopy[expenseYear][expenseMonth], expenseToCache];
          expenseCache.current = expenseCacheCopy;
        }
      }
      else
      {
        expenseCacheCopy[expenseYear][expenseMonth] = [expenseToCache];
        expenseCache.current = expenseCacheCopy;
      }
    }
    else
    {
      let subMonth = {}
      subMonth[expenseMonth] = [expenseToCache];
      
      expenseCacheCopy[expenseYear] = subMonth;
      expenseCache.current = expenseCacheCopy;
    }

    console.log("New expense cached");
    console.log(expenseCacheCopy);
    
    refreshExpenseList();

  }

  const getExpensesByYearFromCache = (year) => {

    if(expenseCache.current == null) return [];
    let cacheMonths = expenseCache.current[year];
    let returnList = [];
    if(cacheMonths == null) return [];
    for (const property in cacheMonths) {
      returnList = [...returnList, ...cacheMonths[property]];
    }
    console.log("Get expense by year");
    console.log(returnList);
    return returnList;
  }

  const getExpensesByMonthFromCache = (year, month) => {
    if(expenseCache.current == null) return [];

    let currentCache = expenseCache.current;
    let cacheMonths = [];
    console.log("CACHE MONTHS GET EXPENSE BY MONTH");
    console.log(currentCache);

    if(currentCache[year])
    {
      console.log("found current year");
      if(currentCache[year][month])
      {
        cacheMonths = [...currentCache[year][month]];
      }
    }
    console.log("!!! CACHE MONTHS");
    console.log(cacheMonths);
    return cacheMonths;
  }

  const handleClearYear = () => {

    const expensesFilteredByYear = getExpensesByYearFromCache(new Date().getFullYear());
    setSelectedMonth(null);
    setSelectedYear(null);
    setExpenseList(expensesFilteredByYear);
    
  }

  const handleClearMonth = () => {

    const expensesFilteredByYear = getExpensesByYearFromCache(selectedYear);
    setSelectedMonth(null);
    setExpenseList(expensesFilteredByYear);
    
  }

  const deleteFromCache = (expense) => {
    const expenseDate = expense.date;
    const expenseYear = expenseDate.getFullYear();
    const expenseMonth = expenseDate.getMonth() + 1;
    console.log(expenseDate.getFullYear());
    let expenseCacheCopy = expenseCache.current;

    if(expenseCacheCopy[expenseYear])
    {
      if(expenseCacheCopy[expenseYear][expenseMonth])
      {
        const newArray  = expenseCacheCopy[expenseYear][expenseMonth].filter( element => { return element.docId !== expense.docId });  
        expenseCacheCopy[expenseYear][expenseMonth] = newArray;
        // TODO: remove from cache if this is the only element in the whole year
      }
    }
    
    console.log("!!! PRE CACHE DELETION UPDATE")
    console.log(expenseCache.current);

    expenseCache.current = expenseCacheCopy;
    
    console.log("!!! POST CACHE DELETION UPDATE")
    console.log(expenseCache.current);
  }

  const deleteExpense = async (expenseToDelete) => {
    const expenseYear = new Date(expenseToDelete.date).getFullYear();
    const docRef = await deleteDoc(doc(db, "expenses", expenseToDelete.userId.toString(), expenseYear.toString(), expenseToDelete.docId.toString()))
    .then( () => {deleteFromExpenseList(expenseToDelete); deleteFromCache(expenseToDelete)} ).catch( (error) => {console.error(error)});
  }

  const deleteFromExpenseList = (expense) => {
    let expenseListCopy = [...expenseList];
    let updatedExpenseList = expenseListCopy.filter( (data) => { return data.docId !== expense.docId });
    setExpenseList(updatedExpenseList);
  }

  

  // queries firebase for entries by year
  const queryFirebaseByYear = async (year) => {
    await getDocs(collection(db, "expenses", user.uid, year.toString()))
      .then((querySnapshot)=>{               
          const newData = querySnapshot.docs.map( (doc) => { 
            let documentData = doc.data()
            documentData.date = new Date(documentData.date);
            return {...documentData, docId: doc.id} });
          newData.forEach( (newElement, index) => {
            console.log("Query firebase by year caching element " + index);
            cacheExpense(newElement);
          })
          console.log("Post year query printing cache");
          console.log(expenseCache.current);
      }).catch( (error) => {console.log(error);})
  }

  const refreshExpenseList = () => {
    
    let refreshedExpenseList = []
    if(selectedMonth != null && selectedYear != null) { 
      refreshedExpenseList = getExpensesByMonthFromCache(selectedYear, selectedMonth);
    }
    else if(selectedMonth == null && selectedYear != null) {
      refreshedExpenseList = getExpensesByYearFromCache(selectedYear);
    }

    setExpenseList(refreshedExpenseList);

  }

  const updateYearMetadata = async (newYearArray, docRef) => {
    await setDoc(docRef, {metadata_years: newYearArray}).then( (result) => {console.log("Successfully updated years metadata")})
  }

  const getYearMetaData = async () => {
    const docRef = doc(db, "expenses", user.uid);
    return await getDoc(docRef).then ( (docResult) => {
      const storedYears = docResult.data().metadata_years;
      return storedYears;
    })
  }
    
  const addNewExpense = async (expenseItem) => {
    expenseItem.userId = user.uid;

    const year = expenseItem.date.getFullYear();
    
    const storedYears = await getYearMetaData().then( (storedYears) => {
      if(!storedYears.includes(year)) {
        const docRef = doc(db, "expenses", user.uid);
        const newYearArray = [...storedYears, year];
        newYearArray.sort();
        newYearArray.reverse();
        setYears(newYearArray);
        updateYearMetadata(newYearArray, docRef);
      }
      else
      {
        // console.log(storedYears);
      }

    } );


    const docRef = await addDoc(collection(db, "expenses", user.uid, year.toString()), {
      name: expenseItem.name,
      amount: expenseItem.amount,
      category: expenseItem.category,
      date: expenseItem.date.toJSON(),
      userId: expenseItem.userId
    }).then( (newDoc) => {
      expenseItem.docId = newDoc.id;
      cacheExpense(expenseItem);
    }).catch( (error) => {console.log(error)});
      
  }

  
  
  /*
    PAGE LOAD PROCESS:

    get the current year
    get all posts from the current year
    store the posts in the cache
    get the current month
    set filter for the current year and month
    

  */


  useEffect(() => {
    if(user === null)
    {
      console.log("Redirecting");
      navigate("/login");
    }
    else {

      // console.log("Fetching");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      queryFirebaseByYear(currentYear).then( () => {
        const monthList = getExpensesByMonthFromCache(currentYear, currentMonth);
        // console.log("USEEFFECT MONTH LIST")
        // console.log(monthList);
        setExpenseList(monthList);
      });
      getYearMetaData().then( (yearsList) => {
        yearsList.sort();
        yearsList.reverse()
        setYears(yearsList)
      })
    }
  },[user])

  const removeFromCache = (element) => {
    console.log("Element to remove from cache");
    console.log(element);
    let elementYear = element.date.getFullYear();
    let elementMonth = element.date.getMonth() + 1;

    if(expenseCache.current == null) return [];

    let cacheCopy = {...expenseCache.current};
    let expensesInCache = []
    if(cacheCopy[elementYear])
    {
      if(cacheCopy[elementYear][elementMonth])
      {
        expensesInCache = [...cacheCopy[elementYear][elementMonth]];
      }
    }
    else
    {
      return;
    }
    
    let updatedExpenseCache = expensesInCache.filter( (data) => { return data.docId.toString() !== element.docId.toString() });
    cacheCopy[elementYear][elementMonth] = updatedExpenseCache;
    
    expenseCache.current = cacheCopy;
    
  }
  
  const handleSelectYear = (yearIndex) => {

    const yearFromArray = years[yearIndex];
    setSelectedYear(yearFromArray);

    let expensesFilteredByYear = getExpensesByYearFromCache(yearFromArray);
    if(expensesFilteredByYear.length == 0)
    {
      // console.log("Fethching...");
      queryFirebaseByYear(yearFromArray.toString()).then( () => {
        expensesFilteredByYear = getExpensesByYearFromCache(yearFromArray);
        setExpenseList(expensesFilteredByYear);
      })
    }
    else
    {
      setExpenseList(expensesFilteredByYear);
    }
    
    setYearDropdownEnabled(false);
  }

  const handleSelectMonth = (monthIndex) => {
    
    setSelectedMonth(monthIndex + 1);
    
    const expensesFilteredByYearMonth = getExpensesByMonthFromCache(selectedYear, monthIndex + 1);
    setExpenseList(expensesFilteredByYearMonth);

    setMonthDropdownEnabled(false);
  }

  const renderYears = () => {
    
    return years.map((element, id) => {
      // console.log("RENDER YEARS");
      // console.log(element);
      // console.log(id);
      return (
        <div key={id} className='year-entry' onClick={() => handleSelectYear(id)}>
          <span className='year-entry-text'>{element}</span>
        </div>
      )
    })
  }

  const renderMonths = () => {
    return months.map((element, id) => {
      return (
        <div key={id} className='year-entry' onClick={() => handleSelectMonth(id)}>
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

        <div>
          <button onClick={() => removeFromCache(expenseList[0])}>Remove first element from the cache</button>

        </div>

        <div className="expense-list-container">
          <h2>This Year: {selectedYear !== null ? selectedYear : new Date().getFullYear().toString()}</h2>
          <h2>This Month: {selectedMonth !== null ? months[selectedMonth - 1] : months[new Date().getMonth()]}</h2>
          <div>
            <button onClick={() => {setShowExpenseAdder(!showExpenseAdder)}}>+</button>
          </div>
          <div>
            <label htmlFor="Delete Mode">Delete Mode</label>
            <input id="Delete Mode" name="Delete Mode" type="checkbox" onChange={() => setDeleteMode(!isDeleteMode)} value={isDeleteMode} />
          </div>
          <div className='header-button-row'>
            {selectedYear ? (<div><button onClick={() => {handleClearYear()}}>X {selectedYear}</button></div>) : (<></>)}
            {selectedMonth ? (<div><button onClick={() => {handleClearMonth()}}>X {months[selectedMonth - 1]}</button></div>) : (<></>)}
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
