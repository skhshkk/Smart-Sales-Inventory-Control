import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase client (frontend)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Note: In a real app we'd handle missing env vars better. 
// For now we assume they are provided or we handle errors.
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

interface AuthContextType {
  user: any;
  session: any;
  role: string | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signUp: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if(session?.user) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if(session?.user) fetchRole(session.user.id);
      else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    // In a real app with proper RLS, we might need a public profile table or custom claim
    // For this demo, we can just assume a metadata or default role, or fetch from our API if we have access.
    // Frontend fetching 'users' table requires RLS setup. We set 'public read' on users table in schema.sql.
    const { data } = await supabase.from('users').select('role').eq('id', userId).single();
    if (data) setRole(data.role);
    setLoading(false);
  };

  const signIn = async (email: string, pass: string) => {
      // Use backend auth endpoint if we want custom logic, OR direct Supabase auth
      // Requirement "Authentication (Supabase)... Email + password login"
      // We can do direct Supabase Client auth
      return supabase.auth.signInWithPassword({ email, password: pass });
  };

  const signUp = async (email: string, pass: string) => {
      // Defaulting to 'cashier' role in metadata for this demo
      return supabase.auth.signUp({
          email,
          password: pass,
          options: {
              data: { role: 'cashier' },
          },
      });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
