import { useState } from 'react';
import {
  getAmbassadorDashboardData,
  getOwnerFinancialOverview,
  addReferralRecord,
  toggleReferralStatusRecord,
} from '../lib/ambassadorEngine.js';
import { useToast } from '../lib/toast.jsx';

export default function AdminAmbassadors({ user, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [simName, setSimName] = useState('');
  const [simEmail, setSimEmail] = useState('');
  const [simStatus, setSimStatus] = useState('active_subscriber');
  const toast = useToast();

  const data = getAmbassadorDashboardData(user);
  const ownerOverview = getOwnerFinancialOverview();

  const handleSimulateAdd = (e) => {
    e.preventDefault();
    try {
      addReferralRecord(user, {
        name: simName || `Membro #${data.totalCount + 1}`,
        email: simEmail || `indicado_${Date.now()}@exemplo.com`,
        status: simStatus,
      });
      setSimName('');
      setSimEmail('');
      toast({
        icon: '✅',
        title: 'Indicado adicionado!',
        desc: `Status: ${simStatus === 'active_subscriber' ? 'Assinante Ativo' : 'Cadastro Gratuito'}`,
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleQuickPreset = (count, status = 'active_subscriber') => {
    try {
      for (let i = 0; i < count; i++) {
        const idx = data.totalCount + i + 1;
        const isFree = status === 'free_user';
        addReferralRecord(user, {
          name: isFree ? `Amigo Convidado #${idx}` : `Assinante Ativo #${idx}`,
          email: `teste_${isFree ? 'free' : 'sub'}_${Date.now()}_${i}@exemplo.com`,
          status: status,
        });
      }
      toast({
        icon: '🚀',
        title: `${count} indicados adicionados!`,
        desc: status === 'free_user' ? 'Cadastros gratuitos adicionados.' : 'Assinantes ativos adicionados.',
      });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResetTests = () => {
    if (!user) return;
    const userId = user.id || user.email;
    localStorage.removeItem(`viva_ambassador_v3_referrals_${userId}`);
    toast({
      icon: '🧹',
      title: 'Indicações de teste resetadas!',
      desc: 'Você pode começar um novo teste do zero.',
    });
    if (onRefresh) onRefresh();
  };

  const handleToggle = (id) => {
    toggleReferralStatusRecord(user, id);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="admin-ambassador-panel">
      {/* Cabeçalho do Proprietário */}
      <div className="admin-head">
        <div className="row-between" style={{ alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fde68a', fontSize: 18 }}>
              👑 Painel Executivo do Dono do Aplicativo
            </h3>
            <span className="muted" style={{ fontSize: 12 }}>
              Logado como: <strong>{user?.email}</strong> (Acesso Total)
            </span>
          </div>
          <span className="sc-badge gold-badge">Proprietário Oficial</span>
        </div>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>
          Gestão centralizada de faturamento recorrente, assinantes ativos, usuários gratuitos e controle do Programa de Embaixadores.
        </p>
      </div>

      {/* 4 Cards de Métricas Principais de Faturamento */}
      <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
        <div className="admin-metric-card" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,.12), rgba(245,158,11,.05))', border: '1px solid rgba(251,191,36,.3)' }}>
          <span className="lbl" style={{ color: '#fbbf24' }}>💰 Faturamento do Mês</span>
          <div className="val" style={{ color: '#fbbf24', fontSize: 24, fontWeight: 700 }}>
            {ownerOverview.formattedRevenue}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>{ownerOverview.totalSubscribers} assinantes x R$ 29,90</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">⭐ Assinantes Pagantes</span>
          <div className="val" style={{ color: '#4ade80', fontSize: 24, fontWeight: 700 }}>
            {ownerOverview.totalSubscribers}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>Pagamento ativo R$ 29,90</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">👥 Usuários Gratuitos</span>
          <div className="val" style={{ color: '#94a3b8', fontSize: 24, fontWeight: 700 }}>
            {ownerOverview.totalFreeUsers}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>Cadastros na base</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">👑 Embaixadores (Grátis 10+)</span>
          <div className="val" style={{ color: '#c084fc', fontSize: 24, fontWeight: 700 }}>
            {data.activeCount >= 10 ? 1 : 0}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>Mantendo 10 ativos</small>
        </div>
      </div>

      {/* Abas do Painel */}
      <div className="admin-subtabs" style={{ display: 'flex', gap: 8, margin: '18px 0 12px', borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 8 }}>
        <button
          type="button"
          className={`btn sm ${activeTab === 'overview' ? '' : 'ghost'}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Gestão de Assinantes
        </button>
        <button
          type="button"
          className={`btn sm ${activeTab === 'simulator' ? '' : 'ghost'}`}
          onClick={() => setActiveTab('simulator')}
        >
          🧪 Simulador & Testes Rápidos
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="admin-section-box">
          <h4 style={{ margin: '0 0 10px', color: '#fde68a', fontSize: 14 }}>
            👥 Lista Completa de Usuários e Assinaturas:
          </h4>
          {ownerOverview.subscriberList.length === 0 ? (
            <p className="muted" style={{ fontSize: 13 }}>Nenhum usuário cadastrado na base local.</p>
          ) : (
            <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Usuário / E-mail</th>
                    <th>Plano</th>
                    <th>Status</th>
                    <th>Mensalidade</th>
                    <th>Indicado por</th>
                  </tr>
                </thead>
                <tbody>
                  {ownerOverview.subscriberList.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <strong>{sub.name}</strong>
                        <div className="muted" style={{ fontSize: 11 }}>{sub.email}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: sub.plan.includes('VIP') ? '#fbbf24' : sub.plan.includes('Assinante') ? '#4ade80' : '#94a3b8' }}>
                          {sub.plan}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${sub.status === 'Ativo' ? 'active_subscriber' : 'free_user'}`}>
                          {sub.status === 'Ativo' ? '🟢 Ativo' : '⚪ Gratuito'}
                        </span>
                      </td>
                      <td>
                        {sub.amountMonthly > 0 ? (
                          <strong style={{ color: '#4ade80' }}>R$ 29,90/mês</strong>
                        ) : (
                          <span className="muted">R$ 0,00</span>
                        )}
                      </td>
                      <td className="muted" style={{ fontSize: 11 }}>
                        {sub.referrerCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="admin-section-box">
          <h4 style={{ margin: '0 0 10px', color: '#fff', fontSize: 14 }}>
            🧪 Simulação de Indicados e Teste da Meta de 10 Ativos
          </h4>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button type="button" className="btn ghost sm" onClick={() => handleQuickPreset(4, 'free_user')}>
              +4 Cadastros (🎁 4 Aulas)
            </button>
            <button type="button" className="btn ghost sm" onClick={() => handleQuickPreset(5, 'free_user')}>
              +5 Cadastros (📚 1 Módulo)
            </button>
            <button type="button" className="btn ghost sm" onClick={() => handleQuickPreset(6, 'active_subscriber')}>
              +6 Assinantes (🥉 1 Mês Grátis)
            </button>
            <button type="button" className="btn ghost sm" onClick={() => handleQuickPreset(7, 'active_subscriber')}>
              +7 Assinantes (🥈 2 Meses Grátis)
            </button>
            <button type="button" className="btn ghost sm" onClick={() => handleQuickPreset(10, 'active_subscriber')}>
              +10 Assinantes (👑 App 100% Grátis)
            </button>
            <button type="button" className="btn ghost sm" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }} onClick={handleResetTests}>
              🧹 Resetar Testes
            </button>
          </div>

          <form onSubmit={handleSimulateAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <input
              type="text"
              placeholder="Nome do indicado"
              value={simName}
              onChange={(e) => setSimName(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel-2)', color: '#fff', fontSize: 13, flex: 1 }}
            />
            <input
              type="email"
              placeholder="E-mail do indicado"
              value={simEmail}
              onChange={(e) => setSimEmail(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel-2)', color: '#fff', fontSize: 13, flex: 1 }}
            />
            <select
              value={simStatus}
              onChange={(e) => setSimStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--panel-2)', color: '#fff', fontSize: 13 }}
            >
              <option value="active_subscriber">Assinante Ativo (R$ 29,90)</option>
              <option value="free_user">Cadastro Gratuito</option>
            </select>
            <button type="submit" className="btn sm">
              + Adicionar
            </button>
          </form>

          <h5 style={{ margin: '14px 0 8px', color: '#fde68a', fontSize: 13 }}>
            📋 Indicados e Ações Rápidas (Simular Cancelamento / Reativação):
          </h5>
          {data.referrals.length === 0 ? (
            <p className="muted" style={{ fontSize: 13 }}>Nenhum indicado cadastrado ainda. Use os botões acima para simular.</p>
          ) : (
            <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
              <table className="admin-table" style={{ width: '100%', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nome / E-mail</th>
                    <th>Status</th>
                    <th>Impacto na Meta</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{r.referred_user_name}</strong>
                        <div className="muted" style={{ fontSize: 11 }}>{r.referred_user_email}</div>
                      </td>
                      <td>
                        <span className={`status-pill ${r.status}`}>
                          {r.status === 'active_subscriber' ? '🟢 Ativo' : '⚪ Gratuito/Cancelado'}
                        </span>
                      </td>
                      <td>
                        {r.status === 'active_subscriber' ? (
                          <strong style={{ color: '#4ade80' }}>+1 para Gratuidade ({data.activeCount}/10)</strong>
                        ) : (
                          <span className="muted">Não soma na meta</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn ghost sm"
                          style={{ padding: '3px 8px', fontSize: 11 }}
                          onClick={() => handleToggle(r.id)}
                        >
                          {r.status === 'active_subscriber' ? 'Simular Cancelamento' : 'Reativar Assinatura'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
