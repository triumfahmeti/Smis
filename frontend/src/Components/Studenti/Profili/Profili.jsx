import React from "react";
import "../Transkripta/Style.css";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import TabbedForm from "./TabbedForm";
import { Link } from "react-router-dom";
import { logout } from "../../Login/Logout";
import { useNavigate } from "react-router-dom";

const Profili = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   const table = $("#datatablesSimple");

  //   // Destroy if already initialized
  //   if ($.fn.DataTable.isDataTable(table)) {
  //     table.DataTable().clear().destroy();
  //   }

  //   table.DataTable({
  //     paging: false,
  //     searching: false,
  //     info: false,
  //   });
  // }, []);

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
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => logout(navigate)} // thërrit logout funksionin
                >
                  Logout
                </button>
              </li>
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
                <Link to="/student/Fabrika" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-pen"></i>
                  </div>
                  Fabrika
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
              <h2 className="mt-4">Profili im</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">Profili im</li>
              </ol>
              <TabbedForm />
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

export default Profili;
