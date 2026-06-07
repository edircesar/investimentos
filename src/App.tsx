import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CompoundInterest } from './pages/CompoundInterest';
import { CDISimulator } from './pages/CDISimulator';
import { CDBSimulator } from './pages/CDBSimulator';
import { GoalSimulator } from './pages/GoalSimulator';
import { CompareSimulator } from './pages/CompareSimulator';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('COMPOUND');

  const renderContent = () => {
    switch (activeTab) {
      case 'COMPOUND':
        return <CompoundInterest />;
      case 'CDI':
        return <CDISimulator />;
      case 'CDB':
        return <CDBSimulator />;
      case 'GOAL':
        return <GoalSimulator />;
      case 'COMPARE':
        return <CompareSimulator />;
      case 'HISTORY':
        return <HistoryPage />;
      default:
        return <CompoundInterest />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">InvestirAgora</h1>
        <p className="mt-2 text-lg text-gray-600">Sua plataforma inteligente para projeções financeiras e enriquecimento.</p>
      </div>
      {renderContent()}
    </Layout>
  );
}
