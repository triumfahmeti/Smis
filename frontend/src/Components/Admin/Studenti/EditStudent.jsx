import React, { useState, useEffect } from "react";
import axiosClient from "../../Login/AxiosClient";
import { useParams, useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout } from "../../Login/Logout";


/* ========== Helpers (si te AddStudent) ========== */
const pickFromLS = (...keys) => {
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v && v !== "null" && v !== "undefined" && String(v).trim() !== "") return v;
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
      } catch {/* ignore */}
    }
  }
  return { uni: uni ? String(uni) : "", dep: dep ? String(dep) : "" };
};

const toIntOrNull = (v) => (v === "" || v === undefined || v === null ? null : Number(v));
/* ================================================ */

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==== USER ====
  const [userData, setUserData] = useState({
    Emri: "", Mbiemri: "", Email: "", Password: "",
    Datelindja: "", NrLeternjoftimit: "", VendLindja: "",
    Gjinia: "", Shteti: "", Vendbanimi: "", Adresa: "",
    Zipkodi: "", Telefoni: "", Nenshtetesia: "", RoleId: 2, Foto: "",
  });

  // ==== STUDENT ====
  const [studentData, setStudentData] = useState({
    VitiRegjistrimit: "", Statusi: "Aktiv",
    UniId: "", DepartamentiId: "", GrupiId: "", SemestriId: "",
  });

  // ==== Lists ====
  //  const [errors, setErrors] = useState({});
  
  const [universitetet, setUniversitetet] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);
  const [grupet, setGrupet] = useState([]);
  const [allSemestrat, setAllSemestrat] = useState([]);
  const [semestrat, setSemestrat] = useState([]);

 

  // ===== Load student + lists =====
  useEffect(() => {
    async function fetchStudent() {
      try {
        const { data } = await axiosClient.get(`/studentiera/${id}`);
        const { uni, dep } = getAdminIdsFromStorage();

        setUserData({
          Emri: data.emri ?? "", Mbiemri: data.mbiemri ?? "", Email: data.email ?? "",
          Password: "", // në edit lëre bosh (nëse s’e ndërron)
          Datelindja: data.datelindja ? String(data.datelindja).split("T")[0] : "",
          NrLeternjoftimit: data.nrLeternjoftimit ?? "", VendLindja: data.vendLindja ?? "",
          Gjinia: data.gjinia ?? "", Shteti: data.shteti ?? "", Vendbanimi: data.vendbanimi ?? "",
          Adresa: data.adresa ?? "", Zipkodi: data.zipkodi ?? "", Telefoni: data.telefoni ?? "",
          Nenshtetesia: data.nenshtetesia ?? "", RoleId: 2, Foto: data.foto ?? ""
        });

        setStudentData((prev) => ({
          ...prev,
          VitiRegjistrimit: data.vitiRegjistrimit ?? "",
          Statusi: data.statusi ?? "Aktiv",
          // merre sipas adminit; nëse mungon në LS përdor vlerën e studentit
          UniId: uni || data.uniId || "",
          DepartamentiId: dep || data.departamentiId || "",
          GrupiId: data.grupiId ?? "",
          SemestriId: data.semestriId ?? data.SemestriID ?? data.semestriID ?? "",
        }));
      } catch (error) {
        console.error("Gabim gjatë marrjes së studentit:", error.response?.data || error.message);
        alert("Studenti nuk u gjet.");
        navigate("/studentet");
      }
    }

    async function fetchLists() {
      try {
        const [uniRes, depRes, grupRes, semRes] = await Promise.all([
          axiosClient.get("/universiteti"),
          axiosClient.get("/departamenti"),
          axiosClient.get("/grupi"),
          axiosClient.get("/semestri"),
        ]);
        setUniversitetet(uniRes.data || []);
        setDepartamentet(depRes.data || []);
        setGrupet(grupRes.data || []);
        setAllSemestrat(semRes.data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së listave:", error.response?.data || error.message);
      }
    }

    fetchStudent();
    fetchLists();
  }, [id, navigate]);

  // ===== Filter semestrat sipas UniId =====
  useEffect(() => {
    if (!studentData.UniId) { setSemestrat([]); return; }
    const uniIdNum = Number(studentData.UniId);
    const filtered = (allSemestrat || []).filter(s => Number(s.uniId ?? s.UniId) === uniIdNum);
    setSemestrat(filtered);
  }, [studentData.UniId, allSemestrat]);

  // ===== Handlers =====
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value ?? "" }));
  };
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value ?? "" }));
  };

  // ===== UI helpers: resolve names (like AddStudent) =====
  const selectedUni = universitetet.find(u => String(u.uniId ?? u.UniId) === String(studentData.UniId));
  const selectedDep = departamentet.find(d => String(d.departamentiId ?? d.DepartamentiId) === String(studentData.DepartamentiId));

  const grupetPerDepartament = grupet.filter(
    g => String(g.departamentiId ?? g.DepartamentiId) === String(studentData.DepartamentiId)
  );

  // ===== Validate & Submit =====
  const validateForm = () => {
    const errs = {};
    if (!userData.Emri?.trim()) errs.Emri = "Emri është i detyrueshëm.";
    if (!userData.Mbiemri?.trim()) errs.Mbiemri = "Mbiemri është i detyrueshëm.";
    if (!userData.Email?.trim()) errs.Email = "Email është i detyrueshëm.";
    if (!studentData.UniId) errs.UniId = "Uni mungon.";
    if (!studentData.DepartamentiId) errs.DepartamentiId = "Departamenti mungon.";
    if (!studentData.GrupiId) errs.GrupiId = "Zgjidh grupin.";
    if (!studentData.SemestriId) errs.SemestriId = "Zgjidh semestrin.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      // USER
      Emri: userData.Emri, Mbiemri: userData.Mbiemri, Email: userData.Email,
      Password: userData.Password, Datelindja: userData.Datelindja,
      NrLeternjoftimit: userData.NrLeternjoftimit, VendLindja: userData.VendLindja,
      Gjinia: userData.Gjinia, Shteti: userData.Shteti, Vendbanimi: userData.Vendbanimi,
      Adresa: userData.Adresa, Zipkodi: userData.Zipkodi, Telefoni: userData.Telefoni,
      Nenshtetesia: userData.Nenshtetesia, RoleId: userData.RoleId, Foto: userData.Foto ?? null,

      // STUDENT
      Roli: "Student",
      UniId: toIntOrNull(studentData.UniId),
      DepartamentiId: toIntOrNull(studentData.DepartamentiId),
      GrupiId: toIntOrNull(studentData.GrupiId),
      SemestriId: toIntOrNull(studentData.SemestriId),
      VitiRegjistrimit: toIntOrNull(studentData.VitiRegjistrimit),
      Statusi: studentData.Statusi || "Aktiv",
    };

    try {
      await axiosClient.put(`/studentiera/${id}`, payload);
      alert("Studenti u përditësua me sukses!");
      navigate("/studentet");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string" ? error.response.data : JSON.stringify(error?.response?.data)) ||
        error.message;
      console.error("Gabim gjatë përditësimit:", error?.response || error);
      alert("Gabim gjatë përditësimit të studentit:\n" + msg);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar e shkurtër */}
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
        {/* Sidebar (opsionale) */}
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
            <h2 className="mb-4">Edito Studentin</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">
                {[
                  { label: "Emri", name: "Emri" },
                  { label: "Mbiemri", name: "Mbiemri" },
                  { label: "Email", name: "Email", type: "email" },
                  { label: "Password (opsionale)", name: "Password", type: "password" },
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

              {/* ====== Universiteti & Departamenti — READ-ONLY me EMRA ====== */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Universiteti</label>
                  <input
                    className="form-control"
                    value={selectedUni?.emri || (studentData.UniId ? `Uni ID: ${studentData.UniId}` : "— nuk u gjet UniId —")}
                    readOnly
                  />
                  <input type="hidden" name="UniId" value={studentData.UniId} />
                  {errors.UniId && <div className="text-danger">{errors.UniId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Departamenti</label>
                  <input
                    className="form-control"
                    value={selectedDep?.emri || (studentData.DepartamentiId ? `Departamenti ID: ${studentData.DepartamentiId}` : "— nuk u gjet DepartamentiId —")}
                    readOnly
                  />
                  <input type="hidden" name="DepartamentiId" value={studentData.DepartamentiId} />
                  {errors.DepartamentiId && <div className="text-danger">{errors.DepartamentiId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Grupi</label>
                  <select
                    name="GrupiId"
                    value={String(studentData.GrupiId ?? "")}
                    onChange={handleStudentChange}
                    className="form-select"
                    required
                  >
                    <option value="">Zgjidh Grupin</option>
                    {grupetPerDepartament.map((grup) => (
                      <option key={grup.grupiId} value={String(grup.grupiId)}>
                        {grup.emri}
                      </option>
                    ))}
                  </select>
                  {errors.GrupiId && <div className="text-danger">{errors.GrupiId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Semestri</label>
                  <select
                    name="SemestriId"
                    value={String(studentData.SemestriId ?? "")}
                    onChange={handleStudentChange}
                    className="form-select"
                    required
                  >
                    <option value="">Zgjidh Semestrin</option>
                    {semestrat.map((sem) => (
                      <option key={sem.semestriId} value={String(sem.semestriId)}>
                        {sem.semestri1}
                      </option>
                    ))}
                  </select>
                  {errors.SemestriId && <div className="text-danger">{errors.SemestriId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Viti i Regjistrimit</label>
                  <input
                    type="number"
                    name="VitiRegjistrimit"
                    className="form-control"
                    value={studentData.VitiRegjistrimit}
                    onChange={handleStudentChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Statusi</label>
                  <select
                    name="Statusi"
                    className={`form-select ${errors.Statusi ? "is-invalid" : ""}`}
                    value={studentData.Statusi}
                    onChange={handleStudentChange}
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Pasiv">Pasiv</option>
                  </select>
                  {errors.Statusi && <div className="text-danger">{errors.Statusi}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">Ruaj Ndryshimet</button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
