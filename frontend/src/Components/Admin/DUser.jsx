import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import "./Style.css";
import $ from "jquery";
import "datatables.net";

const DUserat = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = [
        {
          userID: 1,
          emri: 'Arlind',
          mbiemri: 'Berisha',
          email: 'arlind@example.com',
          password: 'password123',
          roli: 'Admin',
          datelindja: '1999-01-01',
          nrLeternjoftimi: 'A1234567',
          vendLindja: 'Prishtine',
          gjinia: 'Mashkull',
          shteti: 'Kosove',
          vendbanimi: 'Prishtine',
          adresa: 'Lagjja Dardania',
          zipKodi: '10000',
          telefoni: '+38344123456',
          nenshtetesia: 'Kosovar'
        },
        {
          userID: 2,
          emri: 'Elira',
          mbiemri: 'Hoxha',
          email: 'elira@example.com',
          password: 'password456',
          roli: 'User',
          datelindja: '2000-02-02',
          nrLeternjoftimi: 'B7654321',
          vendLindja: 'Gjilan',
          gjinia: 'Femer',
          shteti: 'Kosove',
          vendbanimi: 'Gjilan',
          adresa: 'Rruga e Spitalit',
          zipKodi: '60000',
          telefoni: '+38349123456',
          nenshtetesia: 'Kosovare'
        }
      ];
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <div className="sb-nav-fixed">
      {/* Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        <a className="navbar-brand ps-3" href="#">KOLEGJI UBT-SMIS</a>
      </nav>

      <div id="layoutSidenav">
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Home</div>
                <a className="nav-link" href="#">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-user"></i></div>
                  Profili im
                </a>
                <a className="nav-link" href="#">
                  <div className="sb-nav-link-icon"><i className="fa-solid fa-users"></i></div>
                  Lista e Userave
                </a>
              </div>
            </div>
          </nav>
        </div>

        <div id="layoutSidenav_content">
          <main className="container-fluid p-4">
            <h2 className="mb-4">Lista e Userave</h2>

            {/* Butoni për shtim */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                ➕ Add User
              </button>
            </div>

            {/* Tabela */}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Emri</th>
                  <th>Mbiemri</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Roli</th>
                  <th>Datelindja</th>
                  <th>Nr Leternjoftimi</th>
                  <th>VendLindja</th>
                  <th>Gjinia</th>
                  <th>Shteti</th>
                  <th>Vendbanimi</th>
                  <th>Adresa</th>
                  <th>ZIP Kodi</th>
                  <th>Telefoni</th>
                  <th>Nenshtetesia</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.userID}>
                    <td>{user.emri}</td>
                    <td>{user.mbiemri}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.roli}</td>
                    <td>{user.datelindja}</td>
                    <td>{user.nrLeternjoftimi}</td>
                    <td>{user.vendLindja}</td>
                    <td>{user.gjinia}</td>
                    <td>{user.shteti}</td>
                    <td>{user.vendbanimi}</td>
                    <td>{user.adresa}</td>
                    <td>{user.zipKodi}</td>
                    <td>{user.telefoni}</td>
                    <td>{user.nenshtetesia}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2">Edit</button>
                      <button className="btn btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </main>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default DUserat;
