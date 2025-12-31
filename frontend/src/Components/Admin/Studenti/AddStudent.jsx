import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  // 🔑 Universiteti: ti e ruan me "universitetiId"
  let uni = pickFromLS(
    "universitetiId",
    "UniId",
    "UniID",
    "uniId",
    "universityId"
  );
  // 🔑 Departamenti: provojmë disa emra të zakonshëm
  let dep = pickFromLS(
    "DepartamentiId",
    "DepartamentiID",
    "departamentiId",
    "departmentId",
    "DepId"
  );

  // Nëse s’u gjetën direkt, provo brenda user/currentUser si JSON
  if (!uni || !dep) {
    const userRaw = pickFromLS("user", "currentUser", "auth.user", "authUser");
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        if (!uni)
          uni = String(
            u?.universitetiId ?? u?.uniId ?? u?.UniId ?? u?.universityId ?? ""
          );
        if (!dep)
          dep = String(
            u?.departamentiId ?? u?.DepartamentiId ?? u?.departmentId ?? ""
          );
      } catch {
        /* ignore */
      }
    }
  }

  return {
    uni: uni ? String(uni) : "",
    dep: dep ? String(dep) : "",
  };
};

// kthen int ose null (mos dërgo 0/NaN te backend)
const toIntOrNull = (v) =>
  v === "" || v === undefined || v === null ? null : Number(v);
/* =================================================== */

const AddStudent = () => {
  const navigate = useNavigate();

  // ================== USER ==================
  const [userData, setUserData] = useState({
    Emri: "",
    Mbiemri: "",
    Email: "",
    Password: "",
    Datelindja: "",
    NrLeternjoftimit: "",
    VendLindja: "",
    Gjinia: "",
    Shteti: "",
    Vendbanimi: "",
    Adresa: "",
    Zipkodi: "",
    Telefoni: "",
    Nenshtetesia: "",
    RoleId: 2,
    Foto: null,
  });

  // ================== STUDENT ==================
  const [studentData, setStudentData] = useState({
    VitiRegjistrimit: "",
    Statusi: "",
    UniId: "", // do vendosen pas montimit nga localStorage
    DepartamentiId: "", // do vendosen pas montimit nga localStorage
    GrupiId: "",
    SemestriId: "", // EMRI I SAKTË
  });

  const [errors, setErrors] = useState({});
  const [universitetet, setUniversitetet] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);
  const [grupet, setGrupet] = useState([]);
  const [semestrat, setSemestrat] = useState([]);
  const [allSemestrat, setAllSemestrat] = useState([]);

  // 1) Lexo Universitetin/Departamentin nga localStorage
  useEffect(() => {
    const { uni, dep } = getAdminIdsFromStorage();
    setStudentData((prev) => ({
      ...prev,
      UniId: uni || prev.UniId,
      DepartamentiId: dep || prev.DepartamentiId,
    }));
  }, []);

  // 2) Fetch i të dhënave (mos i mbishkruaj Uni/Dep këtu)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, depRes, grupRes, semRes] = await Promise.all([
          axiosClient.get("/universiteti"),
          axiosClient.get("/departamenti"),
          axiosClient.get("/grupi"),
          axiosClient.get("/semestri"),
        ]);
        setUniversitetet(uniRes.data);
        setDepartamentet(depRes.data);
        setGrupet(grupRes.data);
        setAllSemestrat(semRes.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së të dhënave:", error);
      }
    };
    fetchData();
  }, []);

  // 3) Filtrim i semestrave sipas UniId
  useEffect(() => {
    if (!studentData.UniId) {
      setSemestrat([]);
      return;
    }
    const uniIdNum = Number(studentData.UniId);
    const filtered = allSemestrat.filter(
      (s) => Number(s.uniId ?? s.UniId) === uniIdNum
    );
    setSemestrat(filtered);
  }, [studentData.UniId, allSemestrat]);

  // Handlers
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({ ...prev, [name]: value }));
  };

  const checkEmailExists = async (email) => {
    const res = await axiosClient.get(
      `/account/email-exists?email=${encodeURIComponent(email)}`
    );
    return res.data === true;
  };

  const validateForm = async () => {
    const newErrors = {};
    const requiredFields = [
      "Emri",
      "Mbiemri",
      "Email",
      "Password",
      "Datelindja",
      "NrLeternjoftimit",
      "VendLindja",
      "Gjinia",
      "Shteti",
      "Vendbanimi",
      "Adresa",
      "Zipkodi",
      "Telefoni",
      "Nenshtetesia",
    ];

    requiredFields.forEach((field) => {
      if (!userData[field] || String(userData[field]).trim() === "") {
        newErrors[field] = "Kjo fushë është e detyrueshme.";
      }
    });

    const nameRegex = /^[A-ZÇËa-zçë\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{8,15}$/;
    const zipRegex = /^[0-9]{4,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (userData.Emri && !nameRegex.test(userData.Emri))
      newErrors.Emri = "Emri duhet të përmbajë vetëm shkronja.";
    if (userData.Mbiemri && !nameRegex.test(userData.Mbiemri))
      newErrors.Mbiemri = "Mbiemri duhet të përmbajë vetëm shkronja.";
    if (!passwordRegex.test(userData.Password))
      newErrors.Password =
        "Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe, një numër dhe një shenjë speciale.";
    if (!emailRegex.test(userData.Email))
      newErrors.Email = "Email-i nuk është në formatin e duhur.";
    else if (await checkEmailExists(userData.Email))
      newErrors.Email = "Ky email është tashmë i regjistruar.";
    if (userData.Telefoni && !phoneRegex.test(userData.Telefoni))
      newErrors.Telefoni =
        "Telefoni duhet të përmbajë vetëm numra dhe të jetë 8–15 shifra.";
    if (userData.Zipkodi && !zipRegex.test(userData.Zipkodi))
      newErrors.Zipkodi =
        "ZIP kodi duhet të përmbajë vetëm numra (4 deri në 10).";
    if (userData.Shteti && !nameRegex.test(userData.Shteti))
      newErrors.Shteti = "Shteti duhet të përmbajë vetëm shkronja.";
    if (userData.Nenshtetesia && !nameRegex.test(userData.Nenshtetesia))
      newErrors.Nenshtetesia = "Nenshtetësia duhet të përmbajë vetëm shkronja.";
    if (userData.Vendbanimi && !nameRegex.test(userData.Vendbanimi))
      newErrors.Vendbanimi = "Vendbanimi duhet të përmbajë vetëm shkronja.";
    if (userData.VendLindja && !nameRegex.test(userData.VendLindja))
      newErrors.VendLindja = "Vendlindja duhet të përmbajë vetëm shkronja.";

    // Duhet të ekzistojnë Uni & Departamenti nga admini
    if (!studentData.UniId)
      newErrors.UniId = "Nuk u gjet UniId i adminit (universitetiId).";
    if (!studentData.DepartamentiId)
      newErrors.DepartamentiId = "Nuk u gjet DepartamentiId i adminit.";

    // Opsionalisht i bën të detyrueshëm
    if (!studentData.SemestriId) newErrors.SemestriId = "Zgjidh semestrin.";
    if (!studentData.GrupiId) newErrors.GrupiId = "Zgjidh grupin.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
      Foto: userData.Foto ?? null,

      // STUDENT
      Roli: "Student",
      UniId: toIntOrNull(studentData.UniId),
      DepartamentiId: toIntOrNull(studentData.DepartamentiId),
      GrupiId: toIntOrNull(studentData.GrupiId),
      SemestriId: toIntOrNull(studentData.SemestriId), // EMRI I SAKTË
      VitiRegjistrimit: toIntOrNull(studentData.VitiRegjistrimit),
      Statusi: studentData.Statusi || "Aktiv",
    };

    console.log("PAYLOAD QE PO DERGOHET:", payload);

    try {
      const res = await axiosClient.post("/account/register", payload);
      alert("Studenti u krijua me sukses!");
      navigate("/studentet");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error?.response?.data)) ||
        error.message;
      console.error("Gabim backend:", error?.response || error);
      alert("Gabim gjatë krijimit të studentit:\n" + msg);
    }
  };

  // ================== UI HELPERS ==================
  const selectedUni = universitetet.find(
    (u) => String(u.uniId ?? u.UniId) === String(studentData.UniId)
  );
  const selectedDep = departamentet.find(
    (d) => String(d.departamentiId) === String(studentData.DepartamentiId)
  );

  // Filtrim grupesh sipas departamentit
  const grupetPerDepartament = grupet.filter(
    (g) =>
      String(g.departamentiId ?? g.DepartamentiId) ===
      String(studentData.DepartamentiId)
  );

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
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a className="dropdown-item" href="/profiliadmin">
                  Profili Im
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/studentet">
                  Studentet
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/stafiakademik">
                  Stafi Akademik
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/grupi">
                  Grupi
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/studentetgrupi">
                  Studentet ne grupe
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/lenda">
                  Lenda
                </a>
              </li>
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

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profili-im">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>{" "}
                  Profili im
                </Link>
                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>{" "}
                  Studentet
                </Link>
                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>{" "}
                  Stafi Akademik
                </Link>
                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>{" "}
                  Grupi
                </Link>
                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>{" "}
                  Lenda
                </Link>
                <Link className="nav-link" to="/paneliAfatiSemestrit">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Krijo Afat per Regjistrim te Semestrit
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Shto Student të Ri</h2>

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
                      className={`form-control ${
                        errors[name] ? "is-invalid" : ""
                      }`}
                      value={userData[name]}
                      onChange={handleUserChange}
                    />
                    {errors[name] && (
                      <div className="text-danger">{errors[name]}</div>
                    )}
                  </div>
                ))}

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gjinia</label>
                  <select
                    name="Gjinia"
                    className={`form-select ${
                      errors.Gjinia ? "is-invalid" : ""
                    }`}
                    value={userData.Gjinia}
                    onChange={handleUserChange}
                  >
                    <option value="">Zgjidh Gjininë</option>
                    <option value="Mashkull">Mashkull</option>
                    <option value="Femer">Femer</option>
                  </select>
                  {errors.Gjinia && (
                    <div className="text-danger">{errors.Gjinia}</div>
                  )}
                </div>
              </div>

              {/* ================== FIXED BY ADMIN ACCOUNT ================== */}
              <div className="row">
                {/* UNIVERSITETI — read-only */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Universiteti</label>
                  <input
                    className="form-control"
                    value={
                      selectedUni?.emri ||
                      (studentData.UniId
                        ? `Uni ID: ${studentData.UniId}`
                        : "— nuk u gjet UniId —")
                    }
                    readOnly
                  />
                  {/* ID që dërgohet në submit (opsionale) */}
                  <input type="hidden" name="UniId" value={studentData.UniId} />
                  {errors.UniId && (
                    <div className="text-danger">{errors.UniId}</div>
                  )}
                </div>

                {/* DEPARTAMENTI — read-only */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Departamenti</label>
                  <input
                    className="form-control"
                    value={
                      selectedDep?.emri ||
                      (studentData.DepartamentiId
                        ? `Departamenti ID: ${studentData.DepartamentiId}`
                        : "— nuk u gjet DepartamentiId —")
                    }
                    readOnly
                  />
                  {/* ID që dërgohet në submit (opsionale) */}
                  <input
                    type="hidden"
                    name="DepartamentiId"
                    value={studentData.DepartamentiId}
                  />
                  {errors.DepartamentiId && (
                    <div className="text-danger">{errors.DepartamentiId}</div>
                  )}
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
                  {errors.GrupiId && (
                    <div className="text-danger">{errors.GrupiId}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Semestri</label>
                  <select
                    name="SemestriId" // EMRI I SAKTË
                    value={String(studentData.SemestriId ?? "")}
                    onChange={handleStudentChange}
                    className="form-select"
                    required
                  >
                    <option value="">Zgjidh Semestrin</option>
                    {semestrat.map((sem) => (
                      <option
                        key={sem.semestriId}
                        value={String(sem.semestriId)}
                      >
                        {sem.semestri1}
                      </option>
                    ))}
                  </select>
                  {errors.SemestriId && (
                    <div className="text-danger">{errors.SemestriId}</div>
                  )}
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
                    className={`form-select ${
                      errors.Statusi ? "is-invalid" : ""
                    }`}
                    value={studentData.Statusi}
                    onChange={handleStudentChange}
                  >
                    <option value="Aktiv">Aktiv</option>
                    <option value="Pasiv">Pasiv</option>
                  </select>
                  {errors.Statusi && (
                    <div className="text-danger">{errors.Statusi}</div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Shto Student
              </button>
            </form>
          </main>
        </div>
      </div>

      {/* Footer (opsionale) */}
    </div>
  );
};

export default AddStudent;
