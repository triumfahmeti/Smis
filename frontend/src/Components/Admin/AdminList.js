import React, { useState, useEffect } from "react";

function AdminList() {
  const [admins, setAdmins] = useState([]);

 useEffect(() => {
  fetch('http://localhost:5138/api/admin')
    .then(res => res.json())
    .then(data => {
      console.log("Të dhënat që erdhën:", data);
      setAdmins(data);
    })
    .catch(console.error);
}, []);


  return (
    <div>
      <h2>Lista e Adminëve</h2>
      {admins.length === 0 ? (
        <p>Nuk ka adminë për të shfaqur.</p>
      ) : (
        <table border="1" cellPadding="5" style={{borderCollapse: "collapse"}}>
          <thead>
            <tr>
              <th>AdminID</th>
              <th>DepartamentiID</th>
              <th>UserID</th>
              <th>UniID</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.adminId}>
                <td>{admin.adminId}</td>
                <td>{admin.departamentiId}</td>
                <td>{admin.userId}</td>
                <td>{admin.uniId}</td>
              </tr>
              
            ))}
          </tbody>
          <p>Numri i adminëve: {admins.length}</p>

        </table>
        
      )}
    </div>
  );
}

export default AdminList;
