import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { askIAViva } from '../services/aiService.js';
import MarkdownView from './MarkdownView.jsx';
import { useToast } from '../lib/toast.jsx';

export default function VerseAIModal({
  book,
  chapter,
  verseNum,
  verseText,
  version = 'NVI',
  onClose,
}) {
  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();
  const nav = useNavigate();

  const refLabel = `${book.name} ${chapter}:${verseNum}`;

  async function fetchExplanation() {
    setLoading(true);
    setError('');
    const prompt = `Por favor, faça uma explicação teológica e pastoral profunda do versículo ${refLabel} (${version.toUpperCase()}): "${verseText}".
Apresente:
1. 📖 Contexto Histórico, Cultural e Literário
2. 🔍 Significado no Original (Grego Koiné ou Hebraico) e Exegese
3. 💡 Principais Lições Teológicas
4. 🌿 Aplicação Prática para a Vida Diária
5. 🙏 Oração Breve de Meditação`;

    try {
      const res = await askIAViva(prompt);
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
    fetchExplanation();
  }, [book.abbrev, chapter, verseNum]);

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
              ✨ IA VIVA EXEGESE
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
          {loading && (
            <div className="verse-ai-loading">
              <div className="spin" style={{ margin: '20px auto 14px' }} />
              <p style={{ color: '#fde68a', fontWeight: 600, fontSize: 15, margin: 0 }}>
                Examinando as Escrituras no original e preparando estudo profundo...
              </p>
              <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                Consultando o contexto de {book.name}, exegese teológica e aplicações pastorais.
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
        </div>

        {/* Rodapé com Ações */}
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
      </div>
    </div>
  );
}
