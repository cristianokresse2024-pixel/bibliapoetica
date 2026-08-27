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

export default function App() {
  const [index, setIndex] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIndex()
      .then((idx) => { setIndexRef(idx); setIndex(idx); })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="empty"><div className="big">⚠️</div><p>{error}</p></div>;
  if (!index) return <div className="spin" />;

  return (
    <div className="app">
      <TopBar index={index} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home index={index} />} />
          <Route path="/livros" element={<Books index={index} />} />
          <Route path="/ler/:abbrev/:chapter" element={<Reader index={index} />} />
          <Route path="/jornada" element={<Journey index={index} />} />
          <Route path="/favoritos" element={<Favorites index={index} />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
