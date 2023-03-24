import { Link } from "react-router-dom";
import { useEth } from "../contexts/EthContext";
import { getShortAddress } from "../assets/js/helpers";
import { useState, useEffect } from "react";

function MainNav() {
  const { account } = useEth();
  const [activeTab, setActiveTab] = useState();

  const onTabClick = (e) => {
    if (e.target == activeTab) return;
    if (activeTab) activeTab.classList.remove("active-custom");

    e.target.classList.add("active-custom");
    setActiveTab(e.target);
  };

  useEffect(() => {
    let home = document.getElementById("home");
    home.classList.add("active-custom");
    setActiveTab(home);
  }, []);

  return (
    <nav className="navbar navbar-expand-sm padding">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link
              className={account ? "nav-link" : "nav-link disabled"}
              to="/breed"
              onClick={onTabClick}
            >
              <i class="fa-solid fa-palette"></i>
              Breed
            </Link>

            <Link
              className={account ? "nav-link" : "nav-link disabled"}
              to="/marketplace"
              onClick={onTabClick}
            >
              <i className="fa-solid fa-store"></i> Marketplace
            </Link>

            <Link className="nav-link" to="/" id="home" onClick={onTabClick}>
              <i className="fa-solid fa-house-chimney"></i>
              Home
            </Link>
          </div>
          {account ? (
            <span className="navbar-text">
              {getShortAddress(account)}{" "}
              <Link className="nav-link" to="/mint">
                Mint
              </Link>
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
