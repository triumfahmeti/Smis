import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Login/Logout';
import axiosClient from '../Login/AxiosClient';

const DSemestri = () => {
  const [semestrat, setSemestrat] = useState([]);
  const [universitetiFilter, setUniversitetiFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSemestrat = async () => {
      try {
        const res = await axiosClient.get('/semestri/get-all-semestrat');
        setSemestrat(res.data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së semestrave:", error);
        if (error.response?.status === 401) {
          // token i skaduar / mungon → ridrejto ose provo refresh token
          navigate('/login');
        }
      }
    };
    fetchSemestrat();
  }, [navigate]);

  const uniqueUniversitetet = [...new Set(semestrat.map(s => s.universitetiEmri || 'N/A'))];

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-bars"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/profilisuperadmin">Profili Im</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/admin">Admin</a></li>
              <li><a className="dropdown-item" href="/universiteti">Universiteti</a></li>
              <li><a className="dropdown-item" href="/departamenti">Departamenti</a></li>
              <li><a className="dropdown-item" href="/semestri">Semestri</a></li>
            </ul>
          </li>
        </ul>

        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#!">Settings</a></li>
              <li><a className="dropdown-item" href="#!">Activity Log</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => logout(navigate)}>Logout</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profilisuperadmin">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                  Profili im
                </Link>
                <Link className="nav-link" to="/admin">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Admin
                </Link>
                <Link className="nav-link" to="/universiteti">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Universiteti
                </Link>
                <Link className="nav-link" to="/departamenti">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Departamenti
                </Link>
                <Link className="nav-link" to="/semestri">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Semestri
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Lista e Semestrave</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/add-semestri')}
              >
                ➕ Add Semestri
              </button>
            </div>

            <div className="mb-3 col-md-4">
              <label>Filtro sipas Universitetit:</label>
              <select
                className="form-select"
                value={universitetiFilter}
                onChange={(e) => setUniversitetiFilter(e.target.value)}
              >
                <option value="">Të gjithë universitetet</option>
                {uniqueUniversitetet.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>

            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>SemestriID</th>
                  <th>Semestri</th>
                  <th>Universiteti</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {semestrat
                  .filter(s => universitetiFilter === '' || s.universitetiEmri === universitetiFilter)
                  .map(s => (
                    <tr key={s.semestriId}>
                      <td>{s.semestriId}</td>
                      <td>{s.semestri1}</td>
                      <td>{s.universitetiEmri || 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => navigate(`/edit-semestri/${s.semestriId}`)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => navigate(`/delete-semestri/${s.semestriId}`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
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

export default DSemestri;
