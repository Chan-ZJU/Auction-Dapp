import React, { Component } from "react";
import Home from './ui/ui'
import "./App.css"

let web3 = require('./util/initWeb3')
let auctionInstance = require('./eth/auction')
let NFTinstance = require('./eth/auctionNFT')

class App extends Component{
  //pass to ui props
  constructor(props) {
    super(props);
    this.state = {
      account: '',

    }
  }

  componentDidMount() {
  }

  async componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData()
  {
    let accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
  }

  render() {
    return (
      <div>
        <p>hello {this.state.account}</p>
        <p>铸造NFT</p>
        
        
        <form onSubmit={(event) => {
          event.preventDefault()
          var price = document.getElementById("p").value 
          var limit = document.getElementById("i").value 
          this.state.contract.methods.addArtItem(price, this.state.ipfsHash, limit).send({ from: this.state.account }) 
        }}>
          <label>
          Price:
          <input id="p" type="number" name="price" />
          </label>
          <label>
            Increment
          <input id="i" type="number" name="limit" />
          </label>
          <input type='submit' />
        </form>  
      </div>
    );
  }
}

export default App;