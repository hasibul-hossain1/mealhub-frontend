"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CancelPage() {
  useEffect(() => {
    toast.error("Payment was cancelled. Your cart has been saved.");
  }, []);

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-red-50 via-background to-red-50/30 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-red-200 bg-background/80 backdrop-blur p-8 shadow-lg text-center">
          {/* Alert Icon */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex size-20 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="size-12 text-red-600" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payment Cancelled
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6">
            Your payment was cancelled and no charges were made. Your cart items are still saved and ready for checkout.
          </p>

          {/* Info Box */}
          <div className="rounded-2xl bg-red-50/50 border border-red-200 p-4 mb-6">
            <p className="text-sm text-red-900">
              You can continue shopping and try again whenever you&apos;re ready. Your cart items won&apos;t expire.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/cart" className="w-full">
              <Button className="w-full" size="lg">
                Back to Cart
              </Button>
            </Link>
            <Link href="/meals" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-muted-foreground mt-6">
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
