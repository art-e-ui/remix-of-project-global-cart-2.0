import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useAchCustomers() {
  return useQuery({
    queryKey: ["ach_customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ach_customers")
        .select("*")
        .order("customer_id");
      if (error) throw error;
      return data;
    },
  });
}

export function useAchFinancials() {
  return useQuery({
    queryKey: ["ach_financials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ach_financials")
        .select("*")
        .order("customer_id");
      if (error) throw error;
      return data;
    },
  });
}
