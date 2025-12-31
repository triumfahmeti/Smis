import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Studenti/Transkripta/Style.css";
import $ from "jquery";
import "datatables.net";
import { logout } from "../Login/Logout";

const ListaEGrupeve = () => {
  const navigate = useNavigate();
  const [grupet, setGrupet] = useState([]);

  useEffect(() => {
    $("#datatablesSimple").DataTable({
      paging: false,
      searching: false,
      info: false,
    });
  }, []);

  useEffect(() => {
    const fetchGrupet = async () => {
      try {
        const response = await fetch("http://localhost:5138/api/grupi");
        if (response.ok) {
          const data = await response.json();
          setGrupet(data);
        } else {
          console.error("Nuk mund të merren grupet.");
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };

    fetchGrupet();
  }, []);

  const handleGroupChange = (e) => {
    const selectedGroupId = e.target.value;
    if (selectedGroupId) {
      navigate(`/grupi/${selectedGroupId}`);
    }
  };

  return (
    <>
      <div className="sb-nav-fixed">
        <nav className="sb-topnav navbar navbar-expand navbar-dark">
          <a className="navbar-brand ps-3" href="#">
            KOLEGJI UBT-SMIS
          </a>

          <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user fa-fw"></i>
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdown"
              >
                <li><a className="dropdown-item" href="#!">Settings</a></li>
                <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={() => logout(navigate)}>Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <div id="layoutSidenav">
          <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
              <div className="sb-sidenav-menu">
                <div className="nav">
                  <div className="sb-sidenav-menu-heading">Home</div>
                  <a className="nav-link" href="/profilistudent">
                    <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                    Profili im
                  </a>
                  <a className="nav-link" href="/transkripta">
                    <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                    Transkripta
                  </a>

                  <div className="sb-sidenav-menu-heading">Provimet</div>
                  <a className="nav-link" href="/provimet-e-paraqitura">
                    <div className="sb-nav-link-icon"><i className="fa-solid fa-newspaper"></i></div>
                    Provimet e paraqitura
                  </a>
                  <a className="nav-link" href="/paraqit-provimet">
                    <div className="sb-nav-link-icon"><i className="fa-solid fa-pen"></i></div>
                    Paraqit provimet
                  </a>
                  <a className="nav-link" href="/pagesat">
                    <div className="sb-nav-link-icon"><i className="fa-solid fa-barcode"></i></div>
                    Pagesat
                  </a>
                </div>
              </div>
            </nav>
          </div>

          <div id="layoutSidenav_content">
            <main>
              <div className="container-fluid px-4">
                <h2 className="mt-4">Lista e grupeve</h2>
                <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Lista e Grupeve</li>
                </ol>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5>Zgjedh grupin</h5>
                  </div>
                  <div className="card-body">
                    <select
                      className="form-select"
                      aria-label="Zgjedh grupin"
                      onChange={handleGroupChange}
                    >
                      <option value="">Zgjedh grupin...</option>
                      {grupet.map((grupi) => (
                        <option key={grupi.grupiId} value={grupi.grupiId}>
                          {grupi.emri}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      <div className="footer">
        <h4>© 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë</h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </>
  );
};

export default ListaEGrupeve;
