import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';

const EditDepartament = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [departamentiData, setDepartamentiData] = useState({
    emri: '',
    uniId: ''
  });

  const [universitetet, setUniversitetet] = useState([]);

  // Merr departamentin nga API
  useEffect(() => {
    async function fetchDepartamenti() {
      try {
        const res = await axiosClient.get(`/departamenti/${id}`);
        setDepartamentiData({
          emri: res.data.emri || '',
          uniId: res.data.uniId?.toString() || ''
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së departamentit:", error);
        if (error.response?.status === 404) {
          alert("❌ Departamenti nuk u gjet.");
          navigate("/departamenti");
        } else if (error.response?.status === 401) {
          alert("Sesion i skaduar, kyquni përsëri.");
          navigate("/login");
        } else {
          alert("Gabim gjatë marrjes së departamentit.");
        }
      }
    }

    async function fetchUniversitetet() {
      try {
        const res = await axiosClient.get('/universiteti');
        setUniversitetet(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së universiteteve:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar, kyquni përsëri.");
          navigate("/login");
        }
      }
    }

    fetchDepartamenti();
    fetchUniversitetet();
  }, [id, navigate]);

  // ndryshimet për fushat
  const handleChange = (e) => {
    setDepartamentiData({
      ...departamentiData,
      [e.target.name]: e.target.value
    });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/departamenti/${id}`, {
        emri: departamentiData.emri,
        uniId: Number(departamentiData.uniId)
      });
      alert("✅ Departamenti u përditësua me sukses!");
      navigate("/departamenti");
    } catch (error) {
      console.error("Gabim gjatë përditësimit të departamentit:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar, kyquni përsëri.");
        navigate("/login");
      } else {
        alert("Gabim gjatë përditësimit të departamentit.");
      }
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/departamenti">Departamentet</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Edito Departamentin</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emri</label>
                    <input
                      type="text"
                      name="emri"
                      className="form-control"
                      value={departamentiData.emri}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Universiteti</label>
                    <select
                      name="uniId"
                      className="form-select"
                      value={departamentiData.uniId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Universitetin</option>
                      {universitetet.map(u => (
                        <option key={u.uniId} value={u.uniId.toString()}>
                          {u.emri}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">
                  Ruaj Ndryshimet
                </button>
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

export default EditDepartament;
