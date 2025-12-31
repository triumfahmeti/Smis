// DeleteLigjerata.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from "../../Login/AxiosClient";

const DeleteLigjerata = () => {
  const [ligjerata, setLigjerata] = useState(null);
  const navigate = useNavigate();
  const { stafiId, lendaId } = useParams();

  // Merr ligjeratën sipas composite key (stafiId, lendaId)
  useEffect(() => {
    async function fetchLigjerata() {
      try {
        const { data } = await axiosClient.get(`/ligjerata/${stafiId}/${lendaId}`);
        setLigjerata(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së ligjeratës:", error.response?.data || error.message);
        alert("Ligjerata nuk u gjet ose ka problem me autorizimin.");
        navigate('/ligjerata');
      }
    }
    fetchLigjerata();
  }, [stafiId, lendaId, navigate]);

  // Fshirja
  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë ligjeratë?")) return;

    try {
      await axiosClient.delete(`/ligjerata/${stafiId}/${lendaId}`);
      alert("Ligjerata u fshi me sukses.");
      navigate('/ligjerata');
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error.response?.data || error.message);
      alert("Gabim gjatë fshirjes së ligjeratës. Kontrollo autorizimin ose endpointin.");
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
                <Link className="nav-link" to="/ligjerata">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Ligjerata
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
              <h2 className="mb-4">Fshi Ligjeratën</h2>
              {ligjerata ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini ligjeratën për lëndën{" "}
                    <strong>{ligjerata.lendaEmri}</strong>{" "}
                    {ligjerata.profesoriEmri ? <>nga profesori <strong>{ligjerata.profesoriEmri}</strong></> : null}?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/ligjerata" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet ligjerata...</p>
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

export default DeleteLigjerata;
