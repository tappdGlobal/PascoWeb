import React, { useEffect, useState } from "react";
import supabase from "../supabase/client";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = (sessionData as any)?.session;
        if (!session) return;
        const u = session.user;
        if (!mounted) return;
        setUser(u);
        // load profile
        const { data, error } = await supabase.from('profiles').select('*').eq('id', u.id).single();
        if (error) {
          // no profile yet
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function createProfile() {
    if (!user) return;
    setLoading(true);
    try {
      const payload = { id: user.id, email: user.email, full_name: user.user_metadata?.full_name ?? null, created_at: new Date().toISOString() };
      const { error } = await supabase.from('profiles').upsert([payload]);
      if (error) throw error;
      setProfile(payload);
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  }

  if (!user) return <div className="p-4">Not signed in.</div>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-2">Profile</h3>
      <div className="text-sm text-gray-700 mb-2">Email: {user.email}</div>
      {profile ? (
        <div className="text-sm">Name: {profile.full_name ?? '-'}</div>
      ) : (
        <div>
          <div className="text-sm text-gray-600 mb-2">No profile found. Create one:</div>
          <button onClick={createProfile} className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>Create Profile</button>
        </div>
      )}
    </div>
  );
}
