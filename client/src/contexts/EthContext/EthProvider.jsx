import React, { useEffect, useState } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import ContractApi from "../../api/ContractApi";

function EthProvider({ children }) {
  const [tokens, setTokens] = useState([]);
  const [listings, setListings] = useState([]);
  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [web3, setWeb3] = useState();
  const [contractApi, setContractApi] = useState();
  const artifact = require("../../contracts/MarketPlace.json");

  const autoConnectWallet = async () => {
    const accounts = window.ethereum.request({ method: "eth_accounts" });
    

    if (accounts) {
      return await connectWallet();
    }
    return false;
  };

  const connectWallet = async () => {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const _web3 = new Web3(window.ethereum);
    const _accounts = await _web3.eth.requestAccounts();
    _web3.eth.handleRevert = true;

    // const networkID = await web3.eth.net.getId();
    try {
      const _contract = new _web3.eth.Contract(
        artifact.abi,
        artifact.networks[5777].address,
        { from: _accounts[0] }
      );

      const _contractApi = new ContractApi(_contract, _web3);
      const _listings = await _contractApi.getAllListings();
      const _tokens = await _contractApi.getAllTokens();
      setTokens(_tokens);
      setContract(_contract);
      setContractApi(_contractApi);
      setWeb3(_web3);
      setListings(_listings);
      setAccount(_accounts[0]);
    } catch (err) {
      console.log("wrong network");
      console.error(err);
      return false;
    }

    return true;
  };

  const connectContractWithoutWallet = async () => {
    if (!window.ethereum) return;
    const _web3 = new Web3(window.ethereum);
    try {
      const _contract = new _web3.eth.Contract(
        artifact.abi,
        artifact.networks[5777].address
      );
      const _tokens = await new ContractApi(_contract).getAllTokens();
      setTokens(_tokens);
    } catch (err) {
      console.log("wrong network");
      console.error(err);
    }
  };
  useEffect(() => {
    const tryInit = async () => {
      let success = await autoConnectWallet();
      if (success) return;

      connectContractWithoutWallet();
    };
  
    tryInit();

    const events = ["chainChanged", "accountsChanged"];
    events.forEach((e) => window.ethereum.on(e, connectWallet));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, connectWallet));
    }; 
  }, []);

  useEffect(() => {
    if (!contract) return;
    listenForTokenEvents();
    listenForMarketplaceEvents();

    return () => {
      contract.events
        .Breed()
        .removeListener("data", onBreed)
        .removeListener("error", function (error) {
          console.log(error);
        });
      contract.events
        .ListingCreated()
        .removeListener("data", onListingCreated)
        .removeListener("error", function (error) {
          console.log(error);
        });
      contract.events
        .ListingEnded()
        .removeListener("data", onListingEnded)
        .removeListener("error", function (error) {
          console.log(error);
        });
    };
  }, [contract]);

  //#region token
  const createToken = async (dna) => {
    try {
      await contractApi.createToken(dna);
    } catch (error) {
      console.log(error);
    }
  };
  const getToken = async (id) => {
    try {
      return await contractApi.getToken(id);
    } catch (error) {
      console.log(error);
    }
  };

  const breed = async (id1, id2) => {
    try {
      await contractApi.breed(id1, id2);
    } catch (error) {
      console.log(error);
    }
  };

  const listenForTokenEvents = () => {
    contract.events
      .Breed()
      .on("data", onBreed)
      .on("error", function (error) {
        console.log(error);
      });
  };

  const onBreed = async (event) => {
    try {
      let newToken = await getToken(event.returnValues.tokenId);
      setTokens((tokens) => [...tokens, newToken]);
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region marketplace
  const createListing = async (id, price) => {
    try {
      await contractApi.createListing(id, price);
    } catch (error) {
      console.log(error);
    }
  };

  const buyToken = async (id, price) => {
    try {
      await contractApi.buyListing(id, price);
    } catch (error) {
      console.log(error);
    }
  };

  const removeListing = async (id) => {
    try {
      await contractApi.removeListing(id);
    } catch (error) {
      console.log(error);
    }
  };
  const listenForMarketplaceEvents = () => {
    contract.events
      .ListingCreated()
      .on("data", onListingCreated)
      .on("error", function (error) {
        console.log(error);
      });
    contract.events
      .ListingEnded()
      .on("data", onListingEnded)
      .on("error", function (error) {
        console.log(error);
      });
  };

  const onListingCreated = async (event) => {
    try {
      let newListing = await contractApi.getListing(event.returnValues.tokenId);
      setListings((listings) => [...listings, newListing]);
    } catch (error) {
      console.log(error);
    }
  };

  const onListingEnded = async (event) => {
    setListings((listings) =>
      listings.filter((l) => l.tokenId != event.returnValues.tokenId)
    );
  };
  //#endregion

  return (
    <EthContext.Provider
      value={{
        web3,
        account,
        tokens,
        listings,
        createToken,
        getToken,
        breed,
        createListing,
        removeListing,
        buyToken,
        connectWallet,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
