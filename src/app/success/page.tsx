"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
    toast.success("Payment successful! Your order has been confirmed.");
  }, [clearCart]);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-emerald-50 via-background to-emerald-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-emerald-200 bg-background/80 backdrop-blur p-8 shadow-lg text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex size-20 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="size-12 text-emerald-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Successful!
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Your order has been confirmed and paid. You will receive a confirmation email shortly with your order details.
          </p>

          {/* Order Info Box */}
          <div className="rounded-2xl bg-emerald-50/50 border border-emerald-200 p-4 mb-6">
            <p className="text-sm text-emerald-900">
              Your meals will be prepared and delivered to your address as soon as possible. Track your order in your dashboard.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-muted-foreground mt-6">
            Order confirmation has been sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
