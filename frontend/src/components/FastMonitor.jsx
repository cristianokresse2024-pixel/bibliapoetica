import { useEffect, useRef } from 'react';
import { useProgress, markReminderNotified } from '../lib/progress.js';
import { notify, beep } from '../lib/notify.js';
import { useToast } from '../lib/toast.jsx';
import { todayStr } from '../lib/progress.js';

// Monitora, em segundo plano (com o app aberto):
//  - o jejum ativo: avisa faltando 5 min e ao concluir
//  - o lembrete diário de oração: avisa no horário escolhido
export default function FastMonitor() {
  const state = useProgress();
  const toast = useToast();
  const firedRef = useRef({ five: false, end: false });

  const active = state.fast.active;
  const reminder = state.prayerReminder;

  // reinicia flags quando muda o jejum ativo
  useEffect(() => {
    firedRef.current = { five: false, end: false };
  }, [active?.startTs]);

  // ---- Jejum ----
  useEffect(() => {
    if (!active) return;
    const check = () => {
      const remaining = active.endTs - Date.now();
      if (!firedRef.current.five && remaining <= 5 * 60000 && remaining > 60000) {
        firedRef.current.five = true;
        beep(2);
        notify('⏰ Faltam 5 minutos!', `Seu ${active.label} está quase completo. Prepare o coração para encerrar.`, 'fast-5');
        toast({ icon: '⏰', title: 'Faltam 5 minutos!', desc: `${active.label} quase concluído.`, duration: 6000 });
      }
      if (!firedRef.current.end && remaining <= 0) {
        firedRef.current.end = true;
        beep(3);
        notify('🎉 Jejum concluído!', `Você cumpriu seu ${active.label}. Deus honra sua entrega! Toque para registrar.`, 'fast-end');
        toast({ icon: '🌙', title: 'Jejum concluído!', desc: 'Abra a aba Jejum para registrar.', duration: 8000 });
      }
    };
    check();
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, [active, toast]);

  // ---- Lembrete de oração ----
  useEffect(() => {
    if (!reminder?.enabled) return;
    const check = () => {
      const today = todayStr();
      if (reminder.lastNotified === today) return; // já avisou hoje
      const now = new Date();
      const [h, m] = (reminder.time || '07:00').split(':').map(Number);
      const cur = now.getHours() * 60 + now.getMinutes();
      const target = h * 60 + m;
      // dispara se passou do horário (janela de até 30 min de atraso, ex.: app aberto depois)
      if (cur >= target && cur <= target + 30) {
        markReminderNotified(today);
        beep(2);
        notify('🕊️ Hora de orar', 'Separe um momento no Lugar Secreto para falar com Deus.', 'prayer-reminder');
        toast({ icon: '🕊️', title: 'Hora de orar', desc: 'Que tal um tempo no Lugar Secreto?', duration: 8000 });
      }
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, [reminder?.enabled, reminder?.time, reminder?.lastNotified, toast]);

  return null;
}
