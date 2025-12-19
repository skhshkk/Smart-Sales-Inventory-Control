import { supabase } from '../config/supabase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = user;

    // Optional: Fetch user role from 'users' table if needed for role-based logic here
    // For now, we assume role might be in user_metadata or fetched separately
    // Let's fetch the role from our public.users table or metadata
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData) {
      req.user.role = userData.role;
    } else {
        // Fallback: User might be missing in public.users (Trigger missed?)
        // Attempt to self-heal
        try {
            await supabase.from('users').upsert({
                id: user.id,
                email: user.email || '',
                role: 'cashier'
            });
            console.log(`Self-healed missing public.user for ${user.id}`);
        } catch (syncError) {
            console.warn('Failed to self-heal public user:', syncError);
        }
        req.user.role = 'cashier';
    }

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};
