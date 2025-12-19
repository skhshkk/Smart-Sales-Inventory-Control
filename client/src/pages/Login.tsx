import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/page-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Store, ArrowLeft, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <PageLayout className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-white/10 shadow-2xl bg-black/40">
        <CardHeader className="text-center space-y-4 pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent mb-2 ring-1 ring-accent/30 shadow-[0_0_15px_rgba(94,106,210,0.3)]">
                <Store size={24} />
            </div>
            <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription className="text-base">
                    Enter your credentials to access the terminal.
                </CardDescription>
            </div>
        </CardHeader>

        <CardContent className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    {error}
                </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Email</label>
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        required
                        className="bg-black/20"
                    />
                </div>
                <div className="space-y-2">
                     <label className="text-xs font-medium text-muted-foreground ml-1 uppercase tracking-wider">Password</label>
                    <Input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="bg-black/20"
                    />
                </div>
                
                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full h-11 text-base shadow-[0_0_20px_rgba(94,106,210,0.2)]"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </Button>
                </div>
            </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 text-center border-t border-white/5 pt-6 mt-2 bg-white/[0.01]">
            <p className="text-sm text-muted-foreground">
                Don't have an account? <Link to="/signup" className="font-medium text-accent hover:text-accent/80 hover:underline transition-colors underline-offset-4">Create account</Link>
            </p>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
        </CardFooter>
      </Card>
      
      <div className="fixed bottom-6 text-center text-[10px] text-muted-foreground/50 flex items-center gap-1.5">
        <Lock size={8} /> Secured by Linear Auth
      </div>
    </PageLayout>
  );
}
