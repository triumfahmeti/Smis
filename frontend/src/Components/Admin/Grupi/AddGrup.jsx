import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../../Login/AxiosClient";
import { logout } from "../../Login/Logout";

/* ===================== Helpers (si te AddStudent) ===================== */
const pickFromLS = (...keys) => {
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && v !== "null" && v !== "undefined" && String(v).trim() !== "") {
      return v;
    }
  }
  return null;
};

const getAdminIdsFromStorage = () => {
  let uni = pickFromLS("universitetiId", "UniId", "UniID", "uniId", "universityId");
  let dep = pickFromLS("DepartamentiId", "departamentiId", "DepartamentiID", "DepId", "departmentId");

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
/* ===================================================================== */

const AddGrupi = () => {
  const navigate = useNavigate();

  // Dropdown data
  const [semestrat, setSemestrat] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);

  // Form state (UI)
  const [grupiData, setGrupiData] = useState({
    emri: "",
    semestriId: "",
    departamentiEmri: "",   // vetëm për UI (read-only)
    orariId: "",
    kapaciteti: "",
    aktiv: true,
  });

  // ID të fshehura vetëm për backend
  const [hiddenDepartamentiId, setHiddenDepartamentiId] = useState("");
  const [hiddenUniId, setHiddenUniId] = useState("");

  // 1) Lexo Uni/Dep nga localStorage dhe popullo UI me emrin e departamentit
  useEffect(() => {
    const { uni, dep } = getAdminIdsFromStorage();
    setHiddenUniId(uni || "");
    setHiddenDepartamentiId(dep || "");

    const fetchData = async () => {
      try {
        // merr departamentet & semestrat
        const [depRes, semRes] = await Promise.all([
          axiosClient.get("/departamenti"),
          axiosClient.get("/semestri"),
        ]);

        const depData = depRes.data || [];
        const semData = semRes.data || [];

        setDepartamentet(depData);

        // Filtrim i semestrave sipas UniId (njëjtë si te AddStudent)
        if (uni) {
          const filteredSem = semData.filter(s => Number(s.uniId ?? s.UniId) === Number(uni));
          setSemestrat(filteredSem);
        } else {
          setSemestrat(semData);
        }

        // gjej emrin e departamentit për ID nga LS dhe vendose në UI (read-only)
        if (dep) {
          const match = depData.find(d => String(d.departamentiId) === String(dep));
          setGrupiData(prev => ({
            ...prev,
            departamentiEmri: match?.emri || prev.departamentiEmri || "",
          }));
        }
      } catch (err) {
        console.error("❌ Gabim gjatë marrjes së listave:", err?.response?.data || err?.message || err);
      }
    };

    fetchData();
  }, []);

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGrupiData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validime bazike
    if (!grupiData.emri.trim()) return alert("Shkruaj emrin e grupit.");
    if (!grupiData.semestriId) return alert("Zgjidh semestrin.");
    if (!grupiData.kapaciteti) return alert("Shkruaj kapacitetin.");
    if (!grupiData.departamentiEmri) return alert("Nuk u gjet emri i departamentit.");

    // Siguro ID e departamentit për API (UI s’e shfaq fare)
    let departamentiIdToSend = hiddenDepartamentiId;
    if (!departamentiIdToSend) {
      const byName = departamentet.find(
        d => String(d.emri).toLowerCase() === String(grupiData.departamentiEmri).toLowerCase()
      );
      if (byName) departamentiIdToSend = byName.departamentiId;
    }
    if (!departamentiIdToSend) {
      return alert("Nuk u arrit të gjendet DepartamentiId për emrin e dhënë.");
    }

    const payload = {
      Emri: grupiData.emri,
      SemestriId: Number(grupiData.semestriId),
      DepartamentiId: Number(departamentiIdToSend), // vetëm për backend
      OrariId: grupiData.orariId ? Number(grupiData.orariId) : null,
      Kapaciteti: Number(grupiData.kapaciteti),
      Aktiv: Boolean(grupiData.aktiv),
    };

    try {
      await axiosClient.post("/grupi", payload);
      alert("Grupi u shtua me sukses!");
      navigate("/grupi");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error?.response?.data)) ||
        error.message;
      console.error("Gabim gjatë shtimit të grupit:", error?.response || error);
      alert("Gabim gjatë shtimit të grupit:\n" + msg);
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
           </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
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

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Shto Grup të Ri</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Emri */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Emri</label>
                  <input
                    type="text"
                    name="emri"
                    className="form-control"
                    value={grupiData.emri}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Semestri (i filtruar sipas UniId) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Semestri</label>
                  <select
                    name="semestriId"
                    className="form-select"
                    value={grupiData.semestriId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Zgjidh Semestrin</option>
                    {semestrat.map(s => (
                      <option key={s.semestriId} value={s.semestriId}>
                        {s.semestri1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Departamenti — VETËM EMRI (read-only) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Departamenti</label>
                  <input
                    type="text"
                    className="form-control"
                    value={grupiData.departamentiEmri || "— nuk u gjet —"}
                    readOnly
                  />
                </div>

                {/* Orari ID (opsionale) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Orari ID</label>
                  <input
                    type="number"
                    name="orariId"
                    className="form-control"
                    value={grupiData.orariId}
                    onChange={handleChange}
                  />
                </div>

                {/* Kapaciteti */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Kapaciteti</label>
                  <input
                    type="number"
                    name="kapaciteti"
                    className="form-control"
                    value={grupiData.kapaciteti}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Aktiv */}
                <div className="col-md-6 mb-3 form-check mt-4">
                  <input
                    type="checkbox"
                    name="aktiv"
                    id="aktiv"
                    className="form-check-input"
                    checked={grupiData.aktiv}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="aktiv">Aktiv</label>
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Shto Grup
              </button>
            </form>
          </main>
        </div>
      </div>

      {/* Footer (opsionale) */}
    </div>
  );
};

export default AddGrupi;
