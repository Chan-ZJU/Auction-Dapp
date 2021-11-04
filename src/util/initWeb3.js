let Web3 = require("web3");
let web3 = new Web3();
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
} else if (window.web3) {
  web3 = new Web3(web3.currenctProvider);
} else {
  alert("请先安装MetaMask!");
}
window.ethereum.enable();
module.exports = web3;
