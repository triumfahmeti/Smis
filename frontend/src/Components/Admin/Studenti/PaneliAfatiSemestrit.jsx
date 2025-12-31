import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../../Login/AxiosClient";
import { logout } from "../../Login/Logout";

const PaneliAfatiSemestrit = () => {
  const navigate = useNavigate();
  const [dataFillimit, setDataFillimit] = useState("");
  const [dataMbarimit, setDataMbarimit] = useState("");
  const [tipiSemestrit, setTipiSemestrit] = useState("Tek");
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);

  const fakultetiId = localStorage.getItem("universitetiId");

  const [afatiAktiv, setAfatiAktiv] = useState(null);

  useEffect(() => {
    const fetchAfatiAktiv = async () => {
      try {
        const res = await axiosClient.get(
          `/AfatiRegjistrimit/afat-aktiv/${fakultetiId}`
        );
        console.log("Afati aktiv nga API:", res.data);
        setAfatiAktiv(res.data);
      } catch (error) {
        setAfatiAktiv(null); // nuk ka afat aktiv
      }
    };
    fetchAfatiAktiv();
  }, [fakultetiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // PUT për editim
        await axiosClient.put(`/AfatiRegjistrimit/${afatiAktiv.id}`, {
          fakultetiId: fakultetiId,
          dataFillimit: dataFillimit,
          dataMbarimit: dataMbarimit,
          tipiSemestrit: tipiSemestrit,
          pershkrimi: "Afati i semestrit",
        });
        setMessage("Afati u përditësua me sukses");
      } else {
        const response = await axiosClient.post(
          "/AfatiRegjistrimit/krijo-afat",
          {
            fakultetiId: fakultetiId,
            dataFillimit: dataFillimit,
            dataMbarimit: dataMbarimit,
            tipiSemestrit: tipiSemestrit,
            pershkrimi: "Afati i semestrit",
          }
        );
        setMessage(response.data.message);
      }

      setAfatiAktiv({
        ...afatiAktiv,
        fakultetiId: fakultetiId,
        dataFillimit: dataFillimit,
        dataMbarimit: dataMbarimit,
        tipiSemestrit: tipiSemestrit,
        pershkrimi: "Afati i semestrit",
      });

      setEditing(false);
    } catch (error) {
      setMessage("Gabim gjatë krijimit/editimit të afatit.");
      console.error(error);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar (si te DUniversiteti) */}
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
                <a className="dropdown-item" href="/studentet">
                  Studentet
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/stafiakademik">
                  Stafi Akademik
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/grupi">
                  Grupi
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/studentetgrupi">
                  Studentet ne grupe
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/lenda">
                  Lenda
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/paneliAfatiSemestrit">
                  Krijo Afat per Regjistrim te Semestrit
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
        {/* Sidebar */}
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

                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Studentet
                </Link>

                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Stafi Akademik
                </Link>

                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Grupi
                </Link>

                <Link className="nav-link" to="/studentetgrupi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Studentet ne grupe
                </Link>

                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Lenda
                </Link>

                <Link className="nav-link" to="/paneliAfatiSemestrit">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Krijo Afat per Regjistrim te Semestrit
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Krijo Afat per Regjistrim te Semestrit</h2>

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
                    setDataFillimit(afatiAktiv.dataFillimit.split("T")[0]);
                    setDataMbarimit(afatiAktiv.dataMbarimit.split("T")[0]);
                    setTipiSemestrit(afatiAktiv.tipiSemestrit);
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

              <div className="mb-3">
                <label className="form-label">Tipi i Semestrit</label>
                <select
                  className="form-select"
                  value={tipiSemestrit}
                  onChange={(e) => setTipiSemestrit(e.target.value)}
                  disabled={afatiAktiv && !editing}
                >
                  <option value="Tek">Tek (1, 3, 5)</option>
                  <option value="Cift">Çift (2, 4, 6)</option>
                </select>
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

export default PaneliAfatiSemestrit;
