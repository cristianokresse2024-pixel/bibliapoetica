import { useState, useEffect } from 'react';
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
  const [cloudUsers, setCloudUsers] = useState([]);
  const [cloudTotals, setCloudTotals] = useState(null);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const toast = useToast();

  const data = getAmbassadorDashboardData(user);
  const localOverview = getOwnerFinancialOverview();

  const fetchCloudUsers = async () => {
    try {
      setLoadingCloud(true);
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(user?.email || '')}`);
      if (res.ok) {
        const json = await res.json();
        if (json.ok) {
          setCloudUsers(json.users || []);
          setCloudTotals(json.totals || null);
        }
      }
    } catch {
      // Usa dados locais se offline
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    fetchCloudUsers();
  }, [user]);

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
      fetchCloudUsers();
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
      fetchCloudUsers();
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
    fetchCloudUsers();
  };

  const handleToggle = (id) => {
    toggleReferralStatusRecord(user, id);
    if (onRefresh) onRefresh();
    fetchCloudUsers();
  };

  // Consolidação de métricas: prioriza nuvem, fallback para local
  const totals = cloudTotals || {
    totalUsers: localOverview.totalSubscribers + localOverview.totalFreeUsers,
    totalSubscribers: localOverview.totalSubscribers,
    totalFreeUsers: localOverview.totalFreeUsers,
    totalAmbassadors: data.activeCount >= 10 ? 1 : 0,
    formattedRevenue: localOverview.formattedRevenue,
  };

  const displayUsers = cloudUsers.length > 0 ? cloudUsers : localOverview.subscriberList;

  return (
    <div className="admin-ambassador-panel">
      {/* Cabeçalho do Proprietário */}
      <div className="admin-head">
        <div className="row-between" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: 0, color: '#fde68a', fontSize: 18 }}>
              👑 Painel Executivo do Dono do Aplicativo
            </h3>
            <span className="muted" style={{ fontSize: 12 }}>
              Logado como: <strong>{user?.email}</strong> (Acesso Total)
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="btn ghost sm"
              onClick={fetchCloudUsers}
              disabled={loadingCloud}
              style={{ fontSize: 12 }}
            >
              {loadingCloud ? '🔄 Sincronizando...' : '🔄 Atualizar Nuvem'}
            </button>
            <span className="sc-badge gold-badge">Banco Supabase Conectado</span>
          </div>
        </div>
        <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>
          Gestão centralizada em tempo real: todos os cadastros, leituras de capítulos, progresso espiritual e assinantes ativos.
        </p>
      </div>

      {/* 4 Cards de Métricas Principais de Faturamento & Usuários */}
      <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 14 }}>
        <div className="admin-metric-card" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,.12), rgba(245,158,11,.05))', border: '1px solid rgba(251,191,36,.3)' }}>
          <span className="lbl" style={{ color: '#fbbf24' }}>💰 Faturamento Mensal</span>
          <div className="val" style={{ color: '#fbbf24', fontSize: 24, fontWeight: 700 }}>
            {totals.formattedRevenue}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>{totals.totalSubscribers} assinantes x R$ 29,90</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">⭐ Assinantes Pagantes</span>
          <div className="val" style={{ color: '#4ade80', fontSize: 24, fontWeight: 700 }}>
            {totals.totalSubscribers}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>Assinatura R$ 29,90 ativa</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">👥 Total de Usuários Cadastrados</span>
          <div className="val" style={{ color: '#60a5fa', fontSize: 24, fontWeight: 700 }}>
            {totals.totalUsers}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>Registrados no banco de dados</small>
        </div>

        <div className="admin-metric-card">
          <span className="lbl">👑 Embaixadores Oficiais</span>
          <div className="val" style={{ color: '#c084fc', fontSize: 24, fontWeight: 700 }}>
            {totals.totalAmbassadors}
          </div>
          <small className="muted" style={{ fontSize: 11 }}>10+ indicados ativos (100% grátis)</small>
        </div>
      </div>

      {/* Abas do Painel */}
      <div className="admin-subtabs" style={{ display: 'flex', gap: 8, margin: '18px 0 12px', borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 8 }}>
        <button
          type="button"
          className={`btn sm ${activeTab === 'overview' ? '' : 'ghost'}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Diretório de Usuários ({displayUsers.length})
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
          <div className="row-between" style={{ alignItems: 'center', marginBottom: 12 }}>
            <h4 style={{ margin: 0, color: '#fde68a', fontSize: 14 }}>
              👥 Todos os Usuários Registrados & Progresso Espiritual:
            </h4>
            <span className="muted" style={{ fontSize: 12 }}>
              {displayUsers.length} usuário(s) encontrados
            </span>
          </div>

          {displayUsers.length === 0 ? (
            <p className="muted" style={{ fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Nenhum usuário cadastrado no momento. Quando alguém criar conta, aparecerá aqui instantaneamente!
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5, textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,.1)', color: 'var(--muted)' }}>
                    <th style={{ padding: '8px 6px' }}>Usuário / E-mail</th>
                    <th style={{ padding: '8px 6px' }}>Plano / Status</th>
                    <th style={{ padding: '8px 6px' }}>Capítulos Lidos</th>
                    <th style={{ padding: '8px 6px' }}>XP / Nível</th>
                    <th style={{ padding: '8px 6px' }}>Origem / Indicador</th>
                    <th style={{ padding: '8px 6px' }}>Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((u, i) => (
                    <tr key={u.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                      <td style={{ padding: '8px 6px' }}>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{u.name}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <span
                          className={`sc-badge ${
                            u.plan?.includes('VIP') || u.plan?.includes('👑')
                              ? 'gold-badge'
                              : u.plan?.includes('Assinante') || u.plan === 'subscriber'
                              ? 'gold-badge'
                              : ''
                          }`}
                          style={{ fontSize: 11, padding: '2px 8px' }}
                        >
                          {u.plan}
                        </span>
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <strong style={{ color: '#fde68a' }}>{u.readCount ?? 0}</strong> caps
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <span style={{ color: '#c084fc' }}>Nív. {u.level ?? 1}</span> ({u.xp ?? 0} XP)
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <span className="muted">{u.referredBy || 'Direto'}</span>
                      </td>
                      <td style={{ padding: '8px 6px' }} className="muted">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
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
