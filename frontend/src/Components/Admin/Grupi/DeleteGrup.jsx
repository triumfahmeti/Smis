import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../../Login/AxiosClient";
import { logout } from '../../Login/Logout';

/* ===================== Helpers ===================== */
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
  return { uni: uni ? String(uni) : "", dep: dep ? String(dep) : "" };
};
/* =================================================== */

const DeleteGrupi = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [grupi, setGrupi] = useState(null);

  // Për të shfaqur EMRAT (jo ID):
  const [departamentiEmri, setDepartamentiEmri] = useState("");
  const [semestriEmri, setSemestriEmri] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        // 1) Merr grupin
        const { data: g } = await axiosClient.get(`/grupi/${id}`);
        setGrupi(g);

        // 2) Merr departamentet & semestrat për të gjetur emrat
        const [{ data: deps }, { data: sems }] = await Promise.all([
          axiosClient.get("/departamenti"),
          axiosClient.get("/semestri"),
        ]);

        // gjej emrat
        const depMatch = deps.find(d => String(d.departamentiId) === String(g.departamentiId));
        const semMatch = sems.find(s => String(s.semestriId) === String(g.semestriId));

        setDepartamentiEmri(depMatch?.emri || g.emriDepartamentit || "");
        setSemestriEmri(semMatch?.semestri1 || g.semestri1 || "");
      } catch (err) {
        console.error("❌ Gabim gjatë ngarkimit të grupit:", err?.response?.data || err?.message || err);
        alert("Grupi nuk u gjet.");
        navigate("/grupi");
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë grup?")) return;

    try {
      setDeleting(true);
      await axiosClient.delete(`/grupi/${id}`);
      alert("Grupi u fshi me sukses.");
      navigate("/grupi");
    } catch (error) {
      console.error("❌ Gabim gjatë fshirjes:", error?.response?.data || error?.message || error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : JSON.stringify(error?.response?.data)) ||
        error.message;
      alert("Gabim gjatë fshirjes së grupit:\n" + msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profili-im"><div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div> Profili im</Link>
                <Link className="nav-link" to="/studentet"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Studentet</Link>
                <Link className="nav-link" to="/stafiakademik"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Stafi Akademik</Link>
                <Link className="nav-link" to="/grupi"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Grupi</Link>
                <Link className="nav-link" to="/lenda"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Lenda</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Fshi Grupin</h2>

              {loading ? (
                <p>Po ngarkohet grupi...</p>
              ) : !grupi ? (
                <p>Grupi nuk u gjet.</p>
              ) : (
                <div className="card">
                  <div className="card-body">
                    <p className="mb-2">
                      A jeni i sigurt që doni të fshini grupin <strong>{grupi.emri}</strong>?
                    </p>
                    <ul className="mb-3">
                      <li><strong>Semestri:</strong> {semestriEmri || "—"}</li>
                      <li><strong>Departamenti:</strong> {departamentiEmri || "—"}</li>
                      <li><strong>Orari ID:</strong> {grupi.orariId ?? "—"}</li>
                      {"kapaciteti" in grupi && (
                        <li><strong>Kapaciteti:</strong> {grupi.kapaciteti ?? "—"}</li>
                      )}
                      {"aktiv" in grupi && (
                        <li><strong>Aktiv:</strong> {grupi.aktiv ? "Po" : "Jo"}</li>
                      )}
                    </ul>

                    <button
                      onClick={handleDelete}
                      className="btn btn-danger"
                      disabled={deleting}
                    >
                      {deleting ? "Duke fshirë..." : "Po, fshije"}
                    </button>
                    <Link to="/grupi" className="btn btn-secondary ms-2">
                      Anulo
                    </Link>
                  </div>
                </div>
              )}
            </div>
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

export default DeleteGrupi;
