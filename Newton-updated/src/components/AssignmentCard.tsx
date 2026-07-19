import { useState } from "react";
import type { AssignmentData } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { patchWithAuth, deleteWithAuth } from "../api";

const GRADES = [7, 8, 9, 10, 11, 12];

export function AssignmentCard({ card, onChanged }: { card: AssignmentData; onChanged?: () => void }) {
  const { auth, setAccessToken, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [topic, setTopic] = useState(card.topic);
  const [assignmentsText, setAssignmentsText] = useState(card.assignments.join("\n"));
  const [grade, setGrade] = useState(card.grade);
  const [url, setUrl] = useState(card.url || "");
  const [urlName, setUrlName] = useState(card.urlName || "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    const assignments = assignmentsText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (assignments.length === 0) {
      setError("დაამატეთ მინიმუმ ერთი დავალება");
      return;
    }
    setIsSaving(true);
    try {
      await patchWithAuth(
        `assignments/${card._id}`,
        auth!.accessToken,
        { topic, assignments, grade, url: url || undefined, urlName: urlName || undefined },
        auth!.refreshToken,
        setAccessToken
      );
      setIsEditing(false);
      onChanged?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "განახლება ვერ მოხერხდა";
      if (message.includes("სესია ამოიწურა")) logout();
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("წავშალო ეს დავალება?")) return;
    setError(null);
    setIsSaving(true);
    try {
      await deleteWithAuth(`assignments/${card._id}`, auth!.accessToken, auth!.refreshToken, setAccessToken);
      onChanged?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      if (message.includes("სესია ამოიწურა")) logout();
      setError(message);
      setIsSaving(false);
    }
  };

  if (auth && isEditing) {
    return (
      <div className="card">
        <form
          className="addCardForm"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input className="searchInput" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          <textarea
            className="searchInput addCardTextarea"
            value={assignmentsText}
            onChange={(e) => setAssignmentsText(e.target.value)}
            required
          />
          <div className="addCardRow">
            <select className="searchInput" value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}-ე კლასი</option>
              ))}
            </select>
          </div>
          <div className="addCardRow">
            <input className="searchInput" placeholder="ბმული" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className="searchInput" placeholder="ბმულის სახელი" value={urlName} onChange={(e) => setUrlName(e.target.value)} />
          </div>
          {error && <p className="authError">{error}</p>}
          <div className="addCardRow">
            <button type="submit" className="authSubmitBtn" disabled={isSaving}>
              {isSaving ? "იტვირთება..." : "შენახვა"}
            </button>
            <button type="button" className="addCardToggle" onClick={() => setIsEditing(false)}>
              გაუქმება
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <div>
        <h2>{card.topic}</h2>
        <ul className="assignmentsList">
          {card.assignments.map((task, index) => (
            <li key={index} className="assignmentItem">
              {task}
            </li>
          ))}
        </ul>
      </div>
      <div className="cardFooter">
        <span className="gradeTag">{card.grade}-ე კლასი</span>
        {card.url && (
          <a href={card.url} className="cardLink" target="_blank" rel="noreferrer">
            {card.urlName || "იხილეთ მეტი"}
          </a>
        )}
      </div>
      {auth && (
        <>
          {error && <p className="authError">{error}</p>}
          <div className="addCardRow">
            <button type="button" className="addCardToggle" onClick={() => setIsEditing(true)}>
              რედაქტირება
            </button>
            <button type="button" className="addCardToggle" onClick={handleDelete} disabled={isSaving}>
              წაშლა
            </button>
          </div>
        </>
      )}
    </div>
  );
}