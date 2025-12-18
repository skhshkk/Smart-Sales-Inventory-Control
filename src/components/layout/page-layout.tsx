import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden selection:bg-accent/30 selection:text-white font-sans">
      
      {/* --- Ambient Background System --- */}
      
      {/* Layer 1: Base Ambient Gradient */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900/20 via-background to-background pointer-events-none" />

      {/* Layer 2: Noise Texture (Optimized) */}
      <div className="fixed inset-0 z-0 bg-noise opacity-[0.02] pointer-events-none" />

      {/* Layer 3: Animated Glowing Blobs (Optimized) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Primary Accent Blob */}
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-[80px] animate-blob will-change-transform" />
        
        {/* Secondary Blob */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[400px] bg-purple-500/5 rounded-full blur-[60px] animate-blob animation-delay-2000 will-change-transform" />
      </div>

      {/* Layer 4: Grid Overlay (Subtle Tech Feel) */}
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] pointer-events-none" /> 
      {/* (Using a noise svg placeholder or similar if standard pattern texturing is needed, 
           but for grid we can use css gradients) */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* --- Content --- */}
      <main className={cn("relative z-10 w-full h-full flex flex-col", className)}>
        {children}
      </main>
    </div>
  );
}
