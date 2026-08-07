export type GuestGroup = "贴身组" | "帮手组" | "行动组" | "演员组" | "气氛组";

export interface ActionItem {
  id: string;
  timeLabel: string;
  title: string;
  location?: string;
  detail: string;
  items?: string[];
  note?: string;
  secret?: boolean;
}

export interface Guest {
  id: string;
  name: string;
  role: string;
  tagline: string;
  group: GuestGroup;
  actions: ActionItem[];
  secretNote?: string;
}

export type TimelineIcon = "cart" | "tools" | "users" | "car" | "heart";

export interface TimelineNode {
  id: string;
  timeLabel: string;
  title: string;
  location: string;
  detail: string;
  icon: TimelineIcon;
}
