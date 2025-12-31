import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Orari/Style.css";
import { logout } from "../Login/Logout";
import axiosClient from "../Login/AxiosClient";

const DStudentet = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [departamentiFilter, setDepartamentiFilter] = useState("");
  const [vitiFilter, setVitiFilter] = useState("");
  const [statusiFilter, setStatusiFilter] = useState("");
  const [semestriFilter, setSemestriFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const departamentiId = localStorage.getItem("departamentiId");
  const uniId = localStorage.getItem("universitetiId");

  useEffect(() => {
    const fetchStudents = async () => {
      if (!departamentiId || !uniId) return;

      try {
        const res = await axiosClient.get(
          `/studentiera/universiteti/${uniId}/departamenti/${departamentiId}`
        );
        setStudents(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së studentëve:", error);
        if (error.response?.status === 401) {
          alert("Sesion i skaduar. Ju lutem kyquni përsëri!");
          navigate("/login");
        }
      }
    };

    fetchStudents();
  }, [navigate]);

  const handleResetGrupet = async () => {
    if (
      window.confirm(
        "A jeni të sigurt që doni të resetoni grupet për të gjithë studentët?"
      )
    ) {
      try {
        const res = await axiosClient.put(
          `/grupi/resetogrupet/${departamentiId}`
        );
        if (res.status === 200) alert("Grupet u resetuan me sukses!");
        else alert("Gabim gjatë resetimit të grupeve.");
      } catch (error) {
        console.error("Gabim gjatë komunikimit me API-n:", error);
        alert("Gabim në rrjet ose server.");
      }
    }
  };

  const uniqueVitet = [...new Set(students.map((s) => s.vitiRegjistrimit))];
  const uniqueStatuset = [...new Set(students.map((s) => s.statusi))];
  const uniqueDepartamente = [
    ...new Set(students.map((s) => s.departamentiEmri)),
  ];
  const uniqueSemestrat = [...new Set(students.map((s) => s.semestriEmri))];

  const filteredStudents = students.filter(
    (s) =>
      (departamentiFilter === "" ||
        s.departamentiEmri === departamentiFilter) &&
      (vitiFilter === "" || String(s.vitiRegjistrimit) === vitiFilter) &&
      (statusiFilter === "" || s.statusi === statusiFilter) &&
      (semestriFilter === "" || s.semestriEmri === semestriFilter)
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  return (
    <div className="sb-nav-fixed">
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
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
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

        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Studentët e Fakultetit</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-primary me-2"
                onClick={() => navigate("/add-student")}
              >
                ➕ Add Student
              </button>
              <button className="btn btn-warning" onClick={handleResetGrupet}>
                🔁 Reseto Grupet e Studentëve
              </button>
            </div>

            {/* Filtrat */}
            <div className="row mb-3">
              <div className="col-md-3">
                <label>Departamenti:</label>
                <select
                  className="form-select"
                  value={departamentiFilter}
                  onChange={(e) => setDepartamentiFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueDepartamente.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Semestri:</label>
                <select
                  className="form-select"
                  value={semestriFilter}
                  onChange={(e) => setSemestriFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueSemestrat.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Viti i Regjistrimit:</label>
                <select
                  className="form-select"
                  value={vitiFilter}
                  onChange={(e) => setVitiFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueVitet.map((vit) => (
                    <option key={vit} value={vit}>
                      {vit}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label>Statusi:</label>
                <select
                  className="form-select"
                  value={statusiFilter}
                  onChange={(e) => setStatusiFilter(e.target.value)}
                >
                  <option value="">Të gjithë</option>
                  {uniqueStatuset.map((status) => (
                    <option key={status} value={status}>
                      {status}
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
                  <th>Nr Personal</th>
                  <th>Gjinia</th>
                  <th>Datëlindja</th>
                  <th>Telefoni</th>
                  <th>Statusi</th>
                  <th>Departamenti</th>
                  <th>Semestri</th>
                  <th>Viti i Regjistrimit</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student) => (
                  <tr key={student.studentiId}>
                    <td>{student.emri}</td>
                    <td>{student.mbiemri}</td>
                    <td>{student.email}</td>
                    <td>{student.nrLeternjoftimit}</td>
                    <td>{student.gjinia}</td>
                    <td>{student.datelindja}</td>
                    <td>{student.telefoni}</td>
                    <td>{student.statusi}</td>
                    <td>{student.departamentiEmri}</td>
                    <td>{student.semestriEmri}</td>
                    <td>{student.vitiRegjistrimit}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() =>
                          navigate(`/edit-student/${student.studentiId}`)
                        }
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          navigate(`/delete-student/${student.studentiId}`)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {currentStudents.length === 0 && (
                  <tr>
                    <td colSpan="13" className="text-center">
                      Nuk u gjet asnjë rezultat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
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
                  {
                    length: Math.ceil(
                      filteredStudents.length / studentsPerPage
                    ),
                  },
                  (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
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
                    Math.ceil(filteredStudents.length / studentsPerPage)
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(filteredStudents.length / studentsPerPage)
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

      <div className="footer bg-dark text-white text-center py-3 mt-auto">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
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

export default DStudentet;
