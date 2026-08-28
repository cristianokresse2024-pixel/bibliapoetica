import { BRAND } from '../config/brand.js';

// IA VIVA — a inteligência artificial do ecossistema Viva Inteligente.
// FASE 1: tela de apresentação. A conversa real será ligada quando o backend
// (Cloud Function + AIService + Gemini) estiver disponível — sem expor a chave.

const EXAMPLES = [
  'Explique Romanos 8:28.',
  'O que a Bíblia ensina sobre fé?',
  'Qual o contexto histórico de João 15?',
  'Quero estudar sobre oração.',
  'Monte um estudo bíblico sobre fé.',
  'Explique esse versículo de maneira simples.',
];

export default function IAViva() {
  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>✨ IA Viva</h2>
        <p className="sub">Sua companhia de estudo da Palavra — clara, respeitosa e cristã.</p>
      </section>

      <section className="section">
        <div className="secret-card" style={{ gap: 14 }}>
          <p className="muted" style={{ margin: 0 }}>{BRAND.aiDisclaimer}</p>

          <div className="ia-chat-preview">
            <div className="ia-msg ia-bot">
              <span className="ia-ava">✨</span>
              <div className="ia-bubble">
                Olá! Eu sou a <strong>IA Viva</strong>. Posso ajudar você a entender versículos,
                conhecer o contexto histórico, montar estudos e crescer na fé.
                Sempre que possível, mostro as referências bíblicas usadas e incentivo você a
                buscar a Palavra por conta própria. Por onde quer começar?
              </div>
            </div>
          </div>

          <div>
            <div className="muted" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              Experimente perguntar
            </div>
            <div className="ia-examples">
              {EXAMPLES.map((ex) => (
                <span key={ex} className="ia-example">{ex}</span>
              ))}
            </div>
          </div>

          <div className="ia-composer" aria-hidden="true">
            <input className="select" placeholder="Digite sua pergunta sobre a Bíblia…" disabled />
            <button className="btn" disabled>Enviar</button>
          </div>

          <div className="note-box">
            🔒 <strong>Em preparação.</strong> A conversa com a IA será ativada assim que a
            infraestrutura segura (chave protegida no servidor) estiver conectada. Assim garantimos
            que sua chave de API nunca fique exposta e que o uso seja controlado com responsabilidade.
          </div>
        </div>
      </section>
    </div>
  );
}
