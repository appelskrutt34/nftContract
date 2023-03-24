import Human from "../Human";
import useEth from "../../contexts/EthContext/useEth";

function TokenGrid(props) {
  const { web3, account, tokens, removeListing, buyToken } = useEth();

  const onBuyTokenClick = async (id, price) => {
    await buyToken(id, price);
  };
  const onRemoveListingClick = async (id) => {
    await removeListing(id);
  };

  return (
    <div className="container-fluid center-horizontal">
      <div className="row justify-content-center max-width">
        {props.listings.map((listing, i) => (
          <div className="token-card col-auto text-left" key={listing}>
            <Human dna={tokens[listing.tokenId].dna} />
            <p className="bold">#{listing.tokenId}</p>
            <p>
              Price:{" "}
              <span className="bold">
                {" "}
                {web3?.utils.fromWei(listing.price)} ETH
              </span>
            </p>
            {listing.seller == account ? (
              <button
                className="button button-red token-card-button"
                onClick={() => onRemoveListingClick(listing.tokenId)}
                disabled={!account}
              >
                remove
              </button>
            ) : (
              <button
                className="button button-green token-card-button"
                onClick={() => onBuyTokenClick(listing.tokenId, listing.price)}
                disabled={!account}
              >
                buy
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenGrid;
