
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Redirect } from "wouter";
import { Check, X, Plus, Search, Trash2, Edit, AlertCircle, Eye, RefreshCw, Star, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/productService";
import {
  getOffers,
  respondToOffer,
} from "@/services/offerService";

import {
  getVouchers,
  addVoucher,
  updateVoucher,
  deleteVoucher,
} from "@/services/voucherService";

type Voucher = {
  id: string;
  code: string;
  discount: number;
  minSpend: number;
  pointCost: number;
  description?: string;
  detailedConditions?: string;
};


export default function Admin() {
  const {
    user, products, offers, orders, categories, users, vouchers,
    addProduct, deleteProduct, updateProduct,
updateOrderStatus, updateUser
  } = useStore();
  const role = localStorage.getItem("userRole");

  const [activeTab, setActiveTab] = useState("overview");

  if (role !== "admin") return <Redirect to="/login" />;



  return (
    <div className="container px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your store, products, and orders</p>
        </div>
        <Button variant="outline" onClick={() => window.location.href = "/"}>Back to Site</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="vouchers">Vouchers</TabsTrigger>
          <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab orders={orders} products={products} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab orders={orders} updateStatus={updateOrderStatus} />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab
            products={products}
            categories={categories}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        </TabsContent>

        <TabsContent value="offers">
          <OffersTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab users={users} updateUser={updateUser} />
        </TabsContent>
        <TabsContent value="vouchers">
          <VouchersTab />
        </TabsContent>

        <TabsContent value="feedbacks">
          <FeedbacksTab products={products}/>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- SUB COMPONENTS ---

function OverviewTab({ orders, products }: { orders: any[], products: any[] }) {
  // Mock data for charts - in real app, aggregate from orders
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
  ];

  const salesByCategory = [
    { name: 'Notebooks', value: 400 },
    { name: 'Writing', value: 300 },
    { name: 'Desk', value: 300 },
    { name: 'Paper', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalRevenue.toLocaleString()}đ</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Orders</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{orders.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Orders</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{pendingOrders}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={salesByCategory} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OrdersTab({ orders, updateStatus }: { orders: any[], updateStatus: any }) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");


  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    // Search in items names
    const matchesSearch = o.items.some((i: any) => i.name.toLowerCase().includes(searchTerm.toLowerCase())) || o.id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Order Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9 w-[200px]" placeholder="Search Order ID or Product" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-mono">{order.id}</TableCell>
                <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>{order.total.toLocaleString()}đ</TableCell>
                <TableCell>
                  <Badge variant={order.status === "completed" ? "default" : order.status === "pending" ? "outline" : "secondary"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select value={order.status} onValueChange={(val) => updateStatus(order.id, val)}>
                    <SelectTrigger className="w-[110px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProductsTab({ categories }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  // Load products khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      categoryName: categories.find((c: any) => c.id === formData.get("categoryId"))?.name || "Unknown",
      allowOffers: formData.get("allowOffers") === "on",
      autoAcceptPrice: formData.get("autoAcceptPrice") ? Number(formData.get("autoAcceptPrice")) : undefined,
      autoRejectPrice: formData.get("autoRejectPrice") ? Number(formData.get("autoRejectPrice")) : undefined,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
    };

    if (editProduct) {
      const updated = await updateProduct(editProduct.id, data);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    } else {
      const created = await addProduct(data);
      setProducts(prev => [...prev, created]);
    }

    setIsDialogOpen(false);
    setEditProduct(null);
  };

  const handleDelete = async (id: string) => {
    const ok = await deleteProduct(id);
    if (ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      console.error("Delete failed");
    }
  };


  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory</CardTitle>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 pr-9 w-[200px]"
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setEditProduct(null)}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editProduct ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" defaultValue={editProduct?.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
<select
  name="categoryId"
  className="w-full h-10 px-3 rounded-md border"
  defaultValue={editProduct?.categoryId || "c1"}
  required
>
  <option value="c1">Notebooks</option>
  <option value="c2">Writing</option>
  <option value="c3">Desk</option>
  <option value="c4">Paper</option>
</select>

                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input name="price" type="number" defaultValue={editProduct?.price} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input name="stock" type="number" defaultValue={editProduct?.stock} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input name="description" defaultValue={editProduct?.description} />
                </div>

                <div className="border p-4 rounded-md space-y-4 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Switch name="allowOffers" defaultChecked={editProduct?.allowOffers ?? true} />
                    <Label>Allow Price Offers</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Auto Accept Threshold (Optional)</Label>
                      <Input name="autoAcceptPrice" type="number" placeholder="e.g. 140000" defaultValue={editProduct?.autoAcceptPrice} />
                      <p className="text-[10px] text-muted-foreground">Offers above this will be instantly accepted.</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Auto Reject Threshold (Optional)</Label>
                      <Input name="autoRejectPrice" type="number" placeholder="e.g. 100000" defaultValue={editProduct?.autoRejectPrice} />
                      <p className="text-[10px] text-muted-foreground">Offers below this will be instantly rejected.</p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">{editProduct ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Offers</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((p: any) => (
              <TableRow key={p.id} className={p.isDeleted ? "opacity-50" : ""}>
                <TableCell>
                  {p.isDeleted ? <Badge variant="destructive">Deleted</Badge> : <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>}
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.price.toLocaleString()}đ</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  {p.allowOffers ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-muted-foreground" />}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditProduct(p); setIsDialogOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!p.isDeleted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDelete(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  const loadOffers = async () => {
    const data = await getOffers();
    setOffers(data);
  };


  useEffect(() => {
    loadOffers();
  }, []);

  const handleRespond = async (id: string, status: "accepted" | "rejected") => {
    await respondToOffer(id, status);
    toast({ title: `Offer ${status}` });
    loadOffers();
  };

  const filteredOffers = offers.filter(
    (o) => filterStatus === "all" || o.status === filterStatus
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Offer Management</CardTitle>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Offer Price</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOffers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img
                      src={offer.productImage}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{offer.productName}</p>
                      <p className="text-xs text-muted-foreground line-through">
                        {offer.originalPrice.toLocaleString()}đ
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{offer.userName || offer.userId}</TableCell>

                <TableCell className="font-bold text-primary">
                  {offer.offerPrice.toLocaleString()}đ
                </TableCell>

                <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                  {offer.message || "-"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      offer.status === "pending" ? "outline" : "secondary"
                    }
                  >
                    {offer.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {offer.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 h-8 w-8 p-0"
                        onClick={() => handleRespond(offer.id, "accepted")}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRespond(offer.id, "rejected")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function UsersTab({ users, updateUser }: any) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>User Management</CardTitle>
        <Input
          className="w-[250px]"
          placeholder="Search users..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{u.role}</Badge>
                </TableCell>
                <TableCell>{u.points}</TableCell>
                <TableCell>
                  {u.isBlocked
                    ? <span className="text-red-500">Blocked</span>
                    : <span className="text-green-600">Active</span>}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateUser(u.id, { isBlocked: !u.isBlocked })
                    }
                  >
                    {u.isBlocked ? "Unblock" : "Block"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function VouchersTab() { // Không cần nhận props nữa
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const { toast } = useToast();

  // 1. READ: Tải dữ liệu khi vào tab
  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const data = await getVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Failed to fetch vouchers", error);
    }
  };

  // 2. CREATE & UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const data: any = {
      code: formData.get("code") as string,
      discount: Number(formData.get("discount")),
      minSpend: Number(formData.get("minSpend")),
      pointCost: Number(formData.get("pointCost")),
      description: formData.get("description") as string,
      detailedConditions: formData.get("detailedConditions") as string,
    };

    try {
      if (editVoucher) {
        // Update logic
        await updateVoucher(editVoucher.id, data);
        toast({ title: "Voucher updated successfully" });
      } else {
        // Create logic: Cần thêm ID mới
        await addVoucher({ ...data, id: crypto.randomUUID() });
        toast({ title: "Voucher created successfully" });
      }

      // Refresh dữ liệu và đóng dialog
      await fetchVouchers();
      setIsDialogOpen(false);
      setEditVoucher(null);
    } catch (error) {
      toast({ title: "Error saving voucher", variant: "destructive" });
    }
  };

  // 3. DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this voucher?")) return;

    try {
      await deleteVoucher(id);
      toast({ title: "Voucher deleted" });
      fetchVouchers(); // Refresh dữ liệu ngay lập tức
    } catch (error) {
      toast({ title: "Error deleting voucher", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Voucher Management</CardTitle>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditVoucher(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Voucher
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editVoucher ? "Edit Voucher" : "Add New Voucher"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code (e.g., SAVE10)</Label>
                  <Input name="code" defaultValue={editVoucher?.code} required placeholder="ABCXYZ" />
                </div>
                <div className="space-y-2">
                  <Label>Discount Amount (VND)</Label>
                  <Input
                    name="discount"
                    type="number"
                    defaultValue={editVoucher?.discount}
                    required
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Spend (VND)</Label>
                  <Input
                    name="minSpend"
                    type="number"
                    defaultValue={editVoucher?.minSpend}
                    required
                    placeholder="50000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Point Cost</Label>
                  <Input
                    name="pointCost"
                    type="number"
                    defaultValue={editVoucher?.pointCost}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  defaultValue={editVoucher?.description}
                  placeholder="Short description"
                />
              </div>

              <div className="space-y-2">
                <Label>Conditions</Label>
                <Input
                  name="detailedConditions"
                  defaultValue={editVoucher?.detailedConditions}
                  placeholder="Detailed usage conditions"
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editVoucher ? "Update Voucher" : "Create Voucher"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Spend</TableHead>
              <TableHead>Point Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {vouchers.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-mono font-bold text-primary">
                  {v.code}
                </TableCell>
                <TableCell>{v.discount?.toLocaleString()}đ</TableCell>
                <TableCell>{v.minSpend?.toLocaleString()}đ</TableCell>
                <TableCell>{v.pointCost}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditVoucher(v);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(v.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {vouchers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  No vouchers found. Click "Add Voucher" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
function FeedbacksTab({ products }: any) {
  // Flatten feedbacks from all products
const allFeedbacks = products.flatMap((p: any) =>
  (p.feedbacks || []).map((f: any) => ({
    ...f,
    productName: p.name,
    productId: p.id,
  }))
);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFeedbacks.map((f: any) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium">{f.productName}</TableCell>
                <TableCell>{f.user}</TableCell>
                <TableCell>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < f.rating ? "fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{f.comment}</TableCell>
                <TableCell>{f.date}</TableCell>
              </TableRow>
            ))}
            {allFeedbacks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">No reviews yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
