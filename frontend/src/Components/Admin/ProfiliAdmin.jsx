import React from "react";
import "../Studenti/Transkripta/Style.css";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import TabbedForm from "../Studenti/Profili/TabbedForm";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { logout } from "../Login/Logout";


const ProfiliAdmin = () => {

    const navigate = useNavigate();

  useEffect(() => {
    $("#datatablesSimple").DataTable({
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
                      <a className="dropdown-item" href="stafiakademik">
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
      
            <div id="layoutSidenav">
              <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                  <div className="sb-sidenav-menu">
                    <div className="nav">
                      <div className="sb-sidenav-menu-heading">Home</div>
      
                      <Link className="nav-link" to="/profiliadmin">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                        Profili im
                      </Link>
      
                      <Link className="nav-link" to="/studentet">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                        Studentet
                      </Link>
      
                      <Link className="nav-link" to="/stafiakademik">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                        Stafi Akademik
                      </Link>
      
                      <Link className="nav-link" to="/grupi">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                        Grupi
                      </Link>
                      <Link className="nav-link" to="/studentetgrupi">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                        Studentet ne grupe
                      </Link>
      
                      <Link className="nav-link" to="/lenda">
                        <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                        Lenda
                      </Link>
                    </div>
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
                  <a href="index.html">Home</a>
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

export default ProfiliAdmin;
