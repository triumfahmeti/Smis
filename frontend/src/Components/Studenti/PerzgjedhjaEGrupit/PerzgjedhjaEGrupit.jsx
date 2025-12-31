import React from "react";
import "../Transkripta/Style.css";
import { useEffect } from "react";
import $ from "jquery";
import "datatables.net";
import { Link } from "react-router-dom";
import DropdownLigjeruesi from "../ParaqitjaEProvimeve/DropDownLigjeruesi";
import DropDownGrupi from "./DropDownGrupi";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Login/Logout";
import axiosClient from "../../Login/AxiosClient";

const PerzgjedhjaEGrupit = () => {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState(null);
  const studentId = localStorage.getItem("studentId");
  const [groups, setGroups] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("");
  const [grupiAktual, setGrupiAktual] = useState(null);

  useEffect(() => {
    const departamentiId = localStorage.getItem("departamentiId");

    axiosClient
      .get(`/grupi/grupet-me-vende-lira/${departamentiId}`)
      .then((response) => {
        const grupet = response.data.map((g) => ({
          label: `${g.emri} (${g.vendetELira} vende të lira)`,
          value: g.grupiId,
          kapaciteti: g.kapaciteti,
          studentetNeGrup: g.studentetNeGrup,
          vendetELira: g.vendetELira,
        }));
        setGroups(grupet);
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së grupeve", error);
      });

    axiosClient
      .get(`/grupi/studenti-grupi/${studentId}`)
      .then((response) => {
        if (response.data.kaGrup) {
          setGrupiAktual(response.data.emriGrupit);
          setAlertMessage(`Grupi juaj aktual: ${response.data.emriGrupit}`);
          setAlertType("success");
        } else {
          setGrupiAktual(null);
        }
      })
      .catch((error) => {
        console.error("Gabim gjatë marrjes së grupit aktual", error);
      });
  }, [studentId]);

  const handleRuajGrupin = async () => {
    if (!selectedGroup) {
      setAlertType("danger");
      setAlertMessage("Ju lutem zgjidhni një grup.");
      return;
    }
    const grupi = groups.find((g) => g.value === selectedGroup);

    if (grupi.vendetELira === 0) {
      setAlertType("danger");
      setAlertMessage("Ky grup është plot. Ju lutem zgjidhni një tjetër.");
      return;
    }
    try {
      await axiosClient.put("/studenti/zgjedhgrupin", {
        studentiId: studentId,
        grupiId: parseInt(selectedGroup),
      });

      setAlertType("success");
      setAlertMessage("Grupi u ruajt me sukses!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
      // setGroups((prevGroups) => {
      //   const updatedGroups = prevGroups.map((g) =>
      //     g.value === selectedGroup
      //       ? { ...g, vendetELira: g.vendetELira - 1 }
      //       : g
      //   );
      //   return [...updatedGroups]; // kjo i jep një referencë të re DropDown-it
      // });
    } catch (error) {
      setAlertMessage(
        error.response?.data?.message || "Gabim gjatë ruajtjes së grupit."
      );
    }
  };

  return (
    <div className="sb-nav-fixed">
      {/* Top Navbar */}
      <nav className="sb-topnav navbar navbar-expand navbar-dark ">
        {/* Navbar Brand */}
        <a className="navbar-brand ps-3" href="index.html">
          KOLEGJI UBT-SMIS
        </a>

        {/* Sidebar Toggle */}
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
                <a className="dropdown-item" href="/student/profili">
                  Profili Im
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a className="dropdown-item" href="/student/transkripta">
                  Transkripta
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="stafiakademik"></a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="/student/regjistrimi-semestrit"
                >
                  Regjistrimi Semestrit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="/student/perzgjedh-grupin">
                  Perzgjedh Grupin
                </a>
              </li>

              <li className="dropdown-hover position-relative">
                <a className="dropdown-item d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">Provimet</div>
                  <div>
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>

                <div className="dropdown-hover-content position-absolute start-0 w-100 bg-white border rounded mt-1">
                  <a
                    className="dropdown-item"
                    href="/student/provimet-e-paraqitura"
                  >
                    Provimet e paraqitura
                  </a>
                  <a
                    className="dropdown-item"
                    href="/student/paraqitja-e-provimeve"
                  >
                    Paraqit provimet
                  </a>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        {/* Navbar User Dropdown */}
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-user fa-fw"></i>
            </a>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="navbarDropdown"
            >
              <li>
                <a className="dropdown-item" href="#!">
                  Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#!">
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

      {/* Sidebar and Page Content */}
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
                    <i class="fa-solid fa-user"></i>
                  </div>
                  Profili im
                </Link>

                <Link to="/student/transkripta" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-bars"></i>
                  </div>
                  Transkripta
                </Link>

                <Link to="/student/regjistrimi-semestrit" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-gear"></i>
                  </div>
                  Regjistrimi Semestrit
                </Link>

                <Link to="/student/perzgjedh-grupin" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-people-group"></i>
                  </div>
                  Perzgjedh Grupin
                </Link>

                <div className="sb-sidenav-menu-heading">Provimet</div>
                <Link to="/student/provimet-e-paraqitura" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-newspaper"></i>
                  </div>
                  Provimet e paraqitura
                </Link>
                <Link to="/student/paraqitja-e-provimeve" className="nav-link">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-pen"></i>
                  </div>
                  Paraqit provimet
                </Link>
                <a className="nav-link" href="charts.html">
                  <div className="sb-nav-link-icon">
                    <i class="fa-solid fa-barcode"></i>
                  </div>
                  Pagesat
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              Start Bootstrap
            </div>
          </nav>
        </div>

        {/* Main Page Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h2 className="mt-4">Perzgjedh Grupin</h2>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item">
                  <Link to="/student/profili">Home</Link>
                </li>
                <li className="breadcrumb-item active">Perzgjedh Grupin</li>
              </ol>
              <div className="card mb-4"></div>
            </div>
            {alertMessage && (
              <div
                className={`alert alert-${alertType} alert-dismissible fade show text-center alert-pp-blue cstm-alert`}
                role="alert"
              >
                {/* <strong>
                  {alertType === "success" ? "Sukses!" : "Gabim!"}
                </strong>{" "} */}
                {alertMessage}
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setAlertMessage(null)}
                ></button>
              </div>
            )}

            <div className="card-body">
              <div className="zgjedh-programin">
                <p>Zgjedhe Grupin</p>
                <div>
                  <DropDownGrupi
                    defaultText="Grupi..."
                    items={groups}
                    selected={groups.find((g) => g.value === selectedGroup)}
                    onChange={(item) => setSelectedGroup(item.value)}
                  />
                </div>
                <div className="regjsitroprogramin-button">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm butoni-transkriptes"
                    onClick={handleRuajGrupin}
                    disabled={
                      !selectedGroup ||
                      groups.find((g) => g.value === selectedGroup)
                        ?.vendetELira === 0
                    }
                  >
                    {groups.find((g) => g.value === selectedGroup)
                      ?.vendetELira === 0
                      ? "Nuk ka vend ne grup"
                      : "Ruaj Grupin"}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div class="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </div>
  );
};

export default PerzgjedhjaEGrupit;
