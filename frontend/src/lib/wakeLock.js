/**
 * Utilitário de Screen Wake Lock para manter a tela do dispositivo acesa.
 * Utiliza a Screen Wake Lock API nativa (W3C) com reconexão automática
 * em mudanças de visibilidade (visibilitychange) e fallback para navegadores antigos.
 */

let wakeLockSentinel = null;
let isRequested = false;
let fallbackVideo = null;

/**
 * Fallback para navegadores ou webviews legadas que não suportam Wake Lock API
 * Cria um stream de canvas de 1fps silencioso em vídeo inline mudo.
 */
function enableFallback() {
  try {
    if (fallbackVideo) return;
    if (typeof document === 'undefined') return;

    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 2, 2);
    }

    if (typeof canvas.captureStream === 'function') {
      const stream = canvas.captureStream(1);
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.style.position = 'fixed';
      video.style.left = '-9999px';
      video.style.top = '-9999px';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';
      video.style.pointerEvents = 'none';
      video.srcObject = stream;

      video.play().catch(() => {});
      fallbackVideo = video;
      document.body?.appendChild(video);
    }
  } catch (err) {
    console.debug('[WakeLock Fallback Error]:', err);
  }
}

function disableFallback() {
  if (fallbackVideo) {
    try {
      fallbackVideo.pause();
      if (fallbackVideo.srcObject && typeof fallbackVideo.srcObject.getTracks === 'function') {
        fallbackVideo.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (fallbackVideo.parentNode) {
        fallbackVideo.parentNode.removeChild(fallbackVideo);
      }
    } catch {}
    fallbackVideo = null;
  }
}

/**
 * Solicita que o dispositivo mantenha a tela ligada / acesa.
 */
export async function requestScreenWakeLock() {
  isRequested = true;

  if (typeof navigator !== 'undefined' && 'wakeLock' in navigator && navigator.wakeLock?.request) {
    try {
      if (!wakeLockSentinel || wakeLockSentinel.released) {
        wakeLockSentinel = await navigator.wakeLock.request('screen');
        wakeLockSentinel.addEventListener('release', () => {
          if (!isRequested) {
            wakeLockSentinel = null;
          }
        });
        return true;
      }
      return true;
    } catch (err) {
      console.warn('[WakeLock Warning] Falha ao solicitar bloqueio de tela nativo:', err);
    }
  }

  // Se a API nativa não estiver disponível ou falhar, ativa fallback
  enableFallback();
  return false;
}

/**
 * Libera o bloqueio de tela, permitindo que o dispositivo retorne ao comportamento normal.
 */
export function releaseScreenWakeLock() {
  isRequested = false;

  if (wakeLockSentinel) {
    try {
      wakeLockSentinel.release().catch(() => {});
    } catch {}
    wakeLockSentinel = null;
  }

  disableFallback();
}

/**
 * Retorna se o bloqueio de tela está ativo no momento.
 */
export function isScreenWakeLockActive() {
  return isRequested && (Boolean(wakeLockSentinel && !wakeLockSentinel.released) || Boolean(fallbackVideo));
}

// Re-solicita bloqueio automaticamente quando o usuário volta para o app caso ainda esteja no Lugar Secreto
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isRequested) {
      await requestScreenWakeLock();
    }
  });
}
