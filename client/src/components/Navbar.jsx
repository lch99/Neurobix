import { useNavigate, useLocation } from 'react-router-dom'
import logoHorizontal from '../assets/Asset 1@3x.png'

// Teacher, Admin and Parent have their own in-page tab bars — no links needed here.
const NAV_LINKS = {
  student: [
    { label: 'Home',        path: '/student' },
    { label: 'Lessons',     path: '/lessons' },
    { label: 'Flash Cards', path: '/student#flashcards' },
    { label: 'Quizzes',     path: '/student#quizzes' },
    { label: 'Rewards',     path: '/student#rewards' },
  ],
}

const ROLE_BADGE = {
  student: 'bg-nb-yellow text-nb-dark',
  teacher: 'bg-nb-green text-white',
  admin:   'bg-nb-dark text-white',
}

export default function Navbar({ role, userName }) {
  const navigate = useNavigate()
  const location = useLocation()
  const links = NAV_LINKS[role] || []

  return (
    <nav className="bg-white border-b-2 border-nb-olive/20 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <img src={logoHorizontal} alt="Neurobix Method" className="h-7 sm:h-9 w-auto object-contain" />
          </div>

          {/* Links — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(link => (
              <a key={link.label} href={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname === link.path
                    ? 'bg-nb-yellow text-nb-dark'
                    : 'text-gray-500 hover:text-nb-dark hover:bg-nb-cream'
                }`}>
                {link.label}
              </a>
            ))}
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${ROLE_BADGE[role]}`}>
              {role}
            </span>
            <span className="text-sm font-semibold text-nb-dark hidden sm:block truncate max-w-[120px]">{userName}</span>
            <button onClick={() => navigate('/login')}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium whitespace-nowrap">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
