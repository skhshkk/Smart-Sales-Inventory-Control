import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageLayout } from '@/components/layout/page-layout';
import { 
  ShoppingCart, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3,
  Lock,
  ArrowRight,
  Store,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/* --- Slides as Subcomponents --- */

const HeroSlide = () => {
    const navigate = useNavigate();
    return (
      <section className="w-full h-full flex flex-col justify-center items-center text-center relative px-6 z-10">
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-8 animate-fade-in-up">

            {/* Headline with Gradient */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight md:leading-none">
                <span className="bg-gradient-to-b from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                  Smart Sales & 
                </span>
                <br />
                <span className="bg-gradient-to-r from-[#5E6AD2] via-indigo-300 to-[#5E6AD2] bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
                   Inventory Control
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the precision of a premium POS system. Track products, manage staff, and analyze growth with zero latency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                {/* Cashier Login */}
                <Button 
                    variant="default"
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="shadow-[0_0_20px_rgba(94,106,210,0.3)]"
                >
                    Sign in as Cashier
                </Button>

                {/* View Demo */}
                <Button 
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate('/demo')} 
                    className="group"
                >
                    View Demo <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
      </section>
    );
};

const ValuePropsSection = () => (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-8 animate-fade-in z-10">
    <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-2">Why RetailPro?</h2>
            <p className="text-muted-foreground">Precision tools for modern retail.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
                { icon: <Zap size={20} />, title: "Real-time Tracking", desc: "Instantly track product movement and stock levels." },
                { icon: <ShoppingCart size={20} />, title: "Faster Checkout", desc: "Streamlined cashier mode for rapid billing." },
                { icon: <ShieldCheck size={20} />, title: "Role-Based Access", desc: "Secure permissions for every staff member." },
                { icon: <BarChart3 size={20} />, title: "Sales Insights", desc: "Daily & monthly reports to track growth." },
                { icon: <Users size={20} />, title: "Staff Management", desc: "Control who accesses sensitive business data." },
                { icon: <TrendingUp size={20} />, title: "Reduced Errors", desc: "Automated calculations eliminate manual mistakes." }
            ].map((item, idx) => (
                <Card key={idx} className="group hover:-translate-y-1">
                    <CardContent className="p-6">
                        <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 border border-accent/20 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
    </div>
);

const RolesSection = () => (
    <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-8 animate-fade-in z-10">
    <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent pb-2">Built for Every Role</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Simple for staff, powerful for owners.
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
            {/* Cashier Card */}
            <Card className="relative overflow-hidden border-green-500/20 bg-gradient-to-br from-green-500/[0.02] to-transparent min-h-[320px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <ShoppingCart size={140} />
                </div>
                <CardContent className="p-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm font-mono font-bold mb-8 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                        <Users size={16} /> CASHIER
                    </div>
                    <ul className="space-y-6 text-lg text-gray-300 font-medium">
                        <li className="flex items-center gap-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Fast billing interface
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> Simple POS screen
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Owner Card */}
            <Card className="relative overflow-hidden border-accent/20 bg-gradient-to-br from-accent/[0.05] to-transparent min-h-[320px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-accent">
                    <BarChart3 size={140} />
                </div>
                <CardContent className="p-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-mono font-bold mb-8 border border-accent/20 shadow-[0_0_10px_rgba(94,106,210,0.2)]">
                        <Store size={16} /> OWNER (ADMIN)
                    </div>
                    <ul className="space-y-6 text-lg text-gray-300 font-medium">
                        <li className="flex items-center gap-4">
                            <span className="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(94,106,210,0.8)]"></span> Sales & inventory dashboard
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="w-2 h-2 bg-accent rounded-full shadow-[0_0_8px_rgba(94,106,210,0.8)]"></span> Staff management & Analysis
                        </li>
                    </ul>
                </CardContent>
            </Card>

        </div>
    </div>
    </div>
);

const GrowthSection = () => {
    const navigate = useNavigate();
    return (
      <div className="w-full h-full flex flex-col justify-center items-center p-6 md:p-8 text-center animate-fade-in z-10 relative">
        <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
                <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                    Ready to scale?
                </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
                Join thousands of shops using RetailPro to modernize their workflow.
            </p>
            <Button 
                size="lg"
                className="h-14 px-10 text-lg rounded-full shadow-[0_0_30px_rgba(94,106,210,0.4)] hover:shadow-[0_0_50px_rgba(94,106,210,0.6)] transition-all duration-500"
                onClick={() => navigate('/login')}
            >
                Get Started Now
            </Button>
        </div>
      </div>
    );
};

const slides = [HeroSlide, ValuePropsSection, RolesSection, GrowthSection];

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <PageLayout className="overflow-hidden h-screen flex flex-col">
      
      {/* Slider Section */}
      <div className="flex-1 relative flex flex-col z-10">
        
        {/* Navigation Arrows */}
        <button 
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/[0.05] border border-white/10 backdrop-blur-md hover:bg-white/[0.1] text-white/50 hover:text-white rounded-full transition-all duration-300 group"
            aria-label="Previous Slide"
        >
            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button 
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/[0.05] border border-white/10 backdrop-blur-md hover:bg-white/[0.1] text-white/50 hover:text-white rounded-full transition-all duration-300 group"
            aria-label="Next Slide"
        >
            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Slide Content */}
        <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
             <CurrentSlideComponent />
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-12 left-0 w-full flex justify-center gap-3 pb-5 shrink-0 pointer-events-none z-30">
            <div className="pointer-events-auto flex gap-3 p-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/[0.05]">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                            currentSlide === idx ? 'w-8 bg-accent shadow-[0_0_10px_rgba(94,106,210,0.5)]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
        
        {/* Footer (Static Bottom) */}
        <div className="border-t border-white/[0.06] py-3 text-center shrink-0 text-xs text-muted-foreground z-50 relative bg-background/50 backdrop-blur-lg">
            <div className="flex items-center justify-center gap-1.5 opacity-60">
                <Lock size={10} />
                <span>Secured by Linear Auth</span>
            </div>
        </div>
      </div>
    
    </PageLayout>
  );
}
