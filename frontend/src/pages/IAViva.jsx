import { useEffect, useRef, useState } from 'react';
import { BRAND } from '../config/brand.js';
import { aiReady, askIAViva } from '../services/aiService.js';
import MarkdownView from '../components/MarkdownView.jsx';
import IAIcon from '../components/IAIcon.jsx';

// IA VIVA — assistente de estudo bíblico do ecossistema Viva Inteligente.
// Fala com o endpoint serverless seguro /api/askIAViva (chave do Groq no backend).

const EXAMPLES = [
  'Explique Romanos 8:28.',
  'O que a Bíblia ensina sobre fé?',
  'Qual o contexto histórico de João 15?',
  'Quero estudar sobre oração.',
  'Monte um estudo bíblico sobre fé.',
];

export default function IAViva() {
  const configured = aiReady();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setError('');
    setInput('');
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: 'user', content: q }]);
    setBusy(true);
    try {
      const res = await askIAViva(q, history);
      setMessages((m) => [...m, { role: 'assistant', content: res.text }]);
    } catch (e) {
      if (e.status === 429) {
        setError(e.message || 'Muitas perguntas em pouco tempo. Aguarde um instante e tente de novo.');
      } else {
        setError('Não consegui responder agora. Tente novamente em instantes.');
      }
      setMessages((m) => m.slice(0, -1)); // remove a pergunta que falhou
      setInput(q);
    } finally {
      setBusy(false);
    }
  }

  const canChat = configured;

  return (
    <div className="fade-in ia-screen-wrap">
      <div className="ia-header-bar">
        <div>
          <h1 className="ia-header-title">
            <IAIcon size={28} /> IA Viva
          </h1>
          <p className="ia-header-sub">Inteligência artificial com acesso a uma grande gama de conhecimento dos materiais do Movimento Viva Inteligente.</p>
        </div>
        {messages.length > 0 && (
          <button
            className="btn ghost sm"
            onClick={() => {
              setMessages([]);
              setError('');
            }}
            title="Iniciar nova conversa"
          >
            🧹 Nova conversa
          </button>
        )}
      </div>

      <div className="ia-chat-box">
        <div className="ia-chat-messages" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="ia-msg ia-bot">
              <span className="ia-ava"><IAIcon size={26} /></span>
              <div className="ia-bubble ia-bubble-assistant">
                <div className="md-rendered">
                  <h3 className="md-h2" style={{ marginTop: 0 }}>
                    Graça e Paz! Eu sou a <strong>IA Viva</strong>. 📖
                  </h3>
                  <p className="md-p">
                    Estou pronta para ajudar você a <strong>mergulhar fundo na Palavra de Deus</strong>:
                  </p>
                  <ul className="md-ul">
                    <li>Explicar o contexto histórico, cultural e geográfico dos textos.</li>
                    <li>Revelar o significado dos termos no Grego Koiné e Hebraico bíblico.</li>
                    <li>Montar estudos bíblicos estruturados e profundos do Gênesis ao Apocalipse.</li>
                    <li>Extrair lições práticas e orações para o seu dia a dia.</li>
                  </ul>
                  <p className="md-p" style={{ marginBottom: 0, fontStyle: 'italic', color: '#fde68a' }}>
                    Escolha uma pergunta abaixo ou digite seu versículo ou tema de interesse:
                  </p>
                </div>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`ia-msg ${m.role === 'user' ? 'ia-user' : 'ia-bot'}`}>
              {m.role === 'assistant' && <span className="ia-ava"><IAIcon size={26} /></span>}
              <div className={`ia-bubble ${m.role === 'assistant' ? 'ia-bubble-assistant' : ''}`}>
                {m.role === 'assistant' ? <MarkdownView content={m.content} /> : m.content}
              </div>
            </div>
          ))}

          {busy && (
            <div className="ia-msg ia-bot">
              <span className="ia-ava"><IAIcon size={26} /></span>
              <div className="ia-bubble ia-bubble-assistant ia-typing-wrapper">
                <div className="ia-brain-thinking">
                  <span className="ia-brain-icon" role="img" aria-label="Cérebro pensando">🧠</span>
                  <div className="ia-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="ia-thinking-text">
                    Pensando e examinando as Escrituras...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {messages.length === 0 && (
          <div className="ia-examples">
            {EXAMPLES.map((ex) => (
              <button key={ex} className="ia-example" onClick={() => canChat && send(ex)} disabled={!canChat || busy}>
                🔍 {ex}
              </button>
            ))}
          </div>
        )}

        {error && <div className="note-box" style={{ borderColor: 'rgba(252,165,165,.4)', margin: 0 }}>⚠️ {error}</div>}

        {canChat ? (
          <div className="ia-composer-wrap">
            <input
              className="ia-input"
              placeholder="Digite sua dúvida ou tema bíblico (ex: Explique Efésios 6:10-18)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send();
              }}
              disabled={busy}
            />
            <button className="btn ia-send-btn" onClick={() => send()} disabled={busy || !input.trim()}>
              <span>Enviar</span> ➤
            </button>
          </div>
        ) : (
          <div className="note-box" style={{ margin: 0 }}>
            🔒 <strong>Em preparação.</strong> A conversa com a IA será ativada em instantes.
          </div>
        )}
      </div>
    </div>
  );
}
