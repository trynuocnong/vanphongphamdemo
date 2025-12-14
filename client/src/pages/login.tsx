
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const { login, register, resetPassword } = useStore();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, role)) {
      setLocation(role === "admin" ? "/admin" : "/");
    } else {
      toast({ title: "Invalid credentials", description: "Check your email or role selection.", variant: "destructive" });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    register({ name: regName, email: regEmail, password: regPass });
    setRole("user"); // Switch to login tab ideally, but for now just clear
    setEmail(regEmail);
    setPassword(regPass);
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast({ title: "Enter email first", variant: "destructive" });
      return;
    }
    resetPassword(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-[400px]">
        <Tabs defaultValue="login">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-serif text-2xl">Stationery Co.</CardTitle>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                   <Button 
                     type="button" 
                     variant={role === "user" ? "default" : "outline"} 
                     onClick={() => { setRole("user"); setEmail("user@example.com"); }} 
                   >
                     Customer
                   </Button>
                   <Button 
                     type="button" 
                     variant={role === "admin" ? "default" : "outline"} 
                     onClick={() => { setRole("admin"); setEmail("admin@example.com"); }} 
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
                  <div className="flex justify-between items-center">
                    <Label>Password</Label>
                    <span className="text-xs text-primary cursor-pointer hover:underline" onClick={handleForgotPassword}>Forgot password?</span>
                  </div>
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
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" placeholder="name@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input className="pl-9" type="password" value={regPass} onChange={e => setRegPass(e.target.value)} required />
                  </div>
                </div>

                <Button type="submit" className="w-full h-10 mt-2">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
