import { useState, useRef } from "react";
import { Copy, Wallet, CreditCard, Headphones, AlertTriangle, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const cryptoIcons = [
  { name: "BNB", icon: "/crypto/bnb.svg" },
  { name: "BTC", icon: "/crypto/btc.svg" },
  { name: "USDT", icon: "/crypto/usdt.svg" },
  { name: "ETH", icon: "/crypto/eth.svg" },
  { name: "XRP", icon: "/crypto/xrp.svg" },
  { name: "SOL", icon: "/crypto/sol.svg" },
  { name: "ADA", icon: "/crypto/ada.svg" },
  { name: "DOT", icon: "/crypto/dot.svg" },
];

const depositAddress = "TXrk2qEkPFwSzGYvRmpCkyFbPFCSFdBu8K";

interface ResellerDepositSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ResellerDepositSheet({ open, onOpenChange }: ResellerDepositSheetProps) {
  const { toast } = useToast();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(depositAddress);
    setWalletCopied(true);
    toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
    setTimeout(() => setWalletCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 5MB allowed.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDeposit = () => {
    toast({ title: "Deposit submitted", description: `$${depositAmount} deposit request sent for review.` });
    setDepositAmount("");
    setScreenshot(null);
    setScreenshotName("");
    onOpenChange(false);
  };

  const canSubmit = screenshot !== null && depositAmount.trim() !== "";

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4 pb-8">
          <SheetHeader className="pb-3">
            <SheetTitle className="text-base font-bold text-foreground">Deposit Funds</SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Global Payment */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Global Payment</h3>
                  <p className="text-xs text-muted-foreground">Pay securely with cryptocurrency</p>
                </div>
              </div>
              <Separator className="mb-4" />

              <div className="space-y-3">
                {/* Deposit Amount */}
                <div>
                  <Label htmlFor="deposit-amount" className="text-xs text-muted-foreground">Deposit Amount</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount in USD"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="mt-1 rounded-xl"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 justify-center border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => setShowWalletModal(true)}
                >
                  <Wallet className="h-4 w-4" />
                  Get Wallet Address
                </Button>

                {/* Transaction Screenshot */}
                <div>
                  <Label className="text-xs text-muted-foreground">Transaction Proof</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-1 flex items-center gap-3 rounded-xl border border-dashed border-input bg-background px-4 py-3 cursor-pointer hover:border-primary/40 transition-colors"
                  >
                    {screenshot ? (
                      <>
                        <img src={screenshot} alt="Screenshot" className="h-10 w-10 rounded-lg object-cover border border-border" />
                        <span className="text-sm text-foreground truncate flex-1">{screenshotName}</span>
                      </>
                    ) : (
                      <>
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">Attach Transaction Screenshot</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  className="w-full rounded-xl gap-2"
                  disabled={!canSubmit}
                  onClick={handleSubmitDeposit}
                >
                  <Upload className="h-4 w-4" />
                  Submit Deposit
                </Button>

                <Button variant="outline" className="w-full gap-2 justify-center" asChild>
                  <a href="mailto:support@example.com">
                    <Headphones className="h-4 w-4" />
                    Get Support 24/7
                  </a>
                </Button>

                <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    Empowered by Blockchain Network & Cutting Edge Technology
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {cryptoIcons.map((crypto) => (
                      <div
                        key={crypto.name}
                        className="flex h-7 items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5"
                      >
                        <img src={crypto.icon} alt={crypto.name} className="h-4 w-4" />
                        <span className="text-[10px] font-bold text-muted-foreground">{crypto.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pay in Local */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <CreditCard className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Pay in Local</h3>
                  <p className="text-xs text-muted-foreground">Pay in your local currency</p>
                </div>
              </div>
              <Separator className="mb-4" />
              <div className="rounded-lg bg-muted/50 border border-border p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get advised by discussion with our expertise financial representative to pay in your local currency and pay globally.
                </p>
                <Button variant="outline" className="mt-3 gap-2" asChild>
                  <a href="mailto:support@example.com">
                    <Headphones className="h-4 w-4" /> Contact Financial Expert
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* USDT Wallet Modal */}
      <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2 text-base">
              <img src="/crypto/usdt.svg" alt="USDT" className="h-6 w-6" />
              USDT - TRC20
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Scan the QR code or copy the address below
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-3">
            <div className="rounded-xl border-2 border-border bg-background p-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddress}`}
                alt="USDT TRC20 QR Code"
                className="h-44 w-44"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Deposit Address</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono text-foreground break-all leading-relaxed">
                {depositAddress}
              </code>
              <Button variant="ghost" size="sm" className="shrink-0 h-8 w-8 p-0" onClick={handleCopyWallet}>
                <Copy className={`h-4 w-4 ${walletCopied ? "text-green-500" : "text-muted-foreground"}`} />
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <p className="text-xs text-destructive leading-relaxed">
              Make sure you send only <span className="font-bold">USDT-TRC20</span> token over this address. Sending other tokens may result in permanent loss.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
