import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logo as logoHorizontal, starYellow, signOutIcon } from '../assets/icons'
import { useAuth } from '../context/AuthContext'

const ROLE_BADGE = {
  student: 'bg-nb-yellow text-nb-dark',
  teacher: 'bg-nb-green text-white',
  admin:   'bg-nb-dark text-white',
}

export default function Navbar({ role, userName, points, avatar, children, tabs, activeTab, onTabChange }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-nb-olive/15 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <img src={logoHorizontal} alt="Neurobix Method" className="h-7 sm:h-9 w-auto object-contain flex-shrink-0" />

          {/* Inline nav links (desktop) */}
          {tabs && (
            <div className="hidden md:flex items-center gap-5 lg:gap-8">
              {tabs.map(t => (
                <button key={t.id} onClick={() => onTabChange(t.id)}
                  className={`text-sm font-semibold transition-colors ${
                    activeTab === t.id ? 'text-nb-green' : 'text-nb-dark/55 hover:text-nb-dark'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {points != null && (
              <span className="flex items-center gap-1 text-sm font-bold text-nb-dark bg-nb-yellow/20 border-2 border-nb-yellow/60 rounded-full px-3 py-1 whitespace-nowrap">
                <img src={starYellow} alt="" className="w-4 h-4 object-contain" /> {points.toLocaleString()} <span className="text-[10px] font-bold text-nb-dark/50">XP</span>
              </span>
            )}

            {tabs ? (
              /* Avatar + dropdown */
              <div className="relative">
                <button onClick={() => setMenuOpen(o => !o)} className="flex items-center gap-1">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-nb-dark text-xs bg-nb-yellow">
                    {avatar || '🙂'}
                  </div>
                  <span className="text-nb-dark/50 text-xs">▾</span>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-lg border border-nb-olive/15 py-1.5 z-50">
                    {userName && <p className="px-4 py-1.5 text-xs text-gray-400 truncate">{userName}</p>}
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-1.5 text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
                      <img src={signOutIcon} alt="" className="w-3.5 h-3.5 object-contain" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Legacy right cluster (other dashboards) */
              <>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${ROLE_BADGE[role]}`}>{role}</span>
                {avatar ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-nb-dark text-xs flex-shrink-0 bg-nb-yellow">{avatar}</div>
                ) : (
                  <span className="text-sm font-semibold text-nb-dark hidden sm:block truncate max-w-[120px]">{userName}</span>
                )}
                <button onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors font-medium whitespace-nowrap">
                  <img src={signOutIcon} alt="" className="w-3 h-3 object-contain" /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav tabs (scrollable) */}
      {tabs && (
        <div className="md:hidden border-t border-gray-100 flex overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button key={t.id} onClick={() => onTabChange(t.id)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
                activeTab === t.id ? 'border-nb-green text-nb-green' : 'border-transparent text-gray-400 hover:text-nb-dark'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Legacy tab-bar slot */}
      {children && <div className="border-t border-gray-100">{children}</div>}
    </nav>
  )
}
