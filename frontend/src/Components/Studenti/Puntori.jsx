import React, { useState, useEffect } from "react";
import axiosClient from "../Login/AxiosClient";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Login/Logout";

const Puntori = () => {
  const navigate = useNavigate();
  const [emri, setEmri] = useState("");
  const [modeli, setModeli] = useState("");
  const [vitiProdhimit, setVitiProdhimit] = useState("");
  const [fabrikaId, setFabrikaId] = useState("");
  const [fabrikat, setFabrikat] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  useEffect(() => {
    axiosClient
      .get("/fabrika")
      .then((res) => setFabrikat(res.data))
      .catch((err) => {
        console.error("Gabim gjatë marrjes së Fabrikave:", err);
        setAlertType("danger");
        setAlertMessage("Gabim gjatë ngarkimit të listës së Fabrikave.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/roboti", {
        emri,
        modeli,
        vitiProdhimit: parseInt(vitiProdhimit),
        fabrikaId: parseInt(fabrikaId),
      });
      setAlertType("success");
      setAlertMessage("Roboti u shtua me sukses.");
      setEmri("");
      setModeli("");
      setVitiProdhimit("");
      setFabrikaId("");
    } catch (error) {
      console.error(error);
      setAlertType("danger");
      setAlertMessage("Gabim gjatë shtimit të Robotit.");
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">
          KOLEGJI UBT-SMIS
        </a>
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-bars"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <Link className="dropdown-item" to="/student/profili">
                  Profili Im
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/student/transkripta">
                  Transkripta
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/student/regjistrimi-semestrit"
                >
                  Regjistrimi Semestrit
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/student/perzgjedh-grupin">
                  Perzgjedh Grupin
                </Link>
              </li>
              <li className="dropdown-hover position-relative">
                <a className="dropdown-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">Provimet</div>
                  <div>
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className="dropdown-hover-content position-absolute start-0 w-100 bg-white border rounded mt-1">
                  <Link
                    className="dropdown-item"
                    to="/student/provimet-e-paraqitura"
                  >
                    Provimet e paraqitura
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/student/paraqitja-e-provimeve"
                  >
                    Paraqit provimet
                  </Link>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarUser"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarUser"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Activity Log
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <button
                className="dropdown-item"
                onClick={() => logout(navigate)}
              >
                Logout
              </button>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link to="/student/profili" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>
                <Link to="/student/transkripta" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </Link>
                <Link to="/student/regjistrimi-semestrit" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-gear"></i>
                  </div>
                  Regjistrimi Semestrit
                </Link>
                <Link to="/student/perzgjedh-grupin" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-people-group"></i>
                  </div>
                  Perzgjedh Grupin
                </Link>
                <div className="sb-sidenav-menu-heading">Provimet</div>
                <Link to="/student/provimet-e-paraqitura" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </Link>
                <Link to="/student/paraqitja-e-provimeve" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </Link>
                <div className="sb-sidenav-menu-heading">Fabrika</div>
                <Link to="/student/Fabrika" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-industry"></i>
                  </div>
                  Fabrika
                </Link>
                <Link to="/student/puntori" className="nav-link active">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user-gear"></i>
                  </div>
                  Roboti
                </Link>
                <Link to="/student/Get" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-list"></i>
                  </div>
                  Listat
                </Link>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Menaxhimi i Roboteve</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/student/Fabrika">Fabrikat</Link>
                </li>
                <li className="breadcrumb-item active">Roboti</li>
              </ol>
              {alertMessage && (
                <div
                  className={`alert alert-${alertType} alert-dismissible fade show`}
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAlertMessage(null)}
                  ></button>
                </div>
              )}
              <div className="card mb-4">
                <div className="card-header">
                  <i className="fa-solid fa-user-gear me-1"></i>Shto Puntor
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Emri</label>
                      <input
                        type="text"
                        className="form-control"
                        value={emri}
                        onChange={(e) => setEmri(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Modeli</label>
                      <input
                        type="text"
                        className="form-control"
                        value={modeli}
                        onChange={(e) => setModeli(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Viti Prodhimit</label>
                      <input
                        type="text"
                        className="form-control"
                        value={vitiProdhimit}
                        onChange={(e) => setVitiProdhimit(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Fabrika</label>
                      <select
                        className="form-select"
                        value={fabrikaId}
                        onChange={(e) => setFabrikaId(e.target.value)}
                        required
                      >
                        <option value="">Zgjedh Fabriken</option>
                        {fabrikat.map((l) => (
                          <option key={l.fabrikaId} value={l.fabrikaId}>
                            {l.emri}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        Shto Robote
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default Puntori;
