import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Transkripta/Style.css";

const TabbedForm = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  console.log("userId nga localStorage:", userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/useri/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Error fetching profile data</p>;

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
            className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
            onClick={() => setActiveTab("contact")}
          >
            Kontaktet
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
              <label className="form-label custom-label">Emri</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.emri}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Mbiemri</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.mbiemri}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Datëlindja</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.datelindja}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Vendlindja</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.vendLindja}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Gjinia</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.gjinia}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">
                NrLeternjoftimit
              </label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.nrLeternjoftimit}
                readOnly
              />
            </div>
          </>
        )}

        {activeTab === "contact" && (
          <>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Telefoni</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.telefoni}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Email</label>
              <input
                type="email"
                className="form-control form-control-sm custom-input"
                value={profile.email}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Adresa</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.adresa}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Shteti</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.shteti}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Vendbanimi</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.vendbanimi}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">Adresa</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.adresa}
                readOnly
              />
            </div>
            <div className="form-row mb-2">
              <label className="form-label custom-label">ZipKodi</label>
              <input
                type="text"
                className="form-control form-control-sm custom-input"
                value={profile.zipkodi}
                readOnly
              />
            </div>
          </>
        )}

        {activeTab === "photo" && (
          <div className="form-row mb-2">
            <label className="form-label custom-label">Foto</label>
            <img
              src={profile.foto}
              alt="Foto e studentit"
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

export default TabbedForm;
