import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import ubt_logo from "../Assets/ubt-logo-1.png";
import axiosClient from "./AxiosClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email && !password)
      return setErrorMessage("Ju lutem shkruani emailin dhe fjalëkalimin.");
    if (!email) return setErrorMessage("Ju lutem shkruani emailin.");
    if (!password) return setErrorMessage("Ju lutem shkruani fjalëkalimin.");

    try {
      // 1) LOGIN
      const loginRes = await axiosClient.post("/account/login", {
        email,
        password,
      });
      // login kthen: userName, email, role (camelCase), token, refreshToken
      const loginData = loginRes.data;

      // Ruaje token-at
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("refreshToken", loginData.refreshToken);

      // 2) /account/me – merre profilin + rolet (këtu dalin me PascalCase)
      const meRes = await axiosClient.get("/account/me");
      const me = meRes.data;

      // Normalizo casing (Role/role, Id/id, …)
      const role =
        me.Role ??
        loginData.role ?? // fallback te login
        me.role ??
        "Unknown";

      const userId = me.Id ?? me.id;
      const studentId = me.StudentId ?? me.studentId ?? null;
      const universitetiId = me.UniversitetiId ?? me.universitetiId ?? null;
      const stafId = me.StafId ?? me.stafId ?? null;
      const adminId = me.AdminId ?? me.adminId ?? null;
      const departamentiId = me.DepartamentiId ?? me.departamentiId ?? null;

      // 3) Ruaj një objekt të vetëm në localStorage
      const userObj = {
        userId,
        role,
        token: loginData.token,
        refreshToken: loginData.refreshToken,
        studentId,
        stafId,
        adminId,
        universitetiId,
        departamentiId,
        email: loginData.email ?? me.Email ?? null,
        userName: loginData.userName ?? null,
      };
      localStorage.setItem("user", JSON.stringify(userObj));

      // (opsionale) për compat me kodin ekzistues – po dëshiron:
      localStorage.setItem("roli", role);
      if (studentId) localStorage.setItem("studentId", studentId);
      if (stafId) localStorage.setItem("stafId", stafId);
      if (adminId) localStorage.setItem("adminId", adminId);
      if (universitetiId)
        localStorage.setItem("universitetiId", universitetiId);
      if (departamentiId)
        localStorage.setItem("departamentiId", departamentiId);
      if (userId) localStorage.setItem("userId", userId);

      // 4) Redirect sipas rolit
      if (role === "Student") {
        navigate("/student/profili");
      } else if (role === "Admin") {
        navigate("/studentet");
      } else if (role === "StafAkademik") {
        navigate("/profiliStafi");
      } else if (role === "SuperAdmin") {
        navigate("/admin");
      } else {
        setErrorMessage("Roli i panjohur");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMessage("Email ose fjalëkalim i gabuar!");
      } else {
        setErrorMessage("Ndodhi një gabim gjatë lidhjes me serverin.");
      }
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="teksti-login">
            <h3>SMIS-Login</h3>
          </div>
          <div className="container mt-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Fjalëkalimi"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                  paddingRight: "0.75rem",
                }}
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </span>
            </div>

            <button
              onClick={handleLogin}
              className="btn btn-primary custom-btn"
              type="button"
            >
              Kyçu
            </button>
            {errorMessage && (
              <div className="text-danger mt-2" role="alert">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <h4>
          © 2012 - 2025 KOLEGJI UBT - Lagjja KALABRIA Nr.56., Prishtinë, Kosovë
        </h4>
        <h4>Tel:+383 38 541 400 | Fax:+383 38 542 138 | info@ubt-uni.net</h4>
        <a href="www.smis.education">www.smis.education</a>
      </div>
    </>
  );
};

export default Login;
