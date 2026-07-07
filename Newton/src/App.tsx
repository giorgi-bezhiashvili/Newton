// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const MainPage = lazy(() => import('./mainPage'));

const Resource = lazy(() => import('./spage')); 

const NotFound = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#17130f",
      color: "#f5ece0",
      fontFamily: "'DM Serif Display', serif",
      fontSize: "1.5rem",
    }}
  >
    ⚠️ 404 — გვერდი ვერ მოიძებნა
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          
          <Route path="/:param" element={<Resource />} />          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
