import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle } from "lucide-react";

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState("");

    const faqs = [
        {
            category: "Ordering & Payment",
            questions: [
                {
                    q: "How do I place an order?",
                    a: "Simply browse our products, add items to your cart, and proceed to checkout. You'll need to create an account or log in to complete your purchase. We accept various payment methods including credit cards, debit cards, and online banking.",
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept Visa, Mastercard, American Express, and local payment methods like MoMo and ZaloPay. All transactions are secure and encrypted.",
                },
                {
                    q: "Can I modify or cancel my order?",
                    a: "You can modify or cancel your order within 1 hour of placement. After that, please contact our customer service team for assistance. Once an order is shipped, it cannot be cancelled but can be returned.",
                },
                {
                    q: "How do I use a voucher code?",
                    a: "Visit the Voucher Center to collect available vouchers. During checkout, enter your voucher code in the designated field. The discount will be automatically applied to your order if it meets the minimum requirements.",
                },
            ],
        },
        {
            category: "Shipping & Delivery",
            questions: [
                {
                    q: "What are the shipping costs?",
                    a: "Shipping costs vary based on your location and order size. Standard shipping is 30,000đ for orders under 500,000đ. Orders over 500,000đ qualify for free shipping. Express shipping is available for an additional fee.",
                },
                {
                    q: "How long does delivery take?",
                    a: "Standard delivery takes 3-5 business days for urban areas and 5-7 business days for remote locations. Express delivery takes 1-2 business days. You'll receive a tracking number once your order ships.",
                },
                {
                    q: "Do you ship internationally?",
                    a: "Currently, we only ship within Vietnam. We're working on expanding our shipping coverage to international destinations. Please check back for updates.",
                },
                {
                    q: "How can I track my order?",
                    a: "Once your order ships, you'll receive a tracking number via email and SMS. You can also view your order status in the Order History page of your account.",
                },
            ],
        },
        {
            category: "Returns & Refunds",
            questions: [
                {
                    q: "What is your return policy?",
                    a: "We accept returns within 30 days of delivery for unused items in original packaging. Products must be in resalable condition. Personalized or custom items cannot be returned unless defective.",
                },
                {
                    q: "How do I initiate a return?",
                    a: "Contact our customer service team via email or phone to start the return process. We'll provide you with a return authorization number and shipping instructions. Return shipping costs are the customer's responsibility unless the item is defective.",
                },
                {
                    q: "When will I receive my refund?",
                    a: "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method. Please allow an additional 3-5 business days for the refund to appear in your account.",
                },
                {
                    q: "What if I receive a damaged or defective product?",
                    a: "We're sorry if that happens! Contact us immediately with photos of the damage. We'll arrange a free replacement or full refund including shipping costs. Your satisfaction is our priority.",
                },
            ],
        },
        {
            category: "Account & Loyalty",
            questions: [
                {
                    q: "How do I create an account?",
                    a: "Click the 'Login' button in the header, then select 'Create Account'. Fill in your details and verify your email address. You can also create an account during checkout.",
                },
                {
                    q: "How do loyalty points work?",
                    a: "Earn 1 point for every 1,000đ spent. Use points to redeem exclusive vouchers in the Voucher Center. You also earn 500 points for each successful referral. Points never expire as long as your account is active.",
                },
                {
                    q: "Can I change my account information?",
                    a: "Yes! Visit your Profile page to update your name, phone number, city, and bio. You can also manage your shipping addresses and notification preferences.",
                },
                {
                    q: "I forgot my password. What should I do?",
                    a: "Click 'Forgot Password' on the login page. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password.",
                },
            ],
        },
        {
            category: "Products",
            questions: [
                {
                    q: "Are your products eco-friendly?",
                    a: "Yes! We prioritize sustainability. Many of our products use recycled materials, FSC-certified paper, and eco-friendly inks. Look for the 'Eco-Friendly' badge on product pages.",
                },
                {
                    q: "Do you offer gift wrapping?",
                    a: "Yes, we offer premium gift wrapping for a small fee. Select this option during checkout. We'll include a personalized message card if you provide one.",
                },
                {
                    q: "Can I request a specific product?",
                    a: "Absolutely! Contact our customer service team with your product request. While we can't guarantee availability, we'll do our best to source items or suggest similar alternatives.",
                },
                {
                    q: "How do I know if a product is in stock?",
                    a: "Stock status is displayed on each product page. If an item shows 'Out of Stock', you can sign up for restock notifications. We'll email you when it's available again.",
                },
            ],
        },
    ];

    // Filter FAQs based on search
    const filteredFaqs = searchTerm
        ? faqs.map((category) => ({
            ...category,
            questions: category.questions.filter(
                (faq) =>
                    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        })).filter((category) => category.questions.length > 0)
        : faqs;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                    <HelpCircle className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        FAQs
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Find answers to commonly asked questions
                </p>
            </div>

            {/* Search */}
            <div className="mb-8">
                <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-10"
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
                {filteredFaqs.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                No FAQs found matching "{searchTerm}"
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredFaqs.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                                <span className="h-1 w-8 bg-gradient-to-r from-primary to-purple-600 rounded"></span>
                                {category.category}
                            </h2>
                            <Card>
                                <CardContent className="p-0">
                                    <Accordion type="single" collapsible className="w-full">
                                        {category.questions.map((faq, qIdx) => (
                                            <AccordionItem
                                                key={qIdx}
                                                value={`item-${idx}-${qIdx}`}
                                                className="border-none px-6"
                                            >
                                                <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                                                    <span className="font-semibold">{faq.q}</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground">
                                                    {faq.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>

            {/* Contact CTA */}
            <Card className="mt-12 bg-gradient-to-br from-primary/5 to-purple-500/5 border-none">
                <CardContent className="p-8 text-center">
                    <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
                    <p className="text-muted-foreground mb-4">
                        Can't find the answer you're looking for? Our customer support team is here to help.
                    </p>
                    <a href="/contact" className="text-primary font-semibold hover:underline">
                        Contact Us →
                    </a>
                </CardContent>
            </Card>
        </div>
    );
}
