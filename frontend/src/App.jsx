import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { loadIndex } from './lib/data.js';
import { setIndexRef } from './lib/progress.js';
import TopBar from './components/TopBar.jsx';
import BottomNav from './components/BottomNav.jsx';
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import Reader from './pages/Reader.jsx';
import Journey from './pages/Journey.jsx';
import Favorites from './pages/Favorites.jsx';
import Prayer from './pages/Prayer.jsx';
import Fasting from './pages/Fasting.jsx';
import Gratitude from './pages/Gratitude.jsx';
import IAViva from './pages/IAViva.jsx';
import Studies from './pages/Studies.jsx';
import Community from './pages/Community.jsx';
import Profile from './pages/Profile.jsx';
import Devotional from './pages/Devotional.jsx';
import AmbassadorDashboard from './pages/AmbassadorDashboard.jsx';
import FastMonitor from './components/FastMonitor.jsx';
import { captureReferralFromUrl } from './lib/ambassadorEngine.js';

import SubscriptionGuard from './components/SubscriptionGuard.jsx';
import AuthModal from './components/AuthModal.jsx';

export default function App() {
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    captureReferralFromUrl();
    loadIndex()
      .then((idx) => { setIndexRef(idx); setIndex(idx); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="empty"><div className="big">⚠️</div><p>{error}</p></div>;
  if (!index) return <div className="spin" />;

  return (
    <div className="app">
      <TopBar index={index} />
      <FastMonitor />
      <AuthModal />
      <main className="container">
        <Routes>
          {/* ---- ÁREAS 100% LIBERADAS PARA TODO MUNDO (PÚBLICO/FREE) ---- */}
          <Route path="/" element={<Home index={index} />} />
          <Route path="/devocional" element={<Devotional />} />
          <Route path="/livros" element={<Books index={index} />} />
          <Route path="/ler/:abbrev/:chapter" element={<Reader index={index} />} />
          <Route path="/oracao" element={<Prayer />} />
          <Route path="/jejum" element={<Fasting index={index} />} />
          <Route path="/gratidao" element={<Gratitude />} />
          <Route path="/favoritos" element={<Favorites index={index} />} />
          <Route path="/jornada" element={<Journey index={index} />} />
          <Route path="/perfil" element={<Profile index={index} />} />
          <Route path="/embaixadores" element={<AmbassadorDashboard />} />

          {/* ---- ÁREAS EXCLUSIVAS PARA ASSINANTES E VIPS ---- */}
          <Route
            path="/ia"
            element={
              <SubscriptionGuard
                title="IA Viva"
                description="Inteligência artificial com acesso a uma grande gama de conhecimento dos materiais do Movimento Viva Inteligente."
                icon="✨"
              >
                <IAViva />
              </SubscriptionGuard>
            }
          />
          <Route
            path="/estudos"
            element={
              <SubscriptionGuard
                title="Aulas e Cursos Bíblicos"
                description="Acesse todas as aulas, trilhas teológicas e apostilas exclusivas para membros."
                icon="🎓"
              >
                <Studies />
              </SubscriptionGuard>
            }
          />
          <Route
            path="/comunidade"
            element={
              <SubscriptionGuard
                title="Comunidade do Reino"
                description="Conecte-se com outros membros, compartilhe orações, testemunhos e experiências."
                icon="🤝"
              >
                <Community />
              </SubscriptionGuard>
            }
          />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
