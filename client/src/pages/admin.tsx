
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

export default function Admin() {
  const { 
    user, products, offers, orders, categories, users, vouchers,
    addProduct, deleteProduct, updateProduct, 
    addCategory, updateCategory, deleteCategory,
    addVoucher, updateVoucher, deleteVoucher,
    respondToOffer, updateOrderStatus, updateUser, deleteUser,
    deleteFeedback
  } = useStore();
  const role = localStorage.getItem("userRole");

  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

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
          <OffersTab offers={offers} respondToOffer={respondToOffer} />
        </TabsContent>

        <TabsContent value="users">
           <UsersTab users={users} updateUser={updateUser} deleteUser={deleteUser} />
        </TabsContent>

        <TabsContent value="vouchers">
           <VouchersTab vouchers={vouchers} addVoucher={addVoucher} deleteVoucher={deleteVoucher} updateVoucher={updateVoucher} />
        </TabsContent>

        <TabsContent value="feedbacks">
           <FeedbacksTab products={products} deleteFeedback={deleteFeedback} />
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

function ProductsTab({ products, categories, addProduct, updateProduct, deleteProduct }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null); // If null -> Add mode, else Edit mode

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      price: parseInt(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
      description: formData.get("description"),
      categoryId: formData.get("categoryId"),
      categoryName: categories.find((c: any) => c.id === formData.get("categoryId"))?.name || "Unknown",
      allowOffers: formData.get("allowOffers") === "on",
      autoAcceptPrice: formData.get("autoAcceptPrice") ? parseInt(formData.get("autoAcceptPrice") as string) : undefined,
      autoRejectPrice: formData.get("autoRejectPrice") ? parseInt(formData.get("autoRejectPrice") as string) : undefined,
    };

    if (editProduct) {
      updateProduct(editProduct.id, data);
    } else {
      addProduct({ ...data, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", images: [] });
    }
    setIsDialogOpen(false);
    setEditProduct(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory</CardTitle>
        <div className="flex gap-2">
          <Input 
             className="w-[200px]" 
             placeholder="Search products..." 
             value={searchTerm} 
             onChange={e => setSearchTerm(e.target.value)} 
          />
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
                    <select name="categoryId" className="w-full h-10 px-3 rounded-md border" defaultValue={editProduct?.categoryId}>
                      {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                       <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteProduct(p.id)}>
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

function OffersTab({ offers, respondToOffer }: any) {
  const [filterStatus, setFilterStatus] = useState("all");
  
  const filteredOffers = offers.filter((o: any) => filterStatus === "all" || o.status === filterStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Offer Management</CardTitle>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
             <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
             <SelectContent>
               <SelectItem value="all">All Status</SelectItem>
               <SelectItem value="pending">Pending</SelectItem>
               <SelectItem value="accepted">Accepted</SelectItem>
               <SelectItem value="rejected">Rejected</SelectItem>
               <SelectItem value="countered">Countered</SelectItem>
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
            {filteredOffers.map((offer: any) => (
              <TableRow key={offer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <img src={offer.productImage} className="w-8 h-8 rounded object-cover" />
                    <div className="text-sm">
                      <p className="font-medium">{offer.productName}</p>
                      <p className="text-xs text-muted-foreground line-through">{offer.originalPrice.toLocaleString()}đ</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{offer.userId}</TableCell>
                <TableCell className="font-bold text-primary">{offer.offerPrice.toLocaleString()}đ</TableCell>
                <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground">
                  {offer.message || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={offer.status === "pending" ? "outline" : "secondary"}>
                    {offer.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {offer.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0" onClick={() => respondToOffer(offer.id, "accepted")}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => respondToOffer(offer.id, "rejected")}>
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

function UsersTab({ users, updateUser, deleteUser }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role"),
      points: parseInt(formData.get("points") as string)
    };
    updateUser(editingUser.id, data);
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  return (
    <Card>
       <CardHeader className="flex flex-row justify-between items-center">
         <CardTitle>User Management</CardTitle>
         <div className="flex gap-2">
           <Input 
             className="w-[200px]" 
             placeholder="Search users..." 
             value={searchTerm} 
             onChange={e => setSearchTerm(e.target.value)} 
           />
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                <form onSubmit={handleUpdate} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input name="name" defaultValue={editingUser?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input name="email" defaultValue={editingUser?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <select name="role" className="w-full h-10 px-3 rounded-md border" defaultValue={editingUser?.role}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Points</Label>
                    <Input name="points" type="number" defaultValue={editingUser?.points} />
                  </div>
                  <DialogFooter><Button type="submit">Save Changes</Button></DialogFooter>
                </form>
              </DialogContent>
           </Dialog>
         </div>
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
                 <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                 <TableCell>{u.points}</TableCell>
                 <TableCell>{u.isBlocked ? <span className="text-red-500">Blocked</span> : <span className="text-green-500">Active</span>}</TableCell>
                 <TableCell>
                   <div className="flex gap-2">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => updateUser(u.id, { isBlocked: !u.isBlocked })}
                        className={u.isBlocked ? "text-green-600" : "text-red-600"}
                     >
                       {u.isBlocked ? "Unblock" : "Block"}
                     </Button>
                     <Button variant="ghost" size="sm" onClick={() => { setEditingUser(u); setIsDialogOpen(true); }}>
                       <Edit className="w-4 h-4" />
                     </Button>
                     <Button variant="ghost" size="sm" onClick={() => deleteUser(u.id)}>
                       <Trash2 className="w-4 h-4 text-muted-foreground" />
                     </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       </CardContent>
    </Card>
  )
}

function VouchersTab({ vouchers, addVoucher, deleteVoucher, updateVoucher }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editVoucher, setEditVoucher] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
       code: formData.get("code"),
       discount: parseInt(formData.get("discount") as string),
       minSpend: parseInt(formData.get("minSpend") as string),
       pointCost: parseInt(formData.get("pointCost") as string),
       description: formData.get("description"),
       detailedConditions: formData.get("detailedConditions")
    };

    if (editVoucher) {
       updateVoucher(editVoucher.id, data);
    } else {
       addVoucher(data);
    }
    setIsDialogOpen(false);
    setEditVoucher(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
         <CardTitle>Vouchers</CardTitle>
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button size="sm" onClick={() => setEditVoucher(null)}><Plus className="w-4 h-4 mr-2" /> Add Voucher</Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader><DialogTitle>{editVoucher ? "Edit Voucher" : "Add Voucher"}</DialogTitle></DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-4 py-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Code</Label>
                       <Input name="code" defaultValue={editVoucher?.code} required />
                    </div>
                    <div className="space-y-2">
                       <Label>Discount Amount</Label>
                       <Input name="discount" type="number" defaultValue={editVoucher?.discount} required />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label>Min Spend</Label>
                       <Input name="minSpend" type="number" defaultValue={editVoucher?.minSpend} required />
                    </div>
                    <div className="space-y-2">
                       <Label>Point Cost</Label>
                       <Input name="pointCost" type="number" defaultValue={editVoucher?.pointCost} required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input name="description" defaultValue={editVoucher?.description} />
                 </div>
                 <div className="space-y-2">
                    <Label>Conditions</Label>
                    <Input name="detailedConditions" defaultValue={editVoucher?.detailedConditions} />
                 </div>
                 <DialogFooter><Button type="submit">{editVoucher ? "Update" : "Create"}</Button></DialogFooter>
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
               <TableHead>Action</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {vouchers.map((v: any) => (
               <TableRow key={v.id}>
                 <TableCell className="font-mono font-bold">{v.code}</TableCell>
                 <TableCell>{v.discount.toLocaleString()}đ</TableCell>
                 <TableCell>{v.minSpend.toLocaleString()}đ</TableCell>
                 <TableCell>{v.pointCost}</TableCell>
                 <TableCell>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => { setEditVoucher(v); setIsDialogOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteVoucher(v.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
      </CardContent>
    </Card>
  )
}

function FeedbacksTab({ products, deleteFeedback }: any) {
  // Flatten feedbacks from all products
  const allFeedbacks = products.flatMap((p: any) => 
    p.feedbacks.map((f: any) => ({ ...f, productName: p.name, productId: p.id }))
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
              <TableHead>Action</TableHead>
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
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => deleteFeedback(f.productId, f.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
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
