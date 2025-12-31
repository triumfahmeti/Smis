import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';

const DeleteUniversiteti = () => {
  const [universiteti, setUniversiteti] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchUniversiteti = async () => {
      try {
        const res = await axiosClient.get(`/universiteti/${id}`);
        setUniversiteti(res.data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së universitetit:", error);
        if (error.response?.status === 404) {
          alert("Universiteti nuk u gjet.");
          navigate('/universiteti');
        } else if (error.response?.status === 401) {
          alert("Sesion i skaduar. Kyçu sërish.");
          navigate('/login');
        } else {
          alert("Gabim gjatë komunikimit me serverin.");
          navigate('/universiteti');
        }
      }
    };

    fetchUniversiteti();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që doni ta fshini këtë universitet?")) return;

    try {
      await axiosClient.delete(`/universiteti/${id}`);
      alert("Universiteti u fshi me sukses.");
      navigate('/universiteti');
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar. Kyçu sërish.");
        navigate('/login');
      } else if (error.response?.status === 409) {
        // nëse keni bërë constraint (p.sh. ka varësi Departamente/Lokacione)
        alert("Nuk mund të fshihet: ekzistojnë varësi (departamente/lokacione).");
      } else {
        alert("Gabim gjatë fshirjes së universitetit.");
      }
    }
  };

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/universiteti">
                  Universitetet
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Fshi Universitetin</h2>
              {universiteti ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini universitetin{" "}
                    <strong>{universiteti.emri}</strong>?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/universiteti" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet universiteti...</p>
              )}
            </div>
          </main>
        </div>
      </div>

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

export default DeleteUniversiteti;
