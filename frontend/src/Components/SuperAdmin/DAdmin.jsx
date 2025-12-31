import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { logout } from '../Login/Logout';
import axiosClient from '../Login/AxiosClient';

const DAdminet = () => {
  const navigate = useNavigate(); 

  const [admins, setAdmins] = useState([]);
  const [departamentiFilter, setDepartamentiFilter] = useState('');
  const [universitetiFilter, setUniversitetiFilter] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axiosClient.get("/admin"); // nuk ka nevojë me i shtuar manualisht header-at
        setAdmins(res.data);
      } catch (error) {
        console.error("❌ Error gjatë marrjes së adminëve:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate('/login');
        }
      }
    };

    fetchAdmins();
  }, [navigate]);

  // Nxjerr vlerat unike për filterat
  const uniqueDepartamente = [...new Set(admins.map(admin => admin.departamentiEmri || admin.DepartamentiEmri))];
  const uniqueUniversitete = [...new Set(admins.map(admin => admin.universitetiEmri || admin.UniversitetiEmri))];

  const filteredAdmins = admins.filter(admin => {
    return (
      (departamentiFilter === '' || (admin.departamentiEmri === departamentiFilter || admin.DepartamentiEmri === departamentiFilter)) &&
      (universitetiFilter === '' || (admin.universitetiEmri === universitetiFilter || admin.UniversitetiEmri === universitetiFilter))
    );
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); 
  }, [departamentiFilter, universitetiFilter]);

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="index.html">KOLEGJI UBT-SMIS</a>
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-bars"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/profilisuperadminadmin">Profili Im</a></li>
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
                <Link className="nav-link" to="/profilisuperadmin"><div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>Profili im</Link>
                <Link className="nav-link" to="/admin"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Admin</Link>
                <Link className="nav-link" to="/universiteti"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Universiteti</Link>
                <Link className="nav-link" to="/departamenti"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Departamenti</Link>
                <Link className="nav-link" to="/semestri"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Semestri</Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Adminët e Fakultetit</h2>

            <button type="button" className="btn btn-primary mb-3" onClick={() => navigate('/add-admin')}>
              ➕ Add Admin
            </button>

            {/* Filtrat */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label>Filtro sipas Departamentit:</label>
                <select className="form-select" value={departamentiFilter} onChange={(e) => setDepartamentiFilter(e.target.value)}>
                  <option value="">Të gjithë departamentet</option>
                  {uniqueDepartamente.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label>Filtro sipas Universitetit:</label>
                <select className="form-select" value={universitetiFilter} onChange={(e) => setUniversitetiFilter(e.target.value)}>
                  <option value="">Të gjithë universitetet</option>
                  {uniqueUniversitete.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabela */}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Emri</th>
                  <th>Mbiemri</th>
                  <th>Email</th>
                  <th>Nr Personal</th>
                  <th>Gjinia</th>
                  <th>Datëlindja</th>
                  <th>Telefoni</th>
                  <th>Departamenti</th>
                  <th>Universiteti</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((admin, index) => (
                  <tr key={admin.adminId || index}>
                    <td>{admin.emri}</td>
                    <td>{admin.mbiemri}</td>
                    <td>{admin.email}</td>
                    <td>{admin.nrLeternjoftimit}</td>
                    <td>{admin.gjinia}</td>
                    <td>{admin.datelindja}</td>
                    <td>{admin.telefoni}</td>
                    <td>{admin.departamentiEmri}</td>
                    <td>{admin.universitetiEmri}</td>
                    <td><button className="btn btn-warning btn-sm me-2" onClick={() => navigate(`/edit-admin/${admin.adminId}`)}>Edit</button></td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => navigate(`/delete-admin/${admin.adminId}`)}>Delete</button></td>
                  </tr>
                ))}
                {filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center">Nuk u gjet asnjë rezultat.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                </li>
                {Array.from({ length: Math.ceil(filteredAdmins.length / itemsPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === Math.ceil(filteredAdmins.length / itemsPerPage) ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAdmins.length / itemsPerPage)))}>Next</button>
                </li>
              </ul>
            </nav>
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

export default DAdminet;
