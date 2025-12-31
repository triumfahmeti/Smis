// src/services/authService.js
import axios from "axios";

export const logout = async (navigate) => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    await axios.post("http://localhost:5138/api/account/logout", refreshToken, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Gabim gjatë logout:", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("studentId");
  localStorage.removeItem("adminId");
  localStorage.removeItem("stafId");
  localStorage.removeItem("universitetiId");
  localStorage.removeItem("departamentiId");

  navigate("/login");
};
