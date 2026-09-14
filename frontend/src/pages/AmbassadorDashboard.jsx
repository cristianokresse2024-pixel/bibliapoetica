import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  getAmbassadorDashboardData,
  getShareableReferralLink,
  AMBASSADOR_CONFIG,
  MILESTONES,
} from '../lib/ambassadorEngine.js';
import MilestoneCelebrationModal from '../components/MilestoneCelebrationModal.jsx';
import AdminAmbassadors from '../components/AdminAmbassadors.jsx';
import { useToast } from '../lib/toast.jsx';

export default function AmbassadorDashboard() {
  const { user, isVip, openAuthModal } = useAuth();
  const isOwner = user?.email === 'cristianokresse2024@gmail.com';
  const [activeTab, setActiveTab] = useState(isOwner ? 'admin' : 'indicacoes'); // 'indicacoes' | 'regras' | 'admin'
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [celebrationMilestone, setCelebrationMilestone] = useState(null);
  const toast = useToast();

  const data = getAmbassadorDashboardData(user);
  const referralLink = getShareableReferralLink(user);

  // Calcula o progresso de 0 a 10 ativos
  const progressMax = AMBASSADOR_CONFIG.AMBASSADOR_THRESHOLD;
  const progressPercent = Math.min(100, Math.round((data.activeCount / progressMax) * 100));

  const handleCopyLink = () => {
    if (!user) {
      openAuthModal('register', 'Crie sua conta para gerar seu link exclusivo.');
      return;
    }
    navigator.clipboard?.writeText(referralLink);
    toast({
      icon: '📋',
      title: 'Link copiado!',
      desc: 'Compartilhe com seus amigos e irmãos na fé.',
    });
  };

  const handleShareWhatsApp = () => {
    if (!user) {
      openAuthModal('register', 'Crie sua conta para compartilhar seu link.');
      return;
    }
    const text = encodeURIComponent(
      `Olá! Estou usando o Viva Inteligente para meditar e estudar a Bíblia com inteligência artificial, exegese e mentoria espiritual. Conheça e faça sua assinatura pelo meu link exclusivo: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  if (!user) {
    return (
      <div className="fade-in ambassador-guest-wrap">
        <section className="section member-hero">
          <div className="member-hero-glow" />
          <div className="member-hero-content">
            <span className="sc-badge gold-badge">👑 Programa de Embaixadores & Recompensas</span>
            <h1 className="member-hero-title">Indique Amigos e Desbloqueie Recompensas</h1>
            <p className="member-hero-desc">
              Desbloqueie aulas exclusivas, módulos inteiros, meses de assinatura gratuita e torne-se um Embaixador Oficial com o app 100% gratuito ao manter 10 indicados ativos!
            </p>
            <div style={{ marginTop: 18, display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn" onClick={() => openAuthModal('register')}>
                Criar Conta para Participar
              </button>
              <button className="btn ghost" onClick={() => openAuthModal('login')}>
                Já tenho conta
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="fade-in ambassador-dashboard-wrap">
      {/* Modal Comemorativo */}
      <MilestoneCelebrationModal
        milestone={celebrationMilestone}
        onClose={() => setCelebrationMilestone(null)}
      />

      {/* Hero Principal do Programa */}
      <section className="section ambassador-hero-card">
        <div className="ambassador-hero-head">
          <div>
            <span className="sc-badge gold-badge">
              {isOwner ? '👑 Painel Executivo do Proprietário' : '👑 Programa Oficial de Embaixadores'}
            </span>
            <h1 className="ambassador-main-title">
              {isOwner ? 'Gestão Geral do Aplicativo' : data.isAmbassador ? 'Painel do Embaixador Oficial' : 'Seu Painel de Indicações'}
            </h1>
          </div>
          <div className="ambassador-level-badge">
            <span className="level-lbl">{isOwner ? 'Perfil' : 'Meu Nível'}</span>
            <strong className="level-name">{isOwner ? '👑 DONO DO APP' : data.level}</strong>
          </div>
        </div>

        {/* Alerta de Manutenção / Tolerância de 30 dias se cair abaixo de 10 */}
        {data.warning && (
          <div className="ambassador-warning-banner">
            {data.warning}
          </div>
        )}

        {/* Card de Progresso e Metas */}
        <div className="ambassador-progress-card">
          <div className="row-between" style={{ alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 14, color: '#f0e9ff' }}>
              <strong>Indicados Ativos:</strong> <span className="gold-text">{data.activeCount}</span> / 10
            </span>
            <span className="current-benefit-tag">
              🎁 Benefício: <strong>{data.currentBenefit}</strong>
            </span>
          </div>

          {/* Barra de Progresso Visual */}
          <div className="ambassador-progress-bar-wrap">
            <div
              className="ambassador-progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="ambassador-next-goal-text">
            {data.isAmbassador ? (
              <span style={{ color: '#86efac' }}>
                👑 <strong>Meta de Embaixador Atingida!</strong> Sua assinatura permanece 100% gratuita enquanto você mantiver 10 indicados ativos.
              </span>
            ) : (
              <span>
                🎯 <strong>Próximo Objetivo:</strong> {data.nextGoal?.text}
              </span>
            )}
          </div>
        </div>

        {/* Caixa de Compartilhamento do Link */}
        <div className="ambassador-link-box">
          <div className="link-info-col">
            <span className="link-label">SEU LINK EXCLUSIVO DE INDICAÇÃO:</span>
            <code className="link-code-preview">{referralLink}</code>
          </div>
          <div className="link-btns-col">
            <button type="button" className="btn ghost sm" onClick={handleCopyLink}>
              📋 Copiar Link
            </button>
            <button type="button" className="btn sm" onClick={handleShareWhatsApp}>
              📲 Compartilhar no WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Navegação de Abas */}
      <section className="section" style={{ marginTop: 18 }}>
        <div className="ambassador-tabs-nav">
          {isOwner && (
            <button
              type="button"
              className={`ambassador-tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ borderColor: 'rgba(251,191,36,0.5)', background: activeTab === 'admin' ? 'rgba(251,191,36,0.15)' : undefined }}
            >
              👑 Painel do Dono (Faturamento & Usuários)
            </button>
          )}
          <button
            type="button"
            className={`ambassador-tab-btn ${activeTab === 'indicacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('indicacoes')}
          >
            👥 Minhas Indicações ({data.totalCount})
          </button>
          <button
            type="button"
            className={`ambassador-tab-btn ${activeTab === 'regras' ? 'active' : ''}`}
            onClick={() => setActiveTab('regras')}
          >
            📜 Regras & Escala de Benefícios
          </button>
        </div>
      </section>

      {/* ABA DO DONO: GESTÃO EXECUTIVA E FATURAMENTO */}
      {activeTab === 'admin' && isOwner && (
        <section className="section fade-in">
          <AdminAmbassadors user={user} onRefresh={() => setRefreshTrigger((t) => t + 1)} />
        </section>
      )}

      {/* ABA 1: MINHAS INDICAÇÕES */}
      {activeTab === 'indicacoes' && (
        <section className="section fade-in">
          <div className="stat-grid" style={{ marginBottom: 18 }}>
            <div className="stat">
              <div className="big">{data.totalCount}</div>
              <div className="lbl">Total de Indicados</div>
            </div>
            <div className="stat">
              <div className="big gold">{data.activeCount}</div>
              <div className="lbl">Assinantes Ativos</div>
            </div>
            <div className="stat">
              <div className="big">{data.inactiveCount}</div>
              <div className="lbl">Cadastros Gratuitos</div>
            </div>
            <div className="stat">
              <div className="big" style={{ color: '#4ade80' }}>{Math.max(0, 10 - data.activeCount)}</div>
              <div className="lbl">Faltam para Conta Grátis</div>
            </div>
          </div>

          <div className="secret-card" style={{ gap: 14 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#fde68a' }}>Lista de Pessoas Indicadas por Você</h3>
            {data.referrals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <p className="muted" style={{ margin: '0 0 12px' }}>
                  Você ainda não possui indicações registradas.
                </p>
                <button type="button" className="btn sm" onClick={handleShareWhatsApp}>
                  📲 Convidar Primeiro Amigo
                </button>
              </div>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Membro</th>
                      <th>Data de Entrada</th>
                      <th>Status da Assinatura</th>
                      <th>Contribuição na Meta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.referrals.map((r, idx) => (
                      <tr key={r.id || idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{r.name || r.referred_user_name || 'Amigo Indicado'}</strong>
                          <div className="muted" style={{ fontSize: 11 }}>{r.email || r.referred_user_email}</div>
                        </td>
                        <td className="muted" style={{ fontSize: 12 }}>
                          {new Date(r.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                        </td>
                        <td>
                          <span className={`status-pill ${r.status}`}>
                            {r.status === 'active_subscriber' ? '🟢 Assinante Ativo' : '⚪ Gratuito'}
                          </span>
                        </td>
                        <td>
                          {r.status === 'active_subscriber' ? (
                            <strong style={{ color: '#4ade80' }}>+1 para Assinatura Gratuita</strong>
                          ) : (
                            <span className="muted">Aguardando assinar</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ABA 2: REGRAS & ESCALA */}
      {activeTab === 'regras' && (
        <section className="section fade-in">
          <div className="secret-card" style={{ gap: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#fde68a' }}>
              📜 Como Funciona a Escala de Recompensas e Embaixadores
            </h3>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
              Convide seus amigos e irmãos na fé através do seu link exclusivo. Conforme suas indicações avançam, você desbloqueia conteúdos especiais, meses de assinatura gratuita e a gratuidade permanente do aplicativo:
            </p>

            <div className="milestones-table-wrap">
              <table className="milestones-table">
                <thead>
                  <tr>
                    <th>Meta de Indicações</th>
                    <th>Nível</th>
                    <th>Benefício Conquistado</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MILESTONES.map((m) => {
                    const isReached = m.minActive <= 5 
                      ? (data.activeCount >= m.minActive || data.totalCount >= m.minActive)
                      : data.activeCount >= m.minActive;
                    const diff = m.minActive <= 5 
                      ? Math.max(0, m.minActive - Math.max(data.activeCount, data.totalCount))
                      : Math.max(0, m.minActive - data.activeCount);

                    return (
                      <tr key={m.minActive} className={isReached ? 'reached' : ''}>
                        <td><strong>{m.minActive} {m.minActive <= 5 ? 'indicações' : 'assinantes ativos'}</strong></td>
                        <td><span className="badge-tag">{m.badge}</span></td>
                        <td><strong style={{ color: '#fde68a' }}>{m.benefit}</strong></td>
                        <td>
                          {isReached ? (
                            <span className="status-ok">✅ Desbloqueado</span>
                          ) : (
                            <span className="status-lock">🔒 Falta {diff}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="rules-notice-box" style={{ background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.2)', borderRadius: 10, padding: 14 }}>
              <h4 style={{ margin: '0 0 6px', color: '#fbbf24', fontSize: 14 }}>🛡️ Regra de Manutenção dos 10 Assinantes Ativos:</h4>
              <p className="muted" style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
                Ao alcançar 10 indicados ativos assinantes, você conquista o título de <strong>👑 Embaixador Oficial</strong> e o seu aplicativo permanece <strong>100% gratuito</strong> enquanto essas 10 pessoas mantiverem suas assinaturas ativas. Caso algum indicado cancele e você fique temporariamente com 9 ativos, o sistema concede <strong>30 dias de tolerância</strong> para você convidar outro assinante antes de perder o benefício.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
