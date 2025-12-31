// DLigjerata.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../Login/Logout';
import axiosClient from '../Login/AxiosClient';

const DLigjerata = () => {
  const navigate = useNavigate();

  const [ligjeratat, setLigjeratat] = useState([]);

  // Filtrat
  const [stafiFilter, setStafiFilter] = useState('');
  const [lendaFilter, setLendaFilter] = useState('');

  // Paginimi
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLigjeratat = async () => {
      const departamentiId = localStorage.getItem("departamentiId");
      const uniId = localStorage.getItem("universitetiId");

      if (!departamentiId) return;

      try {
        // ✅ Provo endpoint-in e ri: /api/ligjerata/universiteti/{uniId}/departamenti/{departamentiId}
        const { data } = await axiosClient.get(
          `/ligjerata/universiteti/${uniId}/departamenti/${departamentiId}`
        );
        setLigjeratat(Array.isArray(data) ? data : []);
      } catch (err1) {
        // ↩️ fallback në /api/ligjerata/departamenti/{departamentiId} nëse i pari s’ekziston
        try {
          const { data } = await axiosClient.get(
            `/ligjerata/departamenti/${departamentiId}`
          );
          setLigjeratat(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Gabim gjatë marrjes së ligjeratave:", error.response?.data || error.message);
          if (error.response?.status === 401) {
            alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
            navigate('/login');
          } else {
            alert("Gabim në marrjen e ligjeratave.");
          }
        }
      }
    };

    fetchLigjeratat();
  }, [navigate]);

  // Vlera unike për dropdown
  const uniqueStaf = [...new Set(ligjeratat.map(l => l.profesoriEmri).filter(Boolean))];
  const uniqueLendet = [...new Set(ligjeratat.map(l => l.lendaEmri).filter(Boolean))];

  // Filtrimi
  const filtered = ligjeratat.filter(l =>
    (stafiFilter === '' || l.profesoriEmri === stafiFilter) &&
    (lendaFilter === '' || l.lendaEmri === lendaFilter)
  );

  // Paginimi
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={() => logout(navigate)}>Logout</button></li>
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
                <Link className="nav-link" to="/profiliadmin"><div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>Profili im</Link>
                <Link className="nav-link" to="/studentet"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Studentet</Link>
                <Link className="nav-link" to="/stafiakademik"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Stafi Akademik</Link>
                <Link className="nav-link" to="/grupi"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Grupi</Link>
                <Link className="nav-link" to="/studentetgrupi"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Studentet ne grupe</Link>
                <Link className="nav-link" to="/lenda"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Lenda</Link>
                <Link className="nav-link" to="/ligjerata"><div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div>Ligjerata</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4"> Ligjeratat</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button className="btn btn-primary me-2" onClick={() => navigate('/add-ligjerata')}>➕ Add Ligjeratë</button>
            </div>

            {/* Filtrat */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Profesori:</label>
                <select
                  className="form-select"
                  value={stafiFilter}
                  onChange={(e) => { setStafiFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Të gjithë</option>
                  {uniqueStaf.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label>Lënda:</label>
                <select
                  className="form-select"
                  value={lendaFilter}
                  onChange={(e) => { setLendaFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="">Të gjitha</option>
                  {uniqueLendet.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Tabela */}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Emri i Profesorit</th>
                  <th>Emri i Lëndës</th>
                  <th>StafiID</th>
                  <th>LendaID</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map(l => (
                  <tr key={`${l.stafiId}-${l.lendaId}`}>
                    <td>{l.profesoriEmri || '—'}</td>
                    <td>{l.lendaEmri || '—'}</td>
                    <td>{l.stafiId}</td>
                    <td>{l.lendaId}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => navigate(`/delete-ligjerata/${l.stafiId}/${l.lendaId}`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentRows.length === 0 && (
                  <tr><td colSpan="5" className="text-center">Nuk ka ligjerata për këto filtra.</td></tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
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
                  <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
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

export default DLigjerata;
