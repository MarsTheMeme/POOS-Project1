import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { loginSchema, type LoginRequest, type LoginResponse } from "@shared/schema";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { user, login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Add delay to ensure cookies are properly read
    const timer = setTimeout(() => {
      if (user && !authLoading) {
        console.log("User detected, navigating to contacts:", user);
        navigate("/contacts");
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [user, authLoading, navigate]);

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await api.login(data);
      
      if (response.id > 0) {
        login({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
        });
        // Don't navigate here - let the useEffect handle it
        toast({
          title: "NEURAL LINK ESTABLISHED",
          description: `Welcome to the grid, ${response.firstName}`,
        });
      } else {
        toast({
          title: "ACCESS DENIED",
          description: response.error || "Invalid neural ID or access code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "CONNECTION ERROR",
        description: "Failed to connect to neural grid",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2 glitch neon-glow font-mono"
            data-text="CYBERCONTACTS"
          >
            CYBERCONTACTS
          </h1>
          <h2 className="text-2xl font-semibold text-secondary mb-4 font-mono">2077</h2>
          <p className="text-muted-foreground text-sm">NEURAL LINK DIRECTORY SYSTEM</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 neon-border"></div>
        </div>

        {/* Login Form */}
        <div className="bg-card neon-border rounded-lg p-8 hologram-effect scan-line">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-center mb-2 font-mono">ACCESS TERMINAL</h3>
            <p className="text-muted-foreground text-center text-sm">Authenticate Neural Interface</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <i className="fas fa-user mr-2 text-primary"></i>USER ID
              </label>
              <CyberInput
                {...register("login")}
                placeholder="Enter neural ID..."
                data-testid="input-login"
                disabled={isLoading}
              />
              {errors.login && (
                <p className="text-destructive text-sm mt-1 font-mono">{errors.login.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <i className="fas fa-lock mr-2 text-primary"></i>ACCESS CODE
              </label>
              <CyberInput
                {...register("password")}
                type="password"
                placeholder="Enter access code..."
                data-testid="input-password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-destructive text-sm mt-1 font-mono">{errors.password.message}</p>
              )}
            </div>

            <CyberButton
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  CONNECTING...
                </div>
              ) : (
                <>
                  <i className="fas fa-plug mr-2"></i>CONNECT TO GRID
                </>
              )}
            </CyberButton>
          </form>

          {/* Status Indicators */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span><i className="fas fa-circle text-green-400 mr-1"></i>GRID: ONLINE</span>
              <span><i className="fas fa-circle text-primary mr-1"></i>ENCRYPTION: ACTIVE</span>
              <span><i className="fas fa-circle text-yellow-400 mr-1"></i>LATENCY: 12ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
