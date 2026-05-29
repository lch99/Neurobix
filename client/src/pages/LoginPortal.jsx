import { useNavigate } from 'react-router-dom'
import logoSquare from '../assets/NM_Square.png'

export default function LoginPortal() {
  const navigate = useNavigate()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-nb-cream overflow-hidden px-4"
         style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, #6FC91118 0%, transparent 55%), radial-gradient(circle at 85% 20%, #FFEB3C18 0%, transparent 55%)' }}>

      {/* Logo */}
      <img src={logoSquare} alt="Neurobix Method" className="w-20 h-20 object-contain mb-2" />
      <h1 className="text-2xl font-black text-nb-dark">Neurobix Method</h1>
      <p className="text-gray-400 text-sm mt-1 mb-10">Who are you logging in as?</p>

      {/* Two big portal cards */}
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">

        {/* Student */}
        <button
          onClick={() => navigate('/login/student')}
          className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl border-2 border-transparent hover:border-nb-yellow hover:scale-[1.03] transition-all group"
          style={{ background: 'linear-gradient(135deg,#FFEB3C,#6FC911)' }}>
          <span className="text-6xl group-hover:scale-110 transition-transform">🎒</span>
          <div className="text-center">
            <p className="text-2xl font-black text-nb-dark">I'm a Student</p>
            <p className="text-nb-dark/60 text-sm mt-1">Age 7 – 12</p>
          </div>
        </button>

        {/* Staff / Parent */}
        <button
          onClick={() => navigate('/login/staff')}
          className="flex-1 rounded-3xl p-8 flex flex-col items-center gap-4 shadow-xl border-2 border-transparent hover:border-nb-green hover:scale-[1.03] transition-all group"
          style={{ background: 'linear-gradient(135deg,#396336,#6FC911)' }}>
          <span className="text-6xl group-hover:scale-110 transition-transform">👩‍🏫</span>
          <div className="text-center">
            <p className="text-2xl font-black text-white">Parent / Staff</p>
            <p className="text-green-200 text-sm mt-1">Teacher · Admin · Parent</p>
          </div>
        </button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 text-xs text-gray-400 text-center">
        © 2025 Neurobix Method Pte Ltd · 6 Raffles Blvd #02-34/35, Singapore 039594
      </p>
    </div>
  )
}
