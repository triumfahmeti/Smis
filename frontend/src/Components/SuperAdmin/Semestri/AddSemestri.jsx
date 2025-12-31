import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient'; // Importo axiosClient që shton token automatikisht

const AddSemestri = () => {
  const [universitetet, setUniversitetet] = useState([]);
  const [semestriData, setSemestriData] = useState({
    semestri1: '',
    uniId: ''
  });

  const navigate = useNavigate();

  // Merr universitetet
  useEffect(() => {
    const fetchUniversitetet = async () => {
      try {
        const res = await axiosClient.get('/universiteti');
        setUniversitetet(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së universiteteve:", error);
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchUniversitetet();
  }, [navigate]);

  // Ndryshimi i inputeve
  const handleChange = (e) => {
    setSemestriData({
      ...semestriData,
      [e.target.name]: e.target.value
    });
  };

  // Ruajtja e semestrit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      Semestri1: semestriData.semestri1,
      UniId: Number(semestriData.uniId)
    };

    try {
      await axiosClient.post('/semestri', dataToSend);
      alert('Semestri u shtua me sukses!');
      setSemestriData({ semestri1: '', uniId: '' });
      navigate('/semestri');
    } catch (error) {
      console.error('Gabim gjatë shtimit të semestrit:', error);
      if (error.response?.status === 401) {
        alert('Sesion i skaduar, kyqu përsëri!');
        navigate('/login');
      } else {
        alert('Gabim gjatë shtimit të semestrit');
      }
    }
  };

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/semestri">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Semestri
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Shto Semestër të Ri</h2>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Emri i Semestrit</label>
                    <input
                      type="text"
                      name="semestri1"
                      className="form-control"
                      value={semestriData.semestri1}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Universiteti</label>
                    <select
                      name="uniId"
                      className="form-select"
                      value={semestriData.uniId}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Zgjidh Universitetin</option>
                      {universitetet.map(uni => (
                        <option key={uni.uniId} value={uni.uniId}>{uni.emri}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Shto Semestër</button>
              </form>
            </div>
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

export default AddSemestri;
