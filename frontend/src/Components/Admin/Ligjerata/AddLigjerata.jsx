// AddLigjerata.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../../Login/AxiosClient";
import { logout } from "../../Login/Logout";

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
  let dep = pickFromLS("DepartamentiId", "DepartamentiID", "departamentiId", "departmentId", "DepId");

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

const toIntOrNull = (v) => (v === "" || v === undefined || v === null ? null : Number(v));
/* =================================================== */

const AddLigjerata = () => {
  const navigate = useNavigate();

  const [stafiList, setStafiList] = useState([]);
  const [lendetList, setLendetList] = useState([]);

  const [ligjerataData, setLigjerataData] = useState({
    StafiId: "",
    LendaId: ""
  });

  const [errors, setErrors] = useState({});

  // 1) nxirr Uni/Dep nga localStorage (si AddStudent)
  const { uni, dep } = getAdminIdsFromStorage();

  useEffect(() => {
    const fetchDropdowns = async () => {
      if (!dep) {
        alert("Nuk u gjet DepartamentiId në localStorage. Ju lutem rifreskoni sesionin.");
        return;
      }
      try {
        // ===== STAFI =====
        // Provo endpoint scoped: /stafiakademik/universiteti/{uni}/departamenti/{dep}
        let stafi = [];
        try {
          if (uni) {
            const { data } = await axiosClient.get(`/stafiakademik/universiteti/${uni}/departamenti/${dep}`);
            stafi = Array.isArray(data) ? data : [];
          } else {
            throw new Error("S'ka uniId - kalo te fallback");
          }
        } catch {
          // Fallback: mer të gjithë stafin dhe filtro nga departamenti
          const { data } = await axiosClient.get(`/stafiakademik`);
          stafi = (Array.isArray(data) ? data : []).filter(
            s => String(s.departamentiId ?? s.DepartamentiId) === String(dep)
          );
        }
        setStafiList(stafi);

        // ===== LENDET =====
        // Kemi endpoint stabil: /lenda/departamenti/{dep}
        try {
          const { data } = await axiosClient.get(`/lenda/departamenti/${dep}`);
          setLendetList(Array.isArray(data) ? data : []);
        } catch (err) {
          // Nëse ke krijuar edhe: /lenda/universiteti/{uni}/departamenti/{dep}, mund ta provosh para fallback-ut
          console.error("Gabim gjatë marrjes së lëndëve:", err);
          setLendetList([]);
        }
      } catch (error) {
        console.error("Gabim gjatë marrjes së dropdown-eve:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate('/login');
        } else {
          alert("Gabim gjatë ngarkimit të të dhënave.");
        }
      }
    };

    fetchDropdowns();
  }, [navigate, uni, dep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLigjerataData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const nErr = {};
    if (!ligjerataData.StafiId) nErr.StafiId = "Zgjidh profesorin.";
    if (!ligjerataData.LendaId) nErr.LendaId = "Zgjidh lëndën.";
    setErrors(nErr);
    return Object.keys(nErr).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      StafiId: toIntOrNull(ligjerataData.StafiId),
      LendaId: toIntOrNull(ligjerataData.LendaId)
      // nëse më vonë shton Orar/ditë/klasë etj, shtoji këtu
    };

    try {
      await axiosClient.post("/ligjerata", payload);
      alert("Ligjerata u shtua me sukses!");
      navigate("/ligjerata");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string" ? error.response.data : JSON.stringify(error?.response?.data)) ||
        error.message;
      console.error("Gabim gjatë shtimit të ligjeratës:", error?.response || error);
      alert("Gabim gjatë shtimit të ligjeratës:\n" + msg);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
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
      </nav> <nav className="sb-topnav navbar navbar-expand navbar-dark">
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
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <Link className="nav-link" to="/studentet">Studentet</Link>
                <Link className="nav-link" to="/stafiakademik">Stafi Akademik</Link>
                <Link className="nav-link" to="/lenda">Lendet</Link>
                <Link className="nav-link" to="/ligjerata">Ligjerata</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Shto Ligjeratë të Re</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Zgjidh Stafin</label>
                  <select
                    name="StafiId"
                    className={`form-select ${errors.StafiId ? "is-invalid" : ""}`}
                    value={ligjerataData.StafiId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidh Profesorin</option>
                    {stafiList.map(staf => (
                      <option key={staf.stafiId ?? staf.StafiId} value={String(staf.stafiId ?? staf.StafiId)}>
                        {(staf.emri ?? staf.Emri) + " " + (staf.mbiemri ?? staf.Mbiemri)}
                      </option>
                    ))}
                  </select>
                  {errors.StafiId && <div className="text-danger">{errors.StafiId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Zgjidh Lëndën</label>
                  <select
                    name="LendaId"
                    className={`form-select ${errors.LendaId ? "is-invalid" : ""}`}
                    value={ligjerataData.LendaId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidh Lëndën</option>
                    {lendetList.map(l => (
                      <option key={l.lendaId ?? l.LendaId} value={String(l.lendaId ?? l.LendaId)}>
                        {l.emri ?? l.Emri}
                      </option>
                    ))}
                  </select>
                  {errors.LendaId && <div className="text-danger">{errors.LendaId}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">Shto Ligjeratë</button>
            </form>
          </main>
        </div>
      </div>

      {/* Footer (opsionale) */}
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

export default AddLigjerata;
