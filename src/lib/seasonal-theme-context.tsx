import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SeasonalDecorations {
  elements?: string[];
  snowfall?: boolean;
  topBanner?: string;
  colors?: { accent?: string; secondary?: string };
}

interface SeasonalThemeContextType {
  slug: string;
  name: string;
  decorations: SeasonalDecorations;
  isActive: boolean; // true if a non-"none" theme is active
}

const SeasonalThemeContext = createContext<SeasonalThemeContextType>({
  slug: "none",
  name: "None",
  decorations: {},
  isActive: false,
});

export function SeasonalThemeProvider({ children }: { children: ReactNode }) {
  const { data } = useQuery({
    queryKey: ["active-seasonal-theme"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seasonal_themes")
        .select("*")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 60_000,
    refetchInterval: 5 * 60_000, // refresh every 5 minutes
  });

  const slug = data?.slug ?? "none";
  const decorations = (data?.decorations as SeasonalDecorations) ?? {};

  return (
    <SeasonalThemeContext.Provider
      value={{
        slug,
        name: data?.name ?? "None",
        decorations,
        isActive: slug !== "none",
      }}
    >
      {children}
    </SeasonalThemeContext.Provider>
  );
}

export function useSeasonalTheme() {
  return useContext(SeasonalThemeContext);
}
