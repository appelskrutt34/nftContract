class ContractApi {
  constructor(contract, web3) {
    this.contract = contract;
    this.web3 = web3;
  }

  //#region NFT
  createToken = async (dna) => {
    
    try {
      await this.contract.methods.createHuman(dna).send();
    } catch (error) {
      console.log("fail create token" + error);
    }
    
  };

  getToken = async (id) => {
    return await this.contract.methods.getHuman(parseInt(id)).call();
  };

  getAllTokens = async () => {
    let tokens = await this.contract.methods.getHumans().call();
    return tokens || [];
  };

  breed = async (tokenId1, tokenId2) => {
    await this.contract.methods
      .breedHuman(parseInt(tokenId1), parseInt(tokenId2))
      .send();
  };
  //#endregion
  //#region marketplace
  createListing = async (id, price) => {
    await this.contract.methods
      .createListing(parseInt(id), this.web3.utils.toWei(price))
      .send();
  };

  buyListing = async (id, price) => {
    await this.contract.methods.buy(parseInt(id)).send({ value: price });
  };

  getListing = async (id) => {
    return await this.contract.methods.getListing(parseInt(id)).call();
  };

  getAllListings = async () => {
    let listings = await this.contract.methods.getListings().call();
    return listings ||[];
  };

  removeListing = async (id) => {
    await this.contract.methods.removeListing(parseInt(id)).send();
  };
  //#endregion
}

export default ContractApi;
