export default function ServerStatusBadge() {
  return (
    <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-full px-3 py-1.5 shadow-sm text-xs font-semibold text-nb-dark/70 z-50">
      <span className="w-2 h-2 rounded-full bg-nb-yellow" />
      Demo Mode
    </div>
  )
}
