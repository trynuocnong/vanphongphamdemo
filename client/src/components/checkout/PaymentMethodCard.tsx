import { cn } from "@/lib/utils";
import { CreditCard, Smartphone, Wallet, Banknote } from "lucide-react";

export type PaymentMethodType = "credit_card" | "momo" | "zalopay" | "cod";

interface PaymentMethodCardProps {
    type: PaymentMethodType;
    selected: boolean;
    onClick: () => void;
}

const paymentMethods = {
    credit_card: {
        icon: CreditCard,
        name: "Credit/Debit Card",
        description: "Pay securely with your card",
    },
    momo: {
        icon: Wallet,
        name: "MoMo E-Wallet",
        description: "Pay with MoMo app",
    },
    zalopay: {
        icon: Smartphone,
        name: "ZaloPay",
        description: "Pay with ZaloPay app",
    },
    cod: {
        icon: Banknote,
        name: "Cash on Delivery",
        description: "Pay when you receive",
    },
};

export function PaymentMethodCard({ type, selected, onClick }: PaymentMethodCardProps) {
    const method = paymentMethods[type];
    const Icon = method.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-4 rounded-lg border-2 transition-all text-left",
                "hover:border-primary/50 hover:shadow-md",
                selected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card"
            )}
        >
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-base">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
                <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    selected ? "border-primary" : "border-muted-foreground"
                )}>
                    {selected && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                </div>
            </div>
        </button>
    );
}
