// src/App.jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const MainPage = lazy(() => import('./mainPage'));

const Resource = lazy(() => import('./spage')); 

const NotFound = () => <h2>⚠️ 404 Page Not Found</h2>;

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
