import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../../Login/AxiosClient";

const AddAdmin = () => {
  const [userData, setUserData] = useState({
    Emri: "", Mbiemri: "", Email: "", Password: "", Datelindja: "", NrLeternjoftimit: "",
    VendLindja: "", Gjinia: "", Shteti: "", Vendbanimi: "", Adresa: "",
    Zipkodi: "", Telefoni: "", Nenshtetesia: "", Foto: "", RoleId: 1,
  });

  const [adminData, setAdminData] = useState({ DepartamentiId: "", UniId: "" });
  const [universitetet, setUniversitetet] = useState([]);
  const [departamentet, setDepartamentet] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ==================================================
  // FETCH UNIVERSITETET DHE DEPARTAMENTET
  // ==================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [uniRes, depRes] = await Promise.all([
          axiosClient.get("/universiteti"),
          axiosClient.get("/departamenti")
        ]);
        setUniversitetet(uniRes.data);
        setDepartamentet(depRes.data);
      } catch (error) {
        console.error("❌ Gabim gjatë marrjes së të dhënave:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar, ju lutem kyquni përsëri!");
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [navigate]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  // ==================================================
  // CHECK EMAIL EXISTS
  // ==================================================
  const checkEmailExists = async (email) => {
    try {
      const res = await axiosClient.get(`/account/email-exists?email=${encodeURIComponent(email)}`);
      return res.data === true;
    } catch (error) {
      console.error("Gabim gjatë verifikimit të email-it:", error);
      return false;
    }
  };

  // ==================================================
  // VALIDIMET
  // ==================================================
  const validateForm = async () => {
    const newErrors = {};
    const requiredFields = [
      "Emri", "Mbiemri", "Email", "Password", "Datelindja", "NrLeternjoftimit", "VendLindja",
      "Gjinia", "Shteti", "Vendbanimi", "Adresa", "Zipkodi", "Telefoni", "Nenshtetesia"
    ];

    requiredFields.forEach(field => {
      if (!userData[field] || userData[field].trim() === "") {
        newErrors[field] = "Kjo fushë është e detyrueshme.";
      }
    });

    const nameRegex = /^[A-ZÇËa-zçë\s\-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+]{8,15}$/;
    const zipRegex = /^[0-9]{4,10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

    if (userData.Emri && !nameRegex.test(userData.Emri)) newErrors.Emri = "Emri duhet të përmbajë vetëm shkronja.";
    if (userData.Mbiemri && !nameRegex.test(userData.Mbiemri)) newErrors.Mbiemri = "Mbiemri duhet të përmbajë vetëm shkronja.";
    if (!passwordRegex.test(userData.Password)) newErrors.Password = "Fjalëkalimi duhet të ketë 1 shkronjë të madhe, 1 numër dhe 1 shenjë speciale.";
    if (!emailRegex.test(userData.Email)) {
      newErrors.Email = "Email-i nuk është në formatin e duhur.";
    } else {
      const emailExists = await checkEmailExists(userData.Email);
      if (emailExists) newErrors.Email = "Ky email është tashmë i regjistruar.";
    }
    if (userData.Telefoni && !phoneRegex.test(userData.Telefoni)) newErrors.Telefoni = "Telefoni duhet të jetë 8–15 shifra.";
    if (userData.Zipkodi && !zipRegex.test(userData.Zipkodi)) newErrors.Zipkodi = "ZIP kodi duhet të jetë 4–10 shifra.";
    if (userData.Shteti && !nameRegex.test(userData.Shteti)) newErrors.Shteti = "Shteti duhet të përmbajë vetëm shkronja.";
    if (userData.Nenshtetesia && !nameRegex.test(userData.Nenshtetesia)) newErrors.Nenshtetesia = "Nenshtetësia duhet të përmbajë vetëm shkronja.";
    if (userData.Vendbanimi && !nameRegex.test(userData.Vendbanimi)) newErrors.Vendbanimi = "Vendbanimi duhet të përmbajë vetëm shkronja.";
    if (userData.VendLindja && !nameRegex.test(userData.VendLindja)) newErrors.VendLindja = "Vendlindja duhet të përmbajë vetëm shkronja.";
    if (!adminData.UniId) newErrors.UniId = "Zgjidh universitetin.";
    if (!adminData.DepartamentiId) newErrors.DepartamentiId = "Zgjidh departamentin.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================================================
  // SUBMIT
  // ==================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;

    const dataToSend = {
      ...userData,
      ...adminData,
      Roli: "Admin"
    };

    try {
      const res = await axiosClient.post("/account/register", dataToSend);

      if (res.status === 200 || res.status === 201) {
        alert("✅ Admini u krijua me sukses!");
        setUserData({
          Emri: "", Mbiemri: "", Email: "", Password: "", Datelindja: "", NrLeternjoftimit: "",
          VendLindja: "", Gjinia: "", Shteti: "", Vendbanimi: "", Adresa: "",
          Zipkodi: "", Telefoni: "", Nenshtetesia: "", Foto: "", RoleId: 1,
        });
        setAdminData({ DepartamentiId: "", UniId: "" });
        setErrors({});
        navigate("/admin");
      } else {
        alert("Gabim gjatë krijimit të adminit.");
      }
    } catch (error) {
      console.error("Gabim gjatë komunikimit me serverin:", error);
      alert("Gabim gjatë komunikimit me serverin.");
    }
  };

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profili-im">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div> Profili im
                </Link>
                <Link className="nav-link" to="/admin">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Adminët
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Shto Admin të Ri</h2>

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
                  { label: "Foto (URL)", name: "Foto" }
                ].map(({ label, name, type = "text" }) => (
                  <div key={name} className="col-md-6 mb-3">
                    <label className="form-label">{label}</label>
                    <input
                      type={type}
                      name={name}
                      className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                      value={userData[name]}
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
                    value={userData.Gjinia}
                    onChange={handleUserChange}
                  >
                    <option value="">Zgjidh Gjininë</option>
                    <option value="Mashkull">Mashkull</option>
                    <option value="Femer">Femer</option>
                  </select>
                  {errors.Gjinia && <div className="text-danger">{errors.Gjinia}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Universiteti</label>
                  <select
                    name="UniId"
                    value={adminData.UniId}
                    onChange={handleAdminChange}
                    className={`form-select ${errors.UniId ? "is-invalid" : ""}`}
                  >
                    <option value="">Zgjidh Universitetin</option>
                    {universitetet.map((uni) => (
                      <option key={uni.uniId} value={uni.uniId}>{uni.emri}</option>
                    ))}
                  </select>
                  {errors.UniId && <div className="text-danger">{errors.UniId}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Departamenti</label>
                  <select
                    name="DepartamentiId"
                    value={adminData.DepartamentiId}
                    onChange={handleAdminChange}
                    className={`form-select ${errors.DepartamentiId ? "is-invalid" : ""}`}
                  >
                    <option value="">Zgjidh Departamentin</option>
                    {departamentet.map((dep) => (
                      <option key={dep.departamentiId} value={dep.departamentiId}>{dep.emri}</option>
                    ))}
                  </select>
                  {errors.DepartamentiId && <div className="text-danger">{errors.DepartamentiId}</div>}
                </div>
              </div>

              <button type="submit" className="btn btn-primary mt-3">Shto Admin</button>
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

export default AddAdmin;
