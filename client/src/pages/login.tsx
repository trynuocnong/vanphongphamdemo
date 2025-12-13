
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Login() {
  const { login } = useStore();
  const [_, setLocation] = useLocation();

  const handleLogin = (role: "user" | "admin") => {
    login(role);
    setLocation(role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full h-12" onClick={() => handleLogin("user")}>
            Login as Customer
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => handleLogin("admin")}>
            Login as Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
