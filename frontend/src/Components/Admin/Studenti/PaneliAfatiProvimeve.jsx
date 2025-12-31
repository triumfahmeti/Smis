import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../../Login/AxiosClient";
import { logout } from "../../Login/Logout";

const PaneliAfatiProvimeve = () => {
  const navigate = useNavigate();
  const [emri, setEmri] = useState("");
  const [dataFillimit, setDataFillimit] = useState("");
  const [dataMbarimit, setDataMbarimit] = useState("");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const departamentiId = localStorage.getItem("departamentiId");
  const [afatiAktiv, setAfatiAktiv] = useState(null);

  useEffect(() => {
    const fetchAfatiAktiv = async () => {
      try {
        const res = await axiosClient.get(
          `/afatiProvimit/aktiv/${departamentiId}`
        );
        console.log("Afati aktiv nga API:", res.data);
        setAfatiAktiv(res.data);
      } catch (error) {
        setAfatiAktiv(null);
      }
    };
    fetchAfatiAktiv();
  }, [departamentiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axiosClient.put(`/afatiProvimit/${afatiAktiv.afatiProvimitId}`, {
          emri,
          dataFillimit,
          dataMbarimit,
          aktiv: true,
          departamentiId,
        });
        setMessage("Afati u përditësua me sukses");
      } else {
        // Krijo afat të ri
        const response = await axiosClient.post(`/AfatiProvimit`, {
          emri,
          dataFillimit,
          dataMbarimit,
          aktiv: true,
          departamentiId,
        });
        setMessage("Afati u krijua me sukses");
        setAfatiAktiv(response.data);
      }

      setEditing(false);
    } catch (error) {
      setMessage("Gabim gjatë krijimit/editimit të afatit.");
      console.error(error);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
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
                <a className="dropdown-item" href="/profiliadmin">
                  Profili Im
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/paneliAfatiSemestrit">
                  Afati Semestrit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/paneliAfatiProvimeve">
                  Afati Provimeve
                </a>
              </li>
            </ul>
          </li>
        </ul>

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
              <li>
                <a className="dropdown-item" href="#!">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#!">
                  Activity Log
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => logout(navigate)}
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Sidenav + Content */}
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profiliadmin">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>
                <Link className="nav-link" to="/paneliAfatiSemestrit">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-calendar"></i>
                  </div>
                  Krijo Afat Semestri
                </Link>
                <Link className="nav-link" to="/paneliAfatiProvimeve">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-book"></i>
                  </div>
                  Krijo Afat Provimi
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Krijo Afat për Paraqitje të Provimeve</h2>

            {afatiAktiv && (
              <>
                <div
                  className="alert alert-warning alert-dismissible fade show"
                  role="alert"
                >
                  Ekziston një afat aktiv nga{" "}
                  <strong>
                    {new Date(afatiAktiv.dataFillimit).toLocaleDateString()}
                  </strong>{" "}
                  deri{" "}
                  <strong>
                    {new Date(afatiAktiv.dataMbarimit).toLocaleDateString()}
                  </strong>
                  . Nuk mund të krijoni afat të ri derisa ky afat të mbarojë.
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>

                <button
                  className="btn btn-primary mb-3"
                  onClick={() => {
                    setEmri(afatiAktiv.emri);
                    setDataFillimit(afatiAktiv.dataFillimit.split("T")[0]);
                    setDataMbarimit(afatiAktiv.dataMbarimit.split("T")[0]);
                    setEditing(true);
                  }}
                >
                  Edito Afatin
                </button>
              </>
            )}

            {message && (
              <div
                className="alert alert-info alert-dismissible fade show"
                role="alert"
              >
                {message}
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="alert"
                  aria-label="Close"
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit} disabled={afatiAktiv && !editing}>
              <div className="mb-3">
                <label className="form-label">Emri i Afatit</label>
                <input
                  type="text"
                  className="form-control"
                  value={emri}
                  onChange={(e) => setEmri(e.target.value)}
                  required
                  disabled={afatiAktiv && !editing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Data Fillimit</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataFillimit}
                  onChange={(e) => setDataFillimit(e.target.value)}
                  required
                  disabled={afatiAktiv && !editing}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Data Mbarimit</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataMbarimit}
                  onChange={(e) => setDataMbarimit(e.target.value)}
                  required
                  disabled={afatiAktiv && !editing}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={afatiAktiv && !editing}
              >
                {editing ? "Ruaj Ndryshimet" : "Krijo Afat"}
              </button>
            </form>
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="footer bg-dark text-white text-center py-3 mt-auto">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a
          href="https://www.smis.education"
          className="text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.smis.education
        </a>
      </div>
    </div>
  );
};

export default PaneliAfatiProvimeve;
