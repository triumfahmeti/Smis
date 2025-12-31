import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Components/Login/Logout";

function RezervimiList() {
  const navigate = useNavigate();
  const [sallat, setSallat] = useState([]);
  const [rezervimet, setRezervimet] = useState([]);
  const [sallaZgjedhur, setSallaZgjedhur] = useState("");
  const [oraretDisponueshme, setOraretDisponueshme] = useState([]);
  const [orariZgjedhur, setOrariZgjedhur] = useState("");

  // Merr sallat nga backend
  useEffect(() => {
    fetch("http://localhost:5138/api/salla")
      .then((res) => res.json())
      .then((data) => {
        const sallatFiltruara = data.filter(
          (s) =>
            s.sallaId !== null &&
            s.sallaId !== undefined &&
            s.nrSalles !== null &&
            s.nrSalles !== undefined
        );

        setSallat(sallatFiltruara);
        //localStorage.setItem("userId", "3");
      })
      .catch((err) => console.error("Gabim në API /salla:", err));
  }, []);

  // Merr rezervimet
  useEffect(() => {
    fetch("http://localhost:5138/api/rezervimisalles")
      .then((res) => res.json())
      .then((data) => setRezervimet(data))
      .catch((err) => console.error("Gabim në API /rezervimisalles:", err));
  }, []);

  // Filtrimi i orareve të lira sipas sallës së zgjedhur
  useEffect(() => {
    if (!sallaZgjedhur) {
      setOraretDisponueshme([]);
      return;
    }

    const dataESotme = new Date().toISOString().split("T")[0];

    const rezervimetSalles = rezervimet.filter(
      (r) => r?.SallaId?.toString() === sallaZgjedhur && r?.data === dataESotme
    );

    const teGjithaOraret = [
      "09:00 - 10:30",
      "10:40 - 12:10",
      "12:40 - 14:10",
      "14:20 - 15:50",
      "16:00 - 17:30",
    ];

    const oraretTeLira = teGjithaOraret.filter((ora) => {
      const fillimi = ora.split(" ")[0] + ":00"; // e konverton "10:40" në "10:40:00"
      return !rezervimetSalles.some((r) => r.koha === fillimi);
    });

    setOraretDisponueshme(oraretTeLira);
  }, [sallaZgjedhur, rezervimet]);

  if (sallat.length === 0) {
    return <div>Loading sallat...</div>;
  }

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

        {/* CONTENT */}
        <div id="layoutSidenav_content">
          <main className="container-fluid mt-3">
            <h2>Rezervo Sallën</h2>
            <ol className="breadcrumb mb-4">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">Rezervo Sallën</li>
            </ol>

            {/* Dropdown për sallat */}
            <select
              id="sallaSelect"
              value={sallaZgjedhur}
              onChange={(e) => setSallaZgjedhur(e.target.value)}
              className="form-select mb-3"
            >
              <option value="">-- Zgjidh Sallën --</option>
              {sallat.map((salla, index) => (
                <option key={index} value={salla.sallaId}>
                  {salla.nrSalles}
                </option>
              ))}
            </select>

            {sallaZgjedhur && (
              <>
                {(() => {
                  const sallaMatch = sallat.find(
                    (s) => s.sallaId === parseInt(sallaZgjedhur)
                  );
                  return (
                    <h3>
                      Oraret e lira për Sallën{" "}
                      {sallaMatch ? sallaMatch.nrSalles : "(e panjohur)"}
                    </h3>
                  );
                })()}

                {oraretDisponueshme.length === 0 ? (
                  <p>Asnjë orar i lirë për këtë sallë.</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="orariSelect" className="form-label">
                        Zgjidh Orarin:
                      </label>
                      <select
                        id="orariSelect"
                        className="form-select"
                        value={orariZgjedhur}
                        onChange={(e) => setOrariZgjedhur(e.target.value)}
                      >
                        <option value="">-- Zgjidh Orarin --</option>
                        {oraretDisponueshme.map((ora, index) => (
                          <option key={index} value={ora}>
                            {ora}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (
                          !sallaZgjedhur ||
                          !orariZgjedhur ||
                          parseInt(sallaZgjedhur) === 0
                        ) {
                          console.log("Ju lutem zgjidhni sallën dhe orarin.");
                          alert("Ju lutem zgjidhni sallën dhe orarin!");
                          return;
                        }

                        const kohaESakt = orariZgjedhur
                          .split(" ")[0]
                          .padEnd(8, ":00");

                        const rezervimi = {
                          stafiAkademikId: localStorage.getItem("stafId"), // kjo vlerë ndoshta do merret nga login
                          SallaId: parseInt(sallaZgjedhur),
                          data: new Date().toISOString().split("T")[0],
                          koha: kohaESakt,
                        };

                        // Kontrollo nëse ekziston tashmë një rezervim identik
                        const ekzistonRezervimi = rezervimet.some(
                          (r) =>
                            r.SallaId === rezervimi.SallaId &&
                            r.data === rezervimi.data &&
                            r.koha === rezervimi.koha
                        );

                        if (ekzistonRezervimi) {
                          console.log(
                            " Kjo sallë është tashmë e rezervuar për këtë orar!"
                          );
                          alert(
                            "Kjo sallë është tashmë e rezervuar për këtë orar!"
                          );
                          return;
                        }

                        console.log("Rezervimi që po dërgohet:", rezervimi);

                        fetch("http://localhost:5138/api/rezervimisalles", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(rezervimi),
                        })
                          .then((res) => {
                            if (!res.ok) {
                              return res.text().then((text) => {
                                throw new Error(text);
                              });
                            }
                            return res.json();
                          })
                          .then((data) => {
                            console.log("Rezervimi u bë me sukses!");
                            alert("Rezervimi u bë me sukses!");
                            setRezervimet((prev) => [...prev, rezervimi]); // Shto rezervimin direkt në listë
                            setOraretDisponueshme((prev) =>
                              prev.filter((ora) => ora !== orariZgjedhur)
                            );
                            setOrariZgjedhur("");
                          })
                          .catch((error) => {
                            console.error("Gabim:", error.message);
                            console.log(
                              "Ndodhi një gabim gjatë rezervimit: " +
                                error.message
                            );
                          });
                      }}
                    >
                      Rezervo
                    </button>
                  </>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="footer text-center mt-4 mb-3">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="http://www.smis.education" target="_blank" rel="noreferrer">
          www.smis.education
        </a>
      </div>
    </div>
  );
}

export default RezervimiList;
