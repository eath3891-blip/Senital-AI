import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { Overview } from '../pages/Overview';
import { Agents } from '../pages/Agents';
import { AgentDetail } from '../pages/AgentDetail';
import { Activity } from '../pages/Activity';
import { EventDetail } from '../pages/EventDetail';
import { Approvals } from '../pages/Approvals';
import { ApprovalDetail } from '../pages/ApprovalDetail';
import { Policies } from '../pages/Policies';
import { PolicyDetail } from '../pages/PolicyDetail';
import { PolicyBuilder } from '../pages/PolicyBuilder';
import { DataSystems } from '../pages/DataSystems';
import { SystemDetail } from '../pages/SystemDetail';
import { Audit } from '../pages/Audit';
import { Ecosystem } from '../pages/Ecosystem';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/activity/:id" element={<EventDetail />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/approvals/:id" element={<ApprovalDetail />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/policies/new" element={<PolicyBuilder />} />
          <Route path="/policies/:id" element={<PolicyDetail />} />
          <Route path="/systems" element={<DataSystems />} />
          <Route path="/systems/:id" element={<SystemDetail />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
        </Routes>
        </ErrorBoundary>
      </Layout>
    </BrowserRouter>
  );
}
