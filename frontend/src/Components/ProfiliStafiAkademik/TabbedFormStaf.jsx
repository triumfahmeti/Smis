import React, { useState, useEffect } from "react";
import "../Studenti/Transkripta/Style.css";
import axios from "axios";

const TabbedFormStaf = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [stafData, setStafData] = useState(null);

  useEffect(() => {
    const stafId = localStorage.getItem("stafId");
    axios
      .get(`http://localhost:5138/api/stafiakademik/${stafId}`)
      .then((res) => {
        console.log("Te dhenat e marra:", res.data); // 🔍 Shto këtë
        if (res.data && res.data.length > 0) {
          setStafData(res.data[0]);
        }
      })
      .catch((err) => console.error("Gabim gjatë marrjes së të dhënave:", err));
  }, []);

  if (!stafData) return <p>Duke ngarkuar të dhënat...</p>;

  return (
    <div className="container mt-4">
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Informatat Personale
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pozita" ? "active" : ""}`}
            onClick={() => setActiveTab("pozita")}
          >
            Pozita dhe Roli
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "photo" ? "active" : ""}`}
            onClick={() => setActiveTab("photo")}
          >
            Foto
          </button>
        </li>
      </ul>

      <form className="mt-3">
        {activeTab === "info" && (
          <>
            <div className="form-row mb-2">
              <label className="form-label custom-label">ID e Stafit</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.stafiId}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Emri</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.emri}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Mbiemri</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.mbiemri}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Data e Lindjes</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.datelindja}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm custom-input"
                value={stafData.email}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">
                Numri i telefonit
              </label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.telefoni}
                readOnly
              />
            </div>
          </>
        )}

        {activeTab === "pozita" && (
          <>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Roli</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.roli}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Departamenti</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.emriDepartamentit}
                readOnly
              />
            </div>
          </>
        )}

        {activeTab === "puna" && (
          <>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Data e fillimit</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.dataFillimit}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Kontrata</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={stafData.kontrata}
                readOnly
              />
            </div>
          </>
        )}

        {activeTab === "photo" && (
          <div className="form-row mb-2">
            <label className="form-label custom-label">Foto</label>
            <img
              src={stafData.foto}
              alt="Foto e Stafit"
              className="rounded border"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default TabbedFormStaf;
