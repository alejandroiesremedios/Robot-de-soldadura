import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './routes/Home';
import Menu from './routes/Menu';
import Errors from './routes/Errors';
import ErrorDetail from './routes/ErrorDetail';
import Procedures from './routes/Procedures';
import ProcedureDetail from './routes/ProcedureDetail';
import Parameters from './routes/Parameters';
import Journal from './routes/Journal';
import JournalEntry from './routes/JournalEntry';
import Faq from './routes/Faq';
import Fundamentos from './routes/Fundamentos';
import FundamentoDetail from './routes/FundamentoDetail';
import Joints from './routes/Joints';
import JointDetail from './routes/JointDetail';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/fundamentos" element={<Fundamentos />} />
        <Route path="/fundamentos/:id" element={<FundamentoDetail />} />
        <Route path="/errores" element={<Errors />} />
        <Route path="/errores/:id" element={<ErrorDetail />} />
        <Route path="/procedimientos" element={<Procedures />} />
        <Route path="/procedimientos/:id" element={<ProcedureDetail />} />
        <Route path="/uniones" element={<Joints />} />
        <Route path="/uniones/:id" element={<JointDetail />} />
        <Route path="/parametros" element={<Parameters />} />
        <Route path="/diario" element={<Journal />} />
        <Route path="/diario/nuevo" element={<JournalEntry />} />
        <Route path="/diario/:id" element={<JournalEntry />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
