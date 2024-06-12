import { useEffect, useState } from 'react'
import Navbar from "../organisms/Navbar";
import '../../styles/master.css';
import '../../styles/dashboard.css';
import randomDates from '../atoms/RandomDates';
import expenseList from '../atoms/ExpenseList';
import { render } from 'react-dom';
import { setEmitFlags } from 'typescript';

const Dashboard = () => {
  
  // const [expenseList, setExpenseList] = useState([]);
  const [yearDropdownEnabled, setYearDropdownEnabled] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  
  const categories = ["Food", "Gas", "Grocery", "Personal", "Subscriptions"];
  const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
  let dates = []

    
 
  const updateExpenseList = () => {

  }

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
        <div>
          <h1>Expenses</h1>
        </div>

        <div className="expense-list-container">
          <h2>This Year {selectedYear !== null ? selectedYear : "All"}</h2>
          <h2>This Month</h2>
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
