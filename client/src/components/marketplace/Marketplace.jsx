import useEth from "../../contexts/EthContext/useEth";
import { useState, useEffect } from "react";
import SellTokenModal from "./SellTokenModal";
import TokenGrid from "./TokenGrid";

function Marketplace() {
  const { account, tokens, createListing, listings, connectWallet } = useEth();
  const [sellableTokens, setSellableTokens] = useState([]);
  const [filter, setFilter] = useState("all");

  const getSellableTokens = () => {
    if (!tokens || !listings || !account) return;
    setSellableTokens(
      tokens.filter(
        (t) =>
          t.owner === account &&
          listings.find((l) => l.tokenId === t.id) == null
      )
    );
  };

  const toggleFilter = () => {
    switch (filter) {
      case "all":
        return <TokenGrid listings={listings} />;
      case "mine":
        return (
          <TokenGrid listings={listings.filter((l) => l.seller == account)} />
        );
      case "lowest":
        return (
          <TokenGrid
            listings={[...listings].sort(function (a, b) {
              return a.price - b.price;
            })}
          />
        );
      case "highest":
        return (
          <TokenGrid
            listings={[...listings].sort(function (a, b) {
              return b.price - a.price;
            })}
          />
        );

      default:
        return <TokenGrid listings={listings} />;
    }
  };

  const onSellTokenClick = async (id, price) => {
    await createListing(id, price);
  };

  useEffect(() => {
    getSellableTokens();
  }, [tokens.length, listings.length, account]);

  return (
    <>
      <div className="header-container text-center">
        <div>
          <h1>Marketplace</h1>
          {account ? (
            <>
              <p>Some text here maybe about something fun!</p>
              <button
                className="button button-black  margin-top-md"
                data-bs-toggle="modal"
                data-bs-target="#sellTokenModal"
              >
                Sell NFT
              </button>
            </>
          ) : (
            <>
              <p>Connect your wallet to start trading NFTs</p>
              <button className="button button-blue margin-top-md">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="Connect to metamask"
                  width="30px"
                  onClick={connectWallet}
                />{" "}
                Connect to metamask
              </button>
            </>
          )}
        </div>
      </div>
      {/* 
      <select
        className="form-select margin margin-top-md"
        aria-label="Filter tokens"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all" selected>
          All NFTS
        </option>
        <option value="mine">My NFTS</option>
        <option value="lowest">Price lowest to highest</option>
        <option value="highest">Price highest to lowest</option>
  </select> */}

      <div className="margin-top-sm">
        <TokenGrid listings={listings} />;
      </div>

      <SellTokenModal
        tokens={sellableTokens}
        onSellTokenClick={onSellTokenClick}
      />
    </>
  );
}

export default Marketplace;
