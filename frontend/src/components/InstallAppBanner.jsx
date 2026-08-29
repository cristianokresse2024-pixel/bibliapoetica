import { useState, useEffect } from 'react';
import { BRAND } from '../config/brand.js';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Verifica se ja esta instalado em modo standalone (PWA aberto como app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Verifica se o usuario dispensou recentemente nesta sessao
    const dismissed = sessionStorage.getItem('viva_install_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }

    // 3. Detecta se eh dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // 4. Captura evento oficial do Chrome/Android/Edge para instalacao direta
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Escuta evento de instalacao bem sucedida
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Caso o navegador nao tenha disparado o prompt ainda, mostra guia rapido
      setShowIOSGuide(true);
      return;
    }

    // Dispara o prompt nativo do sistema operacional
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('viva_install_dismissed', 'true');
  };

  // Se ja esta instalado ou dispensado, nao renderiza
  if (isInstalled || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Banner Flutuante de Alta Visibilidade no Topo */}
      <div
        className="fade-in"
        style={{
          background: 'linear-gradient(135deg, #1b1236 0%, #0f0a1e 100%)',
          borderBottom: '1px solid rgba(251,191,36,0.4)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          padding: '12px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 240 }}>
          <img
            src={BRAND.logo || './icon-192.png'}
            alt="Viva Inteligente"
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              boxShadow: '0 0 10px rgba(251,191,36,0.3)',
              border: '1px solid rgba(251,191,36,0.3)',
              objectFit: 'cover',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <strong style={{ fontSize: 14, color: '#fde68a' }}>Instale o App Viva Inteligente</strong>
              <span
                style={{
                  fontSize: 10,
                  background: 'rgba(251,191,36,0.2)',
                  color: '#fbbf24',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontWeight: 'bold',
                }}
              >
                GRÁTIS
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#cbd5e1' }}>
              Acesse a Bíblia, devocionais e IA na tela inicial do seu celular!
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handleInstallClick}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#0f0a1e',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(251,191,36,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>📲</span> Instalar Aplicativo
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            title="Fechar aviso"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-sub)',
              fontSize: 18,
              cursor: 'pointer',
              padding: '4px 8px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Modal / Guia de Instalação (Especialmente para iPhone/iOS ou navegadores sem prompt automático) */}
      {showIOSGuide && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="secret-card fade-in"
            style={{
              maxWidth: 420,
              width: '100%',
              background: '#16102c',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: 18,
              padding: 24,
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={BRAND.logo || './icon-192.png'}
              alt="Logo"
              style={{ width: 64, height: 64, borderRadius: 14, margin: '0 auto 12px', border: '1px solid rgba(251,191,36,0.3)' }}
            />
            <h3 style={{ margin: '0 0 8px', color: '#fde68a', fontSize: 20 }}>
              Como Instalar no seu Celular
            </h3>
            <p className="muted" style={{ fontSize: 13.5, marginBottom: 20 }}>
              Siga estes passos rápidos para ter o app na sua tela inicial:
            </p>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ background: 'var(--gold)', color: '#000', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13, flexShrink: 0 }}>
                  1
                </span>
                <div style={{ fontSize: 14, color: '#f1f5f9' }}>
                  {isIOS ? (
                    <>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com seta para cima <strong style={{ color: '#38bdf8' }}>⎋</strong> na barra do Safari).</>
                  ) : (
                    <>Toque nos <strong>3 pontinhos</strong> do menu do seu navegador (no canto superior direito).</>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ background: 'var(--gold)', color: '#000', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13, flexShrink: 0 }}>
                  2
                </span>
                <div style={{ fontSize: 14, color: '#f1f5f9' }}>
                  Role para baixo e selecione <strong>“Adicionar à Tela de Início”</strong> ou <strong>“Instalar Aplicativo”</strong> 📲.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ background: 'var(--gold)', color: '#000', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 13, flexShrink: 0 }}>
                  3
                </span>
                <div style={{ fontSize: 14, color: '#f1f5f9' }}>
                  Toque em <strong>“Adicionar”</strong> no canto superior. Pronto! O ícone escuro oficial já estará na sua tela inicial! ✨
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn big-btn"
              onClick={() => setShowIOSGuide(false)}
              style={{ width: '100%' }}
            >
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
