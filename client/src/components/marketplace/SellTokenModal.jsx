import Human from "../Human";
import { useState } from "react";
import style from "../../assets/css/marketplace.module.css";

function SellTokenModal(props) {
  const [tokenToSell, setTokenToSell] = useState({});
  const [buttonEnabled, setButtonEnabled] = useState(true);
  var price = 0.001;

  const onSellTokenClickModal = () => {
    if (price == null) return;
    if (price <= 0) return;

    props.onSellTokenClick(tokenToSell.id, price);
  };

  const onTokenClick = (e) => {
    let clickedToken = e.currentTarget;

    if (clickedToken == tokenToSell) {
      tokenToSell.classList.remove("active-token");
      setTokenToSell({});
      return;
    }

    tokenToSell.classList?.remove("active-token");
    clickedToken.classList.add("active-token");
    setTokenToSell(clickedToken);
  };

  const onPriceChange = (e) => {
    price = e.target.value;
    setButtonEnabled(price > 0 && tokenToSell.id != null);
  };

  return (
    <div
      className="modal fade"
      id="sellTokenModal"
      tabIndex="-1"
      aria-label="Pick a token to sell in marketplace"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body container">
            <div
              className={[style.tokenList, "row justify-content-center"].join(
                " "
              )}
            >
              {props.tokens.map((token, i) => (
                <div className="col-auto" key={i}>
                  <button
                    id={token.id}
                    className="button button-beige token-card"
                    onClick={onTokenClick}
                  >
                    <Human dna={token.dna} key={i} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            {tokenToSell.id ? (
              <>
                <p>
                  Sell NFT <span className="bold">#{tokenToSell.id}</span>{" "}
                </p>

                <div
                  className={[
                    "input-group has-validation",
                    style.ethInput,
                  ].join(" ")}
                >
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Price in ETH"
                    min="0.00001"
                    defaultValue={price}
                    onChange={onPriceChange}
                  />
                  <span className="input-group-text">ETH</span>
                </div>
              </>
            ) : (
              <></>
            )}
            <button
              type="button"
              className="button button-green"
              data-bs-dismiss="modal"
              aria-label="Sell token"
              onClick={onSellTokenClickModal}
              disabled={!buttonEnabled}
            >
              Sell NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellTokenModal;
