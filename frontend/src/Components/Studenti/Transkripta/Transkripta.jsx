import React from "react";
import "./Style.css";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import $ from "jquery";
import "datatables.net";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Login/Logout";
import axiosClient from "../../Login/AxiosClient";

const Transkripta = () => {
  const navigate = useNavigate();
  const [transkripta, setTranskripta] = useState([]);
  const studentiId = localStorage.getItem("studentId");
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const handleGjeneroTranskripten = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosClient.get(
        `/studenti/transkripta/${studentiId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTranskripta(response.data);
    } catch (error) {
      console.error("Gabim gjatë gjenerimit të transkriptës:", error);
      // alert("Nuk u gjendën nota për këtë student.");
      setAlertMessage("Nuk u gjendën nota për këtë student.");
      setAlertType("danger");
    }
  };

  useEffect(() => {
    const table = $("#datatablesSimple");

    // Destroy if already initialized
    if ($.fn.DataTable.isDataTable(table)) {
      table.DataTable().destroy();
    }

    table.DataTable({
      paging: false,
      searching: false,
      info: false,
    });
  }, []);

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
                <a className="dropdown-item" href="/student/profili">
                  Profili Im
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/student/transkripta">
                  Transkripta
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="stafiakademik"></a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="/student/regjistrimi-semestrit"
                >
                  Regjistrimi Semestrit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/student/perzgjedh-grupin">
                  Perzgjedh Grupin
                </a>
              </li>

              <li className="dropdown-hover position-relative">
                <a className="dropdown-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">Provimet</div>
                  <div>
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>

                <div className="dropdown-hover-content position-absolute start-0 w-100 bg-white border rounded mt-1">
                  <a
                    className="dropdown-item"
                    href="/student/provimet-e-paraqitura"
                  >
                    Provimet e paraqitura
                  </a>
                  <a
                    className="dropdown-item"
                    href="/student/paraqitja-e-provimeve"
                  >
                    Paraqit provimet
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

      {/* Sidebar and Page Content */}
      <div id="layoutSidenav">
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
                    <i class="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>

                <Link to="/student/transkripta" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </Link>

                <Link to="/student/regjistrimi-semestrit" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                  Regjistrimi Semestrit
                </Link>

                <Link to="/student/perzgjedh-grupin" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-people-group"></i>
                  </div>
                  Perzgjedh Grupin
                </Link>

                <div className="sb-sidenav-menu-heading">Provimet</div>
                <Link to="/student/provimet-e-paraqitura" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </Link>
                <Link to="/student/paraqitja-e-provimeve" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </Link>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-barcode"></i>
                  </div>
                  Pagesat
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>

        {/* Main Page Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Transkripta e notave</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">Transkripta</li>
              </ol>
              <div className="card mb-4"></div>
              {alertMessage && (
                <div
                  className={`alert alert-${alertType} alert-dismissible fade show text-center alert-pp-blue cstm-alert`}
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
            </div>

            <div className="card-body">
              <table
                id="datatablesSimple"
                className="table table-bordered table-striped table-hover table-compact force-border thin-cells tab-1"
              >
                <thead>
                  <tr>
                    <th className="cell-drejtimi">Drejtimi</th>
                    <th>Niveli</th>
                    <th>Statusi</th>
                    <th>Transkripta</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Shkenca Kompjuterike dhe Inxhinieri</td>
                    <td>Bachelor</td>
                    <td>I rregullt</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm butoni-transkriptes"
                        onClick={handleGjeneroTranskripten}
                      >
                        Gjenero Transkripten
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table
                id="datatablesSimple"
                className="table table-bordered table-striped table-hover table-compact force-border thin-cells"
              >
                <thead>
                  <tr>
                    <th className="kodi-lendes">#</th>

                    <th>Lenda</th>
                    <th>Kategoria</th>
                    <th>ECTS</th>
                    <th>Nota</th>
                    <th>Nota Shkronje</th>
                  </tr>
                </thead>

                <tbody>
                  {transkripta.map((nota, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{nota.emri}</td>
                      <td>{nota.kategoria}</td>
                      <td>{nota.kredite}</td>
                      <td>{nota.notaNr}</td>
                      <td>{nota.notaShkronje}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>
      <div class="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default Transkripta;
