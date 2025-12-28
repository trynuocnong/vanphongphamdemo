import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState } from "react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser, loginUser } from "@/services/userService";
import { useStore } from "@/lib/store";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useStore();

  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);

      if (!user) {
        toast.error("Invalid email or password");
        return;
      }

      // Check role matches
      if (user.role !== role) {
        toast.error(`This account is not a ${role} account`);
        return;
      }

      // Use store's login function to update state
      const success = login(user.email, user.role);

      if (success) {
        toast.success(`Welcome back, ${user.name}!`);
        // Small delay to ensure state is updated before navigation
        setTimeout(() => {
          setLocation(user.role === "admin" ? "/admin" : "/");
        }, 100);
      }
    } catch {
      toast.error("Server error, please try again");
    }
  };

  // --- REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        name: regName,
        email: regEmail,
        password: regPass,
        role: "user",
      });

      toast.success("Account created successfully! You can now login.");

      setEmail(regEmail);
      setPassword("");
    } catch {
      toast.error("Registration failed, please try again");
    }
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
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={role === "user" ? "default" : "outline"}
                    onClick={() => setRole("user")}
                  >
                    Customer
                  </Button>
                  <Button
                    type="button"
                    variant={role === "admin" ? "default" : "outline"}
                    onClick={() => setRole("admin")}
                  >
                    Admin
                  </Button>
                </div>

                <Label>Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} />

                <Label>Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <Label>Full Name</Label>
                <Input value={regName} onChange={e => setRegName(e.target.value)} />

                <Label>Email</Label>
                <Input value={regEmail} onChange={e => setRegEmail(e.target.value)} />

                <Label>Password</Label>
                <Input type="password" value={regPass} onChange={e => setRegPass(e.target.value)} />

                <Button type="submit" className="w-full">
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
