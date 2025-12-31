import React, { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { logout } from "../Components/Login/Logout";

const VendosNota = () => {
  const { paraqitjaId } = useParams();
  console.log("ParaqitjaId nga params:", paraqitjaId); // duhet me dal p.sh. "1"

  const [nota, setNota] = useState("");
  const navigate = useNavigate();

  console.log("Po dergohet nota:", {
    paraqitjaId: parseInt(paraqitjaId),
    notaNr: parseFloat(nota),
  });

useEffect(() => {
  async function fetchNota() {
    try {
      const res = await fetch(`http://localhost:5138/api/nota/byParaqitja/${paraqitjaId}`);

      if (res.ok) {
        const data = await res.json();
        if (data && data.notaNr !== undefined) {
          setNota(data.notaNr);
        }
      } else {
        console.warn("Nuk u gjet nota ekzistuese për këtë paraqitje.");
      }
    } catch (err) {
      console.error("Gabim gjatë marrjes së notës ekzistuese:", err);
    }
  }

  if (paraqitjaId) fetchNota();
}, [paraqitjaId]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nota || parseFloat(nota) < 0 || parseFloat(nota) > 10) {
      console.log("Ju lutem vendosni një notë nga 0 deri në 10!");
      return;
    }

    console.log({
      paraqitjaId: parseInt(paraqitjaId),
      notaNr: parseFloat(nota),
    });
    const notaNumerike = parseFloat(nota); // nga inputi
let notaShkronje = "";

if (notaNumerike >= 9) {
  notaShkronje = "A";
} else if (notaNumerike >= 8) {
  notaShkronje = "B";
} else if (notaNumerike >= 7) {
  notaShkronje = "C";
} else if (notaNumerike >= 6) {
  notaShkronje = "D";
} else {
  notaShkronje = "F";
}

const data = {
  paraqitjaId: parseInt(paraqitjaId),
  notaNr: notaNumerike,
  notaShkronje: notaShkronje,
  studentiId: localStorage.getItem("studentId") // duhet ta plotësosh këtë variabël saktë!
};

    try {
      const res = await fetch("http://localhost:5138/api/nota/vendos-thjesht", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
     body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("Nota u vendos me sukses!");
        navigate("/provimet-e-paraqitura"); // <-- Ky është rikthimi prapa
      } else {
        const errorData = await res.json();
        console.log(errorData.message || "Gabim gjatë vendosjes së notës.");
      }
    } catch (err) {
      console.error("Gabim:", err);
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
                  Rezervo Sallen
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
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content" className="d-flex flex-column">
          <main className="flex-grow-1">
            <div className="container-fluid px-4">
              <h2 className="mt-4">Vendos notën</h2>

              <div
                className="card shadow p-4 mx-auto mb-5"
                style={{
                  maxWidth: "70000px",
                  minHeight: "300px",
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nota:</label>
                    <select
                      className="form-control"
                      value={nota}
                      onChange={(e) => setNota(e.target.value)}
                    >
                      <option value="">Zgjedh notën</option>
                      <option value="0">0</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Vendos Notën
                  </button>
                </form>
              </div>
            </div>
          </main>

          <footer className="footer bg-light text-center py-3 mt-auto border-top">
            <div>
              <h5>
                © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë,
                Kosovë
              </h5>
              <h6>
                Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net
              </h6>
              <a
                href="https://www.smis.education"
                target="_blank"
                rel="noreferrer"
              >
                www.smis.education
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default VendosNota;
