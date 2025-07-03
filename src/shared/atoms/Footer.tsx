import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-teal-50 to-blue-50 py-5 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-gray-800 gap-4 border-t border-blue-100">
      {/* Left side */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="font-bold text-lg text-teal-700">Healthiclick</span>
        <span className="text-gray-600 hidden sm:inline">© 2024 Healthiclick</span>
      </div>

      {/* Right side */}
      <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6 font-medium text-sm text-gray-700">
        <Link href="/privacy" className="hover:text-teal-600 transition-colors">
          Privacy
        </Link>
        <Link href="/contact" className="hover:text-teal-600 transition-colors">
          Contact
        </Link>
        <Link href="/terms" className="hover:text-teal-600 transition-colors">
          Terms
        </Link>
        <Link href="/insights" className="hover:text-teal-600 transition-colors">
          Insights
        </Link>
      </div>
    </footer>
  )
}
