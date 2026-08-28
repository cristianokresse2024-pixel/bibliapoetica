import { useEffect, useRef, useState } from 'react';
import { BRAND } from '../config/brand.js';
import { aiReady, askIAViva } from '../services/aiService.js';
import { authReady, onAuth, signInWithGoogle } from '../services/authService.js';

// IA VIVA — assistente de estudo bíblico do ecossistema Viva Inteligente.
// Fala com a Cloud Function segura (chave do provedor fica no backend).
// Degradação graciosa: sem backend configurado, mostra aviso e exemplos.

const EXAMPLES = [
  'Explique Romanos 8:28.',
  'O que a Bíblia ensina sobre fé?',
  'Qual o contexto histórico de João 15?',
  'Quero estudar sobre oração.',
  'Monte um estudo bíblico sobre fé.',
];

export default function IAViva() {
  const configured = aiReady();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!authReady()) return;
    let unsub = () => {};
    onAuth((u) => setUser(u)).then((fn) => { if (fn) unsub = fn; });
    return () => unsub();
  }, []);

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
      if (e.message === 'NOT_CONFIGURED') {
        setError('A IA Viva ainda está sendo configurada. Volte em breve! 🙏');
      } else if (e.code === 'functions/unauthenticated') {
        setError('Faça login para conversar com a IA Viva.');
      } else if (e.code === 'functions/resource-exhausted') {
        setError(e.message || 'Você atingiu o limite de uso de hoje.');
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
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>✨ IA Viva</h2>
        <p className="sub">Sua companhia de estudo da Palavra — clara, respeitosa e cristã.</p>
      </section>

      <section className="section">
        <div className="secret-card" style={{ gap: 14 }}>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>{BRAND.aiDisclaimer}</p>

          <div className="ia-chat" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="ia-msg ia-bot">
                <span className="ia-ava">✨</span>
                <div className="ia-bubble">
                  Olá! Eu sou a <strong>IA Viva</strong>. Posso ajudar você a entender versículos,
                  conhecer o contexto histórico, montar estudos e crescer na fé. Sempre que possível,
                  mostro as referências bíblicas usadas. Por onde quer começar?
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`ia-msg ${m.role === 'user' ? 'ia-user' : 'ia-bot'}`}>
                {m.role === 'assistant' && <span className="ia-ava">✨</span>}
                <div className="ia-bubble">{m.content}</div>
              </div>
            ))}
            {busy && (
              <div className="ia-msg ia-bot">
                <span className="ia-ava">✨</span>
                <div className="ia-bubble ia-typing"><span></span><span></span><span></span></div>
              </div>
            )}
          </div>

          {messages.length === 0 && (
            <div className="ia-examples">
              {EXAMPLES.map((ex) => (
                <button key={ex} className="ia-example" onClick={() => canChat && send(ex)} disabled={!canChat}>
                  {ex}
                </button>
              ))}
            </div>
          )}

          {error && <div className="note-box" style={{ borderColor: 'rgba(252,165,165,.4)' }}>⚠️ {error}</div>}

          {canChat ? (
            <div className="ia-composer">
              <input
                className="select"
                placeholder="Digite sua pergunta sobre a Bíblia…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                disabled={busy}
              />
              <button className="btn" onClick={() => send()} disabled={busy || !input.trim()}>
                Enviar
              </button>
            </div>
          ) : (
            <div className="note-box">
              🔒 <strong>Em preparação.</strong> A conversa com a IA será ativada assim que o backend
              seguro estiver conectado.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
