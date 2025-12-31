import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';
import { logout } from '../../Login/Logout';

/* ===================== Helpers ===================== */
// lexon vlerë nga disa çelësa të mundshëm në localStorage
const pickFromLS = (...keys) => {
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && v !== "null" && v !== "undefined" && String(v).trim() !== "") {
      return v;
    }
  }
  return null;
};

// gjej UniId (universitetiId) / DepartamentiId edhe në objekte JSON (p.sh. "user")
const getAdminIdsFromStorage = () => {
  let uni = pickFromLS("universitetiId", "UniId", "UniID", "uniId", "universityId");
  let dep = pickFromLS("departamentiId", "DepartamentiId", "DepartamentiID", "departmentId", "DepId");

  if (!uni || !dep) {
    const userRaw = pickFromLS("user", "currentUser", "auth.user", "authUser");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (!uni) uni = String(u?.universitetiId ?? u?.uniId ?? u?.UniId ?? u?.universityId ?? "");
        if (!dep) dep = String(u?.departamentiId ?? u?.DepartamentiId ?? u?.departmentId ?? "");
      } catch { /* ignore */ }
    }
  }

  return {
    uni: uni ? String(uni) : "",
    dep: dep ? String(dep) : "",
  };
};

// kthen int ose null (mos dërgo 0/NaN te backend)
const toIntOrNull = (v) => (v === "" || v === undefined || v === null ? null : Number(v));
/* =================================================== */

const AddLenda = () => {
  const navigate = useNavigate();

  // IDs fikse nga llogaria e adminit
  const [ctxIds, setCtxIds] = useState({ uni: "", dep: "" });

  // Dropdown sources
  const [universitetet, setUniversitetet] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);
  const [allSemestrat, setAllSemestrat] = useState([]);
  const [semestrat, setSemestrat] = useState([]);

  // Forma
  const [lendaData, setLendaData] = useState({
    Emri: "",
    Kredite: "",
    SemestriId: "",
    Kategoria: ""
  });

  const [errors, setErrors] = useState({});

  // 1) Lexo Uni/Dep nga LS
  useEffect(() => {
    const ids = getAdminIdsFromStorage();
    setCtxIds(ids);
  }, []);

  // 2) Fetch të dhënave (universitete, departamente, semestra)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, depRes, semRes] = await Promise.all([
          axiosClient.get("/universiteti"),
          axiosClient.get("/departamenti"),
          axiosClient.get("/semestri"),
        ]);
        setUniversitetet(uniRes.data || []);
        setDepartamentet(depRes.data || []);
        setAllSemestrat(semRes.data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate('/login');
        }
      }
    };
    fetchData();
  }, [navigate]);

  // 3) Filtrim i semestrave sipas universitetit të adminit
  useEffect(() => {
    if (!ctxIds.uni) {
      setSemestrat([]);
      return;
    }
    const uniIdNum = Number(ctxIds.uni);
    const filtered = (allSemestrat || []).filter(
      (s) => Number(s.uniId ?? s.UniId) === uniIdNum
    );
    setSemestrat(filtered);
  }, [ctxIds.uni, allSemestrat]);

  // UI helpers — emri i Uni/Dep për read-only
  const selectedUni = universitetet.find((u) => String(u.uniId ?? u.UniId) === String(ctxIds.uni));
  const selectedDep = departamentet.find((d) => String(d.departamentiId) === String(ctxIds.dep));

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLendaData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!lendaData.Emri || !lendaData.Emri.trim()) newErrors.Emri = "Shkruaj emrin e lëndës.";
    if (!lendaData.Kredite || Number.isNaN(Number(lendaData.Kredite)) || Number(lendaData.Kredite) <= 0) {
      newErrors.Kredite = "Shkruaj kredite (>0).";
    }
    if (!lendaData.SemestriId) newErrors.SemestriId = "Zgjidh semestrin.";
    if (!lendaData.Kategoria) newErrors.Kategoria = "Zgjidh kategorinë.";
    if (!ctxIds.dep) newErrors.DepartamentiId = "Nuk u gjet DepartamentiId i adminit.";
    if (!ctxIds.uni) newErrors.UniId = "Nuk u gjet UniversitetiId i adminit.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      Emri: lendaData.Emri,
      Kredite: toIntOrNull(lendaData.Kredite),
      DepartamentiId: toIntOrNull(ctxIds.dep),  // nga LS
      SemestriId: toIntOrNull(lendaData.SemestriId),
      Kategoria: lendaData.Kategoria
    };

    try {
      await axiosClient.post("/lenda", payload);
      alert("Lënda u shtua me sukses!");
      navigate("/lenda");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string" ? error.response.data : JSON.stringify(error?.response?.data)) ||
        error.message;
      console.error("Gabim backend:", error?.response || error);
      alert("Gabim gjatë shtimit të lëndës:\n" + msg);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
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

      {/* Sidebar and Page Content */}
      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profili-im">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div> Profili im
                </Link>
                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Studentet
                </Link>
                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Stafi Akademik
                </Link>
                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Grupi
                </Link>
                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Lenda
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Shto Lëndë të Re</h2>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Emri */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emri</label>
                    <input
                      type="text"
                      name="Emri"
                      className={`form-control ${errors.Emri ? "is-invalid" : ""}`}
                      value={lendaData.Emri}
                      onChange={handleChange}
                      required
                    />
                    {errors.Emri && <div className="text-danger">{errors.Emri}</div>}
                  </div>

                  {/* Kredite */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kredite</label>
                    <input
                      type="number"
                      name="Kredite"
                      className={`form-control ${errors.Kredite ? "is-invalid" : ""}`}
                      value={lendaData.Kredite}
                      onChange={handleChange}
                      required
                    />
                    {errors.Kredite && <div className="text-danger">{errors.Kredite}</div>}
                  </div>

                  {/* Universiteti — read-only */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Universiteti</label>
                    <input
                      className="form-control"
                      value={
                        selectedUni?.emri ||
                        (ctxIds.uni ? `Uni ID: ${ctxIds.uni}` : "— nuk u gjet UniId —")
                      }
                      readOnly
                    />
                    {errors.UniId && <div className="text-danger">{errors.UniId}</div>}
                  </div>

                  {/* Departamenti — read-only */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Departamenti</label>
                    <input
                      className="form-control"
                      value={
                        selectedDep?.emri ||
                        (ctxIds.dep ? `Departamenti ID: ${ctxIds.dep}` : "— nuk u gjet DepartamentiId —")
                      }
                      readOnly
                    />
                    {errors.DepartamentiId && <div className="text-danger">{errors.DepartamentiId}</div>}
                  </div>

                  {/* Semestri — filtrohet sipas universitetit */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Semestri</label>
                    <select
                      name="SemestriId"
                      className={`form-select ${errors.SemestriId ? "is-invalid" : ""}`}
                      value={lendaData.SemestriId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Semestrin</option>
                      {semestrat.map((s) => (
                        <option key={s.semestriId} value={String(s.semestriId)}>
                          {s.semestri1}
                        </option>
                      ))}
                    </select>
                    {errors.SemestriId && <div className="text-danger">{errors.SemestriId}</div>}
                  </div>

                  {/* Kategoria */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kategoria</label>
                    <select
                      name="Kategoria"
                      className={`form-select ${errors.Kategoria ? "is-invalid" : ""}`}
                      value={lendaData.Kategoria}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Kategorinë</option>
                      <option value="Obligative">Obligative</option>
                      <option value="Zgjedhore">Zgjedhore</option>
                    </select>
                    {errors.Kategoria && <div className="text-danger">{errors.Kategoria}</div>}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Shto Lëndë</button>
              </form>
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

export default AddLenda;
