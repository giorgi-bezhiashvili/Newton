import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import { useAuth } from "./contexts/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(userName, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "შესვლა ვერ მოხერხდა");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-page">
      <Header />
      <main className="mainContent authContent">
        <form className="authForm" onSubmit={handleSubmit}>
          <h1 className="authTitle">შესვლა</h1>
          <p className="authSubtitle">შედით სისტემაში დავალებებისა და პროექტების დასამატებლად</p>

          <label className="authLabel" htmlFor="userName">მომხმარებლის სახელი</label>
          <input
            id="userName"
            className="searchInput"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            autoComplete="username"
            required
          />

          <label className="authLabel" htmlFor="password">პაროლი</label>
          <input
            id="password"
            className="searchInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="authError">{error}</p>}

          <button type="submit" className="authSubmitBtn" disabled={isSubmitting}>
            {isSubmitting ? "იტვირთება..." : "შესვლა"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default LoginPage;