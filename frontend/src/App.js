import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminList from './Components/Admin/AdminList';
import RoleRoute from './RoleRoute';
import Unauthorized from './Unauthorized';



import PrivateRoute from './Components/Login/PrivateRoute';
import logo from './logo.svg';
import './App.css';
import Login from './Components/Login/Login';
import Transkripta from './Components/Studenti/Transkripta/Transkripta';
import ProvimetEParaqitura from './Components/Studenti/ProvimetEParaqitura/ProvimetEParaqitura';
import ParaqitjaEProvimeve from './Components/Studenti/ParaqitjaEProvimeve/ParaqitjaEProvimeve';
import Profili from './Components/Studenti/Profili/Profili';
import PerzgjedhjaEGrupit from './Components/Studenti/PerzgjedhjaEGrupit/PerzgjedhjaEGrupit';
import RegjistrimiSemestrit from './Components/Studenti/RegjistrimiSemestrit/RegjistrimiSemestrit';


import ListaEGrupeve, { Grupi1, Grupi2, Grupi3, Grupi4 } from './Components/ListaEGrupeve/Grupe';



import OrariProfesori from './Lidhjet/OrariProfesori';
import RezervimiList from './Lidhjet/RezervimiList';
import DashboardRezervimet from './Lidhjet/DashboardRezervimet';
import NotaForm from './Lidhjet/NotaForm';
import VendosNota from './Lidhjet/VendosNota';
import ProvimetEParaqituraStaf from './Components/ProfiliStafiAkademik/ProvimetEParaqituraStaf';
import ProfiliStafiAkademik from './Components/ProfiliStafiAkademik/ProfiliStafiAkademik'



import DeleteStaff from './Components/Admin/Stafi/DeleteStaff';
import EditStaff from './Components/Admin/Stafi/EditStaff';
import DLenda from './Components/Admin/DLenda';
//import Login from './Components/Login/Login';
//import Transkripta from './Components/Transkripta/Transkripta';
import Orari from './Components/Orari/Orari';
import DStudentet from './Components/Admin/DStudentet';
import DGrupi from './Components/Admin/DGrupi';
//import Profili from './Components/Profili/Profili';
import AddStaff  from './Components/Admin/Stafi/AddStaff';
import DStafi from './Components/Admin/DStafi';
import AddLenda  from './Components/Admin/Lenda/AddLenda';
import EditLenda from './Components/Admin/Lenda/EditLenda';
import DeleteLenda from './Components/Admin/Lenda/DeleteLenda';
import AddGroup from './Components/Admin/Grupi/AddGrup';
import EditGroup from './Components/Admin/Grupi/EditGrup';
import DeleteGroup from './Components/Admin/Grupi/DeleteGrup';
import AddStudent from './Components/Admin/Studenti/AddStudent';
import EditStudent from './Components/Admin/Studenti/EditStudent';
import DeleteStudent from './Components/Admin/Studenti/DeleteStudent';
import ProfiliAdmin from './Components/Admin/ProfiliAdmin';

import DDepartamenti from './Components/SuperAdmin/DDepartamenti';
import AddDepartament from './Components/SuperAdmin/Departamenti/AddDepartament';
import EditDepartament from './Components/SuperAdmin/Departamenti/EditDepartament';
import DeleteDepartment from './Components/SuperAdmin/Departamenti/DeleteDepartament';
import DUniversiteti from './Components/SuperAdmin/DUniversiteti';
import AddUniversiteti from './Components/SuperAdmin/Universiteti/AddUniversiteti';
import EditUniversiteti from './Components/SuperAdmin/Universiteti/EditUniversiteti';
import DeleteUniversiteti from './Components/SuperAdmin/Universiteti/DeleteUniversiteti';
import DSemestri from './Components/SuperAdmin/DSemestri';
import AddSemestri from './Components/SuperAdmin/Semestri/AddSemestri';
import EditSemestri from './Components/SuperAdmin/Semestri/EditSemestri';
import DeleteSemestri from './Components/SuperAdmin/Semestri/DeleteSemestri';
import DLigjerata from './Components/Admin/Dligjerata';
import AddLigjerata from './Components/Admin/Ligjerata/AddLigjerata';
import EditLigjerata from './Components/Admin/Ligjerata/EditLigjerata';
import DeleteLigjerata from './Components/Admin/Ligjerata/DeleteLigjerata';
import DAdmin from './Components/SuperAdmin/DAdmin';
import AddAdmin from './Components/SuperAdmin/Admin/AddAdmin';
import EditAdmin from './Components/SuperAdmin/Admin/EditAdmin';
import DeleteAdmin from './Components/SuperAdmin/Admin/DeleteAdmin';
import ProfiliSuperAdmin from './Components/SuperAdmin/ProfiliSuperAdmin';
import DStudentetGrupi from './Components/Admin/DStudentetGrupi';
import PaneliAfatiSemestrit from './Components/Admin/Studenti/PaneliAfatiSemestrit';
import PaneliAfatiProvimeve from './Components/Admin/Studenti/PaneliAfatiProvimeve';
import Ligjerata from './Components/Studenti/Fabrika';
import Puntori from './Components/Studenti/Puntori';
import Fabrika from './Components/Studenti/Fabrika';
import Get from './Components/Studenti/Get';

function App() {
  return (
   <Router>
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* Rrugë për Student */}
    <Route element={<PrivateRoute />}>
      <Route element={<RoleRoute allowedRoles={["Student"]} />}>
        <Route path="/student/profili" element={<Profili />} />
          <Route path="/student/transkripta" element={<Transkripta />} />
          <Route path="/student/provimet-e-paraqitura" element={<ProvimetEParaqitura />} />
          <Route path="/student/paraqitja-e-provimeve" element={<ParaqitjaEProvimeve />} />
          <Route path="/student/perzgjedh-grupin" element={<PerzgjedhjaEGrupit />} />
          <Route path="/student/regjistrimi-semestrit" element={<RegjistrimiSemestrit />} />
           <Route path="/student/Ligjerata" element={<Ligjerata />} />
           <Route path="/student/Puntori" element={<Puntori/>} />
           <Route path="/student/Fabrika" element={<Fabrika />} />
           <Route path="/student/Get" element={<Get />} />

      </Route>
    </Route>


     {/* Rrugë për Staf */}
    <Route element={<PrivateRoute />}>
      <Route element={<RoleRoute allowedRoles={["StafAkademik"]} />}>
       
<Route path="/profiliStafi" element={<ProfiliStafiAkademik/>}/>
        <Route path="/orari" element={<OrariProfesori/>}/>
        <Route path="/rezervoSallen" element={<RezervimiList/>}/>
        <Route path="/dashboardRezervimet" element={<DashboardRezervimet />} />
        <Route path="/vendosNota" element={<ProvimetEParaqituraStaf/>}/>
        <Route path="/vendos-nota/:paraqitjaId" element={<VendosNota />} />
        <Route path="/provimet-e-paraqitura" element={<ProvimetEParaqituraStaf />} />

      </Route>
    </Route>



    {/* Rrugë për Admin */}
    <Route element={<PrivateRoute />}>
      <Route element={<RoleRoute allowedRoles={["Admin"]} />}>
        <Route path="/lenda" element={<DLenda />} />
<Route path="/studentet" element={<DStudentet />} />
        <Route path="/" element={<DStudentet />} />
        <Route path="/grupi" element={<DGrupi />} />
        {/* <Route path="/profili" element={<Profili />} /> */}
        <Route path="/studentetgrupi" element={<DStudentetGrupi />} />
        <Route path="/edit-staff/:id" element={<EditStaff />} />
        <Route path="/delete-staff/:id" element={<DeleteStaff />} />
        <Route path="/stafiakademik" element={<DStafi />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/add-lenda" element={<AddLenda />} />
        <Route path="/edit-lenda/:id" element={<EditLenda />} />
        <Route path="/delete-lenda/:id" element={<DeleteLenda />} />
       
        <Route path="/add-grup" element={<AddGroup />} />
        <Route path="/edit-grup/:id" element={<EditGroup />} />
        <Route path="/delete-grup/:id" element={<DeleteGroup />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/edit-student/:id" element={<EditStudent />} />
        <Route path="/delete-student/:id" element={<DeleteStudent />} />
        <Route path="/profiliadmin" element={<ProfiliAdmin/>} />
        <Route path="/adminlist" element={<AdminList />} />
        <Route path="/adminlist" element={<AdminList />} />
<Route path="/ligjerata" element={<DLigjerata/>}/>

        <Route path="add-ligjerata" element={<AddLigjerata/>}/>
        <Route path="/edit-ligjerata/:stafiId/:lendaId" element={<EditLigjerata />} />
        <Route path="delete-ligjerata/:stafiId/:lendaId" element={<DeleteLigjerata/>}/>
        <Route path="/paneliAfatiSemestrit" element={<PaneliAfatiSemestrit/>}/>
         <Route path="/paneliAfatiProvimeve" element={<PaneliAfatiProvimeve/>}/>
        

      </Route>
    </Route>

    {/* Rrugë për SuperAdmin */}
    <Route element={<PrivateRoute />}>
      <Route element={<RoleRoute allowedRoles={["SuperAdmin"]} />}>
       <Route path="/departamenti" element={<DDepartamenti/>}/>
        <Route path="add-departament" element={<AddDepartament/>}/>
        <Route path="edit-departament/:id" element={<EditDepartament/>}/>
        <Route path="delete-departament/:id" element={<DeleteDepartment/>}/>
        <Route path="/universiteti" element={<DUniversiteti/>}/>
        <Route path="add-universiteti" element={<AddUniversiteti/>}/>
        <Route path="edit-universiteti/:id" element={<EditUniversiteti/>}/>
        <Route path="delete-universiteti/:id" element={<DeleteUniversiteti/>}/>
        <Route path="/semestri" element={<DSemestri/>}/>
        <Route path="add-semestri" element={<AddSemestri/>}/>
        <Route path="edit-semestri/:id" element={<EditSemestri/>}/>
        <Route path="delete-semestri/:id" element={<DeleteSemestri/>}/>

        <Route path="/admin" element={<DAdmin/>}/>
        <Route path="/afsdf" element={<DAdmin/>}/>
        <Route path="/profilisuperadmin" element={<ProfiliSuperAdmin/>}/>
        <Route path="add-admin" element={<AddAdmin/>}/>
        <Route path="edit-admin/:id" element={<EditAdmin/>}/>
        <Route path="delete-admin/:id" element={<DeleteAdmin/>}/>


      </Route>
    </Route>
  </Routes>
</Router>

  );
}

export default App;