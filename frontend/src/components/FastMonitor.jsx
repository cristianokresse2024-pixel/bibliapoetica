import { useEffect, useRef } from 'react';
import { useProgress } from '../lib/progress.js';
import { notify, beep } from '../lib/notify.js';
import { useToast } from '../lib/toast.jsx';

// Monitora o jejum ativo em segundo plano (enquanto o app está aberto)
// e dispara avisos: faltando 5 minutos e ao concluir.
export default function FastMonitor() {
  const state = useProgress();
  const toast = useToast();
  const firedRef = useRef({ five: false, end: false });

  const active = state.fast.active;

  // reinicia flags quando muda o jejum ativo
  useEffect(() => {
    firedRef.current = { five: false, end: false };
  }, [active?.startTs]);

  useEffect(() => {
    if (!active) return;
    const check = () => {
      const remaining = active.endTs - Date.now();
      // faltando 5 minutos (300000 ms) — janela de tolerância
      if (!firedRef.current.five && remaining <= 5 * 60000 && remaining > 60000) {
        firedRef.current.five = true;
        beep(2);
        notify('⏰ Faltam 5 minutos!', `Seu ${active.label} está quase completo. Prepare o coração para encerrar.`, 'fast-5');
        toast({ icon: '⏰', title: 'Faltam 5 minutos!', desc: `${active.label} quase concluído.`, duration: 6000 });
      }
      // concluído
      if (!firedRef.current.end && remaining <= 0) {
        firedRef.current.end = true;
        beep(3);
        notify('🎉 Jejum concluído!', `Você cumpriu seu ${active.label}. Deus honra sua entrega! Toque para registrar.`, 'fast-end');
        toast({ icon: '🌙', title: 'Jejum concluído!', desc: 'Abra a aba Jejum para registrar.', duration: 8000 });
      }
    };
    check();
    const t = setInterval(check, 15000); // checa a cada 15s
    return () => clearInterval(t);
  }, [active, toast]);

  return null;
}
