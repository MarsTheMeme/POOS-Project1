import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
import { signupSchema, type SignupRequest, type SignupResponse } from "@shared/schema";
import { CyberButton } from "@/components/ui/cyber-button";
import { CyberInput } from "@/components/ui/cyber-input";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export default function SignupPage() {
  const [, navigate] = useLocation();
  const { user, login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    // Add delay to ensure cookies are properly read
    const timer = setTimeout(() => {
      if (user && !authLoading) {
        console.log("User already logged in, redirecting to contacts:", user);
        navigate("/contacts");
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [user, authLoading, navigate]);

  const onSubmit = async (data: SignupRequest) => {
    setIsLoading(true);
    try {
      const response: SignupResponse = await api.signup(data);
      
      if (response.id > 0) {
        // Auto-login after successful signup
        login({
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
        });
        toast({
          title: "NEURAL LINK CREATED",
          description: `Welcome to the grid, ${response.firstName}! Your neural ID has been registered.`,
        });
        navigate("/contacts");
      } else {
        toast({
          title: "REGISTRATION FAILED",
          description: response.error || "Failed to create neural link",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "CONNECTION ERROR",
        description: "Failed to connect to neural registration server",
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
            data-text="NEURAL REGISTRY"
          >
            NEURAL REGISTRY
          </h1>
          <h2 className="text-2xl font-semibold text-secondary mb-4 font-mono">2077</h2>
          <p className="text-muted-foreground text-sm">CREATE NEW NEURAL ID</p>
          <div className="w-20 h-1 bg-primary mx-auto mt-4 neon-border"></div>
        </div>

        {/* Signup Form */}
        <div className="bg-card neon-border rounded-lg p-8 hologram-effect scan-line">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-primary font-mono">
              <i className="fas fa-user-plus mr-2"></i>NEURAL REGISTRATION
            </h3>
            <p className="text-muted-foreground text-sm">
              Register your consciousness with the neural grid
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <i className="fas fa-user mr-2 text-primary"></i>FIRST NAME
                </label>
                <CyberInput
                  {...register("firstName")}
                  placeholder="Enter first name..."
                  data-testid="input-firstName"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-destructive text-sm mt-1 font-mono">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  <i className="fas fa-user mr-2 text-primary"></i>LAST NAME
                </label>
                <CyberInput
                  {...register("lastName")}
                  placeholder="Enter last name..."
                  data-testid="input-lastName"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-destructive text-sm mt-1 font-mono">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                <i className="fas fa-id-card mr-2 text-primary"></i>NEURAL ID
              </label>
              <CyberInput
                {...register("login")}
                placeholder="Choose unique neural ID..."
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
                placeholder="Create access code..."
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
              data-testid="button-signup"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  CREATING NEURAL LINK...
                </div>
              ) : (
                <>
                  <i className="fas fa-brain mr-2"></i>CREATE NEURAL ID
                </>
              )}
            </CyberButton>
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-4 border-t border-border text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Already registered in the neural grid?
            </p>
            <CyberButton
              variant="secondary"
              onClick={() => navigate("/")}
              className="w-full"
              data-testid="button-login-link"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>ACCESS EXISTING NEURAL LINK
            </CyberButton>
          </div>

          {/* Status Indicators */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span><i className="fas fa-circle text-green-400 mr-1"></i>REGISTRY: ONLINE</span>
              <span><i className="fas fa-circle text-primary mr-1"></i>ENCRYPTION: ACTIVE</span>
              <span><i className="fas fa-circle text-yellow-400 mr-1"></i>SECURITY: HIGH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}