import useEth from "../../contexts/EthContext/useEth";
import TokenGrid from "./TokenGrid";

function LandingPage() {
  const { account, connectWallet } = useEth();

  return (
    <>
      <div className="header-container text-center ">
        <div>
          <h1>SOME NAME</h1>
          {account ? (
            <>
              <p>Some text here maybe about something fun!</p>
            </>
          ) : (
            <>
              <p>Connect your wallet to start trading NFTs</p>
              <button
                className="button button-blue margin-top-md"
                onClick={connectWallet}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
                  alt="Connect to metamask"
                  width="30px"
                />{" "}
                Connect to metamask
              </button>
            </>
          )}
        </div>
      </div>
      <div className="margin-top-sm">
        <TokenGrid />;
      </div>
    </>
  );
}

export default LandingPage;
