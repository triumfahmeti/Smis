import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from "../../Login/AxiosClient";

const DeleteStudent = () => {
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Merr studentin sipas ID
  useEffect(() => {
    async function fetchStudent() {
      try {
        const { data } = await axiosClient.get(`/studentiera/${id}`);
        setStudent(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së studentit:", error.response?.data || error.message);
        alert("Studenti nuk u gjet ose ka problem me autorizimin.");
        navigate('/studentet');
      }
    }
    fetchStudent();
  }, [id, navigate]);

  // Fshirja
  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë student?")) return;

    try {
      await axiosClient.delete(`/studentiera/${id}`);
      alert("Studenti dhe user-i u fshinë me sukses.");
      navigate('/studentet');
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error.response?.data || error.message);
      alert("Gabim gjatë fshirjes së studentit. Kontrollo autorizimin ose endpointin.");
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profili-im">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div> Profili im
                </Link>
                <Link className="nav-link" to="/studentet">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Studentet
                </Link>
                <Link className="nav-link" to="/stafiakademik">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Stafi Akademik
                </Link>
                <Link className="nav-link" to="/grupi">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Grupi
                </Link>
                <Link className="nav-link" to="/lenda">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Lenda
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Fshi Studentin</h2>
              {student ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini studentin{" "}
                    <strong>{student.emri} {student.mbiemri}</strong>?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/studentet" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet studenti...</p>
              )}
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

export default DeleteStudent;
