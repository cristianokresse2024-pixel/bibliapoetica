import { useAuth } from '../context/AuthContext.jsx';
import PaywallCard from './PaywallCard.jsx';

export default function SubscriptionGuard({
  children,
  title = 'Recurso Exclusivo para Assinantes',
  description = 'Para ter acesso completo a esta ferramenta, torne-se um assinante do Movimento Fé Inteligente.',
  icon = '🔒',
}) {
  const { isSubscriber, loading } = useAuth();

  if (loading) {
    return (
      <div className="spin" style={{ margin: '60px auto' }} />
    );
  }

  if (isSubscriber) {
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
