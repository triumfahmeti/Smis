import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosClient from '../../Login/AxiosClient';

const DeleteAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await axiosClient.get(`/admin/${id}`);
        setAdmin(res.data);
      } catch (error) {
        console.error("❌ Gabim gjatë marrjes së adminit:", error);
        if (error.response?.status === 404) {
          alert("Admini nuk u gjet.");
        } else if (error.response?.status === 401) {
          alert("Sesion i skaduar, kyquni përsëri.");
          navigate("/login");
        } else {
          alert("Gabim gjatë komunikimit me serverin.");
        }
        navigate("/admin");
      }
    }

    fetchAdmin();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("A jeni i sigurt që dëshironi të fshini këtë admin?")) return;

    try {
      await axiosClient.delete(`/admin/${id}`);
      alert("✅ Admini dhe useri u fshinë me sukses.");
      navigate("/admin");
    } catch (error) {
      console.error("❌ Gabim gjatë fshirjes:", error);
      if (error.response?.status === 401) {
        alert("Sesion i skaduar, kyquni përsëri.");
        navigate("/login");
      } else {
        alert("Gabim gjatë fshirjes së adminit.");
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
                <Link className="nav-link" to="/profili-im">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div> Profili im
                </Link>
                <Link className="nav-link" to="/admin">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-bars"></i></div> Adminët
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container mt-5">
              <h2 className="mb-4">Fshi Adminin</h2>
              {admin ? (
                <div>
                  <p>
                    A jeni i sigurt që doni të fshini adminin{" "}
                    <strong>{admin.emri} {admin.mbiemri}</strong>?
                  </p>
                  <button onClick={handleDelete} className="btn btn-danger">Po, fshije</button>
                  <Link to="/admin" className="btn btn-secondary ms-2">Anulo</Link>
                </div>
              ) : (
                <p>Po ngarkohet admini...</p>
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

export default DeleteAdmin;
