import useEth from "../../contexts/EthContext/useEth";
import { useState, useEffect } from "react";
import Human from "../Human";

function MyTokens() {
  const { account, tokens, breed } = useEth();
  const [myTokens, setMyTokens] = useState([]);
  const [chosenTokens, setChosenTokens] = useState([]);

  const getMyTokens = () => {
    if (!tokens || tokens.length == 0) return;
    setMyTokens(tokens.filter((t) => t.owner === account));
  };

  const toggleChosenToken = (e) => {
    let clickedToken = e.currentTarget;

    if (chosenTokens.includes(clickedToken.id)) {
      setChosenTokens(chosenTokens.filter((id) => id !== clickedToken.id));
      clickedToken.classList.remove("active-token");
      return;
    }

    if (chosenTokens.length == 2) {
      let popped = chosenTokens.pop();
      document.getElementById(popped).classList.remove("active-token");
      setChosenTokens(chosenTokens.filter((id) => id !== popped));
    }

    setChosenTokens([clickedToken.id, ...chosenTokens]);
    clickedToken.classList.add("active-token");
  };

  const onBreedClick = async () => {
   breed(chosenTokens[0], chosenTokens[1]);
  };

  useEffect(() => {
    getMyTokens();
  }, [tokens.length, account]);

  return (
    <>
      <div className="header-container text-center">
        <div>
          <h1>My Collection</h1>
          <p>Select two NFTS and breed a new one!</p>
          <button
            className="button button-black margin-top-md"
            disabled={chosenTokens.length !== 2}
            onClick={onBreedClick}
          >
            Breed
          </button>
        </div>
      </div>
      <div className="row token-card-container overflow-auto justify-content-center margin-top-md">
        {myTokens.map((token, i) => (
          <div className="col-auto" key={i}>
            <button
              id={token.id}
              className="my-token-card  text-left"
              onClick={toggleChosenToken}
            >
              <Human dna={token.dna} key={i} />
              <p className="bold">#{token.id}</p>
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyTokens;
