import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Ticket, Search, Award, Check, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Voucher {
    id: string;
    code: string;
    discount: number;
    minSpend: number;
    pointCost: number;
    description: string;
    detailedConditions: string;
}

export default function VoucherCenter() {
    const { user, vouchers } = useStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Please log in to collect vouchers</p>
            </div>
        );
    }

    // Filter vouchers
    const availableVouchers = vouchers.filter(
        (v) => !user.vouchers?.includes(v.id)
    );
    const myVouchers = vouchers.filter((v) => user.vouchers?.includes(v.id));

    const filteredVouchers = (
        selectedTab === "all" ? availableVouchers : myVouchers
    ).filter(
        (v) =>
            v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCollectVoucher = async (voucher: Voucher) => {
        try {
            // Check if user has enough points
            if (voucher.pointCost > 0 && (user.points || 0) < voucher.pointCost) {
                toast.error(`You need ${voucher.pointCost} points to redeem this voucher`);
                return;
            }

            // Add voucher to user's collection
            const updatedVouchers = [...(user.vouchers || []), voucher.id];
            const updatedPoints =
                voucher.pointCost > 0 ? (user.points || 0) - voucher.pointCost : user.points;

            const response = await fetch(`http://localhost:3001/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    vouchers: updatedVouchers,
                    points: updatedPoints,
                }),
            });

            if (response.ok) {
                toast.success(
                    voucher.pointCost > 0
                        ? `Voucher collected! Used ${voucher.pointCost} points`
                        : "Voucher collected successfully!"
                );
                // Reload to update data
                setTimeout(() => window.location.reload(), 1000);
            } else {
                toast.error("Failed to collect voucher");
            }
        } catch (error) {
            console.error("Error collecting voucher:", error);
            toast.error("Error collecting voucher");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Voucher Center
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Collect vouchers and save on your orders
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Your Points</p>
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-amber-500" />
                                <p className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                                    {user.points?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search vouchers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <div className="flex items-center gap-2 py-2">
                            <Ticket className="h-4 w-4" />
                            <span>Available ({availableVouchers.length})</span>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="my"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                        <div className="flex items-center gap-2 py-2">
                            <Check className="h-4 w-4" />
                            <span>My Vouchers ({myVouchers.length})</span>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-4">
                    {filteredVouchers.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Ticket className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No vouchers found</h3>
                                <p className="text-muted-foreground text-center">
                                    {selectedTab === "all"
                                        ? "Check back later for new vouchers"
                                        : "Start collecting vouchers to save on your orders"}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {filteredVouchers.map((voucher) => {
                                const isCollected = user.vouchers?.includes(voucher.id);
                                const canAfford = (user.points || 0) >= voucher.pointCost;

                                return (
                                    <Card
                                        key={voucher.id}
                                        className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-gray-50/50"
                                    >
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-purple-600/10 rounded-full blur-3xl -z-10" />

                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                                                        <Ticket className="h-6 w-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-xl">{voucher.code}</CardTitle>
                                                        <CardDescription>{voucher.description}</CardDescription>
                                                    </div>
                                                </div>
                                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 border-none">
                                                    {voucher.discount.toLocaleString()}đ OFF
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="space-y-2 text-sm text-muted-foreground">
                                                <p>• Min spend: {voucher.minSpend.toLocaleString()}đ</p>
                                                {voucher.pointCost > 0 && (
                                                    <p className="flex items-center gap-1">
                                                        • Redeem cost:
                                                        <span
                                                            className={`font-semibold ${canAfford ? "text-amber-600" : "text-red-600"
                                                                }`}
                                                        >
                                                            {voucher.pointCost.toLocaleString()} points
                                                        </span>
                                                    </p>
                                                )}
                                                <p className="text-xs italic pt-1">{voucher.detailedConditions}</p>
                                            </div>

                                            {isCollected ? (
                                                <Button
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                    disabled
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Collected
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="w-full group-hover:scale-105 transition-transform"
                                                    onClick={() => handleCollectVoucher(voucher)}
                                                    disabled={voucher.pointCost > 0 && !canAfford}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    {voucher.pointCost > 0
                                                        ? `Collect (${voucher.pointCost} pts)`
                                                        : "Collect Voucher"}
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
