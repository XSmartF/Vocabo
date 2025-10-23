"use client"


import { IconDots, IconFolder, IconShare3, IconTrash, type Icon } from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { usePersistedList } from "@/shared/hooks/use-persisted-list"
import { colorOptions, ICON_OPTIONS } from "@/app/constants/icon-options"
import type { IconOption } from "@/app/constants/icon-options"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { useSidebar } from "@/shared/components/ui/sidebar-context"

export function NavLibraries({
  items,
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()

  type LocalItem = { title: string; url: string; icon: Icon; iconKey?: string; color?: string }

  const [localItems, setLocalItems] = usePersistedList<LocalItem>(
    "nav-libraries",
    items as LocalItem[]
  )

  const iconOptions: IconOption[] = ICON_OPTIONS


  // Icon selection handled via DropdownMenu below

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Thư viện yêu thích</SidebarGroupLabel>
      <SidebarMenu>
        {localItems.map((item, i) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url} className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label={`Choose icon for ${item.title}`}
                      onClick={(e) => e.preventDefault()}
                      className="icon-change-button"
                    >
                      {(() => {
                        const it = item as LocalItem
                        const key = it.iconKey as string | undefined
                        const found = iconOptions.find((o) => o.key === key)
                        const Comp = found ? found.comp : it.icon
                        return <Comp className="h-5 w-5" style={{ color: it.color || undefined }} />
                      })()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <div className="px-2 py-1">
                      <div className="text-xs font-medium mb-1">Chọn icon</div>
                      {iconOptions.map((opt, optIdx) => (
                        <DropdownMenuItem
                          key={optIdx}
                          onClick={(e) => {
                            e.preventDefault()
                            setLocalItems((prev) => {
                              const next = prev.map((it) => ({ ...it }))
                              next[i].icon = opt.comp
                              next[i].iconKey = opt.key
                              return next
                            })
                          }}
                        >
                          <opt.comp className="h-5 w-5" />
                          <span className="ml-2">{opt.label ?? opt.key}</span>
                        </DropdownMenuItem>
                      ))}

                      <div className="h-px my-2 bg-border" />
                      <div className="text-xs font-medium mb-1">Chọn màu</div>
                      <div className="flex gap-2 px-1">
                        {colorOptions.map((c) => (
                          <button
                            key={c}
                            onClick={(e) => {
                              e.preventDefault()
                              setLocalItems((prev) => {
                                const next = prev.map((it) => ({ ...it }))
                                next[i].color = c
                                return next
                              })
                            }}
                            className="w-6 h-6 rounded-full border"
                            style={{ background: c }}
                            aria-label={`Set color ${c}`}
                          />
                        ))}
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots className="h-5 w-5" />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-24 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconFolder className="h-5 w-5" />
                  <span>Open</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconShare3 className="h-5 w-5" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <IconTrash className="h-5 w-5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
            <IconDots className="h-5 w-5 text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
