import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Heart, Sparkles } from "lucide-react";

export default function About() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    About Stationery
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Crafting minimalist tools for the modern mind since 2020
                </p>
            </div>

            {/* Story */}
            <div className="mb-16">
                <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5">
                    <CardContent className="p-8 md:p-12">
                        <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Founded in 2020, Stationery was born from a simple belief: that the tools we use every day should inspire clarity, creativity, and calm. In a world of digital noise, we create physical products that help you think, plan, and create with intention.
                            </p>
                            <p>
                                Every product in our collection is carefully curated for quality, design, and functionality. We work directly with manufacturers who share our commitment to craftsmanship and sustainability.
                            </p>
                            <p>
                                From premium notebooks to elegant writing instruments, each item is designed to elevate your workspace and enhance your daily rituals. We believe that beautiful, well-made tools make better work possible.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Values */}
            <div className="mb-16">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Our Values</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto mb-4">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Quality First</h3>
                            <p className="text-sm text-muted-foreground">
                                We never compromise on materials or craftsmanship. Every product is built to last.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Sustainability</h3>
                            <p className="text-sm text-muted-foreground">
                                Eco-friendly materials and responsible manufacturing practices guide our choices.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Design Excellence</h3>
                            <p className="text-sm text-muted-foreground">
                                Timeless, minimalist aesthetics that enhance rather than distract.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardContent className="p-6">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Customer Care</h3>
                            <p className="text-sm text-muted-foreground">
                                Your satisfaction is our priority. We're here to help every step of the way.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Stats */}
            <div className="mb-16">
                <Card className="border-none shadow-xl">
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <p className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                                    10K+
                                </p>
                                <p className="text-sm text-muted-foreground">Happy Customers</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                                    500+
                                </p>
                                <p className="text-sm text-muted-foreground">Products</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-2">
                                    98%
                                </p>
                                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
                            </div>
                            <div>
                                <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent mb-2">
                                    4.8★
                                </p>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Mission */}
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    To create inspiring tools that help people think clearly, work mindfully, and live intentionally. We believe that beautiful, well-designed stationery can transform everyday tasks into moments of creativity and calm.
                </p>
            </div>
        </div>
    );
}
