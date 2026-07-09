import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import LessonBrowser from '../components/LessonBrowser'

const TABS = [
  { id: 'home',       icon: '🏠', label: 'Home'       },
  { id: 'lessons',    icon: '📚', label: 'Lessons'    },
  { id: 'flashcards', icon: '🃏', label: 'Flash Cards' },
  { id: 'quizzes',    icon: '📝', label: 'Quizzes'    },
  { id: 'shop',       icon: '🛍️', label: 'Shop'       },
  { id: 'rewards',    icon: '🏆', label: 'Rewards'    },
]

export default function LessonsPage() {
  const navigate = useNavigate()

  function handleTabChange(tab) {
    if (tab === 'lessons') return
    navigate('/student', { state: { tab } })
  }

  return (
    <div className="min-h-screen bg-nb-cream">
      <Navbar role="student" userName="Ahmad bin Hassan" points={1240} avatar="AH"
              tabs={TABS} activeTab="lessons" onTabChange={handleTabChange} />

      <div className="max-w-5xl mx-auto px-4 pb-6">
        <LessonBrowser />
      </div>
    </div>
  )
}
