import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TERMS, formatTermRange,
  getTermWeekCount, getCurrentTermWeek, getLessonsByWeek,
  SUBJECT_META, TYPE_ICON, TYPE_COLOR, STATUS_STYLE, STATUS_LABEL,
} from '../data/lessons'

const TERM_STATUS_DOT = {
  active:    'bg-nb-green',
  upcoming:  'bg-blue-400',
  completed: 'bg-gray-300',
}

export default function WeeklySchedule({ readOnly = false }) {
  const navigate = useNavigate()
  const { term: currentTerm, week: currentWeek } = getCurrentTermWeek()
  const [termId, setTermId] = useState(currentTerm.id)
  const term = TERMS.find(t => t.id === termId) || currentTerm
  const isCurrentTerm = term.id === currentTerm.id

  const weekCount = getTermWeekCount(term)
  const byWeek = getLessonsByWeek(term.id)
  const [selectedWeek, setSelectedWeek] = useState(isCurrentTerm ? currentWeek : 1)

  function selectTerm(t) {
    setTermId(t.id)
    setSelectedWeek(t.id === currentTerm.id ? currentWeek : 1)
  }

  const weekLessons = byWeek[selectedWeek] || []
  const bySubject = weekLessons.reduce((acc, l) => {
    (acc[l.subject] ||= []).push(l)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-nb-dark">🗓️ Weekly Schedule</h2>
          <p className="text-sm text-gray-400 mt-0.5">See what's coming up each week across all your classes.</p>
        </div>
        <span className="hidden sm:inline-block text-xs text-gray-400 flex-shrink-0">{weekLessons.length} {weekLessons.length === 1 ? 'class' : 'classes'}</span>
      </div>

      {/* Term selector */}
      <div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TERMS.map(t => (
            <button key={t.id} onClick={() => selectTerm(t)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                t.id === term.id ? 'bg-nb-green text-white' : 'bg-nb-cream/60 text-gray-500 hover:bg-nb-cream'
              }`}>
              <span className={`w-2 h-2 rounded-full ${t.id === term.id ? 'bg-white' : TERM_STATUS_DOT[t.status]}`} />
              {t.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">{formatTermRange(term)} · ~{weekCount} weeks{isCurrentTerm ? ' · currently in progress' : ''}</p>
      </div>

      {/* Week selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {Array.from({ length: weekCount }, (_, i) => i + 1).map(w => {
          const hasContent = !!byWeek[w]
          const isNow = isCurrentTerm && w === currentWeek
          const isSelected = w === selectedWeek
          return (
            <button key={w} onClick={() => setSelectedWeek(w)}
              className={`relative flex-shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                isSelected
                  ? 'bg-nb-yellow text-nb-dark shadow-sm'
                  : hasContent
                    ? 'bg-nb-cream/60 text-gray-500 hover:bg-nb-cream'
                    : 'bg-gray-50 text-gray-300'
              }`}>
              Wk {w}
              {isNow && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-nb-green border-2 border-white" />}
            </button>
          )
        })}
      </div>

      {/* Selected week content */}
      <div className="border-t border-nb-olive/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm sm:text-base text-nb-dark">
            Week {selectedWeek}
            {isCurrentTerm && selectedWeek === currentWeek && (
              <span className="ml-2 text-[10px] font-black bg-nb-green text-white px-2 py-1 rounded-full align-middle">THIS WEEK</span>
            )}
          </h3>
          <span className="sm:hidden text-xs text-gray-400">{weekLessons.length} {weekLessons.length === 1 ? 'class' : 'classes'}</span>
        </div>

        {weekLessons.length === 0 ? (
          <div className="py-8 flex flex-col items-center gap-2 text-center">
            <span className="text-3xl">📭</span>
            <p className="text-sm text-gray-400">No classes scheduled for this week.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, lessons]) => {
              const meta = SUBJECT_META[subject] || {}
              return (
                <div key={subject}>
                  <div className="flex items-center gap-2 mb-2">
                    {meta.icon && <img src={meta.icon} alt="" className="w-5 h-5 object-contain" />}
                    <span className="font-bold text-sm text-nb-dark">{subject}</span>
                  </div>
                  <div className="space-y-2">
                    {lessons.map(l => (
                      <button key={l.id} disabled={readOnly} onClick={() => navigate(`/lessons/${l.id}`)}
                        className={`w-full flex items-center gap-3 rounded-xl bg-nb-cream/40 px-3.5 py-2.5 text-left transition ${
                          readOnly ? 'cursor-default' : 'hover:bg-nb-cream/70'
                        }`}>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLOR[l.type]}`}>
                          {TYPE_ICON[l.type]} {l.type}
                        </span>
                        <span className="flex-1 min-w-0 text-sm font-bold text-nb-dark truncate">{l.title}</span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">⏱ {l.duration}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${STATUS_STYLE[l.status]}`}>
                          {STATUS_LABEL[l.status]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
