import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import "datatables.net";

const ProvimetEParaqitura = () => {
  const navigate = useNavigate();
  const [paraqitjet, setParaqitjet] = useState([]);


  
  useEffect(() => {
    let id= localStorage.getItem("stafId");
    fetch(`http://localhost:5138/api/ParaqitjaEProvimitView/view-all/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data:", data);
        setParaqitjet(data);
      })
      .catch((err) => console.error("Gabim gjatë marrjes së të dhënave:", err));
  }, []);

  useEffect(() => {
    if (paraqitjet.length > 0) {
      if ($.fn.DataTable.isDataTable("#datatablesSimple")) {
        $('#datatablesSimple').DataTable().destroy(); // Shkatërro instancën ekzistuese
      }
  
      $("#datatablesSimple").DataTable({
        paging: false,
        searching: false,
        info: false,
      });
    }
  }, [paraqitjet]);
  
 
  

  const deleteNota = async (notaId) => {
    

    try {
      const res = await fetch(`http://localhost:5138/api/nota/${notaId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      console.log(data.message || "Nota u fshi!");
      window.location.reload();
    } catch (err) {
      console.error("Gabim:", err);
    }
  };

  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark">
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>
        <ul className="navbar-nav order-1 order-lg-0 me-4 me-lg-0">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-bars"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="/profiliStafi">Profili Im</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="/orari">Orari im</a></li>
              <li><a className="dropdown-item" href="/vendosNota">Vendos notën</a></li>
              <li><a className="dropdown-item" href="/rezervoSallen">Rezervo Sallën</a></li>
            </ul>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><a className="dropdown-item" href="#">Activity Log</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#">Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <Link className="nav-link" to="/profiliStafi">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                  Profili im
                </Link>
                <Link className="nav-link" to="/orari">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-calendar"></i></div>
                  Orari im
                </Link>
                <Link className="nav-link" to="/vendosNota">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-pen"></i></div>
                  Vendos notën
                </Link>
                <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseRezervo" aria-expanded="false" aria-controls="collapseRezervo">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-door-open"></i></div>
                  Rezervo Sallën
                  <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                </a>
                <div className="collapse" id="collapseRezervo">
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link className="nav-link" to="/rezervoSallen">Bëj Rezervim</Link>
                    <Link className="nav-link" to="/dashboardRezervimet">Shiko Rezervimet</Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Provimet e paraqitura</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item"><a href="index.html">Home</a></li>
                <li className="breadcrumb-item active">Vendos Notën</li>
              </ol>
              <div className="card mb-4"></div>
            </div>

            <div className="card-body">
              <table id="datatablesSimple" className="table table-bordered table-striped table-hover table-compact force-border thin-cells tab-1">
                <thead>
                  <tr>
                    <th className="kodi-lendes">Kodi</th>
                    <th>Lenda</th>
                    <th>Kategoria</th>
                    <th>Studenti</th>
                    <th>Nota</th>
                    <th>Statusi i notes</th>
                    <th>Data vendosjes</th>
                    <th className="cell-button">Vendos notën</th>
                    <th className="cell-button">Fshij notën</th>
                  
                  </tr>
                </thead>
                <tbody>
  {paraqitjet.map((provim, index) => (
    <tr key={index}>
      <td>{provim.kodiLendes}</td>
      <td>{provim.emriLendes}</td>
      <td>{provim.kategoria}</td>
      <td>{provim.studenti}</td>
      <td>{provim.nota ?? "-"}</td>
      <td>{provim.statusiNotes}</td>
      <td>{provim.dataVendosjes ? provim.dataVendosjes.split("T")[0] : "-"}</td>

      <td>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(`/vendos-nota/${provim.paraqitjaId}`)}>Vendos</button>
      </td>
      <td>
        <button className="btn btn-primary btn-sm" onClick={() => deleteNota(provim.notaId)}>Fshij</button>
      </td>
    </tr> 
  ))}
</tbody>

              </table>
            </div>
          </main>
        </div>
      </div>

      <div className="footer">
        <h4>© 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë</h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default ProvimetEParaqitura;