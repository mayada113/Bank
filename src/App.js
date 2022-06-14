import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Operations from './components/Operations';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
const axios = require('axios')


class App extends Component {
  constructor() {
    super();
    this.state = {
      transactions:[]
    }
  }

  Home() {
    let color
    this.balance() >= 0 ? color = "green" : color = "red"
    return(
      <div className="home">
        <h1>Welcome to your Bank</h1>
      <div className="balance">
       <h2> Balance: <span className={color}>{this.balance()}</span></h2>
      </div>
      </div>
    )
  }

  getTransactions = async () => {
    const res = await axios.get('http://localhost:8080/transactions')
    this.setState({transactions: res.data})

  }

  async componentDidMount() {
    this.getTransactions()
  }

  add = async (trans, sign) =>
  {
    let amount 
    (sign === "-") ? amount = -trans.amount : amount = trans.amount
    await axios.post('http://localhost:8080/transaction', {
      transaction: {
        amount: amount,
        vendor: trans.vendor,
        category: trans.category
      }
    })
    this.getTransactions()
  }
  async removeTransactionFromDB(id) {
    await axios.delete(`http://localhost:4200/transaction/${id}`)
    const index = this.state.transactions.findIndex(d => d._id === id)
    if (index !== -1) this.props.transactions.splice(index, 1);
  }

  remove = (id) => {
    let tempArr = [...this.state.transactions]
    tempArr.splice(tempArr.findIndex(d => id === d._id), 1)
    this.setState({
      transactions: tempArr
    }, this.getBalance)
    this.removeTransactionFromDB(id)
  }

  numOfCategories(){
    let categories = {}
    for(let t of this.state.transactions){
      if(t.category in categories){
        categories[t.category]++
      }else {
        categories[t.category] = 1
      }
    }
    return categories
  }

  balance(){
    let sum = 0
    for(let t of this.state.transactions){
      sum += t.amount
    }
    return sum
  }



  render() {
    return (
      <div className="App">
      <Router>
        <div className="App">
          <div className="nav-wrapper">
            <div className="left-side">
              <div className="nav-link-wrapper">
                <Link to="/">home</Link>
              </div>
              <div className="nav-link-wrapper">
               <Link to="/operations"> Operations </Link>
              </div>
              <div className="nav-link-wrapper">
                <Link to="/transactions">Transactions</Link>
              </div>
              <div className="nav-link-wrapper">
                <Link to="/categories">categories</Link>
              </div>
            </div>
          </div>
        </div>
      <div>
        <Route path="/" exact render={() => this.Home()}></Route>
        <Route path="/transactions" exact render={() => <Transactions data={this.state.transactions} delete={this.remove}/>}></Route>
        <Route path="/operations" exact render={() => <Operations add={this.add} />}></Route>
        <Route path="/categories" exact render={() => <Categories categories={this.numOfCategories()} />}></Route>
      </div>
    </Router>
    </div>

    )
  }
}

export default App;
