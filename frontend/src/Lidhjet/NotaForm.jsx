import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotaForm = ({ provimiId }) => {
  const [studentet, setStudentet] = useState([]);
  const [studentiZgjedhur, setStudentiZgjedhur] = useState("");
  const [nota, setNota] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:5138/api/paraqitjaEProvimit/lenda/${provimiId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Studentët:", data);
        setStudentet(data);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së studentëve:", err);
      });
  }, [provimiId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedStudent = studentet.find(
      (s) => s.studentiId.toString() === studentiZgjedhur
    );

    if (!selectedStudent) {
      alert("Ju lutem zgjidhni një student.");
      return;
    }

    const notaDto = {
      notaNr: parseFloat(nota),
      notaShkronje: "A",
      dataVendosjes: new Date().toISOString().split("T")[0],
      studentiId: selectedStudent.studentiId,
      paraqitjaId: selectedStudent.paraqitjaId,
      provimiId: provimiId,
    };

    try {
      const res = await fetch("http://localhost:5138/api/nota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notaDto),
      });

      if (res.ok) {
        alert("Nota u vendos me sukses!");
        navigate("/paraqitjet"); // ✅ redirekto pas suksesit
      } else {
        alert("Dështoi vendosja e notës.");
      }
    } catch (err) {
      console.error("Gabim në POST:", err);
      alert("Ndodhi një gabim gjatë vendosjes së notës.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Zgjidh studentin dhe vendos notën</h4>

      <div className="mb-3">
        <label htmlFor="studenti">Studenti:</label>
        <select
          id="studenti"
          className="form-select"
          value={studentiZgjedhur}
          onChange={(e) => setStudentiZgjedhur(e.target.value)}
        >
          <option value="">-- Zgjidh një student --</option>
          {studentet.map((s) => (
            <option key={s.studentiId} value={s.studentiId}>
              ID: {s.studentiId} - Grupi: {s.grupiId} ({s.statusi})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="nota">Nota:</label>
        <input
          id="nota"
          type="number"
          min="1"
          max="10"
          className="form-control"
          value={nota}
          onChange={(e) => setNota(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-success">
        Vendos Notën
      </button>
    </form>
  );
};

export default NotaForm;
