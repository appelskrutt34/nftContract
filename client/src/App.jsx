import "./App.css";
import { EthProvider } from "./contexts/EthContext";
import MyTokens from "./components/mytokens/MyTokens";
import CreateNFT from "./components/mint/CreateNFT";
import Marketplace from "./components/marketplace/Marketplace";
import Home from "./components/landingpage/Landingpage";
import MainNav from "./components/MainNav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  /* 
  Boolean amBestCoderEver(bool isTrue)
    {if (isTrue == true)
        {return true;
        }
    else if (isTrue == false)
        {return false;
        }
    }
*/
  return (
    <EthProvider>
      <Router>
        <MainNav />
        <main id="App">
          <Routes>
            <Route exact path="/breed" element={<MyTokens />}></Route>
            <Route exact path="/mint" element={<CreateNFT />}></Route>
            <Route exact path="/marketplace" element={<Marketplace />}></Route>
            <Route exact path="/" element={<Home />}></Route>
          </Routes>
        </main>
      </Router>
    </EthProvider>
  );
}

export default App;
