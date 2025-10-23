import {
  IconDatabase,
  IconReport,
  IconFileWord,
  IconFileAi,
  IconFolder,
  IconFileDescription,
  IconShare3,
  type Icon,
} from "@tabler/icons-react"

export type IconOption = { key: string; comp: Icon; label: string }

export const colorOptions = [
  "#0ea5e9", 
  "#10b981", 
  "#f59e0b",
  "#ef4444", 
  "#7c3aed",
]

export const ICON_OPTIONS: IconOption[] = [
  { key: "database", comp: IconDatabase, label: "Từ vựng" },
  { key: "report", comp: IconReport, label: "Báo cáo" },
  { key: "fileword", comp: IconFileWord, label: "Bài viết" },
  { key: "fileai", comp: IconFileAi, label: "Trợ lý" },
  { key: "folder", comp: IconFolder, label: "Thư mục" },
  { key: "filedesc", comp: IconFileDescription, label: "Mô tả" },
  { key: "share", comp: IconShare3, label: "Chia sẻ" },
]
