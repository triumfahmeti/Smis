import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "./Style.css";
import $ from "jquery";
import "datatables.net";
import { logout } from "../Login/Logout";
import { useNavigate } from "react-router-dom";

const Orari = () => {
  const navigate = useNavigate();
  const [orariList, setOrariList] = useState([]);

  useEffect(() => {
    fetchOrari();
  }, []);

  useEffect(() => {
    if (orariList.length > 0) {
      $("#datatablesSimple").DataTable();
    }
  }, [orariList]);

  const fetchOrari = async () => {
    try {
      const res = await fetch("http://localhost:5138/api/orari"); // Ndrysho nëse ndryshe quhet endpoint-i
      const data = await res.json();
      setOrariList(data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së orarit:", err);
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Navbar dhe Sidebar mbeten të njëjta */}

      <div id="layoutSidenav_content">
        <main className="container-fluid">
          <table
            id="datatablesSimple"
            className="table table-striped table-hover table-border mt-3 ml-1 mr-1"
          >
            <thead>
              <tr>
                <th className="text-center" colSpan={5} scope="col">
                  Orari
                </th>
              </tr>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Koha</th>
                <th scope="col">Lloji</th>
                <th scope="col">Ndërrimi</th>
                <th scope="col">ID</th>
              </tr>
            </thead>
            <tbody>
              {orariList.map((o) => (
                <tr key={o.orariId}>
                  <td>{o.data}</td>
                  <td>{o.koha}</td>
                  <td>{o.lloji}</td>
                  <td>{o.ndërrimi}</td>
                  <td>{o.orariId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>

      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="https://www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default Orari;
