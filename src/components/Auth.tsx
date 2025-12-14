import React, { useState } from "react";
import supabase from "../supabase/client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await supabase.auth.signUp({ email, password });
        if (res.error) {
          setMessage(res.error.message);
        } else {
          setMessage("Signup initiated. Check email for confirmation (if enabled).");
        }
      } else {
        const res = await supabase.auth.signInWithPassword({ email, password });
        if (res.error) {
          setMessage(res.error.message);
        } else {
          setMessage("Signed in successfully.");
        }
      }
    } catch (err: any) {
      setMessage(err.message || String(err));
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-3">{mode === "signup" ? "Sign up" : "Sign in"}</h3>
      {message && <div className="mb-2 text-sm text-gray-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-600">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-xs text-gray-600">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="flex items-center gap-2">
          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <button type="button" className="text-sm text-gray-600" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Have an account? Sign in" : "Need an account? Sign up"}</button>
        </div>
      </form>
    </div>
  );
}
