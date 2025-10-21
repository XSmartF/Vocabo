import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavLibraries } from "@/shared/components/nav-libraries"
import { NavMain } from "@/shared/components/nav-main"
import { NavSecondary } from "@/shared/components/nav-secondary"
import { NavUser } from "@/shared/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { NavNotes } from "./nav-notes"

import { ROUTES } from "@/shared/constants/route-paths"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Trang chủ",
      url: ROUTES.HOME,
      icon: IconDashboard,
    },
    {
      title: "Học tập",
      url: ROUTES.LEARN,
      icon: IconListDetails,
    },
    {
      title: "Thư viện",
      url: ROUTES.LIBRARIES,
      icon: IconChartBar,
    },
    {
      title: "Ghi chép",
      url: ROUTES.NOTES,
      icon: IconFolder,
    },
    {
      title: "Hồ sơ",
      url: ROUTES.PROFILE,
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Cài đặt",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Hỗ trợ",
      url: "#",
      icon: IconHelp,
    },
  ],
  libraries: [
    {
      title: "Từ vựng writing task 1",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Reading nugmet",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Full từ vựng writing task 2",
      url: "#",
      icon: IconFileWord,
    },
    {
      title: "Từ vựng nâng cao",
      url: "#",
      icon: IconFileAi,
    },
  ],
  notes: [
    {
      title: "Cách viết bài viết writing task 1",
      url: "#",
      icon: IconFileDescription,
    },
    {
      title: "Từ vựng đồng nghĩa nên học",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Ghi chú ngữ pháp trọng tâm",
      url: "#",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Vocabo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavLibraries items={data.libraries} />
        <NavNotes items={data.notes} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
