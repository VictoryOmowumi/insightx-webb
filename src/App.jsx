import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MainLayout from './components/layout/MainLayout';
import SuccessPage from './pages/publicForm/Success';
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Login = lazy(() => import('./pages/login/Login'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const Activities = lazy(() => import('./pages/activities/Activities'));
const Activity = lazy(() => import('./pages/activities/Activity'));
const AddActivity = lazy(() => import('./pages/activities/AddActivity'));
const EditActivity = lazy(() => import('./pages/activities/EditActivity'));
const StockRequests = lazy(() => import('./pages/stock-requests/StockRequests'));
const StockRequest = lazy(() => import('./pages/stock-requests/StockRequest'));
const RequestDetails = lazy(() => import('./pages/stock-requests/RequestDetails'));
const FormsDashboard = lazy(() => import('./pages/forms/FormsDashboard'));
const FormBuilder = lazy(() => import('./pages/forms/FormBuilder'));
const FormDetails = lazy(() => import('./pages/forms/FormDetails'));
const FormResponse = lazy(() => import('./pages/forms/FormResponse'));
const Agents = lazy(() => import('./pages/agents/Agents'));
const Agent = lazy(() => import('./pages/agents/Agent'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Error = lazy(() => import('./pages/Error'));
const PublicForm = lazy(() => import('./pages/publicForm/PublicForm'));
import Loading from './components/common/Loading';
const App = () => {

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/error" element={<Error />} />
          <Route element={<ProtectedRoute roles={['Admin', 'Member', 'Manager']} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<Activity />} />
              <Route path="/activities/add" element={<AddActivity />} />
              <Route path="/activities/edit/:id" element={<EditActivity />} />
              <Route path="/stock-requests" element={<StockRequests />} />
              <Route path="/stock-requests/:id" element={<StockRequest />} />
              <Route path="/forms" element={<FormsDashboard />} />
              <Route path="/forms/form-details/:id" element={<DndProvider backend={HTML5Backend}><FormDetails /></DndProvider>} />
              <Route path="/forms/form-builder/:id" element={<DndProvider backend={HTML5Backend}><FormBuilder /></DndProvider>} />
              <Route path="/forms/response/:id" element={<FormResponse />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:id" element={<Agent />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/stock-requests/details/:id" element={<RequestDetails />} />
          </Route>
          <Route path="/forms/response/:slug/:id" element={<PublicForm />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App