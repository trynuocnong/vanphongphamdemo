import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { registerUser, loginUser, getUsers } from "@/services/userService";
import { useStore } from "@/lib/store";

export default function Login() {
  const [, setLocation] = useLocation();
const { login, user, refetchAll } = useStore();

  const [role, setRole] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

    useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/admin" : "/");
    }
  }, [user, setLocation]);
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
  localStorage.setItem("userRole", user.role);
  toast.success(`Welcome back, ${user.name}!`);

  setTimeout(() => {
    setLocation(user.role === "admin" ? "/admin" : "/");
  }, 0);
}

    } catch {
      toast.error("Server error, please try again");
    }
  };

  // --- REGISTER ---
 const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  // 🧩 Validate trống
  if (!regName.trim() || !regEmail.trim() || !regPass.trim()) {
    toast.error("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  // 🧩 Validate độ dài mật khẩu
  if (regPass.length < 6) {
    toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }

  try {
    // 🔍 Kiểm tra email đã tồn tại
    const users = await getUsers();
    const emailExists = users.some(
      (u: any) => u.email.toLowerCase() === regEmail.toLowerCase()
    );

    if (emailExists) {
      toast.error("Email đã được đăng ký!");
      return;
    }

    // 🧠 Tạo tài khoản mới
    await registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPass,
      role: "user",
    });

    // 🔄 Refetch để store cập nhật danh sách user mới (không cần reload)
    await refetchAll();
    toast.success("Tạo tài khoản thành công! Hãy đăng nhập.");

    // Tự động điền email vào login tab
    setEmail(regEmail);
    setPassword("");

    // Chuyển sang tab Login ngay
    const loginTab = document.querySelector('[data-state="login"]');
    if (loginTab) (loginTab as HTMLElement).click();
  } catch (err) {
    console.error(err);
    toast.error("Đăng ký thất bại, vui lòng thử lại.");
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
