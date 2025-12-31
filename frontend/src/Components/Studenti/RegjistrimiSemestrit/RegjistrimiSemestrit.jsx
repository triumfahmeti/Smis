import React from "react";
import "../Transkripta/Style.css";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Login/Logout";
import axiosClient from "../../Login/AxiosClient";
import { Alert, Button } from "react-bootstrap";

const RegjistrimiSemestrit = () => {
  const navigate = useNavigate();

  const [staffData, setStaffData] = useState({
    orariMesimit: "Paradite",
    // lokacioni: "UBT-Prishtine",
    semestri: "",
  });
  const [regjistrimiEkziston, setRegjistrimiEkziston] = useState(false);
  const [regjistrimiId, setRegjistrimiId] = useState(null);
  const [regjistrimiEkzistues, setRegjistrimiEkzistues] = useState([]);

  const [afatiAktiv, setAfatiAktiv] = useState(null);
  const [lokacionet, setLokacionet] = useState([]);
  const [semestrat, setSemestrat] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");

  const fakultetiId = localStorage.getItem("universitetiId");
  const studentiId = localStorage.getItem("studentId");
  const departamentiId = localStorage.getItem("departamentiId");

  useEffect(() => {
    fetchRegjistrimiSemestrit();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`/api/AfatiRegjistrimit/afat-aktiv/${fakultetiId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAfatiAktiv(res.data))
      .catch((err) => {
        console.error("Gabim gjatë marrjes së regjistrimit:", err);
        setAfatiAktiv(null);
      });
  }, [fakultetiId]);

  useEffect(() => {
    const fetchSemestrat = async () => {
      try {
        const response = await axiosClient.get(
          `/semestri/departamentiId/${departamentiId}`
        );
        setSemestrat(response.data);
      } catch (error) {
        console.error("Gabim në marrjen e semestrave:", error);
      }
    };

    fetchSemestrat();
  }, []);

  useEffect(() => {
    const fetchLokacionet = async () => {
      try {
        const universitetiId = localStorage.getItem("universitetiId");
        const response = await axiosClient.get(
          `/universiteti/${universitetiId}`
        );
        setLokacionet(response.data.lokacionet);
      } catch (error) {
        console.error("Gabim në marrjen e lokacioneve:", error);
      }
    };

    fetchLokacionet();
  }, []);

  const fetchRegjistrimiSemestrit = async () => {
    try {
      const response = await axiosClient.get(
        `/studenti/${studentiId}/regjistrimi-semestrit`
      );
      console.log("Regjistrimi ekzistues nga API:", response.data);
      if (response.data && response.data.length > 0) {
        const regjistrimi = response.data[0]; // ← marrim objektin e parë nga array
        setRegjistrimiEkziston(true);
        setRegjistrimiId(regjistrimi.regjistrimiSemestritId);
        setRegjistrimiEkzistues(response.data);
      } else {
        setRegjistrimiEkziston(false);
        setRegjistrimiId(null);
        setRegjistrimiEkzistues([]);
      }
    } catch (err) {
      console.error("Gabim gjatë marrjes së regjistrimit:", err);
      setRegjistrimiEkziston(false);
      setRegjistrimiId(null);
      setRegjistrimiEkzistues([]);
    }
  };

  // useEffect(() => {
  //   const kontrolloRegjistrimin = async () => {
  //     try {
  //       const response = await axiosClient.get(
  //         `/studenti/${studentiId}/regjistrimi-semestrit`
  //       );
  //       if (response.data) {
  //         setRegjistrimiEkziston(true);
  //         setRegjistrimiId(response.data.regjistrimiSemestritId);
  //       }
  //     } catch (error) {
  //       console.error("Gabim gjatë kontrollit të regjistrimit:", error);
  //     }
  //   };

  //   kontrolloRegjistrimin();
  // }, []);

  const handleChange = (e) => {
    setStaffData({
      ...staffData,
      [e.target.name]: e.target.value,
    });
  };
  const handleQregjistrimi = async () => {
    try {
      console.log("HEJ", regjistrimiEkzistues.regjistrimiSemestritId);
      await axiosClient.delete(
        `/studenti/cregjistrosemestrin/${regjistrimiEkzistues[0].regjistrimiSemestritId}`
      );
      setAlertMessage("Çregjistrimi u krye me sukses.");
      setAlertType("success");
      setRegjistrimiEkziston(false);
      setRegjistrimiId(null);
    } catch (error) {
      setAlertMessage("Gabim gjate c'regjistrimit.");
      setAlertType("success");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (regjistrimiEkziston) {
      setAlertMessage(
        "Jeni të regjistruar në një semestër. Çregjistrohuni për të vazhduar."
      );
      setAlertType("danger");
      return;
    }

    const studentiId = localStorage.getItem("studentId");
    const dataRegjistrimit = new Date().toISOString();
    console.log("staffData:", staffData);

    try {
      const response = await axiosClient.post("/studenti/regjistrosemestrin", {
        StudentiId: parseInt(studentiId),
        SemestriId: parseInt(staffData.semestri),
        FakultetiId: parseInt(fakultetiId),
        DataRegjistrimit: dataRegjistrimit,
        Lokacioni: staffData.lokacioni,
        Nderrimi: staffData.orariMesimit,
      });

      console.log("Regjistrimi u krye:", response.data);

      setAlertMessage("Regjistrimi u krye me sukses!");
      setAlertType("success");
      setRegjistrimiEkziston(true);
      setRegjistrimiId(response.data.regjistrimiSemestritId);
      await fetchRegjistrimiSemestrit();
    } catch (error) {
      console.error(
        "Gabim gjatë regjistrimit:",
        error.response?.data || error.message
      );
      alert("Gabim gjatë regjistrimit. Kontrollo të dhënat.");
      setAlertMessage("Gabim gjatë regjistrimit. Kontrollo të dhënat.");
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
              <h2 className="mt-4">Regjistrimi Semestrit</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  Regjistrimi Semestrit
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

              {afatiAktiv ? (
                <div
                  className="alert alert-success alert-dismissible fade show text-center alert-pp-blue cstm-alert"
                  role="alert"
                >
                  <strong>Verejtje!</strong> Mund të regjistroni semestrin nga{" "}
                  <b>
                    {new Date(afatiAktiv.dataFillimit).toLocaleDateString()}
                  </b>{" "}
                  deri më{" "}
                  <b>
                    {new Date(afatiAktiv.dataMbarimit).toLocaleDateString()}
                  </b>
                  .
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              ) : (
                <div
                  className="alert alert-danger alert-dismissible fade show text-center alert-pp-blue cstm-alert"
                  role="alert"
                >
                  <strong>Kujdes!</strong> Aktualisht nuk ka afat aktiv për
                  regjistrim.
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Lokacioni</label>
                    <select
                      className="form-select"
                      name="lokacioni"
                      value={staffData.lokacioni}
                      onChange={handleChange}
                      required
                      disabled={!afatiAktiv}
                    >
                      <option value="">Zgjedh lokacionin</option>
                      {lokacionet.map((l, index) => (
                        <option key={index} value={l.qyteti}>
                          {l.qyteti}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Semestri i studimeve</label>
                    <select
                      className="form-select"
                      name="semestri"
                      value={staffData.semestri}
                      onChange={handleChange}
                      required
                      disabled={!afatiAktiv} // bllokohet nëse nuk ka afat aktiv
                    >
                      <option value="">Zgjedh Semestrin</option>

                      {afatiAktiv &&
                        semestrat
                          .filter((s) => {
                            const semNumri = parseInt(
                              s.semestri1.split(" ")[1],
                              10
                            );

                            if (afatiAktiv.tipiSemestrit === "Tek") {
                              return semNumri % 2 !== 0; // 1, 3, 5
                            } else {
                              return semNumri % 2 === 0; // 2, 4, 6
                            }
                          })
                          .map((s) => (
                            <option key={s.semestriId} value={s.semestriId}>
                              {s.semestri1}
                            </option>
                          ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Orari i mesimit</label>
                    <select
                      className="form-select"
                      name="orariMesimit"
                      value={staffData.orariMesimit}
                      onChange={handleChange}
                      required
                      disabled={!afatiAktiv}
                    >
                      <option value="Paradite">Paradite</option>
                      <option value="Masdite">Masdite</option>
                    </select>
                  </div>
                </div>

                {/* {!regjistrimiEkziston ? ( */}
                <button
                  type="submit"
                  className="btn btn-primary mt-3 regjistro-semestrin"
                  disabled={!afatiAktiv}
                >
                  Regjistro semestrin
                </button>

                {/* ) : ( */}
                <button
                  type="button"
                  className="btn btn-danger mt-3 regjistro-semestrin"
                  onClick={handleQregjistrimi}
                  disabled={!afatiAktiv}
                >
                  Çregjistro semestrin
                </button>
                {/* )} */}
              </form>
            </div>
            <div className="card mt-4 shadow-sm">
              <div className="card-header bg-info text-white text-center">
                <h2 className="fs-5">Semestrat e Regjistruar</h2>
              </div>
              <div className="card-body">
                {regjistrimiEkzistues && regjistrimiEkzistues.length > 0 ? (
                  <table className="table table-striped table-hover text-center">
                    <thead>
                      <tr>
                        <th>Semestri</th>
                        <th>Lokacioni</th>
                        <th>Nderrimi</th>
                        <th>Data Regjistrimit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regjistrimiEkzistues.map((item, index) => (
                        <tr key={item.regjistrimiSemestritId}>
                          <td> {item.semestri}</td>
                          <td>{item.lokacioni}</td>
                          <td>{item.nderrimi}</td>
                          <td>
                            {new Date(item.dataRegjistrimit).toLocaleDateString(
                              "sq-AL",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="alert alert-warning text-center">
                    Nuk keni asnjë semestër të regjistruar.
                  </div>
                )}
              </div>
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

export default RegjistrimiSemestrit;
