import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Style.css";
import { logout } from '../Login/Logout';
import axiosClient from "../Login/AxiosClient";

const DUniversiteti = () => {
  const [universitetet, setUniversitetet] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversitetet = async () => {
      try {
        const res = await axiosClient.get("/universiteti");
        setUniversitetet(res.data);
      } catch (err) {
        console.error("❌ Gabim gjatë marrjes së universiteteve:", err);
        if (err.response?.status === 401) {
          alert("Sesion i skaduar, kyquni përsëri.");
          navigate("/login");
        }
      }
    };

    fetchUniversitetet();
  }, [navigate]);

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>

        {/* Sidebar Toggle */}
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button"
               data-bs-toggle="dropdown" aria-expanded="false">
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

        {/* Navbar User Dropdown */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button"
               data-bs-toggle="dropdown" aria-expanded="false">
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
        {/* Sidebar */}
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

        {/* Content */}
        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Universitetet</h2>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button type="button" className="btn btn-primary"
                      onClick={() => navigate('/add-universiteti')}>
                ➕ Add Universitet
              </button>
            </div>

            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>UniID</th>
                  <th>Emri</th>
                  <th>Qyteti</th>
                  <th>Lokacioni</th>
                  <th>Telefoni</th>
                  <th>Email</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {universitetet.map(uni => (
                  <tr key={uni.uniId}>
                    <td>{uni.uniId}</td>
                    <td>{uni.emri}</td>
                    <td>
                      {uni.lokacionet?.length > 0 ? (
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                          {uni.lokacionet.map((lok, index) => (
                            <li key={index}>{lok.qyteti}</li>
                          ))}
                        </ul>
                      ) : <span>Ska të dhëna</span>}
                    </td>
                    <td>
                      {uni.lokacionet?.length > 0 ? (
                        <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                          {uni.lokacionet.map((lok, index) => (
                            <li key={index}>{lok.adresa}</li>
                          ))}
                        </ul>
                      ) : <span>Ska të dhëna</span>}
                    </td>
                    <td>{uni.phone}</td>
                    <td>{uni.email}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2"
                              onClick={() => navigate(`/edit-universiteti/${uni.uniId}`)}>
                        Edit
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm"
                              onClick={() => navigate(`/delete-universiteti/${uni.uniId}`)}>
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

export default DUniversiteti;
