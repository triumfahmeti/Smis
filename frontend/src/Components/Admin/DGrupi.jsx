import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";
import axiosClient from "../Login/AxiosClient";
import { logout } from "../Login/Logout";

const DGrupi = () => {
  const navigate = useNavigate();

  const [grupet, setGrupet] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtrat
  const [semestriFilter, setSemestriFilter] = useState("");
  const [departamentiFilter, setDepartamentiFilter] = useState("");
  const [emriGrupitFilter, setEmriGrupitFilter] = useState("");
  const [aktivFilter, setAktivFilter] = useState("");

  useEffect(() => {
    const fetchGrupet = async () => {
      try {
        const departamentiId = localStorage.getItem("departamentiId");
        if (!departamentiId) {
          setLoading(false);
          return alert("Mungon departamentiId në localStorage.");
        }

        // ⚠️ Nëse endpoint-i yt është ndryshe, përshtate rrugën:
        const res = await axiosClient.get(`/grupi/departamenti/${departamentiId}`);
        setGrupet(res.data || []);
      } catch (err) {
        console.error("❌ Gabim gjatë marrjes së grupeve:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          alert("Sesion i skaduar, ju lutem kyquni përsëri.");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGrupet();
  }, [navigate]);

  // Vlera unike për dropdown filters
  const uniqueSemestrat = [...new Set((grupet || []).map(g => g.semestri1).filter(Boolean))];
  const uniqueDepartamentet = [...new Set((grupet || []).map(g => g.emriDepartamentit).filter(Boolean))];
  const uniqueEmratGrupit = [...new Set((grupet || []).map(g => g.emri).filter(Boolean))];

  // Filtrimi
  const filteredGrupet = (grupet || []).filter((g) => {
    const bySemestri = !semestriFilter || g.semestri1 === semestriFilter;
    const byDepartamenti = !departamentiFilter || g.emriDepartamentit === departamentiFilter;
    const byEmri = !emriGrupitFilter || g.emri === emriGrupitFilter;
    const byAktiv =
      aktivFilter === "" ||
      (aktivFilter === "true" && g.aktiv === true) ||
      (aktivFilter === "false" && g.aktiv === false);

    return bySemestri && byDepartamenti && byEmri && byAktiv;
  });

  return (
    <div className="sb-nav-fixed">
      {/* Navbar (si te DUniversiteti) */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">
          KOLEGJI UBT-SMIS
        </a>

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
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/profiliadmin">Profili Im</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/studentet">Studentet</a></li>
              <li><a className="dropdown-item" href="/stafiakademik">Stafi Akademik</a></li>
              <li><a className="dropdown-item" href="/grupi">Grupi</a></li>
              <li><a className="dropdown-item" href="/studentetgrupi">Studentet ne grupe</a></li>
              <li><a className="dropdown-item" href="/lenda">Lenda</a></li>
            </ul>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#!">Settings</a></li>
              <li><a className="dropdown-item" href="#!">Activity Log</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => logout(navigate)}>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Sidenav + Content */}
      <div id="layoutSidenav">
        {/* Sidebar */}
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

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Grupet e Fakultetit</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/add-grup")}
              >
                ➕ Add Group
              </button>
            </div>

            {/* Filtrat */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label>Semestri</label>
                <select
                  className="form-select"
                  value={semestriFilter}
                  onChange={(e) => setSemestriFilter(e.target.value)}
                >
                  <option value="">Të gjithë semestrat</option>
                  {uniqueSemestrat.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>Departamenti</label>
                <select
                  className="form-select"
                  value={departamentiFilter}
                  onChange={(e) => setDepartamentiFilter(e.target.value)}
                >
                  <option value="">Të gjithë departamentet</option>
                  {uniqueDepartamentet.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>Emri i Grupit</label>
                <select
                  className="form-select"
                  value={emriGrupitFilter}
                  onChange={(e) => setEmriGrupitFilter(e.target.value)}
                >
                  <option value="">Të gjithë grupet</option>
                  {uniqueEmratGrupit.map((emri) => (
                    <option key={emri} value={emri}>{emri}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label>Aktiv</label>
                <select
                  className="form-select"
                  value={aktivFilter}
                  onChange={(e) => setAktivFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  <option value="true">Aktiv</option>
                  <option value="false">Jo aktiv</option>
                </select>
              </div>
            </div>

            {/* Tabela */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Emri</th>
                    <th>Semestri</th>
                    <th>Departamenti</th>
                    <th>Kapaciteti</th>
                    <th>Aktiv</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center">Duke u ngarkuar…</td>
                    </tr>
                  ) : filteredGrupet.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center">Nuk u gjet asnjë rezultat.</td>
                    </tr>
                  ) : (
                    filteredGrupet.map((grupi) => (
                      <tr
                        key={grupi.grupiId}
                        onClick={() => navigate(`/studentet-e-grupit/${grupi.grupiId}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* Emri i grupit */}
                        <td>{grupi.emri}</td>

                        {/* Semestri – shfaq emrin nëse e ke në API, përndryshe përdor semestriId */}
                        <td>{grupi.semestri1 ?? grupi.semestriEmri ?? `ID: ${grupi.semestriId}`}</td>

                        {/* Departamenti – shfaq emrin nëse e ke në API, përndryshe përdor departamentiId */}
                        <td>{grupi.emriDepartamentit ?? `ID: ${grupi.departamentiId}`}</td>

                       

                        {/* Kapaciteti */}
                        <td>{grupi.kapaciteti ?? "—"}</td>

                        {/* Aktiv si Po/Jo */}
                        <td>{grupi.aktiv ? "Po" : "Jo"}</td>

                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-grup/${grupi.grupiId}`);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/delete-grup/${grupi.grupiId}`);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="footer bg-dark text-white text-center py-3 mt-auto">
        <h4>© 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë</h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education" className="text-white" target="_blank" rel="noopener noreferrer">
          www.smis.education
        </a>
      </div>
    </div>
  );
};

export default DGrupi;
