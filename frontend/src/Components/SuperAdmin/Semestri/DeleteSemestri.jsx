import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';

const DeleteSemestri = () => {
  const [semestri, setSemestri] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchSemestri = async () => {
      try {
        const res = await axiosClient.get(`/semestri/${id}`);
        setSemestri(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së semestrit:", error);
        if (error.response?.status === 404) {
          alert("❌ Semestri nuk u gjet.");
          navigate('/semestri');
        } else if (error.response?.status === 401) {
          alert("Sesion i skaduar. Kyçu përsëri.");
          navigate('/login');
        } else {
          alert("Gabim gjatë marrjes së semestrit.");
          navigate('/semestri');
        }
      }
    };

    fetchSemestri();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë semestër?")) return;

    try {
      await axiosClient.delete(`/semestri/${id}`);
      alert("✅ Semestri u fshi me sukses.");
      navigate('/semestri');
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar. Kyçu përsëri.");
        navigate('/login');
      } else if (error.response?.status === 409) {
        alert("Nuk mund të fshihet: ekzistojnë varësi (lëndë/studentë).");
      } else {
        alert("Gabim gjatë fshirjes së semestrit.");
      }
    }
  };

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/semestri">Semestrat</Link>
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Fshi Semestrin</h2>
              {semestri ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini semestrin{" "}
                    <strong>{semestri.semestri1}</strong>?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/semestri" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet semestri...</p>
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

export default DeleteSemestri;
