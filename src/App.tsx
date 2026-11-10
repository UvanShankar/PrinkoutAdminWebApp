import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardScreen } from './screens/DashboardScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { MerchantsScreen } from './screens/MerchantsScreen';
import { CustomersScreen } from './screens/CustomersScreen';
import { PricingCommissionScreen } from './screens/PricingCommissionScreen';
import { ReportsScreen } from './screens/ReportsScreen';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<string>('reports');
  const [reportSubtab, setReportSubtab] = useState<string>('overview');
  const [pricingSubtab, setPricingSubtab] = useState<string>('rules');

  const handleNavigate = (screenId: string, subtab?: string) => {
    setActiveScreen(screenId);
    if (screenId === 'reports' && subtab) {
      setReportSubtab(subtab);
    } else if (screenId === 'pricing' && subtab) {
      setPricingSubtab(subtab);
    }
  };

  const getHeaderMeta = () => {
    switch (activeScreen) {
      case 'dashboard':
        return {
          title: 'Dashboard Overview',
          subtitle: 'Real-time platform activity and high-level health indicators.',
        };
      case 'orders':
        return {
          title: 'Live Orders Feed',
          subtitle: 'Monitor incoming print jobs, customer uploads, and shop fulfillment status.',
        };
      case 'merchants':
        return {
          title: 'Merchants',
          subtitle: 'Manage print shops, verify accounts, track performance and control access.',
        };
      case 'customers':
        return {
          title: 'Customers',
          subtitle: 'Manage users, view orders, track activity and control access.',
        };
      case 'pricing':
        return {
          title: 'Pricing & Commissions',
          subtitle: 'Set and manage commission structure, thresholds, convenience fees, and pricing.',
          breadcrumb: 'Platform Management',
        };
      case 'reports':
      default:
        return {
          title: 'Reports & Analytics',
          subtitle: 'Track business performance, revenue, orders and growth across Prinkout.',
        };
    }
  };

  const meta = getHeaderMeta();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      {/* Left Sidebar */}
      <Sidebar
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        reportSubtab={reportSubtab}
      />

      {/* Main Content Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          breadcrumb={meta.breadcrumb}
        />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeScreen === 'dashboard' && <DashboardScreen onNavigate={handleNavigate} />}
          {activeScreen === 'orders' && <OrdersScreen />}
          {activeScreen === 'merchants' && <MerchantsScreen />}
          {activeScreen === 'customers' && <CustomersScreen />}
          {activeScreen === 'pricing' && <PricingCommissionScreen initialSubtab={pricingSubtab} />}
          {activeScreen === 'reports' && (
            <ReportsScreen
              initialSubtab={reportSubtab}
              onSubtabChange={(sub) => setReportSubtab(sub)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
