import Link from "next/link"
import { Github, Twitter, Linkedin, Sparkles, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-background/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground hover:opacity-80 transition-opacity flex items-center">
              BYTE<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              A premium blogging platform designed for creators. Powered by Next.js and enhanced with cutting-edge Gemini AI for intelligent content generation.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/amit-amitt" className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/amit-amitt/" className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 col-span-2">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Platform</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-zinc-400 hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/search" className="text-sm text-zinc-400 hover:text-primary transition-colors">Search</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-zinc-400 hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-200">Account</h4>
              <ul className="space-y-2">
                <li><Link href="/profile" className="text-sm text-zinc-400 hover:text-primary transition-colors">Profile</Link></li>
                <li><Link href="/posts/new" className="text-sm text-zinc-400 hover:text-primary transition-colors">Write a Post</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-zinc-500">
            © {currentYear} ByteBlogs. Built with <Heart className="w-3 h-3 mx-1 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
