import React, { useEffect, useState } from "react";
import axiosClient from "../Login/AxiosClient";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Login/Logout";
import { Modal, Button, Form } from "react-bootstrap";

const Get = () => {
  const navigate = useNavigate();
  const [fabrikat, setFabrikat] = useState([]);
  const [robotet, setRobotet] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  // const [editModalOpen, setEditModalOpen] = useState(false);
  // const [editingFabrika, setEditingFabrika] = useState(null);
  // const [editEmriFabrikes, setEditEmriFabrikes] = useState("");
  // const [editLokacioni, setEditLokacioni] = useState("");
  // // const [editEmail, setEditEmail] = useState("");

  // const getLigjeruesiName = (ligjeruesiId) => {
  //   if (!ligjeruesiId) return "-";
  //   const l = ligjeruesit.find((x) => x.ligjeruesiId === ligjeruesiId);
  //   if (!l) return ligjeruesiId;
  //   const emri = l.emri ?? "";
  //   const mbiemri = l.mbiemri ?? "";
  //   const full = `${emri} ${mbiemri}`.trim();
  //   return full || l.emri || l.email || ligjeruesiId;
  // };

  const getFabrikaName = (fabrikaId) => {
    if (!fabrikaId) return "-";
    const l = fabrikat.find((x) => x.fabrikaId === fabrikaId);
    if (!l) return fabrikaId;
    const emri = l.emri ?? "";
    const mbiemri = l.mbiemri ?? "";
    const full = `${emri} ${mbiemri}`.trim();
    return full || l.emri || l.email || fabrikaId;
  };

  const deleteRoboti = async (robotiId) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini robotin?"))
      return;
    try {
      await axiosClient.delete(`/roboti/${robotiId}`);
      setRobotet((prev) => prev.filter((p) => p.robotiId !== robotiId));
      setAlertType("success");
      setAlertMessage("Roboti u fshi me sukses.");
    } catch (err) {
      console.error(err);
      setAlertType("danger");
      setAlertMessage("Gabim gjatë fshirjes së robotit.");
    }
  };

  const getRobotsByFabrikaId = (fabrikaId) => {
    return robotet.filter((r) => r.fabrikaId === fabrikaId);
  };

  // const openEditModal = (fabrika) => {
  //   setEditingFabrika(fabrika);
  //   setEditEmriFabrikes(fabrika.emri ?? "");
  //   setEditLokacioni(fabrika.lokacioni ?? "");
  //   // setEditEmail(ligjeruesi.email ?? "");
  //   setEditModalOpen(true);
  // };

  // const closeEditModal = () => {
  //   setEditModalOpen(false);
  //   setEditingFabrika(null);
  //   setEditEmriFabrikes("");
  //   setEditLokacioni("");
  //   // setEditEmail("");
  // };

  // const saveFabrikaEdit = async () => {
  //   if (!editingFabrika) return;
  //   try {
  //     await axiosClient.put(`/fabrika/${editingFabrika.fabrikaId}`, {
  //       emri: editEmriFabrikes,
  //       lokacioni: editLokacioni,
  //       // email: editEmail,
  //     });
  //     setFabrikat((prev) =>
  //       prev.map((f) =>
  //         f.fabrikaId === editingFabrika.fabrikaId
  //           ? {
  //               ...f,
  //               emri: editEmriFabrikes,
  //               lokacioni: editLokacioni,
  //               // email: editEmail,
  //             }
  //           : f
  //       )
  //     );
  //     setAlertType("success");
  //     setAlertMessage("Fabrika u përditësua me sukses.");
  //     closeEditModal();
  //   } catch (err) {
  //     console.error(err);
  //     setAlertType("danger");
  //     setAlertMessage("Gabim gjatë përditësimit të fabrikës.");
  //   }
  // };
  useEffect(() => {
    axiosClient
      .get("/fabrika")
      .then((res) => setFabrikat(res.data))
      .catch((error) => {
        console.error(error);
        setAlertType("danger");
        setAlertMessage("Gabim gjatë ngarkimit të listës së fabrikave.");
      });
  }, []);
  useEffect(() => {
    axiosClient
      .get("/roboti")
      .then((res) => setRobotet(res.data))
      .catch((err) => {
        console.error("Gabim gjatë marrjes së robotëve:", err);
        setAlertType("danger");
        setAlertMessage("Gabim gjatë ngarkimit të listës së robotëve.");
      });
  }, []);
  return (
    <div className="sb-nav-fixed">
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
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
                <Link className="dropdown-item" to="/student/profili">
                  Profili Im
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <Link className="dropdown-item" to="/student/transkripta">
                  Transkripta
                </Link>
              </li>
              <li>
                <Link
                  className="dropdown-item"
                  to="/student/regjistrimi-semestrit"
                >
                  Regjistrimi Semestrit
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/student/perzgjedh-grupin">
                  Perzgjedh Grupin
                </Link>
              </li>
              <li className="dropdown-hover position-relative">
                <a className="dropdown-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">Provimet</div>
                  <div>
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div className="dropdown-hover-content position-absolute start-0 w-100 bg-white border rounded mt-1">
                  <Link
                    className="dropdown-item"
                    to="/student/provimet-e-paraqitura"
                  >
                    Provimet e paraqitura
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="/student/paraqitja-e-provimeve"
                  >
                    Paraqit provimet
                  </Link>
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarUser"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarUser"
            >
              <li>
                <a className="dropdown-item" href="#">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  Activity Log
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <button
                className="dropdown-item"
                onClick={() => logout(navigate)}
              >
                Logout
              </button>
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
                <Link to="/student/profili" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>
                <Link to="/student/transkripta" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </Link>
                <Link to="/student/regjistrimi-semestrit" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-gear"></i>
                  </div>
                  Regjistrimi Semestrit
                </Link>
                <Link to="/student/perzgjedh-grupin" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-people-group"></i>
                  </div>
                  Perzgjedh Grupin
                </Link>
                <div className="sb-sidenav-menu-heading">Provimet</div>
                <Link to="/student/provimet-e-paraqitura" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </Link>
                <Link to="/student/paraqitja-e-provimeve" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </Link>
                <div className="sb-sidenav-menu-heading">Fabrika</div>
                <Link to="/student/Fabrika" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-industry"></i>
                  </div>
                  Fabrika
                </Link>
                <Link to="/student/puntori" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-user-gear"></i>
                  </div>
                  Puntori
                </Link>
                <Link to="/student/Get" className="nav-link active">
                  <div className="sb-nav-link-icon">
                    <i className="fa-solid fa-list"></i>
                  </div>
                  Listat
                </Link>
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
              <h2 className="mt-4">Listat e Roboteve dhe Fabrikave</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">Listat</li>
              </ol>
              {alertMessage && (
                <div
                  className={`alert alert-${alertType} alert-dismissible fade show`}
                  role="alert"
                >
                  {alertMessage}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAlertMessage(null)}
                  ></button>
                </div>
              )}

              <div className="card mb-4">
                <div className="card-header">
                  <i className="fa-solid fa-user-gear me-1"></i>Lista e Roboteve
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Emri</th>
                        <th>Modeli</th>
                        <th>VitiProdhimit</th>
                        <th>Fabrika</th>

                        <th className="text-center"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {robotet.map((l) => (
                        <tr key={l.robotiId}>
                          <td>{l.emri}</td>

                          <td>{l.modeli}</td>
                          <td>{l.vitiProdhimit}</td>
                          <td>{getFabrikaName(l.fabrikaId)}</td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteRoboti(l.robotiId)}
                            >
                              Fshij
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-header">
                  <i className="fa-solid fa-industry me-1"></i>Lista e Fabrikave
                </div>
                <div className="card-body">
                  <table className="table table-bordered table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Emri</th>
                        <th>Lokacioni</th>
                        <th>Shteti</th>
                        <th>Lista e roboteve</th>
                        {/* <th className="text-center">Veprime</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {fabrikat.map((l) => (
                        <tr key={l.fabrikaId}>
                          <td>{l.emri}</td>
                          <td>{l.lokacioni}</td>
                          <td>{l.shteti}</td>
                          <td>
                            <Button onclick></Button>
                          </td>
                          {/* <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => openEditModal(l)}
                            >
                              Edito
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>

      {/* <Modal
        show={editModalOpen}
        onHide={closeEditModal}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edito Fabrikën</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Emri i Fabrikës</Form.Label>
              <Form.Control
                type="text"
                value={editEmriFabrikes}
                onChange={(e) => setEditEmriFabrikes(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Lokacioni</Form.Label>
              <Form.Control
                type="text"
                value={editLokacioni}
                onChange={(e) => setEditLokacioni(e.target.value)}
              />
            </Form.Group> */}
      {/* <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </Form.Group> */}
      {/* </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeEditModal}>
            Mbyll
          </Button>
          <Button variant="primary" onClick={saveFabrikaEdit}>
            Ruaj
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default Get;
