import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../Login/AxiosClient";
import { logout } from "../Login/Logout";
import "bootstrap/dist/css/bootstrap.min.css";

const DStafiAkademik = () => {
  const navigate = useNavigate();

  const [staff, setStaff] = useState([]);
  const [departamentiFilter, setDepartamentiFilter] = useState("");
  const [roliStafitFilter, setRoliStafitFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStaff = async () => {
      const departamentiId = localStorage.getItem("departamentiId");
      const uniId = localStorage.getItem("universitetiId");
      if (!departamentiId || !uniId) return;

      try {
        const res = await axiosClient.get(
          `/stafiakademik/universiteti/${uniId}/departamenti/${departamentiId}`
        );
        setStaff(res.data || []);
      } catch (error) {
        console.error("Gabim gjatë marrjes së stafit:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate("/login");
        }
      }
    };

    fetchStaff();
  }, [navigate]);

  // Uniq values për filtrat
  const uniqueDepartamente = useMemo(
    () => [...new Set((staff || []).map((s) => s.departamentiEmri).filter(Boolean))],
    [staff]
  );
  const uniqueRolet = useMemo(
    () => [...new Set((staff || []).map((s) => s.roliStafit ?? s.RoliStafit).filter(Boolean))],
    [staff]
  );

  // Filtrimi
  const filteredStaff = useMemo(
    () =>
      (staff || []).filter(
        (s) =>
          (departamentiFilter === "" || s.departamentiEmri === departamentiFilter) &&
          (roliStafitFilter === "" || (s.roliStafit ?? s.RoliStafit) === roliStafitFilter)
      ),
    [staff, departamentiFilter, roliStafitFilter]
  );

  // Reset page kur ndryshojnë filtrat
  useEffect(() => {
    setCurrentPage(1);
  }, [departamentiFilter, roliStafitFilter]);

  // Paginimi
  const totalPages = Math.max(1, Math.ceil(filteredStaff.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedStaff = filteredStaff.slice(indexOfFirst, indexOfLast);

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">
          KOLEGJI UBT-SMIS
        </a>
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
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/profiliadmin">Profili Im</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/studentet">Studentet</a></li>
              <li><a className="dropdown-item" href="/stafiakademik">Stafi Akademik</a></li>
              <li><a className="dropdown-item" href="/grupi">Grupi</a></li>
              <li><a className="dropdown-item" href="/studentetgrupi">Studentet ne grupe</a></li>
              <li><a className="dropdown-item" href="/lenda">Lenda</a></li>
            </ul>
          </li>
        </ul>

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
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li>
                <a className="dropdown-item" href="#!">
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
            <h2 className="mb-4"> Stafi Akademik</h2>

            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={() => navigate("/add-staff")}
            >
              ➕ Add Staff
            </button>

            {/* Filtrat */}
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Departamenti:</label>
                <select
                  className="form-select"
                  value={departamentiFilter}
                  onChange={(e) => setDepartamentiFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueDepartamente.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Roli i stafit:</label>
                <select
                  className="form-select"
                  value={roliStafitFilter}
                  onChange={(e) => setRoliStafitFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueRolet.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Emri</th>
                  <th>Mbiemri</th>
                  <th>Email</th>
                  <th>Gjinia</th>
                  <th>Datëlindja</th>
                  <th>Nr Leternjoftimit</th>
                  <th>Telefoni</th>
                  <th>Viti i Regjistrimit</th>
                  <th>Roli</th>
                  <th>Titulli</th>
                  <th>Departamenti</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((s) => (
                  <tr key={s.stafiId}>
                    <td>{s.emri}</td>
                    <td>{s.mbiemri}</td>
                    <td>{s.email}</td>
                    <td>{s.gjinia}</td>
                    <td>{s.datelindja}</td>
                    <td>{s.nrLeternjoftimit}</td>
                    <td>{s.telefoni}</td>
                    <td>{s.vitiRegjistrimit}</td>
                    <td>{s.roliStafit ?? s.RoliStafit}</td>
                    <td>{s.titulli}</td>
                    <td>{s.departamentiEmri}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => navigate(`/edit-staff/${s.stafiId}`)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => navigate(`/delete-staff/${s.stafiId}`)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedStaff.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center">
                      Nuk ka staf për këto filtra.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
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

export default DStafiAkademik;
