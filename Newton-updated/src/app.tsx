import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PageLoader from './components/PageLoader';

const MainPage = lazy(() => import('./mainPage'));
const FormulasPage = lazy(() => import('./FormulaPage'));
const AssignmentsPage = lazy(() => import('./AssignmentsPage'));
const ProjectsPage = lazy(() => import('./ProjectsPage'));
const AboutPage = lazy(() => import('./aboutPage'));
const LoginPage = lazy(() => import('./LoginPage'));

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
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/formulas" element={<FormulasPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}