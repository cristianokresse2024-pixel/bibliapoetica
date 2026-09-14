import { BRAND } from '../config/brand.js';

export default function MilestoneCelebrationModal({ milestone, onClose }) {
  if (!milestone) return null;

  const isAmbassador = milestone.activeCount >= 10;
  const count = milestone.activeCount || milestone.count || 0;
  const icon = isAmbassador ? '👑' : count >= 6 ? '⭐' : count >= 5 ? '📚' : '🎬';

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="celebration-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="celebration-badge-icon">
          {icon}
        </div>

        <h2 className="celebration-title">
          {isAmbassador ? 'VOCÊ É UM EMBAIXADOR OFICIAL!' : 'Nova Conquista Desbloqueada!'}
        </h2>

        <p className="celebration-level-tag">
          {count} Indicação(ões) Registrada(s)
        </p>

        <div className="celebration-benefit-box">
          <span style={{ fontSize: 12, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: 1 }}>
            Recompensa Liberada:
          </span>
          <h3 style={{ margin: '6px 0 0', color: '#fde68a', fontSize: 20 }}>
            {milestone.benefit}
          </h3>
        </div>

        <p className="celebration-desc">
          {isAmbassador ? (
            <>
              Parabéns! O seu aplicativo está <strong>100% gratuito</strong> enquanto você mantiver seus 10 indicados ativos como assinantes.
            </>
          ) : count >= 6 ? (
            <>
              Você liberou <strong>{milestone.benefit}</strong> com acesso irrestrito a todas as ferramentas e inteligência artificial do Viva Inteligente!
            </>
          ) : count === 5 ? (
            <>
              Você liberou <strong>1 Módulo Inteiro de Estudos</strong>! Acesse a área de estudos e aproveite o conteúdo completo desse módulo.
            </>
          ) : (
            <>
              Você liberou <strong>4 Aulas Exclusivas</strong> na área de estudos! Continue compartilhando para liberar módulos inteiros e meses gratuitos.
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
