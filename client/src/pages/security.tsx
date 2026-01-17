import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Shield,
    Key,
    Smartphone,
    History,
    Monitor,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    MapPin,
    Clock,
    Trash2,
    Lock,
    Bell,
    Mail,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

function PasswordStrengthMeter({ password }: { password: string }) {
    const getStrength = () => {
        if (!password) return { strength: 0, label: "No password", color: "bg-gray-300" };
        if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" };
        if (password.length < 10) return { strength: 50, label: "Fair", color: "bg-yellow-500" };
        if (password.length < 14) return { strength: 75, label: "Good", color: "bg-blue-500" };
        return { strength: 100, label: "Strong", color: "bg-green-500" };
    };

    const { strength, label, color } = getStrength();

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Password Strength</span>
                <span className="font-medium">{label}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} transition-all duration-300`}
                    style={{ width: `${strength}%` }}
                />
            </div>
        </div>
    );
}

export default function Security() {
    const { user } = useStore();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
    const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications || true);
    const [smsNotifications, setSmsNotifications] = useState(user?.smsNotifications || false);
    const [showQRDialog, setShowQRDialog] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    // Real data from API
    const [loginHistory, setLoginHistory] = useState<any[]>([]);
    const [activeSessions, setActiveSessions] = useState<any[]>([]);

    // Fetch real data from API
    useEffect(() => {
        const fetchSecurityData = async () => {
            if (!user) return;

            try {
                // Fetch login history for this user
                const loginRes = await fetch(`http://localhost:3001/loginHistory?userId=${user.id}&_sort=timestamp&_order=desc&_limit=10`);
                const loginData = await loginRes.json();
                setLoginHistory(loginData.map((log: any) => ({
                    ...log,
                    timestamp: new Date(log.timestamp),
                })));

                // Fetch active sessions for this user
                const sessionsRes = await fetch(`http://localhost:3001/activeSessions?userId=${user.id}&_sort=lastActive&_order=desc`);
                const sessionsData = await sessionsRes.json();
                setActiveSessions(sessionsData.map((session: any) => ({
                    ...session,
                    lastActive: new Date(session.lastActive),
                    createdAt: new Date(session.createdAt),
                })));
            } catch (error) {
                console.error("Error fetching security data:", error);
            }
        };

        fetchSecurityData();
    }, [user]);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Please log in to view security settings</p>
            </div>
        );
    }

    const handleToggle2FA = () => {
        if (!twoFactorEnabled) {
            setShowQRDialog(true);
        } else {
            setTwoFactorEnabled(false);
            toast.success("Two-factor authentication disabled");
        }
    };

    const handleEnable2FA = () => {
        setTwoFactorEnabled(true);
        setShowQRDialog(false);
        toast.success("Two-factor authentication enabled!");
    };

    const handleChangePassword = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            toast.error("Passwords do not match");
            return;
        }
        if (passwordForm.new.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            // Verify current password
            if (passwordForm.current !== user?.password) {
                toast.error("Current password is incorrect");
                return;
            }

            // Update password in mock API
            const response = await fetch(`http://localhost:3001/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password: passwordForm.new,
                }),
            });

            if (response.ok) {
                toast.success("Password changed successfully!");
                setShowPasswordDialog(false);
                setPasswordForm({ current: "", new: "", confirm: "" });
            } else {
                toast.error("Failed to change password");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("Failed to change password");
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        try {
            const response = await fetch(`http://localhost:3001/activeSessions/${sessionId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Remove from state
                setActiveSessions(activeSessions.filter((s) => s.id !== sessionId));
                toast.success("Session revoked successfully");
            } else {
                toast.error("Failed to revoke session");
            }
        } catch (error) {
            console.error("Error revoking session:", error);
            toast.error("Failed to revoke session");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8 space-y-2">
                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Security Settings
                </h1>
                <p className="text-muted-foreground">Manage your account security and privacy</p>
            </div>

            <div className="space-y-6">
                {/* Security Overview */}
                <Card className="border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-green-600" />
                            Security Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                                {twoFactorEnabled ? (
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                ) : (
                                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                                )}
                                <div>
                                    <p className="font-semibold">2FA</p>
                                    <p className="text-sm text-muted-foreground">
                                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="font-semibold">Password</p>
                                    <p className="text-sm text-muted-foreground">Strong</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                                <Monitor className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="font-semibold">Active Sessions</p>
                                    <p className="text-sm text-muted-foreground">{activeSessions.length} devices</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Authentication Settings */}
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Authentication
                        </CardTitle>
                        <CardDescription>Manage your login credentials and security methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Password */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Lock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">Password</p>
                                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                                </div>
                            </div>
                            <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Monitor className="h-5 w-5" />
                            Active Sessions
                        </CardTitle>
                        <CardDescription>Manage devices that are currently logged in</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {activeSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Monitor className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{session.device}</p>
                                                {session.isCurrent && (
                                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {session.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(session.lastActive, "MMM dd, HH:mm")}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">IP: {session.ipAddress}</p>
                                        </div>
                                    </div>
                                    {!session.isCurrent && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRevokeSession(session.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Revoke
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Login History */}
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Login History
                        </CardTitle>
                        <CardDescription>Recent login attempts to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Device</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loginHistory.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>
                                            {log.status === "success" ? (
                                                <Badge className="bg-green-500/10 text-green-700 border-green-500/20 flex items-center gap-1 w-fit">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Success
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                    <XCircle className="h-3 w-3" />
                                                    Failed
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                                {log.device}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                {log.location}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                                        <TableCell>{format(log.timestamp, "MMM dd, yyyy HH:mm")}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* 2FA Setup Dialog */}
            <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center p-8 bg-muted rounded-lg">
                            <div className="h-48 w-48 bg-white flex items-center justify-center rounded-lg border-2 border-primary">
                                <p className="text-sm text-muted-foreground text-center px-4">
                                    QR Code Placeholder<br />
                                    <span className="text-xs">(In production, show actual QR code)</span>
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Enter verification code</Label>
                            <Input placeholder="000000" maxLength={6} className="text-center text-2xl tracking-widest" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQRDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEnable2FA}>
                            Verify & Enable
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Change Password Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Choose a strong password to keep your account secure
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={passwordForm.current}
                                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={passwordForm.new}
                                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                            />
                            <PasswordStrengthMeter password={passwordForm.new} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                value={passwordForm.confirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleChangePassword}>
                            Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
