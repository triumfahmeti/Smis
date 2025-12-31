import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';
import { logout } from '../../Login/Logout';

const AddDepartament = () => {
  const [universitetet, setUniversitetet] = useState([]);
  const [formData, setFormData] = useState({
    emri: '',
    uniId: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversitetet = async () => {
      try {
        const res = await axiosClient.get('/universiteti');
        setUniversitetet(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së universiteteve:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Kyçu sërish.");
          logout(navigate);
        } else {
          alert("Nuk mund të merren universitetet.");
        }
      }
    };

    fetchUniversitetet();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      emri: formData.emri,
      uniId: Number(formData.uniId)
    };

    try {
      const res = await axiosClient.post('/departamenti', dataToSend);

      if (res.status === 201 || res.status === 200) {
        alert('Departamenti u shtua me sukses!');
        setFormData({ emri: '', uniId: '' });
        navigate('/departamenti');
      } else {
        alert('Gabim gjatë shtimit të departamentit');
      }
    } catch (error) {
      console.error("Gabim gjatë komunikimit me serverin:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar. Kyçu sërish.");
        logout(navigate);
      } else {
        alert("Gabim gjatë shtimit të departamentit.");
      }
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
                <Link className="nav-link" to="/departamenti">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Departamentet
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Shto Departament të Ri</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emri</label>
                    <input
                      type="text"
                      name="emri"
                      className="form-control"
                      value={formData.emri}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Universiteti</label>
                    <select
                      name="uniId"
                      className="form-select"
                      value={formData.uniId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Universitetin</option>
                      {universitetet.map(u => (
                        <option key={u.uniId} value={u.uniId}>{u.emri}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Shto Departament</button>
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

export default AddDepartament;
