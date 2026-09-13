export interface PortfolioStat {
  key: string;
  value: string;
  label: string;
  icon: string;
  id?: string;
  updated_at?: string;
}

export const fallbackStats: PortfolioStat[] = [
  { key: "rating", value: "4.9", label: "Rating", icon: "Star" },
  { key: "projects", value: "150+", label: "Projects", icon: "Folder" },
  { key: "comments", value: "1.2k", label: "Comments", icon: "MessageCircle" },
  { key: "experience", value: "3+", label: "Experience", icon: "BarChart3" },
];
