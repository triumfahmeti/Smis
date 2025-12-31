import React, { useEffect } from "react";
import "../Studenti/Transkripta/Style.css";
import $ from "jquery";
import "datatables.net";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../Login/Logout";

const ListaEGrupeve = () => {
  const navigate = useNavigate();
  useEffect(() => {
    $("#datatablesSimple").DataTable({
      paging: false,
      searching: false,
      info: false,
    });
  }, []);

  const handleGroupChange = (e) => {
    const selectedGroup = e.target.value;
    if (selectedGroup) {
      navigate(`/grupi/${selectedGroup}`);
    }
  };

  return (
    <>
      <div className="sb-nav-fixed">
        {/* Top Navbar */}
        <nav className="sb-topnav navbar navbar-expand navbar-dark">
          {/* Navbar Brand */}
          <a className="navbar-brand ps-3" href="index.html">
            KOLEGJI UBT-SMIS
          </a>

          {/* Sidebar Toggle */}
          <button
            className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
            id="sidebarToggle"
          >
            <i className="fas fa-bars"></i>
          </button>

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
                  <a className="nav-link" href="index.html">
                    <div className="sb-nav-link-icon">
                      <i className="fa-solid fa-user"></i>
                    </div>
                    Profili im
                  </a>

                  <a className="nav-link" href="charts.html">
                    <div className="sb-nav-link-icon">
                      <i className="fa-solid fa-bars"></i>
                    </div>
                    Transkripta
                  </a>

                  <div className="sb-sidenav-menu-heading">Provimet</div>
                  <a className="nav-link" href="charts.html">
                    <div className="sb-nav-link-icon">
                      <i className="fa-solid fa-newspaper"></i>
                    </div>
                    Provimet e paraqitura
                  </a>
                  <a className="nav-link" href="tables.html">
                    <div className="sb-nav-link-icon">
                      <i className="fa-solid fa-pen"></i>
                    </div>
                    Paraqit provimet
                  </a>
                  <a className="nav-link" href="charts.html">
                    <div className="sb-nav-link-icon">
                      <i className="fa-solid fa-barcode"></i>
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

          <div id="layoutSidenav_content">
            <main>
              <div className="container-fluid px-4">
                <h2 className="mt-4">Lista e grupeve</h2>
                <ol className="breadcrumb mb-4">
                  <li className="breadcrumb-item">
                    <a href="index.html">Home</a>
                  </li>
                  <li className="breadcrumb-item active">Lista e Grupeve</li>
                </ol>

                <div className="card mb-4">
                  <div className="card-header">
                    <h5>Zgjedh llojin e grupit</h5>
                  </div>
                  <div className="card-body">
                    <select
                      className="form-select"
                      aria-label="Zgjedh llojin e grupit"
                      onChange={handleGroupChange}
                    >
                      <option value="">Zgjedh grupin...</option>
                      <option value="Grupi1">Grupi 1</option>
                      <option value="Grupi2">Grupi 2</option>
                      <option value="Grupi3">Grupi 3</option>
                      <option value="Grupi4">Grupi 4</option>
                    </select>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Footer jashtë sb-nav-fixed */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </>
  );
};

export const Grupi1 = () => {
  const studentet = [
    { id: 232470243, emri: "Donjeta", mbiemri: "Jashari" },
    { id: 232470111, emri: "Era", mbiemri: "Hasani" },
    { id: 232470717, emri: "Anda", mbiemri: "Krasniqi" },
    { id: 232470822, emri: "Liridona", mbiemri: "Shala" },
  ];

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
        >
          <i className="fas fa-bars"></i>
        </button>
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
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </a>

                <div className="sb-sidenav-menu-heading">Provimet</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-barcode"></i>
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

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Grupi 1</h2>
              <Link to="/" className="text-primary">
                Kjo është faqja për Grupi 1.
              </Link>
              {/* Tabela me studentët */}
              <div className="card mt-4">
                <div className="card-header">
                  <strong>Lista e Studentëve</strong>
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Emri</th>
                        <th>Mbiemri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentet.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.emri}</td>
                          <td>{s.mbiemri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer jashtë sb-nav-fixed */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export const Grupi2 = () => {
  const studentet = [
    { id: 232470123, emri: "Triumf", mbiemri: "Ahmeti" },
    { id: 232470982, emri: "Viola", mbiemri: "Olloni" },
    { id: 232470722, emri: "Flamur", mbiemri: "Krasniqi" },
    { id: 232470154, emri: "Fatjona", mbiemri: "Haxholli" },
  ];

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
        >
          <i className="fas fa-bars"></i>
        </button>
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
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </a>

                <div className="sb-sidenav-menu-heading">Provimet</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-barcode"></i>
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

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Grupi 2</h2>
              <Link to="/" className="text-primary">
                Kjo është faqja për Grupi 2.
              </Link>
              {/* Tabela me studentët */}
              <div className="card mt-4">
                <div className="card-header">
                  <strong>Lista e Studentëve</strong>
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Emri</th>
                        <th>Mbiemri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentet.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.emri}</td>
                          <td>{s.mbiemri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer jashtë sb-nav-fixed */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export const Grupi3 = () => {
  const studentet = [
    { id: 232470987, emri: "Anika", mbiemri: "Gjinolli" },
    { id: 232470222, emri: "Andi", mbiemri: "Gashi" },
    { id: 232470654, emri: "Sara", mbiemri: "Ferizaj" },
    { id: 232470928, emri: "Drilon", mbiemri: "Shala" },
  ];

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
        >
          <i className="fas fa-bars"></i>
        </button>
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
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </a>
                <div className="sb-sidenav-menu-heading">Provimet</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-barcode"></i>
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

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Grupi 3</h2>
              <Link to="/" className="text-primary">
                Kjo është faqja për Grupi 3.
              </Link>
              {/* Tabela me studentët */}
              <div className="card mt-4">
                <div className="card-header">
                  <strong>Lista e Studentëve</strong>
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Emri</th>
                        <th>Mbiemri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentet.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.emri}</td>
                          <td>{s.mbiemri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer jashtë sb-nav-fixed */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export const Grupi4 = () => {
  const studentet = [
    { id: 232470233, emri: "Maltina", mbiemri: "Imeri" },
    { id: 232470232, emri: "Arba", mbiemri: "Hasani" },
    { id: 232470928, emri: "Anida", mbiemri: "Duriqi" },
    { id: 232470357, emri: "Bardha", mbiemri: "Qerimi" },
  ];

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>
        <button
          className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
          id="sidebarToggle"
        >
          <i className="fas fa-bars"></i>
        </button>
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
                <a className="nav-link" href="index.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </a>
                <div className="sb-sidenav-menu-heading">Provimet</div>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </a>
                <a className="nav-link" href="tables.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </a>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-barcode"></i>
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

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Grupi 4</h2>
              <Link to="/" className="text-primary">
                Kjo është faqja për Grupi 4.
              </Link>
              {/* Tabela me studentët */}
              <div className="card mt-4">
                <div className="card-header">
                  <strong>Lista e Studentëve</strong>
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Emri</th>
                        <th>Mbiemri</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentet.map((s) => (
                        <tr key={s.id}>
                          <td>{s.id}</td>
                          <td>{s.emri}</td>
                          <td>{s.mbiemri}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer jashtë sb-nav-fixed */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default ListaEGrupeve;
