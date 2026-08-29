import { BRAND } from '../config/brand.js';

export default function MilestoneCelebrationModal({ milestone, onClose }) {
  if (!milestone) return null;

  const isAmbassador = milestone.activeCount >= 10;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="celebration-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="celebration-badge-icon">
          {isAmbassador ? '👑' : '🎉'}
        </div>

        <h2 className="celebration-title">
          {isAmbassador ? 'VOCÊ É UM EMBAIXADOR!' : 'Novo Benefício Desbloqueado!'}
        </h2>

        <p className="celebration-level-tag">
          {milestone.activeCount} Indicado(s) Ativo(s) Alcançado(s)
        </p>

        <div className="celebration-benefit-box">
          <span style={{ fontSize: 12, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: 1 }}>
            Benefício Conquistado:
          </span>
          <h3 style={{ margin: '6px 0 0', color: '#fde68a', fontSize: 20 }}>
            {milestone.benefit}
          </h3>
        </div>

        <p className="celebration-desc">
          {isAmbassador ? (
            <>
              Sua <strong>assinatura está gratuita</strong> enquanto você mantiver 10 indicados ativos.
              A partir de agora, cada novo indicado além dos 10 gera <strong>30% de comissão recorrente (R$ 8,97/mês)</strong>!
            </>
          ) : (
            <>
              Parabéns pelo seu avanço na propagação do Reino! Você já garantiu <strong>{milestone.benefit}</strong> no Movimento Fé Inteligente.
            </>
          )}
        </p>

        <button type="button" className="btn celebration-btn" onClick={onClose}>
          Continuar no Painel
        </button>
      </div>
    </div>
  );
}
