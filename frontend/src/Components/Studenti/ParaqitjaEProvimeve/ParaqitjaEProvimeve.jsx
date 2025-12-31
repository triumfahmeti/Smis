import React from "react";
import "../Transkripta/Style.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import DropdownLigjeruesi from "./DropDownLigjeruesi";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Login/Logout";
import axiosClient from "../../Login/AxiosClient";

const ParaqitjaEProvimeve = () => {
  const navigate = useNavigate();
  const [provimet, setProvimet] = useState([]);
  const [selectedStafiByLendaId, setSelectedStafiByLendaId] = useState({});
  const [paraqitjetEkzistuese, setParaqitjetEkzistuese] = useState([]);
  const [afati, setAfati] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const departamentiId = localStorage.getItem("departamentiId");
  useEffect(() => {
    const table = $("#datatablesSimple");

    if (provimet.length > 0) {
      if ($.fn.DataTable.isDataTable(table)) {
        table.DataTable().destroy();
      }

      setTimeout(() => {
        table.DataTable({
          paging: false,
          searching: false,
          info: false,
        });
      }, 0);
    }
  }, [provimet]);

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

  const fetchParaqitjetEkzistuese = async () => {
    try {
      const response = await axiosClient.get(
        `/paraqitjaeprovimit/provimet-e-paraqitura/studenti/${studentiId}`
      );
      setParaqitjetEkzistuese(response.data);
    } catch (error) {
      console.error("Gabim gjatë marrjes së paraqitjeve ekzistuese:", error);
    }
  };

  useEffect(() => {
    fetchParaqitjetEkzistuese();
  }, []);

  const eshteParaqitur = (lendaId) => {
    return paraqitjetEkzistuese.some(
      (paraqitja) => paraqitja.lendaId === lendaId
    );
  };

  const fetchStafiPerLende = async (lendaId) => {
    try {
      const response = await axiosClient.get(
        `/paraqitjaeprovimit/ligjeruesit-per-lende/${lendaId}`
      );

      const data = response.data;
      console.log("Ligjeruesit për lëndën", lendaId, data);

      return data.map((s) => ({
        id: s.stafiId,
        label: `${s.emri} ${s.mbiemri}`,
      }));
    } catch (error) {
      console.error("Gabim gjatë marrjes së stafit:", error);
      return [];
    }
  };

  const studentiId = localStorage.getItem("studentId");
  useEffect(() => {
    const fetchProvimetMeStaf = async () => {
      const departamentiId = localStorage.getItem("departamentiId");
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:5138/api/provimi/departamenti/${departamentiId}/studenti/${studentiId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Nuk u arrit të merren provimet!");
        }

        const data = await response.json();

        const provimeTeGrupuar = Object.values(
          data.reduce((acc, curr) => {
            if (!acc[curr.lendaId]) {
              acc[curr.lendaId] = curr;
            }
            return acc;
          }, {})
        );

        const provimetMeStaf = await Promise.all(
          provimeTeGrupuar.map(async (provim) => {
            const staf = await fetchStafiPerLende(provim.lendaId);
            return { ...provim, stafAkademikList: staf };
          })
        );

        setProvimet(provimetMeStaf);
      } catch (error) {
        console.error("Gabim gjatë marrjes së provimeve me staf:", error);
      }
    };

    fetchProvimetMeStaf();
  }, []);

  const handleSelectStafi = (lendaId, selectedItem) => {
    console.log("Selected item:", selectedItem);
    setSelectedStafiByLendaId((prev) => ({
      ...prev,
      [lendaId]: selectedItem,
    }));
  };
  const handleSubmit = (lendaId) => {
    const stafiObj = selectedStafiByLendaId[lendaId];
    console.log("Stafi i zgjedhur:", stafiObj);

    if (!stafiObj || !stafiObj.id) {
      setAlertMessage(
        "Zgjedh ligjëruesin për këtë provim para se të paraqitesh!"
      );
      setAlertType("danger");
      return;
    }

    const stafiId = stafiObj.id;

    paraqitProvimin(studentiId, lendaId, stafiId)
      .then(() => {
        alert("Paraqitja u bë me sukses!");
        fetchParaqitjetEkzistuese();

        setProvimet((prevProvimet) =>
          prevProvimet.filter((provim) => provim.lendaId !== Number(lendaId))
        );
      })
      .catch((err) => {
        console.error(err);
        alert("Gabim gjatë paraqitjes!");
      });
  };

  const paraqitProvimin = async (studentiId, lendaId, stafiId) => {
    console.log("Po dërgohet:", {
      studentiId,
      lendaId,
      stafiId,
      departamentiId,
    });

    const token = localStorage.getItem("token");

    return await axios.post(
      "http://localhost:5138/api/paraqitjaeprovimit",
      {
        studentiId,
        lendaId,
        stafiId,
        departamentiId,
        afatiProvimitId: afati.afatiProvimitId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
              <h2 className="mt-4">Paraqitja e provimeve</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  Paraqitja e provimeve
                </li>
              </ol>
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

              {!afati ? (
                <div className="alert alert-danger" role="alert">
                  Nuk ka afat aktiv për paraqitjen e provimeve!
                </div>
              ) : (
                <div className="alert alert-success" role="alert">
                  Mund të paraqitni provimet nga{" "}
                  <strong>
                    {new Date(afati.dataFillimit).toLocaleDateString()}
                  </strong>{" "}
                  deri më{" "}
                  <strong>
                    {new Date(afati.dataMbarimit).toLocaleDateString()}
                  </strong>
                </div>
              )}

              {afati && (
                <div className="card-body">
                  <table
                    id="datatablesSimple"
                    className="table table-bordered table-striped table-hover table-compact force-border thin-cells tab-1"
                  >
                    <thead>
                      <tr>
                        <th className="kodi-lendes">Kodi</th>
                        <th>Lenda</th>
                        <th>Kredit ECTS</th>
                        <th>Semestri</th>
                        <th>Kategoria</th>
                        <th>Zgjidh profesorin</th>
                        <th className="cell-button paraqitja-button">
                          Paraqit provimin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {provimet.map((provim) => (
                        <tr key={provim.provimiId}>
                          <td>{provim.lendaId}</td>
                          <td>{provim.emri}</td>
                          <td>{provim.kredite}</td>
                          <td>{provim.semestri1}</td>
                          <td>{provim.kategoria}</td>
                          <td>
                            <DropdownLigjeruesi
                              key={`dropdown-${provim.provimiId}`}
                              defaultText="Zgjedh Ligjëruesin"
                              items={provim.stafAkademikList ?? []}
                              selected={selectedStafiByLendaId[provim.lendaId]}
                              onChange={(selectedItem) =>
                                handleSelectStafi(provim.lendaId, selectedItem)
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSubmit(provim.lendaId)}
                              disabled={eshteParaqitur(provim.lendaId)}
                            >
                              {eshteParaqitur(provim.lendaId)
                                ? "E paraqitur"
                                : "Paraqit provimin"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

export default ParaqitjaEProvimeve;
