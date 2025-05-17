import {
  IconChecklist,
  IconHelp,
  IconLayoutDashboard,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTool,
  IconUserCog,
  IconWallet,
} from "@tabler/icons-react";
import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { type SidebarData } from "./types";

export const sidebarData: SidebarData = {
  user: {
    name: "satnaing",
    email: "satnaingdev@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Shadcn Admin",
      logo: Command,
      plan: "Vite + ShadcnUI",
    },
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "Payments",
          url: "/dashboard/payments",
          icon: IconLayoutDashboard,
        },
        {
          title: "Balance",
          url: "/dashboard/balance",
          icon: IconWallet,
        },
        {
          title: "Products",
          url: "/dashboard/products",
          icon: IconChecklist,
        },
      ],
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Settings",
          icon: IconSettings,
          items: [
            {
              title: "Business Profile",
              url: "/dashboard/settings/business-profile",
              icon: IconUserCog,
            },
            {
              title: "Wallet",
              url: "/dashboard/settings/wallet",
              icon: IconWallet,
            },
            {
              title: "API Keys",
              url: "/dashboard/settings/api-key",
              icon: IconTool,
            },
            {
              title: "Checkout UI",
              url: "/dashboard/settings/checkout-ui",
              icon: IconPalette,
            },
            {
              title: "Webhooks",
              url: "/dashboard/settings/webhook",
              icon: IconNotification,
            },
          ],
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: IconHelp,
        },
      ],
    },
  ],
};
