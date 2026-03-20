import { FileText, ChevronRight, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  { label: "Frequently Asked Questions (FAQ)", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Refund & Return Policy", href: "#" },
  { label: "Shipping Policy", href: "#" },
  { label: "Cookie Policy", href: "#" },
];

export default function FaqTermsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors w-full text-left">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">FAQ, Terms &amp; Policies</p>
              <p className="text-xs text-muted-foreground">Legal info &amp; help</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8 pt-4 max-h-[70vh]">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-base font-semibold">FAQ, Terms &amp; Policies</SheetTitle>
        </SheetHeader>
        <div className="space-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-border bg-background p-3.5 hover:border-primary/30 transition-colors"
            >
              <span className="text-sm font-medium text-foreground">{link.label}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
