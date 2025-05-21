import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-[#fee4c3] py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-[#1f1f1f] gap-4">
      {/* Left side */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="font-bold text-lg">Healthiclick</span>
        <span className="text-gray-600 hidden sm:inline">© 2024 Healthiclick</span>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-8 font-semibold text-sm">
        <Link href="/privacy" className="hover:underline">
          Privacy
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms
        </Link>
        <Link href="/insights" className="hover:underline">
          Insights
        </Link>
      </div>
    </footer>
  )
}
