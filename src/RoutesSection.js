import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useContext } from "react";
import Context from "./context/Context";
import NotFoundPage from "./pages/NotFoundPage";
import CreateTicket from "./pages/CreateTicket";
import TicketList from "./pages/TickerList";
import BreakTicket from "./pages/BreakTicket";
import TicketCutControl from "./pages/TicketCutControl";
import TicketViewer from "./pages/TicketViewer";

export default function RoutesSection() {
  const context = useContext(Context);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/ticket-viewer/:hash" element={<TicketViewer />} />
      {context.isLogged&&
        <>
          <Route path="/cut-ticket-control" element={<TicketCutControl />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/reserve-ticket" element={<CreateTicket reserve={true} />} />
          <Route path="/edit-ticket/:id" element={<CreateTicket edit={true} />} />
          <Route path="/ticket-list" element={<TicketList />} />
          <Route path="/break-ticket" element={<BreakTicket />} />
        </>
      }
      <Route path='*' exact={true} component={NotFoundPage} />
    </Routes>
  );
}
