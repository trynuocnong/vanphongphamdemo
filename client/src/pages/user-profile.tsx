import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    User,
    MapPin,
    Ticket,
    Award,
    Edit3,
    Plus,
    Trash2,
    Camera,
    Mail,
    Phone,
    Calendar,
    TrendingUp,
    Package,
    DollarSign,
    Heart,
    ShoppingBag,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

function AddressCard({ address, onEdit, onDelete, isDefault }: {
    address: any;
    onEdit: () => void;
    onDelete: () => void;
    isDefault?: boolean;
}) {
    return (
        <Card className={`group relative transition-all duration-300 hover:shadow-lg ${isDefault ? "border-primary border-2" : ""
            }`}>
            {isDefault && (
                <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 border-none">Default</Badge>
                </div>
            )}
            <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                        <p className="font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            {address.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.phone}</p>
                        <p className="text-sm">{address.address}</p>
                        <p className="text-sm text-muted-foreground">
                            {address.city}, {address.postalCode}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                    </Button>
                    {!isDefault && (
                        <Button variant="outline" size="sm" onClick={onDelete} className="flex-1 text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function VoucherCard({ voucher }: { voucher: any }) {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-primary/5 to-purple-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-full blur-3xl -z-10" />
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                            <Ticket className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-lg">{voucher.code}</p>
                            <p className="text-xs text-muted-foreground">{voucher.description}</p>
                        </div>
                    </div>
                    <Badge variant="secondary">{voucher.discount.toLocaleString()}đ OFF</Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Min spend: {voucher.minSpend.toLocaleString()}đ</p>
                    {voucher.pointCost > 0 && (
                        <p>• Cost: {voucher.pointCost.toLocaleString()} points</p>
                    )}
                    <p className="text-xs pt-1 italic">{voucher.detailedConditions}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function UserProfile() {
    const { user, vouchers, orders, wishlist, toggleWishlist, products } = useStore();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedUser, setEditedUser] = useState(user);

    // Sync editedUser with user when user data loads
    useEffect(() => {
        if (user) {
            setEditedUser(user);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground">Please log in to view your profile</p>
            </div>
        );
    }

    // Sample addresses (in real app, would come from API)
    const addresses = [
        {
            id: "addr1",
            name: user.name,
            phone: user.phone || "0987823027",
            address: user.address || "185/94/2C, KP Tay B",
            city: "Bình Dương",
            postalCode: "75000",
            isDefault: true,
        },
    ];

    // User vouchers
    const userVouchers = vouchers.filter((v) => user.vouchers?.includes(v.id));

    // User statistics
    const userOrders = orders.filter((o) => o.userId === user.id);
    const stats = {
        totalOrders: userOrders.length,
        completedOrders: userOrders.filter((o) => o.status === "completed").length,
        totalSpent: userOrders
            .filter((o) => o.status === "completed")
            .reduce((sum, o) => sum + o.total, 0),
    };

    const handleSaveProfile = async () => {
        try {
            // Update user in mock API
            const response = await fetch(`http://localhost:3001/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: editedUser?.name,
                    phone: editedUser?.phone,
                    city: editedUser?.city,
                    bio: editedUser?.bio,
                }),
            });

            if (response.ok) {
                // Update local store
                const updatedUser = await response.json();
                // Refresh user data in store
                window.location.reload(); // Simple reload to fetch fresh data
                toast.success("Profile updated successfully!");
                setIsEditingProfile(false);
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header with Avatar */}
            <div className="mb-8">
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-pink-500/5">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Avatar */}
                            <div className="relative group cursor-pointer">
                                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="h-8 w-8 text-white" />
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {user.name}
                                </h1>
                                <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="flex items-center gap-1">
                                            <Phone className="h-4 w-4" />
                                            {user.phone}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Member since {format(new Date(user.memberSince || "2023-01-01"), "MMM yyyy")}
                                    </div>
                                </div>
                                {user.bio && (
                                    <p className="text-muted-foreground italic pt-2">{user.bio}</p>
                                )}
                                <div className="flex items-center gap-2 pt-2">
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        <Award className="h-3 w-3" />
                                        {user.role === "admin" ? "Administrator" : "Member"}
                                    </Badge>
                                    {user.points > 0 && (
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-none flex items-center gap-1">
                                            <Award className="h-3 w-3" />
                                            {user.points.toLocaleString()} Points
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex md:flex-col gap-4">
                                <Link href="/orders">
                                    <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm cursor-pointer hover:bg-white/80 hover:scale-105 transition-all duration-300 hover:shadow-lg">
                                        <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                                        <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                        <p className="text-xs text-muted-foreground">Orders</p>
                                    </div>
                                </Link>
                                <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
                                    <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                                    <p className="text-2xl font-bold">{(stats.totalSpent / 1000000).toFixed(1)}M</p>
                                    <p className="text-xs text-muted-foreground">Total Spent</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <User className="h-4 w-4 mr-2" />
                        Personal Info
                    </TabsTrigger>
                    <TabsTrigger value="addresses" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        Addresses
                    </TabsTrigger>
                    <TabsTrigger value="wishlist" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Wishlist ({wishlist?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="vouchers" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Ticket className="h-4 w-4 mr-2" />
                        Vouchers ({userVouchers.length})
                    </TabsTrigger>
                    <TabsTrigger value="rewards" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Award className="h-4 w-4 mr-2" />
                        Rewards
                    </TabsTrigger>
                </TabsList>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Manage your personal details</CardDescription>
                            </div>
                            <Button
                                variant={isEditingProfile ? "default" : "outline"}
                                onClick={() => setIsEditingProfile(!isEditingProfile)}
                            >
                                <Edit3 className="h-4 w-4 mr-2" />
                                {isEditingProfile ? "Cancel" : "Edit"}
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={editedUser?.name || ""}
                                        onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                                        disabled={!isEditingProfile}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={editedUser?.email || ""}
                                        disabled
                                        className="bg-muted"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={editedUser?.phone || ""}
                                        onChange={(e) => setEditedUser({ ...editedUser!, phone: e.target.value })}
                                        disabled={!isEditingProfile}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={editedUser?.city || ""}
                                        onChange={(e) => setEditedUser({ ...editedUser!, city: e.target.value })}
                                        disabled={!isEditingProfile}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={editedUser?.bio || ""}
                                    onChange={(e) => setEditedUser({ ...editedUser!, bio: e.target.value })}
                                    disabled={!isEditingProfile}
                                    placeholder="Tell us about yourself..."
                                    rows={3}
                                />
                            </div>
                            {isEditingProfile && (
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveProfile}>
                                        Save Changes
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Addresses Tab */}
                <TabsContent value="addresses" className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-2xl font-semibold">Saved Addresses</h3>
                            <p className="text-sm text-muted-foreground">Manage your shipping addresses</p>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Address
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Address</DialogTitle>
                                    <DialogDescription>Add a new shipping address to your account</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="addr-name">Full Name</Label>
                                        <Input id="addr-name" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="addr-phone">Phone</Label>
                                        <Input id="addr-phone" placeholder="0901234567" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="addr-address">Address</Label>
                                        <Input id="addr-address" placeholder="123 Street Name" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="addr-city">City</Label>
                                            <Input id="addr-city" placeholder="Ho Chi Minh" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="addr-postal">Postal Code</Label>
                                            <Input id="addr-postal" placeholder="700000" />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => toast.success("Address added!")}>
                                        Add Address
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                isDefault={address.isDefault}
                                onEdit={() => toast("Edit address")}
                                onDelete={() => toast("Delete address")}
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* Vouchers Tab */}
                <TabsContent value="vouchers" className="space-y-4">
                    <div className="mb-4">
                        <h3 className="text-2xl font-semibold">My Vouchers</h3>
                        <p className="text-sm text-muted-foreground">Use your vouchers to get discounts on orders</p>
                    </div>

                    {userVouchers.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Ticket className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No vouchers yet</h3>
                                <p className="text-muted-foreground text-center">
                                    Redeem vouchers with your points or get them from promotions
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {userVouchers.map((voucher) => (
                                <VoucherCard key={voucher.id} voucher={voucher} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Wishlist Tab */}
                <TabsContent value="wishlist" className="space-y-4">
                    <div className="mb-4">
                        <h3 className="text-2xl font-semibold">My Wishlist</h3>
                        <p className="text-sm text-muted-foreground">Products you've saved for later</p>
                    </div>

                    {!wishlist || wishlist.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Heart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    Start adding products you love to your wishlist
                                </p>
                                <Link href="/">
                                    <Button variant="outline">
                                        <ShoppingBag className="h-4 w-4 mr-2" />
                                        Browse Products
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {wishlist.map((productId) => {
                                const product = products.find(p => p.id === productId);
                                if (!product) return null;

                                return (
                                    <Card key={product.id} className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                                        <div className="aspect-square overflow-hidden bg-muted">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                                                    <h3 className="font-medium line-clamp-1">{product.name}</h3>
                                                </div>
                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className="text-red-500 hover:text-red-600 p-1 transition-colors"
                                                >
                                                    <Heart className="h-5 w-5 fill-current" />
                                                </button>
                                            </div>
                                            <p className="text-lg font-bold">{product.price.toLocaleString()}đ</p>
                                            {product.stock > 0 ? (
                                                <Badge variant="secondary" className="text-xs">In Stock</Badge>
                                            ) : (
                                                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                                            )}
                                            <div className="flex gap-2 pt-2">
                                                <Link href={`/product/${product.id}`} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                {/* Rewards Tab */}
                <TabsContent value="rewards" className="space-y-4">
                    <Card className="border-none shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full blur-3xl" />
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-6 w-6 text-amber-500" />
                                Loyalty Points
                            </CardTitle>
                            <CardDescription>Earn points with every purchase and redeem for rewards</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center p-8 relative">
                                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white mb-4 shadow-2xl">
                                    <div className="text-center">
                                        <TrendingUp className="h-8 w-8 mx-auto mb-1" />
                                        <p className="text-3xl font-bold">{user.points?.toLocaleString() || 0}</p>
                                    </div>
                                </div>
                                <p className="text-lg font-semibold mb-1">Your Points Balance</p>
                                <p className="text-sm text-muted-foreground">
                                    Keep shopping to earn more rewards!
                                </p>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <h4 className="font-semibold">How to Earn Points</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Make a Purchase</p>
                                            <p className="text-sm text-muted-foreground">Earn 1 point per 1,000đ spent</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">Refer a Friend</p>
                                            <p className="text-sm text-muted-foreground">Get 500 points for each referral</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
