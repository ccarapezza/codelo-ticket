import "./App.css";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calificacion from "./pages/calificacion/Calificacion";
import CreateParticipante from "./pages/participante/CreateParticipante";
import ListParticipante from "./pages/participante/ListParticipante";
import AdminLogin from "./pages/AdminLogin";
import { useContext } from "react";
import Context from "./context/Context";
import NotFoundPage from "./pages/NotFoundPage";
import Resultados from "./pages/calificacion/Resultados";
import QrListParticipantes from "./pages/participante/QrListParticipantes";
import QrListMuestra from "./pages/participante/QrListMuestra";
import MesasManager from "./pages/mesa/MesasManager";
import EditParticipante from "./pages/participante/EditParticipante";
import ConsultaCalificacion from "./pages/calificacion/ConsultaCalificacion";
import ListDojo from "./pages/dojo/ListDojo";
import ListCategoria from "./pages/categoria/ListCategoria";
import Summary from "./pages/Summary";
import CreateJurado from "./pages/participante/CreateJurado";
import ListJurado from "./pages/participante/ListJurado";
import SummaryCalificaciones from "./pages/SummaryCalificaciones";

export default function Routes() {
  const context = useContext(Context);

  return (
    <Switch>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {context.isLogged&&
        <>
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/ticket-list" element={<TicketList />} />
          <Route path="/break-ticket" element={<BreakTicket />} />
        </>
      }
      <Route path='*' exact={true} component={NotFoundPage} />
    </Switch>
  );
}
