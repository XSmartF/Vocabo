import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

export default function Profile() {
  const user = {
    name: "Người dùng",
    email: "user@example.com",
    avatar: "/avatar.png",
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Hồ sơ của tôi</h1>

      <Tabs defaultValue="overview" className="bg-transparent">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{user.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-lg font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="text-sm text-muted-foreground">Ở đây hiển thị thông tin tổng quan về tài khoản của bạn.</div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <form className="grid gap-4">
            <label className="grid">
              <span className="text-sm">Tên</span>
              <input className="input" defaultValue={user.name} />
            </label>

            <label className="grid">
              <span className="text-sm">Email</span>
              <input className="input" defaultValue={user.email} />
            </label>

            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-primary">Lưu</button>
              <button type="button" className="btn">Hủy</button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-4">
            <label className="grid">
              <span className="text-sm">Đổi mật khẩu</span>
              <input type="password" className="input" placeholder="Mật khẩu hiện tại" />
            </label>

            <label className="grid">
              <input type="password" className="input" placeholder="Mật khẩu mới" />
            </label>

            <div className="flex items-center gap-2">
              <button type="button" className="btn btn-primary">Cập nhật mật khẩu</button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
