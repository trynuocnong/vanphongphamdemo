
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail } from "lucide-react";

export default function Login() {
  const { login } = useStore();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, role)) {
      setLocation(role === "admin" ? "/admin" : "/");
    } else {
      toast({ title: "Invalid credentials", description: "Check your email or role selection.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
               <Button 
                 type="button" 
                 variant={role === "user" ? "default" : "outline"} 
                 onClick={() => { setRole("user"); setEmail("user@example.com"); }} // prefill for demo
               >
                 Customer
               </Button>
               <Button 
                 type="button" 
                 variant={role === "admin" ? "default" : "outline"} 
                 onClick={() => { setRole("admin"); setEmail("admin@example.com"); }} // prefill for demo
               >
                 Admin
               </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 mt-2">
              Login
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo Credentials:<br/>
              User: user@example.com / password123<br/>
              Admin: admin@example.com / adminpassword
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
