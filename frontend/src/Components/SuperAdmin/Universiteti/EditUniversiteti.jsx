import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';


const EditUniversiteti = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [universitetiData, setUniversitetiData] = useState({
    emri: '',
    phone: '',
    email: '',
    lokacionet: [{ qyteti: '', adresa: '' }]
  });

  // merr universitetin nga API
  useEffect(() => {
    async function fetchUniversiteti() {
      try {
        const res = await axiosClient.get(`/universiteti/${id}`);
        setUniversitetiData({
          emri: res.data.emri || '',
          phone: res.data.phone || '',
          email: res.data.email || '',
          lokacionet: res.data.lokacionet?.map(l => ({
            qyteti: l.qyteti || '',
            adresa: l.adresa || ''
          })) || [{ qyteti: '', adresa: '' }]
        });
      } catch (error) {
        console.error("Gabim gjatë marrjes së universitetit:", error);
        if (error.response?.status === 404) {
          alert("❌ Universiteti nuk u gjet.");
          navigate("/universiteti");
        } else if (error.response?.status === 401) {
          alert("Sesion i skaduar, kyquni përsëri.");
          navigate("/login");
        } else {
          alert("Gabim gjatë marrjes së universitetit.");
        }
      }
    }

    fetchUniversiteti();
  }, [id, navigate]);

  // ndryshimet për fushat kryesore
  const handleChange = (e) => {
    setUniversitetiData({
      ...universitetiData,
      [e.target.name]: e.target.value
    });
  };

  // ndryshimet për lokacionet
  const handleLokacionChange = (index, field, value) => {
    const updated = [...universitetiData.lokacionet];
    updated[index][field] = value;
    setUniversitetiData({ ...universitetiData, lokacionet: updated });
  };

  // shto lokacion
  const addLokacionField = () => {
    setUniversitetiData({
      ...universitetiData,
      lokacionet: [...universitetiData.lokacionet, { qyteti: '', adresa: '' }]
    });
  };

  // fshi lokacion sipas index
  const removeLokacionField = (index) => {
    const updated = [...universitetiData.lokacionet];
    updated.splice(index, 1);
    setUniversitetiData({ ...universitetiData, lokacionet: updated });
  };

  // submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/universiteti/${id}`, universitetiData);
      alert("✅ Universiteti u përditësua me sukses!");
      navigate("/universiteti");
    } catch (error) {
      console.error("Gabim gjatë përditësimit të universitetit:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar, kyquni përsëri.");
        navigate("/login");
      } else {
        alert("Gabim gjatë përditësimit të universitetit.");
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
                <Link className="nav-link" to="/universiteti">Universitetet</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Edito Universitetin</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emri</label>
                    <input
                      type="text"
                      name="emri"
                      className="form-control"
                      value={universitetiData.emri}
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
                      value={universitetiData.phone}
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
                      value={universitetiData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Lokacionet */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Lokacionet</label>
                    {universitetiData.lokacionet.map((lok, index) => (
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
                          {universitetiData.lokacionet.length > 1 && (
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
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addLokacionField}
                    >
                      ➕ Shto Lokacion
                    </button>
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

export default EditUniversiteti;
