import React, { Component } from "react";
import Web3 from "web3";
import "./App.css"

class App extends Component{
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData()
  {
    const web3 = new Web3( "http://localhost:8545")
    const accounts = await web3.eth.getAccounts();
    const ver = await web3.version;
    this.setState({ account1: accounts[0],account2:accounts[1],version:ver })
  }

  constructor(props) {
    super(props);
    this.state = {account:''}
  }

  render() {
    return (
      <div className="container">
        <h1l>hello world</h1l>
        <p>your account: {this.state.account1},{this.state.account2}</p>
        <p>version: {this.state.version}</p>
      </div>
    );
  }
}

export default App;