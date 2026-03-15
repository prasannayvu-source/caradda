import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AppShell from './layouts/AppShell';
import ProtectedRoute from './components/auth/ProtectedRoute';
import InstallPromptBanner from './components/settings/InstallPromptBanner';

// ── Eagerly loaded (above-the-fold critical) ──────────────────────────
import LoginPage from './pages/auth/LoginPage';
import LandingPage from './pages/landing/LandingPage';
import NotFound from './pages/NotFound';

// ── Lazily loaded pages (code-split per route) ────────────────────────
const DashboardPage     = lazy(() => import('./pages/dashboard/DashboardPage'));
const CustomersPage     = lazy(() => import('./pages/customers/CustomersPage'));
const CustomerDetailPage= lazy(() => import('./pages/customers/CustomerDetailPage'));
const BillListPage      = lazy(() => import('./pages/billing/BillListPage'));
const CreateBillPage    = lazy(() => import('./pages/billing/CreateBillPage'));
const BillDetailPage    = lazy(() => import('./pages/billing/BillDetailPage'));
const InventoryPage     = lazy(() => import('./pages/inventory/InventoryPage'));
const InventoryFormPage = lazy(() => import('./pages/inventory/InventoryFormPage'));
const InventoryDetailPage=lazy(()=> import('./pages/inventory/InventoryDetailPage'));
const VendorsPage       = lazy(() => import('./pages/vendors/VendorsPage'));
const VendorFormPage    = lazy(() => import('./pages/vendors/VendorFormPage'));
const VendorDetailPage  = lazy(() => import('./pages/vendors/VendorDetailPage'));
const PurchasesPage     = lazy(() => import('./pages/vendors/PurchasesPage'));
const RecordPurchasePage= lazy(() => import('./pages/vendors/RecordPurchasePage'));
const ExpensesPage      = lazy(() => import('./pages/expenses/ExpensesPage'));
const AddExpensePage    = lazy(() => import('./pages/expenses/AddExpensePage'));
const ReportsPage       = lazy(() => import('./pages/reports/ReportsPage'));
const SettingsPage      = lazy(() => import('./pages/settings/SettingsPage'));

// ── Fallback while a lazy page chunk loads ────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-navy-900">
      <div className="w-8 h-8 border-2 border-red/30 border-t-red rounded-full animate-spin" />
    </div>
  );
}

const toastBase = {
  background: '#1E293B', color: '#F8FAFC',
  border: '1px solid rgba(51,65,85,0.5)', borderRadius: '12px',
  fontFamily: 'Inter, sans-serif', fontSize: '14px',
};

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* Customers */}
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              {/* Billing */}
              <Route path="/billing" element={<BillListPage />} />
              <Route path="/billing/new" element={<CreateBillPage />} />
              <Route path="/billing/:id" element={<BillDetailPage />} />
              {/* Inventory */}
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/inventory/new" element={<InventoryFormPage />} />
              <Route path="/inventory/:id" element={<InventoryDetailPage />} />
              <Route path="/inventory/:id/edit" element={<InventoryFormPage />} />
              {/* Vendors */}
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/vendors/new" element={<VendorFormPage />} />
              <Route path="/vendors/:id" element={<VendorDetailPage />} />
              <Route path="/vendors/:id/edit" element={<VendorFormPage />} />
              {/* Purchases */}
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/purchases/new" element={<RecordPurchasePage />} />
              {/* Expenses */}
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/new" element={<AddExpensePage />} />
              {/* Reports */}
              <Route path="/reports" element={<ReportsPage />} />
              {/* Settings */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* PWA install prompt — shown globally */}
      <InstallPromptBanner />

      <Toaster
        position="top-right"
        toastOptions={{
          style: toastBase,
          success: {
            iconTheme: { primary: '#22C55E', secondary: '#1E293B' },
            style: { ...toastBase, border: '1px solid rgba(34,197,94,0.4)' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#1E293B' },
            style: { ...toastBase, border: '1px solid rgba(239,68,68,0.4)' },
          },
        }}
      />
    </>
  );
}

export default App;
