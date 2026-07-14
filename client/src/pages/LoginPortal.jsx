import { useNavigate } from 'react-router-dom'
import { logo as logoFull } from '../assets/icons'
import charStudent from '../assets/char-student.png'
import charStaff from '../assets/char-staff.png'
import BrainBackground from '../components/BrainBackground'
import ServerStatusBadge from '../components/ServerStatusBadge'

export default function LoginPortal() {
  const navigate = useNavigate()

  return (
    <BrainBackground>
      <div className="relative flex flex-col items-center w-full">
        {/* Logo lockup */}
        <img src={logoFull} alt="Neurobix Method" className="h-8 sm:h-10 object-contain mb-6" />

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-bold text-nb-dark text-center tracking-tight mb-12 sm:mb-16">
          Are you a teacher or a student?
        </h1>

        {/* Two portal cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16">

          {/* Student */}
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => navigate('/login/student')}
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-[2rem] bg-white shadow-lg flex items-center justify-center hover:scale-[1.03] transition-transform"
            >
              <img src={charStudent} alt="Student" className="w-[68%] h-[68%] object-contain" />
            </button>
            <button
              onClick={() => navigate('/login/student')}
              className="px-12 py-2.5 rounded-full bg-nb-green text-white font-bold text-lg shadow-[0_5px_0_rgba(42,77,40,0.4)] hover:bg-nb-dark active:translate-y-0.5 active:shadow-[0_2px_0_rgba(42,77,40,0.4)] transition-all"
            >
              Student
            </button>
          </div>

          {/* Parent / Staff */}
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => navigate('/login/staff')}
              className="w-40 h-40 sm:w-52 sm:h-52 rounded-[2rem] bg-white shadow-lg flex items-center justify-center hover:scale-[1.03] transition-transform"
            >
              <img src={charStaff} alt="Parent / Staff" className="w-[68%] h-[68%] object-contain" />
            </button>
            <button
              onClick={() => navigate('/login/staff')}
              className="px-12 py-2.5 rounded-full bg-nb-green text-white font-bold text-lg shadow-[0_5px_0_rgba(42,77,40,0.4)] hover:bg-nb-dark active:translate-y-0.5 active:shadow-[0_2px_0_rgba(42,77,40,0.4)] transition-all"
            >
              Parent / Staff
            </button>
          </div>
        </div>
      </div>
      <ServerStatusBadge />
    </BrainBackground>
  )
}
