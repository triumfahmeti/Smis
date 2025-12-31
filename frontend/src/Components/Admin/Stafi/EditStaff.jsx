// EditStaf.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from "../../Login/AxiosClient";
import { logout } from "../../Login/Logout";


/* ===================== Helpers (si te AddStudent/AddStaf) ===================== */
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
  let dep = pickFromLS("departamentiId", "DepartamentiId", "DepartamentiID", "departmentId", "DepId");

  if (!uni || !dep) {
    const userRaw = pickFromLS("user", "currentUser", "auth.user", "authUser");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (!uni) uni = String(u?.universitetiId ?? u?.uniId ?? u?.UniId ?? u?.universityId ?? "");
        if (!dep) dep = String(u?.departamentiId ?? u?.DepartamentiId ?? u?.departmentId ?? "");
      } catch {}
    }
  }
  return { uni: uni ? String(uni) : "", dep: dep ? String(dep) : "" };
};

const toIntOrNull = (v) => (v === "" || v === undefined || v === null ? null : Number(v));
/* ============================================================================ */

const EditStaf = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ===== USER =====
  const [userData, setUserData] = useState({
    Emri: '', Mbiemri: '', Email: '', Password: '',
    Datelindja: '', NrLeternjoftimit: '', VendLindja: '',
    Gjinia: '', Shteti: '', Vendbanimi: '', Adresa: '',
    Zipkodi: '', Telefoni: '', Nenshtetesia: '',
    RoleId: 3, Foto: ''
  });

  // ===== STAFI =====
  const [staffData, setStaffData] = useState({
    VitiRegjistrimit: '', RoliStafit: '', Titulli: '',
    DepartamentiId: '', UniId: ''
  });

  const [errors, setErrors] = useState({});
  const [universitetet, setUniversitetet] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);

  // ===== FETCH: stafi + listat =====
  useEffect(() => {
    async function fetchAll() {
      try {
        const [{ data: stafi }, uniRes, depRes] = await Promise.all([
          axiosClient.get(`/stafiakademik/${id}`),
          axiosClient.get("/universiteti"),
          axiosClient.get("/departamenti"),
        ]);

        setUniversitetet(uniRes.data || []);
        setDepartamentet(depRes.data || []);

        // vendos user data
        setUserData({
          Emri: stafi.emri ?? '',
          Mbiemri: stafi.mbiemri ?? '',
          Email: stafi.email ?? '',
          Password: stafi.password ?? '',
          Datelindja: stafi.datelindja ? String(stafi.datelindja).split('T')[0] : '',
          NrLeternjoftimit: stafi.nrLeternjoftimit ?? '',
          VendLindja: stafi.vendLindja ?? '',
          Gjinia: stafi.gjinia ?? '',
          Shteti: stafi.shteti ?? '',
          Vendbanimi: stafi.vendbanimi ?? '',
          Adresa: stafi.adresa ?? '',
          Zipkodi: stafi.zipkodi ?? '',
          Telefoni: stafi.telefoni ?? '',
          Nenshtetesia: stafi.nenshtetesia ?? '',
          RoleId: stafi.roleId ?? 3,
          Foto: stafi.foto ?? ''
        });

        // lexo Uni/Dep nga LS dhe mbivendos (si te AddStudent/AddStaf)
        const { uni, dep } = getAdminIdsFromStorage();
        setStaffData({
          VitiRegjistrimit: stafi.vitiRegjistrimit ?? '',
          RoliStafit: stafi.roliStafit ?? '',
          Titulli: stafi.titulli ?? '',
          UniId: uni || stafi.uniId || '',
          DepartamentiId: dep || stafi.departamentiId || '',
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error?.response?.data || error.message);
        alert("Stafi nuk u gjet.");
        navigate('/stafiakademik');
      }
    }

    fetchAll();
  }, [id, navigate]);

  // ===== VALIDIMET =====
  const validateForm = async () => {
    const newErrors = {};
    const required = [
      "Emri","Mbiemri","Email","Password","Datelindja","NrLeternjoftimit",
      "VendLindja","Gjinia","Shteti","Vendbanimi","Adresa","Zipkodi","Telefoni","Nenshtetesia"
    ];
    required.forEach((f) => {
      if (!userData[f] || String(userData[f]).trim() === "") {
        newErrors[f] = "Kjo fushë është e detyrueshme.";
      }
    });

    const nameRegex = /^[A-ZÇËa-zçë\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{8,15}$/;
    const zipRegex = /^[0-9]{4,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (userData.Emri && !nameRegex.test(userData.Emri)) newErrors.Emri = "Emri duhet të përmbajë vetëm shkronja.";
    if (userData.Mbiemri && !nameRegex.test(userData.Mbiemri)) newErrors.Mbiemri = "Mbiemri duhet të përmbajë vetëm shkronja.";
    if (!emailRegex.test(userData.Email)) newErrors.Email = "Email-i nuk është në formatin e duhur.";
    if (!passwordRegex.test(userData.Password)) newErrors.Password = "Fjalëkalimi duhet të ketë 1 shkronjë të madhe, 1 numër dhe 1 shenjë speciale.";
    if (userData.Telefoni && !phoneRegex.test(userData.Telefoni)) newErrors.Telefoni = "Telefoni: 8–15 shifra (numra/+).";
    if (userData.Zipkodi && !zipRegex.test(userData.Zipkodi)) newErrors.Zipkodi = "ZIP: vetëm numra (4–10).";
    if (userData.Shteti && !nameRegex.test(userData.Shteti)) newErrors.Shteti = "Shteti duhet të përmbajë vetëm shkronja.";
    if (userData.Nenshtetesia && !nameRegex.test(userData.Nenshtetesia)) newErrors.Nenshtetesia = "Nenshtetësia duhet të përmbajë vetëm shkronja.";
    if (userData.Vendbanimi && !nameRegex.test(userData.Vendbanimi)) newErrors.Vendbanimi = "Vendbanimi duhet të përmbajë vetëm shkronja.";
    if (userData.VendLindja && !nameRegex.test(userData.VendLindja)) newErrors.VendLindja = "Vendlindja duhet të përmbajë vetëm shkronja.";

    if (!staffData.UniId) newErrors.UniId = "Nuk u gjet UniId i adminit.";
    if (!staffData.DepartamentiId) newErrors.DepartamentiId = "Nuk u gjet DepartamentiId i adminit.";
    if (!staffData.RoliStafit) newErrors.RoliStafit = "Zgjidh rolin e stafit.";
    if (!staffData.Titulli) newErrors.Titulli = "Shkruaj titullin akademik.";
    if (!staffData.VitiRegjistrimit) newErrors.VitiRegjistrimit = "Shkruaj vitin e regjistrimit.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===== Handlers =====
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((p) => ({ ...p, [name]: value }));
  };

  const handleStaffChange = (e) => {
    const { name, value } = e.target;
    setStaffData((p) => ({ ...p, [name]: value }));
  };

  // ===== Submit (PUT) =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    const payload = {
      // USER
      Emri: userData.Emri,
      Mbiemri: userData.Mbiemri,
      Email: userData.Email,
      Password: userData.Password,
      Datelindja: userData.Datelindja,
      NrLeternjoftimit: userData.NrLeternjoftimit,
      VendLindja: userData.VendLindja,
      Gjinia: userData.Gjinia,
      Shteti: userData.Shteti,
      Vendbanimi: userData.Vendbanimi,
      Adresa: userData.Adresa,
      Zipkodi: userData.Zipkodi,
      Telefoni: userData.Telefoni,
      Nenshtetesia: userData.Nenshtetesia,
      RoleId: userData.RoleId,
      Foto: userData.Foto || null,

      // STAFI
      VitiRegjistrimit: toIntOrNull(staffData.VitiRegjistrimit),
      RoliStafit: staffData.RoliStafit,
      Titulli: staffData.Titulli,
      DepartamentiId: toIntOrNull(staffData.DepartamentiId),
      UniId: toIntOrNull(staffData.UniId),
    };

    try {
      await axiosClient.put(`/stafiakademik/${id}`, payload);
      alert("Stafi u përditësua me sukses!");
      navigate("/stafiakademik");
    } catch (error) {
      const msg = error?.response?.data?.message
        || error?.response?.data?.title
        || (typeof error?.response?.data === "string" ? error.response.data : JSON.stringify(error?.response?.data))
        || error.message;
      console.error("Gabim gjatë përditësimit:", error?.response || error);
      alert("Gabim gjatë përditësimit të stafit:\n" + msg);
    }
  };

  // ===== UI helpers: emrat read-only për Uni/Dep =====
  const selectedUni = universitetet.find(
    (u) => String(u.uniId ?? u.UniId) === String(staffData.UniId)
  );
  const selectedDep = departamentet.find(
    (d) => String(d.departamentiId) === String(staffData.DepartamentiId)
  );

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
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Studentet
                </Link>
                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Stafi Akademik
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Edito Stafin</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {[
                  { label: "Emri", name: "Emri" },
                  { label: "Mbiemri", name: "Mbiemri" },
                  { label: "Email", name: "Email", type: "email" },
                  { label: "Password", name: "Password", type: "password" },
                  { label: "Datëlindja", name: "Datelindja", type: "date" },
                  { label: "Nr Leternjoftimit", name: "NrLeternjoftimit" },
                  { label: "Vend Lindja", name: "VendLindja" },
                  { label: "Shteti", name: "Shteti" },
                  { label: "Vendbanimi", name: "Vendbanimi" },
                  { label: "Adresa", name: "Adresa" },
                  { label: "ZIP Kodi", name: "Zipkodi" },
                  { label: "Telefoni", name: "Telefoni" },
                  { label: "Nenshtetesia", name: "Nenshtetesia" },
                  { label: "Foto (URL)", name: "Foto" },
                ].map(({ label, name, type = "text" }) => (
                  <div key={name} className="col-md-6 mb-3">
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      name={name}
                      className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                      value={userData[name] ?? ""}
                      onChange={handleUserChange}
                    />
                    {errors[name] && <div className="text-danger">{errors[name]}</div>}
                  </div>
                ))}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gjinia</label>
                  <select
                    name="Gjinia"
                    className={`form-select ${errors.Gjinia ? "is-invalid" : ""}`}
                    value={userData.Gjinia ?? ""}
                    onChange={handleUserChange}
                  >
                    <option value="">Zgjidh Gjininë</option>
                    <option value="Mashkull">Mashkull</option>
                    <option value="Femer">Femer</option>
                  </select>
                  {errors.Gjinia && <div className="text-danger">{errors.Gjinia}</div>}
                </div>
              </div>

              {/* ================== FIXED BY ADMIN ACCOUNT (read-only emrat) ================== */}
              <div className="row">
                {/* UNIVERSITETI — vetëm emri (read-only) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Universiteti</label>
                  <input
                    className="form-control"
                    value={selectedUni?.emri || (staffData.UniId ? `Uni ID: ${staffData.UniId}` : "— nuk u gjet UniId —")}
                    readOnly
                  />
                  <input type="hidden" name="UniId" value={staffData.UniId} />
                  {errors.UniId && <div className="text-danger">{errors.UniId}</div>}
                </div>

                {/* DEPARTAMENTI — vetëm emri (read-only) */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Departamenti</label>
                  <input
                    className="form-control"
                    value={selectedDep?.emri || (staffData.DepartamentiId ? `Departamenti ID: ${staffData.DepartamentiId}` : "— nuk u gjet DepartamentiId —")}
                    readOnly
                  />
                  <input type="hidden" name="DepartamentiId" value={staffData.DepartamentiId} />
                  {errors.DepartamentiId && <div className="text-danger">{errors.DepartamentiId}</div>}
                </div>

                {/* Roli i stafit */}
                <div className="col-md-6 mb-3">
                  <label>Roli i Stafit</label>
                  <select
                    name="RoliStafit"
                    className={`form-select ${errors.RoliStafit ? "is-invalid" : ""}`}
                    value={staffData.RoliStafit}
                    onChange={handleStaffChange}
                    required
                  >
                    <option value="">Zgjidh rolin</option>
                    <option value="Profesor">Profesor</option>
                    <option value="Asistent">Asistent</option>
                    <option value="Ligjërues">Ligjërues</option>
                    <option value="Udhëheqës Departamenti">Udhëheqës Departamenti</option>
                  </select>
                  {errors.RoliStafit && <div className="text-danger">{errors.RoliStafit}</div>}
                </div>

                {/* Titulli */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Titulli</label>
                  <input
                    type="text"
                    name="Titulli"
                    className={`form-control ${errors.Titulli ? "is-invalid" : ""}`}
                    value={staffData.Titulli}
                    onChange={handleStaffChange}
                    required
                  />
                  {errors.Titulli && <div className="text-danger">{errors.Titulli}</div>}
                </div>

                {/* Viti i Regjistrimit */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Viti i Regjistrimit</label>
                  <input
                    type="number"
                    name="VitiRegjistrimit"
                    className={`form-control ${errors.VitiRegjistrimit ? "is-invalid" : ""}`}
                    value={staffData.VitiRegjistrimit}
                    onChange={handleStaffChange}
                    required
                  />
                  {errors.VitiRegjistrimit && <div className="text-danger">{errors.VitiRegjistrimit}</div>}
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
        <a href="https://www.smis.education" className="text-white" target="_blank" rel="noopener noreferrer">www.smis.education</a>
      </div>
    </div>
  );
};

export default EditStaf;
