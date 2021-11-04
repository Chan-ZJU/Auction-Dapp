window.addEventListener("load", function () {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts

    // detect Metamask account change
    window.ethereum.on("accountsChanged", function (accounts) {
      console.log("accountsChanges", accounts);
    });

    // detect Network account change
    window.ethereum.on("networkChanged", function (networkId) {
      console.log("networkChanged", networkId);
    });
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545")
    );
  }
});
