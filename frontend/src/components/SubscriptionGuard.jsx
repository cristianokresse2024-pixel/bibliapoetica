import { useAuth } from '../context/AuthContext.jsx';
import { getUserUnlockedEntitlements } from '../lib/ambassadorEngine.js';
import PaywallCard from './PaywallCard.jsx';

export default function SubscriptionGuard({
  children,
  title = 'Recurso Exclusivo para Assinantes',
  description = 'Para ter acesso completo a esta ferramenta, torne-se um assinante do Movimento Fé Inteligente.',
  icon = '🔒',
  allowReferralStudies = false,
}) {
  const { user, isSubscriber, loading } = useAuth();
  const entitlements = getUserUnlockedEntitlements(user);

  if (loading) {
    return (
      <div className="spin" style={{ margin: '60px auto' }} />
    );
  }

  // Acesso liberado para assinantes pagos, VIPs ou quem conquistou gratuidade geral (6+, 10 ativos)
  if (isSubscriber || entitlements.canAccessAll) {
    return children;
  }

  // Acesso liberado à área de estudos para quem tem 4 ou 5 indicados
  if (allowReferralStudies && entitlements.canAccessStudies) {
    return children;
  }

  return (
    <PaywallCard
      title={title}
      description={description}
      icon={icon}
    />
  );
}
