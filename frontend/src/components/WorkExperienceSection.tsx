import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { WorkExperience } from "../AuthContext";
import "./WorkExperienceSection.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export interface EditableExperience extends Omit<WorkExperience, "id"> {
  id: string | null;
  clientKey: string;
}

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  isEditing: boolean;
  candidateId: string;
  token: string | null;
  editableList: EditableExperience[];
  onEditableListChange: (list: EditableExperience[]) => void;
  onSaveExperience: () => Promise<void>;
}

function formatMonthYear(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function WorkExperienceSection({
  experiences,
  isEditing,
  candidateId,
  token,
  editableList,
  onEditableListChange,
  onSaveExperience,
}: WorkExperienceSectionProps) {
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const updateEntry = (clientKey: string, field: keyof EditableExperience, value: string) => {
    onEditableListChange(
      editableList.map((entry) =>
        entry.clientKey === clientKey ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addRoleAfter = (index: number) => {
    const blank: EditableExperience = {
      id: null,
      clientKey: `new-${Date.now()}`,
      title: "",
      employer: "",
      city: "",
      state: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    const updated = [...editableList];
    updated.splice(index + 1, 0, blank);
    onEditableListChange(updated);
  };

  const removeEntry = async (entry: EditableExperience) => {
    setDeleteError(null);
    if (entry.id) {
      try {
        const res = await fetch(
          `${API_BASE}/candidates/${candidateId}/experience/${entry.id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Delete failed");
      } catch (err) {
        setDeleteError("Could not delete that entry.");
        return;
      }
    }
    onEditableListChange(editableList.filter((e) => e.clientKey !== entry.clientKey));
  };

  const handleSaveExperience = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      await onSaveExperience();
      setSaveMessage("Experience saved.");
    } catch (err) {
      setSaveMessage("Could not save experience.");
    } finally {
      setSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <section aria-label="Work Experience" className="experience-section">
        <h2>Experience</h2>
        {experiences.length === 0 && <p className="experience-empty">No experience added yet.</p>}
        <div className="experience-list">
          {experiences.map((exp) => (
            <div className="experience-entry" key={exp.id}>
              <div className="experience-entry-title">{exp.title}</div>
              <div className="experience-entry-employer">{exp.employer}</div>
              <div className="experience-entry-meta">
                {[exp.city, exp.state].filter(Boolean).join(", ")}
                {(exp.city || exp.state) && " · "}
                {formatMonthYear(exp.startDate)} – {formatMonthYear(exp.endDate)}
              </div>
              {exp.description && (
                <div className="experience-entry-description">{exp.description}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Edit Work Experience" className="experience-section">
      <h2>Experience</h2>
      {deleteError && (
        <p role="alert" data-testid="experience-delete-error">
          {deleteError}
        </p>
      )}
      <div className="experience-edit-list">
        {editableList.map((entry, index) => (
          <div className="experience-edit-card" key={entry.clientKey}>
            <button
              type="button"
              className="experience-delete-button"
              onClick={() => removeEntry(entry)}
              aria-label="Delete this experience entry"
              data-testid={`delete-experience-${index}`}
            >
              <TrashIcon />
            </button>

            <div>
              <label htmlFor={`title-${entry.clientKey}`}>Title</label>
              <input
                id={`title-${entry.clientKey}`}
                type="text"
                value={entry.title}
                onChange={(e) => updateEntry(entry.clientKey, "title", e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor={`employer-${entry.clientKey}`}>Employer</label>
              <input
                id={`employer-${entry.clientKey}`}
                type="text"
                value={entry.employer}
                onChange={(e) => updateEntry(entry.clientKey, "employer", e.target.value)}
                required
              />
            </div>
            <div className="experience-date-row">
              <div>
                <label htmlFor={`start-${entry.clientKey}`}>From</label>
                <DatePicker
                  id={`start-${entry.clientKey}`}
                  selected={entry.startDate ? new Date(entry.startDate) : null}
                  onChange={(date: Date | null) =>
                    updateEntry(
                      entry.clientKey,
                      "startDate",
                      date ? date.toISOString().slice(0, 10) : ""
                    )
                  }
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Select month"
                  required
                />
              </div>
              <div>
                <label htmlFor={`end-${entry.clientKey}`}>To</label>
                <DatePicker
                  id={`end-${entry.clientKey}`}
                  selected={entry.endDate ? new Date(entry.endDate) : null}
                  onChange={(date: Date | null) =>
                    updateEntry(
                      entry.clientKey,
                      "endDate",
                      date ? date.toISOString().slice(0, 10) : ""
                    )
                  }
                  dateFormat="MMM yyyy"
                  showMonthYearPicker
                  placeholderText="Present"
                  isClearable
                />
                <span className="experience-field-hint">Leave blank if current</span>
              </div>
            </div>
            <div className="experience-date-row">
              <div>
                <label htmlFor={`city-${entry.clientKey}`}>City</label>
                <input
                  id={`city-${entry.clientKey}`}
                  type="text"
                  value={entry.city || ""}
                  onChange={(e) => updateEntry(entry.clientKey, "city", e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`state-${entry.clientKey}`}>State</label>
                <input
                  id={`state-${entry.clientKey}`}
                  type="text"
                  value={entry.state || ""}
                  onChange={(e) => updateEntry(entry.clientKey, "state", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor={`description-${entry.clientKey}`}>Description</label>
              <textarea
                id={`description-${entry.clientKey}`}
                value={entry.description || ""}
                onChange={(e) => updateEntry(entry.clientKey, "description", e.target.value)}
              />
            </div>

            <button
              type="button"
              className="experience-add-button"
              onClick={() => addRoleAfter(index)}
              data-testid={`add-role-after-${index}`}
            >
              + Add Role
            </button>
          </div>
        ))}
        {editableList.length === 0 && (
          <button
            type="button"
            className="experience-add-button"
            onClick={() => addRoleAfter(-1)}
            data-testid="add-first-role"
          >
            + Add Role
          </button>
        )}
      </div>
      <div className="experience-save-row">
        {saveMessage && <span data-testid="experience-save-message">{saveMessage}</span>}
        <button
          type="button"
          className="form-submit-button"
          onClick={handleSaveExperience}
          disabled={saving}
          data-testid="save-experience-button"
        >
          {saving ? "Saving…" : "Save Experience"}
        </button>
      </div>
    </section>
  );
}

export default WorkExperienceSection;