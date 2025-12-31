// DStudentetGrupi.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Orari/Style.css';
import { logout } from '../Login/Logout';
import axiosClient from '../Login/AxiosClient';

const DStudentetGrupi = () => {
  const navigate = useNavigate();

  // Data
  const [students, setStudents] = useState([]);

  // Filters (si DStudentet, por për Grup & Semestër)
  const [semestriFilter, setSemestriFilter] = useState('');
  const [grupiFilter, setGrupiFilter] = useState('');

  // Pagination (e njëjtë si DStudentet)
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      const departamentiId = localStorage.getItem('departamentiId');
      const uniId = localStorage.getItem('universitetiId');
      if (!departamentiId || !uniId) return;

      try {
        const res = await axiosClient.get(
          `/studentiera/universiteti/${uniId}/departamenti/${departamentiId}`
        );
        setStudents(res.data || []);
      } catch (error) {
        console.error('Gabim gjatë marrjes së studentëve:', error);
        if (error.response?.status === 401) {
          alert('Sesion i skaduar. Ju lutem kyquni përsëri!');
          navigate('/login');
        } else {
          alert('Gabim në marrjen e studentëve.');
        }
      }
    };

    fetchStudents();
  }, [navigate]);

  // Vlerat unike për dropdown-ët
  const uniqueSemestrat = [
    ...new Set(students.map((s) => s.semestriEmri).filter(Boolean)),
  ];
  const uniqueGrupet = [
    ...new Set(students.map((s) => s.grupiEmri).filter(Boolean)),
  ];

  // Filtrimi (si DStudentet)
  const filteredStudents = students.filter(
    (s) =>
      (semestriFilter === '' || s.semestriEmri === semestriFilter) &&
      (grupiFilter === '' || s.grupiEmri === grupiFilter)
  );

  // Pagination slice (si DStudentet)
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">
          KOLEGJI UBT-SMIS
        </a>

        {/* Menu butoni i majtë (si DStudentet) */}
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
                <a className="dropdown-item" href="/stafiakademik">
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

        {/* User dropdown (si DStudentet) */}
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
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" onClick={() => logout(navigate)}>
                  Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profiliadmin">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>
                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Studentet
                </Link>
                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Stafi Akademik
                </Link>
                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Grupi
                </Link>
                <Link className="nav-link" to="/studentetgrupi">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Studentet ne grupe
                </Link>
                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Lenda
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Studentët sipas Grupit dhe Semestrit</h2>

            {/* Toolbar opsionale si tek DStudentet */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => navigate('/add-student')}
                >
                  ➕ Add Student
                </button>
              </div>
            </div>

            {/* Filtrat (strukturë e njëjtë me DStudentet) */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Semestri:</label>
                <select
                  className="form-select"
                  value={semestriFilter}
                  onChange={(e) => {
                    setSemestriFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjithë</option>
                  {uniqueSemestrat.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label>Grupi:</label>
                <select
                  className="form-select"
                  value={grupiFilter}
                  onChange={(e) => {
                    setGrupiFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Të gjithë</option>
                  {uniqueGrupet.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
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
                  <th>Grupi</th>
                  <th>Semestri</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((s) => (
                  <tr key={s.studentiId}>
                    <td>{s.emri}</td>
                    <td>{s.mbiemri}</td>
                    <td>{s.email}</td>
                    <td>{s.grupiEmri}</td>
                    <td>{s.semestriEmri}</td>
                  </tr>
                ))}
                {currentStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Nuk u gjet asnjë rezultat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination (njësoj si DStudentet) */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                  >
                    Previous
                  </button>
                </li>

                {Array.from(
                  { length: Math.ceil(filteredStudents.length / studentsPerPage) || 1 },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage ===
                    Math.ceil(filteredStudents.length / studentsPerPage) || 1
                      ? 'disabled'
                      : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(filteredStudents.length / studentsPerPage) || 1
                        )
                      )
                    }
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
        <a
          href="https://www.smis.education"
          className="text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          www.smis.education
        </a>
      </div>
    </div>
  );
};

export default DStudentetGrupi;
