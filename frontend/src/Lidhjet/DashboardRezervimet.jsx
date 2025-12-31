import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Components/Login/Logout";

const DashboardRezervimet = () => {
  const navigate = useNavigate();
  const [rezervimet, setRezervimet] = useState([]);
  const [dataAktuale, setDataAktuale] = useState(
    new Date().toISOString().split("T")[0]
  );

  // e kqyr a ka ndrru data
  useEffect(() => {
    const interval = setInterval(() => {
      const sot = new Date().toISOString().split("T")[0];
      if (sot !== dataAktuale) {
        setDataAktuale(sot);
      }
    }, 60000); // kontrollo çdo 1 minut

    return () => clearInterval(interval);
  }, [dataAktuale]);

  // ndrron data
  useEffect(() => {
    fetch("http://localhost:5138/api/rezervimisalles")
      .then((res) => res.json())
      .then((data) => {
        setRezervimet(data);
      })
      .catch((err) =>
        console.error("Gabim gjatë marrjes së rezervimeve:", err)
      );
  }, [dataAktuale]);

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        {/* Navbar Brand */}
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>

        {/* Sidebar Toggle */}
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
                <a className="dropdown-item" href="/profiliStafi">
                  Profili Im
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/orari">
                  Orari im
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="stafiakademik"></a>
              </li>
              <li>
                <a className="dropdown-item" href="/vendosNota">
                  Vendos Notën
                </a>
              </li>

              <li className="dropdown-hover position-relative">
                <a className="dropdown-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    Rezervo Sallën
                  </div>
                  <div>
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>

                <div className="dropdown-hover-content position-absolute start-0 w-100 bg-white border rounded mt-1">
                  <a className="dropdown-item" href="/rezervoSallen">
                    Bëj Rezervim
                  </a>
                  <a className="dropdown-item" href="/dashboardRezervimet">
                    Shiko Rezervimet
                  </a>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        {/* Navbar User Dropdown */}
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

      {/* Sidebar and Content */}
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profiliStafi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>
                <Link className="nav-link" to="/orari">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-calendar"></i>
                  </div>
                  Orari im
                </Link>
                <Link className="nav-link" to="/vendosNota">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Vendos notën
                </Link>
                <a
                  className="nav-link collapsed"
                  href="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseRezervo"
                  aria-expanded="false"
                  aria-controls="collapseRezervo"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-door-open"></i>
                  </div>
                  Rezervo Sallën
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className="collapse" id="collapseRezervo">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link className="nav-link" to="/rezervoSallen">
                      Bëj Rezervim
                    </Link>
                    <Link className="nav-link" to="/dashboardRezervimet">
                      Shiko Rezervimet
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid mt-4">
            <h2>Të gjitha rezervimet e sallave</h2>
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Rezervo Sallën</li>
            </ol>
            {rezervimet.length === 0 ? (
              <p>Nuk ka asnjë rezervim të regjistruar.</p>
            ) : (
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Stafi </th>
                    <th>Numri i sallës</th>
                    <th>Data</th>
                    <th>Koha</th>
                  </tr>
                </thead>
                <tbody>
                  {rezervimet
                    .filter((r) => r.data === dataAktuale)
                    .map((r, i) => (
                      <tr key={i}>
                        <td>
                          {r.emri} {r.mbiemri}
                        </td>

                        <td>{r.nrSalles}</td>
                        <td>{r.data}</td>
                        <td>{r.koha}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </main>

          {/* Footer */}
          <footer className="footer text-center mt-4">
            <h4>
              © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë,
              Kosovë
            </h4>
            <h4>
              Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net
            </h4>
            <a
              href="https://www.smis.education"
              target="_blank"
              rel="noreferrer"
            >
              www.smis.education
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default DashboardRezervimet;
