import { supabase } from '../config/supabase.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const { user, session } = data;
    
    // Fetch role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    // Return session and role
    res.json({
        user: {
            ...user,
            role: userData?.role || 'cashier'
        },
        session
    });

  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const getMe = async (req, res) => {
  // req.user is populated by middleware
  res.json({ user: req.user });
};

export const registerProfile = async (req, res) => {
  try {
      const { id, email } = req.user;
      // Upsert into public.users to ensure it exists
      const { error } = await supabase
          .from('users')
          .upsert({ id, email, role: 'cashier' })
          .select();
      
      if (error) throw error;
      res.json({ message: 'Profile synced' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to sync profile' });
  }
};
