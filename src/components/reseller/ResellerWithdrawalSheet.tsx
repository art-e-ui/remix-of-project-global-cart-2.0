import { useState } from "react";
import { ArrowDownToLine, Clock, CheckCircle2, XCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useReseller } from "@/lib/reseller-context";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface ResellerWithdrawalSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WithdrawalRecord {
  id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  date: string;
}

const MOCK_HISTORY: WithdrawalRecord[] = [
  { id: "w1", amount: 200, status: "approved", date: "2026-03-10" },
  { id: "w2", amount: 150, status: "pending", date: "2026-03-15" },
  { id: "w3", amount: 500, status: "rejected", date: "2026-03-05" },
];

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "text-yellow-500 bg-yellow-500/10" },
  approved: { icon: CheckCircle2, label: "Approved", className: "text-emerald-500 bg-emerald-500/10" },
  rejected: { icon: XCircle, label: "Rejected", className: "text-destructive bg-destructive/10" },
};

export default function ResellerWithdrawalSheet({ open, onOpenChange }: ResellerWithdrawalSheetProps) {
  const { reseller } = useReseller();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [history] = useState<WithdrawalRecord[]>(MOCK_HISTORY);

  const handleSubmit = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid withdrawal amount.", variant: "destructive" });
      return;
    }
    if (num > (reseller?.balance || 0)) {
      toast({ title: "Insufficient balance", description: "Withdrawal amount exceeds your available balance.", variant: "destructive" });
      return;
    }
    toast({ title: "Withdrawal requested", description: `Your withdrawal of $${num.toFixed(2)} has been submitted for review.` });
    setAmount("");
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4 pb-8">
        <SheetHeader className="pb-3">
          <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <ArrowDownToLine className="h-5 w-5 text-primary" />
            Withdraw Funds
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Balance display */}
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-foreground">${reseller?.balance?.toFixed(2) || "0.00"}</p>
          </div>

          {/* Amount input */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <Label htmlFor="withdraw-amount" className="text-xs font-medium text-muted-foreground">
              Withdrawal Amount (USD)
            </Label>
            <Input
              id="withdraw-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="rounded-xl text-lg font-semibold h-12"
              min={0}
            />
            <p className="text-[11px] text-muted-foreground">
              Funds will be sent to your saved payment method in Personal Settings.
            </p>
          </div>

          {/* Submit button */}
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full rounded-xl gap-2 h-12 text-sm font-semibold"
          >
            <Send className="h-4 w-4" />
            Request Withdrawal
          </Button>

          <Separator />

          {/* Withdrawal status / history */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Withdrawal Status</h3>
            {history.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No withdrawal requests yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((record) => {
                  const config = statusConfig[record.status];
                  const StatusIcon = config.icon;
                  return (
                    <div
                      key={record.id}
                      className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${config.className}`}>
                          <StatusIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">${record.amount.toFixed(2)}</p>
                          <p className="text-[11px] text-muted-foreground">{record.date}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.className}`}>
                        {config.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
