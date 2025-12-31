import React from "react";
import "../Transkripta/Style.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Login/Logout";
import axiosClient from "../../Login/AxiosClient";

const ProvimetEParaqitura = () => {
  const navigate = useNavigate();
  const [provimet, setProvimet] = useState([]);
  const [notat, setNotat] = useState([]);
  const [afati, setAfati] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const departamentiId = localStorage.getItem("departamentiId");

  useEffect(() => {
    const fetchAfati = async () => {
      try {
        const response = await axiosClient.get(
          `/afatiprovimit/aktiv/${departamentiId}`
        );
        setAfati(response.data);
      } catch (err) {
        setAfati(null);
      }
    };

    fetchAfati();
  }, []);

  useEffect(() => {
    const studentiId = localStorage.getItem("studentId");

    axiosClient
      .get(`/paraqitjaeprovimit/provimet-e-paraqitura/studenti/${studentiId}`)
      .then((res) => {
        setProvimet(res.data);

        axiosClient
          .get(`/nota/studenti/${studentiId}`)
          .then((res) => {
            setNotat(res.data);
          })
          .catch((err) => console.error("Gabim në marrjen e notave", err));

        setTimeout(() => {
          const table = $("#datatablesSimple");
          if ($.fn.DataTable.isDataTable(table)) {
            table.DataTable().destroy();
          }
          table.DataTable({
            paging: false,
            searching: false,
            info: false,
          });
        }, 100);
      })
      .catch((err) => console.error("Gabim në marrjen e provimeve", err));
  }, []);

  const gjejNotaPerParaqitjen = (paraqitjaId) => {
    const nota = notat.find((n) => n.paraqitjaId === paraqitjaId);
    if (nota) {
      return {
        notaId: nota.notaId,
        notaNr: nota.notaNr,
        notaShkronje: nota.notaShkronje,
        dataVendosjes: nota.dataVendosjes,
        eshteRefuzuar: nota.eshteRefuzuar,
      };
    }
    return { notaNr: "-", notaShkronje: "-", dataVendosjes: "-" };
  };

  const anuloParaqitjen = async (paraqitjaId) => {
    if (!window.confirm("A jeni i sigurt që doni ta anuloni këtë paraqitje?"))
      return;

    try {
      await axiosClient.delete(`/paraqitjaeprovimit/${paraqitjaId}`);

      setProvimet((prev) => prev.filter((p) => p.paraqitjaId !== paraqitjaId));

      setAlertMessage("Paraqitja u anulua me sukses!");
      setAlertType("success");
    } catch (error) {
      console.error(
        "Gabim gjatë anulimit të paraqitjes",
        error.response?.data || error.message
      );

      setAlertMessage("Ndodhi një gabim gjatë anulimit.");
      setAlertType("danger");
    }
  };
  const refuzoNoten = async (notaId) => {
    if (!window.confirm("A jeni të sigurt që doni të refuzoni këtë notë?"))
      return;

    try {
      await axiosClient.post(`/nota/refuzo-noten/${notaId}`);
      alert("Nota u refuzua me sukses!");

      setNotat((prev) =>
        prev.map((n) =>
          n.notaId === notaId ? { ...n, eshteRefuzuar: true } : n
        )
      );
    } catch (error) {
      console.error("Gabim në refuzimin e notës:", error);
      alert("Gabim gjatë refuzimit të notës.");
      setAlertMessage("Gabim gjatë refuzimit të notës.");
      setAlertType("danger");
    }
  };

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
              <h2 className="mt-4">Provimet e paraqitura</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  Provimet e paraqitura
                </li>
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
              {/* Kontrollojmë nëse nuk ka afat */}
              {!afati ? (
                <div className="alert alert-danger text-center" role="alert">
                  Nuk ka nje afat per paraqitje te provimit për momentin!
                </div>
              ) : (
                <table
                  id="datatablesSimple"
                  className="table table-bordered table-striped table-hover table-compact force-border thin-cells tab-1"
                >
                  <thead>
                    <tr>
                      <th className="kodi-lendes">Kodi</th>
                      <th>Lenda</th>
                      <th>Kategoria</th>
                      <th>Profesori</th>
                      <th>Nota</th>
                      <th>Nota Shkronje</th>
                      <th>Data vendosjes</th>
                      <th className="cell-button">
                        Anulo paraqitjen e provimit
                      </th>
                      <th className="cell-button">Refuzo noten</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provimet.map((provim) => {
                      const nota = gjejNotaPerParaqitjen(provim.paraqitjaId);

                      return (
                        <tr key={provim.paraqitjaId}>
                          <td>{provim.lendaId}</td>
                          <td>{provim.emri}</td>
                          <td>{provim.kategoria}</td>
                          <td>
                            {provim.emriStafit} {provim.mbiemri}
                          </td>
                          <td>{nota.notaNr}</td>
                          <td>{nota.notaShkronje}</td>
                          <td>
                            {new Date(nota.dataVendosjes).toLocaleDateString()}
                          </td>
                          <td>
                            {!provim.eshtePerfunduar ? (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  anuloParaqitjen(provim.paraqitjaId)
                                }
                              >
                                Anulo paraqitjen
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                disabled
                              >
                                Nota ekziston
                              </button>
                            )}
                          </td>
                          <td>
                            {!nota.eshteRefuzuar && nota.notaNr !== "-" ? (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => refuzoNoten(nota.notaId)}
                              >
                                Refuzo Noten
                              </button>
                            ) : nota.eshteRefuzuar ? (
                              <button
                                className="btn btn-primary btn-sm"
                                disabled
                              >
                                E Refuzuar
                              </button>
                            ) : (
                              <button
                                className="btn btn-primary btn-sm"
                                disabled
                              >
                                Refuzo Noten
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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

export default ProvimetEParaqitura;
