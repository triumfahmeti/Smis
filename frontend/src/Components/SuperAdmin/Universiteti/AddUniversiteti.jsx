import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';

const AddUniversiteti = () => {
  const [uniData, setUniData] = useState({
    emri: '',
    phone: '',
    email: '',
    lokacionet: [{ qyteti: '', adresa: '' }]
  });

  const navigate = useNavigate();

  // ndryshimet për fushat kryesore
  const handleChange = (e) => {
    setUniData({ ...uniData, [e.target.name]: e.target.value });
  };

  // ndryshimet për lokacionet
  const handleLokacionChange = (index, field, value) => {
    const newLokacionet = [...uniData.lokacionet];
    newLokacionet[index][field] = value;
    setUniData({ ...uniData, lokacionet: newLokacionet });
  };

  // shto lokacion të ri
  const addLokacionField = () => {
    setUniData({
      ...uniData,
      lokacionet: [...uniData.lokacionet, { qyteti: '', adresa: '' }]
    });
  };

  // fshi lokacion sipas index
  const removeLokacionField = (index) => {
    const newLokacionet = uniData.lokacionet.filter((_, i) => i !== index);
    setUniData({ ...uniData, lokacionet: newLokacionet });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/universiteti', uniData);
      alert('✅ Universiteti u shtua me sukses!');
      navigate('/universiteti');
    } catch (error) {
      console.error('❌ Gabim gjatë shtimit të universitetit:', error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar, kyquni përsëri.");
        navigate('/login');
      } else {
        alert('Gabim gjatë shtimit të universitetit.');
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
                <Link className="nav-link" to="/universiteti">Universitetet</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container mt-5">
            <h2 className="mb-4">Shto Universitet të Ri</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Emri</label>
                  <input
                    type="text"
                    name="emri"
                    className="form-control"
                    value={uniData.emri}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telefoni</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={uniData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={uniData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Lokacionet */}
                <div className="col-md-12 mb-3">
                  <label className="form-label">Lokacionet</label>
                  {uniData.lokacionet.map((lok, index) => (
                    <div key={index} className="row mb-2">
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Qyteti"
                          value={lok.qyteti}
                          onChange={(e) => handleLokacionChange(index, 'qyteti', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Adresa"
                          value={lok.adresa}
                          onChange={(e) => handleLokacionChange(index, 'adresa', e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        {uniData.lokacionet.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeLokacionField(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addLokacionField}>
                    ➕ Shto Lokacion
                  </button>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Shto Universitetin</button>
              </div>
            </form>
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

export default AddUniversiteti;
