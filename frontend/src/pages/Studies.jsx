import { BRAND } from '../config/brand.js';

// ESTUDOS — jornada de crescimento espiritual (NÃO é "curso" acadêmico).
// FASE 1: apresentação + destaque do estudo "Fé Inteligente".
// A estrutura permite adicionar outros estudos futuramente (módulos, aulas, PDFs,
// vídeos, progresso, conclusão e certificado simbólico).

const STUDIES = [
  {
    id: 'fe-inteligente',
    title: 'Fé Inteligente',
    badge: 'Principal',
    desc: 'A mentoria central do ecossistema: uma jornada para viver uma fé consciente, ' +
      'firmada na Palavra e transformadora no dia a dia.',
    modules: 'Módulos, reflexões e materiais de apoio',
    icon: '💡',
  },
];

export default function Studies() {
  return (
    <div className="fade-in">
      <section className="section">
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, margin: '18px 0 4px' }}>🎓 Estudos</h2>
        <p className="sub">Uma jornada de crescimento espiritual, no seu ritmo.</p>
      </section>

      <section className="section">
        <div className="note-box">{BRAND.studiesDisclaimer}</div>
      </section>

      <section className="section">
        <div className="study-list">
          {STUDIES.map((s) => (
            <div key={s.id} className="study-card">
              <div className="study-ic">{s.icon}</div>
              <div className="study-body">
                <div className="row-between" style={{ alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{s.title}</h3>
                  {s.badge && <span className="sc-badge">{s.badge}</span>}
                </div>
                <p className="muted" style={{ margin: '6px 0 8px' }}>{s.desc}</p>
                <div className="study-meta">{s.modules}</div>
                <button className="btn ghost sm" disabled style={{ marginTop: 12 }}>Em breve</button>
              </div>
            </div>
          ))}
        </div>

        <div className="note-box" style={{ marginTop: 18 }}>
          🎗️ Ao concluir um estudo você poderá receber um <strong>certificado simbólico</strong> de
          participação/conclusão — que <strong>não</strong> representa formação acadêmica, diploma
          ou certificação profissional.
        </div>
      </section>
    </div>
  );
}
