import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ChevronLeft, FileText, Calendar, User, DollarSign, Trash2, ExternalLink } from "lucide-react";

export default function History({ onBack, onEdit }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("bills")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this bill?")) return;

    try {
      const { error } = await supabase.from("bills").delete().eq("id", id);
      if (error) throw error;
      setBills(bills.filter(b => b.id !== id));
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium uppercase tracking-widest">Back</span>
          </button>
          <h2 className="text-2xl font-bold tracking-tighter uppercase">SMART <span className="font-light">BILLR</span></h2>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground animate-spin" />
            <p className="text-xs text-foreground/40 uppercase tracking-widest">Loading Records...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-foreground/10 rounded-3xl">
            <FileText className="w-12 h-12 text-foreground/10 mb-4" />
            <p className="text-sm text-foreground/40 font-light italic">No bills found in your history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bills.map((bill) => (
              <Card 
                key={bill.id} 
                className="bg-foreground/[0.02] border-foreground/5 hover:bg-foreground/[0.04] hover:border-foreground/20 transition-all cursor-pointer group rounded-2xl overflow-hidden"
                onClick={() => onEdit(bill.data)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-foreground/5 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-foreground/60" />
                    </div>
                    <button 
                      onClick={(e) => handleDelete(bill.id, e)}
                      className="p-2 text-foreground/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[11px] uppercase tracking-widest text-foreground/30 font-bold mb-1">Invoice No.</h3>
                      <p className="text-lg font-bold tracking-tight">{bill.invoice_number || "#---"}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <User className="w-3 h-3 text-foreground/30" />
                          <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Client</span>
                        </div>
                        <p className="text-xs font-medium truncate">{bill.client_name || "Guest"}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar className="w-3 h-3 text-foreground/30" />
                          <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold">Date</span>
                        </div>
                        <p className="text-xs font-medium">
                          {bill.invoice_date ? format(new Date(bill.invoice_date), "MMM d, yyyy") : "---"}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-foreground/30 font-bold mr-2">Total</span>
                        <span className="text-sm font-bold">{bill.currency} {bill.total_amount?.toLocaleString() || "0"}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-foreground/20 group-hover:text-foreground/60 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
