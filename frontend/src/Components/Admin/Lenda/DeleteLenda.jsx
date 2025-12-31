import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from "../../Login/AxiosClient";

const DeleteLenda = () => {
  const [lenda, setLenda] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Merr lëndën sipas ID
  useEffect(() => {
    async function fetchLenda() {
      try {
        const { data } = await axiosClient.get(`/lenda/${id}`);
        setLenda(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së lëndës:", error.response?.data || error.message);
        alert("Lënda nuk u gjet ose ka problem me autorizimin.");
        navigate('/lenda');
      }
    }
    fetchLenda();
  }, [id, navigate]);

  // Fshirja
  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë lëndë?")) return;

    try {
      await axiosClient.delete(`/lenda/${id}`);
      alert("Lënda u fshi me sukses.");
      navigate('/lenda');
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error.response?.data || error.message);
      alert("Gabim gjatë fshirjes së lëndës. Kontrollo autorizimin ose endpointin.");
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
              <h2 className="mb-4">Fshi Lëndën</h2>
              {lenda ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini lëndën{" "}
                    <strong>{lenda.emri ?? lenda.Emri}</strong>?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/lenda" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet lënda...</p>
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

export default DeleteLenda;
