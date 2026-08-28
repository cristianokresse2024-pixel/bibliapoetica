// COMUNIDADE FÉ INTELIGENTE
// FASE 1: apresentação. Publicações, comentários, curtidas, pedidos de oração e
// testemunhos serão ativados quando o backend (contas + banco) estiver pronto.

const FEATURES = [
  { icon: '📝', title: 'Publicações', desc: 'Compartilhe aprendizados e reflexões.' },
  { icon: '🙏', title: 'Pedidos de oração', desc: 'Peça e interceda por outros irmãos.' },
  { icon: '💬', title: 'Comentários', desc: 'Converse e edifique uns aos outros.' },
  { icon: '✨', title: 'Testemunhos', desc: 'Celebre o que Deus tem feito.' },
];

export default function Community() {
  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🤝 Comunidade Fé Inteligente</h2>
        <p className="sub">Um lugar para crescer em comunhão, não sozinho.</p>
      </section>

      <section className="section">
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-ic">{f.icon}</div>
              <strong>{f.title}</strong>
              <span className="muted">{f.desc}</span>
            </div>
          ))}
        </div>
        <div className="note-box" style={{ marginTop: 18 }}>
          🔒 <strong>Em preparação.</strong> A comunidade será ativada junto com as contas de usuário,
          para que cada publicação e pedido de oração tenha um rosto e um nome.
        </div>
      </section>
    </div>
  );
}
