import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { logout } from "../../Login/Logout";

const EditLigjerata = () => {
  const { stafiId, lendaId } = useParams();
  const navigate = useNavigate();

  const [ligjerata, setLigjerata] = useState({
    StafiId: "",
    LendaId: ""
  });

  const [stafiList, setStafiList] = useState([]);
  const [lendetList, setLendetList] = useState([]);

  useEffect(() => {
    async function fetchLigjerata() {
      try {
        const res = await fetch(`http://localhost:5138/api/ligjerata/${stafiId}/${lendaId}`);
        if (res.ok) {
          const data = await res.json();
          setLigjerata({
            StafiId: data.stafiId,
            LendaId: data.lendaId
          });
        } else {
          alert("Ligjerata nuk u gjet");
          navigate("/ligjeratat");
        }
      } catch (err) {
        console.error("Gabim ne fetch", err);
        navigate("/ligjeratat");
      }
    }

    async function fetchStafi() {
      const res = await fetch("http://localhost:5138/api/stafiakademik");
      if (res.ok) setStafiList(await res.json());
    }

    async function fetchLendet() {
      const res = await fetch("http://localhost:5138/api/lenda");
      if (res.ok) setLendetList(await res.json());
    }

    fetchLigjerata();
    fetchStafi();
    fetchLendet();
  }, [stafiId, lendaId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLigjerata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:5138/api/ligjerata/${stafiId}/${lendaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ligjerata)
    });

    if (res.ok) {
      alert("Ligjerata u përditësua me sukses!");
      navigate("/ligjeratat");
    } else {
      alert("Gabim gjatë përditësimit të ligjeratës");
    }
  };

  return (
    <div className="sb-nav-fixed">
       <nav className="sb-topnav navbar navbar-expand navbar-dark">
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
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="#!">
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={() => logout(navigate)}>
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
                <Link className="nav-link" to="/studentet">Studentet</Link>
                <Link className="nav-link" to="/stafiakademik">Stafi Akademik</Link>
                <Link className="nav-link" to="/ligjeratat">Ligjeratat</Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Edito Ligjeratën</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Profesori</label>
                  <select
                    name="StafiId"
                    className="form-select"
                    value={ligjerata.StafiId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidh Profesorin</option>
                    {stafiList.map((s) => (
                      <option key={s.stafiId} value={s.stafiId}>
                        {s.emri} {s.mbiemri}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Lënda</label>
                  <select
                    name="LendaId"
                    className="form-select"
                    value={ligjerata.LendaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidh Lëndën</option>
                    {lendetList.map((l) => (
                      <option key={l.lendaId} value={l.lendaId}>
                        {l.emri}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3">Ruaj Ndryshimet</button>
            </form>
          </main>
        </div>
      </div>

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

export default EditLigjerata;
