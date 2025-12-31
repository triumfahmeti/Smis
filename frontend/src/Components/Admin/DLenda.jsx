import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { logout } from '../Login/Logout';
import axiosClient from '../Login/AxiosClient';

const DLenda = () => {
  const navigate = useNavigate();

  const [lendet, setLendet] = useState([]);

  // Filtrat
  const [departamentiFilter, setDepartamentiFilter] = useState('');
  const [semestriFilter, setSemestriFilter] = useState('');

  // Paginimi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLendet = async () => {
      const departamentiId = localStorage.getItem("departamentiId");
      const uniId = localStorage.getItem("universitetiId"); // mund të të duhej nëse ke endpoint sipas uni

      if (!departamentiId) return;

      try {
        // Nëse ke endpoint sipas uni+dep, zëvendëso me atë.
        const { data } = await axiosClient.get(`/lenda/departamenti/${departamentiId}`);
        setLendet(data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së lëndëve:", error.response?.data || error.message);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate('/login');
        } else {
          alert("Gabim në marrjen e të dhënave të lëndëve");
        }
      }
    };

    fetchLendet();
  }, [navigate]);

  // Vlera unike për dropdown-ët (mbulo edhe casing/aliaset)
  const uniqueDepartamente = [
    ...new Set(
      lendet.map(l =>
        l.departamentiEmri ?? l.Departamentiemri ?? l.departamenti?.emri ?? ""
      ).filter(Boolean)
    )
  ];

  const uniqueSemestrat = [
    ...new Set(
      lendet.map(l =>
        l.semestri1 ?? l.Semestri1 ?? l.semestri?.semestri1 ?? ""
      ).filter(Boolean)
    )
  ];

  // Filtrimi
  const filteredLendet = lendet.filter(l => {
    const depName = l.departamentiEmri ?? l.Departamentiemri ?? l.departamenti?.emri;
    const semName = l.semestri1 ?? l.Semestri1 ?? l.semestri?.semestri1;

    return (
      (departamentiFilter === '' || depName === departamentiFilter) &&
      (semestriFilter === '' || semName === semestriFilter)
    );
  });

  // Paginimi – llogarit diljen në tabelë
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLendet.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLendet.length / itemsPerPage) || 1;

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        {/* Navbar Brand */}
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>

        {/* Sidebar Toggle */}
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
                <a className="dropdown-item" href="stafiakademik">
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

        {/* Navbar User Dropdown */}
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
                <a className="dropdown-item" href="#!">
                  Activity Log
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
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>

                <Link className="nav-link" to="/profiliadmin">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                  Profili im
                </Link>

                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Studentet
                </Link>

                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Stafi Akademik
                </Link>

                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Grupi
                </Link>

                <Link className="nav-link" to="/studentetgrupi">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Studentet ne grupe
                </Link>

                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>
                  Lenda
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Lëndët e Fakultetit</h2>

            {/* Butonat kryesorë */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <button
                  type="button"
                  className="btn btn-primary me-2"
                  onClick={() => navigate('/add-lenda')}
                >
                  ➕ Add Subject
                </button>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => navigate('/ligjerata')}
                >
                  📚 Ligjerata
                </button>
              </div>
            </div>

            {/* Filtrat */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label>Filtro sipas Departamentit:</label>
                <select
                  className="form-select"
                  value={departamentiFilter}
                  onChange={(e) => {
                    setDepartamentiFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjitha departamentet</option>
                  {uniqueDepartamente.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label>Filtro sipas Semestrit:</label>
                <select
                  className="form-select"
                  value={semestriFilter}
                  onChange={(e) => {
                    setSemestriFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjithë semestrat</option>
                  {uniqueSemestrat.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabela */}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Emri i Lëndës</th>
                  <th>Kreditet</th>
                  <th>Departamenti</th>
                  <th>Semestri</th>
                  <th>Kategoria</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((lenda) => {
                  const id = lenda.lendaId ?? lenda.LendaId;
                  const emri = lenda.emri ?? lenda.Emri;
                  const kredite = lenda.kredite ?? lenda.Kredite;
                  const depName = lenda.departamentiEmri ?? lenda.Departamentiemri ?? lenda.departamenti?.emri;
                  const semName = lenda.semestri1 ?? lenda.Semestri1 ?? lenda.semestri?.semestri1;
                  const kategoria = lenda.kategoria ?? lenda.Kategoria;

                  return (
                    <tr key={id}>
                      <td>{emri}</td>
                      <td>{kredite}</td>
                      <td>{depName}</td>
                      <td>{semName}</td>
                      <td>{kategoria}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => navigate(`/edit-lenda/${id}`)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => navigate(`/delete-lenda/${id}`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">Nuk ka lëndë për këto filtra.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginimi */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
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

export default DLenda;
