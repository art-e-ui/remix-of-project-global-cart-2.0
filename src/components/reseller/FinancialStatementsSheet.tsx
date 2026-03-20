import { useState } from "react";
import { FileText, ArrowDownToLine, ArrowUpFromLine, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type TransactionType = "deposit" | "withdrawal";
type TransactionStatus = "pending" | "approved" | "rejected";

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  date: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "deposit", amount: 500, status: "approved", date: "2026-03-16" },
  { id: "t2", type: "withdrawal", amount: 200, status: "approved", date: "2026-03-15" },
  { id: "t3", type: "deposit", amount: 1000, status: "pending", date: "2026-03-14" },
  { id: "t4", type: "withdrawal", amount: 150, status: "pending", date: "2026-03-13" },
  { id: "t5", type: "withdrawal", amount: 500, status: "rejected", date: "2026-03-10" },
  { id: "t6", type: "deposit", amount: 750, status: "approved", date: "2026-03-08" },
  { id: "t7", type: "deposit", amount: 300, status: "approved", date: "2026-03-05" },
  { id: "t8", type: "withdrawal", amount: 100, status: "approved", date: "2026-03-03" },
];

const statusConfig = {
  pending: { icon: Clock, label: "Pending", className: "text-yellow-500 bg-yellow-500/10" },
  approved: { icon: CheckCircle2, label: "Approved", className: "text-emerald-500 bg-emerald-500/10" },
  rejected: { icon: XCircle, label: "Rejected", className: "text-destructive bg-destructive/10" },
};

type FilterType = "all" | "deposit" | "withdrawal";

export default function FinancialStatementsSheet() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = MOCK_TRANSACTIONS.filter(
    (t) => filter === "all" || t.type === filter
  );

  return (
    <>
      {/* Trigger Card */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-card-foreground">Financial Statements</p>
            <p className="text-xs text-muted-foreground">Deposits & withdrawals history</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Bottom Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4 pb-8">
          <SheetHeader className="pb-3">
            <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Financial Statements
            </SheetTitle>
          </SheetHeader>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4">
            {(["all", "deposit", "withdrawal"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "all" ? "All" : f === "deposit" ? "Deposits" : "Withdrawals"}
              </button>
            ))}
          </div>

          {/* Transaction list */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">No transactions found.</p>
            ) : (
              filtered.map((tx) => {
                const config = statusConfig[tx.status];
                const StatusIcon = config.icon;
                const isDeposit = tx.type === "deposit";
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        isDeposit ? "bg-emerald-500/10" : "bg-orange-500/10"
                      }`}>
                        {isDeposit ? (
                          <ArrowDownToLine className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ArrowUpFromLine className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {isDeposit ? "+" : "-"}${tx.amount.toFixed(2)}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {isDeposit ? "Deposit" : "Withdrawal"} • {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className={`h-3.5 w-3.5 ${config.className.split(" ")[0]}`} />
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.className}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
