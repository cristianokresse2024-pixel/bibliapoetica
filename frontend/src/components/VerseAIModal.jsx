import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askIAViva } from '../services/aiService.js';
import MarkdownView from './MarkdownView.jsx';
import { useToast } from '../lib/toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import IAIcon from './IAIcon.jsx';

export default function VerseAIModal({
  book,
  chapter,
  verseNum,
  verseText,
  version = 'NVI',
  onClose,
}) {
  const { isSubscriber, openAuthModal, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(isSubscriber);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const nav = useNavigate();

  const refLabel = `${book.name} ${chapter}:${verseNum}`;

  async function fetchExplanation() {
    if (!isSubscriber) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    const prompt = `Explique de forma viva, profunda e acessível o versículo bíblico ${refLabel} (${version.toUpperCase()}): "${verseText}".
Vá direto à explicação sem saudações introdutórias genéricas nem despedidas.
Estruture a resposta obrigatoriamente nestas 3 partes:

### 🏛️ O que estava acontecendo
Cenário histórico, cultural e narrativo rápido e simples daquele versículo: quem estava falando, em que momento e para quem.

### 💡 O que o texto realmente significa
A verdade central e espiritual da passagem explicada em linguagem clara, humana e descomplicada, revelando o coração de Deus.

### 🌿 Para a sua vida hoje
Aplicação prática, encorajadora e transformadora para o cotidiano do leitor.`;

    try {
      const res = await askIAViva(prompt, [], {
        passage: {
          book: book.name,
          chapter,
          verseNum,
          verseText,
        },
        mode: 'explain',
      });
      setExplanation(res.text);
    } catch (e) {
      if (e.status === 429) {
        setError(e.message || 'Muitas perguntas em pouco tempo. Aguarde um instante e tente novamente.');
      } else {
        setError('Não foi possível carregar a explicação da IA Viva agora. Verifique a conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSubscriber) {
      fetchExplanation();
    } else {
      setLoading(false);
    }
  }, [book.abbrev, chapter, verseNum, isSubscriber]);

  async function handleCopy() {
    if (!explanation) return;
    const textToCopy = `📖 Estudo IA Viva — ${refLabel}\n“${verseText}”\n\n${explanation}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
        toast({ icon: '📋', title: 'Copiado!', desc: `Explicação de ${refLabel} copiada.` });
      }
    } catch {}
  }

  function handleOpenFullChat() {
    nav('/ia');
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="verse-ai-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="verse-ai-head">
          <div className="verse-ai-head-info">
            <span className="pill gold" style={{ fontSize: 11.5, padding: '4px 10px', gap: 5 }}>
              <IAIcon size={16} /> IA VIVA EXEGESE
            </span>
            <h2 className="verse-ai-title">{refLabel}</h2>
          </div>
          <button className="intro-close" onClick={onClose} title="Fechar">✕</button>
        </div>

        {/* Citação do Versículo */}
        <div className="verse-ai-quote">
          <p className="verse-ai-quote-text">“{verseText}”</p>
          <span className="verse-ai-quote-ref">— {refLabel} ({version.toUpperCase()})</span>
        </div>

        {/* Conteúdo Explicativo */}
        <div className="verse-ai-body">
          {!isSubscriber ? (
            <div className="verse-ai-paywall">
              <div style={{ fontSize: 36, marginBottom: 8 }}>👑</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#fde68a' }}>
                Estudo com a IA Viva
              </h3>
              <p style={{ color: '#e9e2ff', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
                A explicação profunda deste versículo com base no conhecimento e materiais do Movimento Viva Inteligente é exclusiva para assinantes e membros VIP.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn sm"
                  onClick={() => {
                    onClose();
                    openAuthModal(isLoggedIn ? 'login' : 'register');
                  }}
                >
                  {isLoggedIn ? 'Ver Planos de Assinatura' : 'Cadastre-se / Entrar'}
                </button>
              </div>
            </div>
          ) : (
            <>
              {loading && (
                <div className="verse-ai-loading">
                  <div style={{ textAlign: 'center', margin: '14px auto 10px' }}>
                    <span className="ia-brain-icon-large" role="img" aria-label="Cérebro pensando">🧠</span>
                    <div className="ia-typing-dots" style={{ justifyContent: 'center', marginTop: 4 }}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <p style={{ color: '#fde68a', fontWeight: 600, fontSize: 15, margin: '8px 0 0' }}>
                    Consultando biblioteca teológica e preparando explicação...
                  </p>
                  <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    Analisando o cenário histórico e espiritual de {book.name} {chapter}:{verseNum}.
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="note-box" style={{ borderColor: 'rgba(252,165,165,.4)', textAlign: 'center', padding: 18 }}>
                  <p style={{ color: '#fca5a5', margin: '0 0 12px', fontSize: 15 }}>⚠️ {error}</p>
                  <button className="btn sm" onClick={fetchExplanation}>
                    🔄 Tentar novamente
                  </button>
                </div>
              )}

              {!loading && explanation && (
                <div className="verse-ai-content">
                  <MarkdownView content={explanation} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Rodapé com Ações */}
        {isSubscriber && (
          <div className="verse-ai-footer">
            <button
              className="btn ghost sm"
              onClick={handleCopy}
              disabled={loading || !explanation}
              title="Copiar texto completo da explicação"
            >
              📋 Copiar Estudo
            </button>
            <button
              className="btn sm"
              onClick={handleOpenFullChat}
              title="Abrir a IA Viva completa para fazer mais perguntas"
            >
              💬 Perguntar mais à IA Viva
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
