import { useEffect, useState } from "react";
import type { UserPrefs } from "../../../common/types";

type Props = {
  value: UserPrefs;
  onChange: (next: UserPrefs) => void;
};

const LS_KEY = "aiwx_prefs";

export default function PrefsForm({ value, onChange }: Props) {
  const [likes, setLikes] = useState((value.likes || []).join(", "));
  const [dislikes, setDislikes] = useState((value.dislikes || []).join(", "));
  const [gear, setGear] = useState((value.gear || []).join(", "));

  // load once
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        onChange(JSON.parse(raw));
      } catch {
        // Error parsing prefs; ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(value));
  }, [value]);

  const setField = <K extends keyof UserPrefs>(k: K, v: UserPrefs[K]) => {
    onChange({ ...value, [k]: v });
  };

  return (
    <div className="card">
      <h3>Your preferences</h3>

      <div className="grid2">
        <label>
          Diet
          <select value={value.diet || ""} onChange={(e) => setField("diet", e.target.value as UserPrefs["diet"])}>
            <option value="">—</option>
            <option value="veg">veg</option>
            <option value="non-veg">non-veg</option>
            <option value="vegan">vegan</option>
            <option value="egg">egg</option>
            <option value="custom">custom</option>
          </select>
        </label>

        <label>
          Budget
          <select value={value.budget || ""} onChange={(e) => setField("budget", e.target.value as UserPrefs["budget"])}>
            <option value="">—</option>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </label>

        <label>
          Style
          <select value={value.style || ""} onChange={(e) => setField("style", e.target.value as UserPrefs["style"])}>
            <option value="">—</option>
            <option value="casual">casual</option>
            <option value="sporty">sporty</option>
            <option value="smart-casual">smart-casual</option>
            <option value="formal">formal</option>
          </select>
        </label>

        <label>
          Likes (comma-separated)
          <input
            value={likes}
            onChange={(e) => {
              setLikes(e.target.value);
              setField("likes", splitComma(e.target.value));
            }}
            placeholder="coffee, long walks, museums"
          />
        </label>

        <label>
          Dislikes (comma-separated)
          <input
            value={dislikes}
            onChange={(e) => {
              setDislikes(e.target.value);
              setField("dislikes", splitComma(e.target.value));
            }}
            placeholder="crowds, seafood"
          />
        </label>

        <label>
          Gear you own (comma-separated)
          <input
            value={gear}
            onChange={(e) => {
              setGear(e.target.value);
              setField("gear", splitComma(e.target.value));
            }}
            placeholder="umbrella, sneakers, raincoat"
          />
        </label>
      </div>
    </div>
  );
}

function splitComma(s: string) {
  return s
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
}
