import Link from "next/link"
import { getProfile, signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { PenSquare, LogOut, User as UserIcon, LayoutDashboard, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function Navbar() {
  const profile = await getProfile()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">B</span>
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">ByteBlogs</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
          
          {profile ? (
            <>
              {(profile.role === 'author' || profile.role === 'admin') && (
                <Link href="/posts/new">
                  <Button variant="ghost" size="sm" className="hidden sm:flex space-x-2">
                    <PenSquare className="w-4 h-4" />
                    <span>Write</span>
                  </Button>
                </Link>
              )}
              
              {profile.role === 'admin' && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="hidden sm:flex space-x-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </Button>
                </Link>
              )}

              <div className="flex items-center space-x-3 pl-4 border-l border-zinc-800">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium text-zinc-200">{profile.name}</span>
                  <span className="text-xs text-zinc-500 capitalize">{profile.role}</span>
                </div>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" title="Profile Settings">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Link>
                <form action={signOut}>
                  <Button variant="ghost" size="sm" type="submit" title="Logout">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
