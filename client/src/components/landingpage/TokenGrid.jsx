import Human from "../Human";
import useEth from "../../contexts/EthContext/useEth";

function TokenGrid() {
  const { tokens } = useEth();

  return (
    <div className="container-fluid center-horizontal">
      <div className="row justify-content-center max-width">
        {tokens.map((token, i) => (
          <div className="token-card col-auto text-left" key={i}>
            <Human dna={token.dna} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TokenGrid;
