import iconAddSub from '../assets/icons/add-sub.png'
import iconMultiply from '../assets/icons/multiply.png'
import iconFraction from '../assets/icons/fraction.png'
import iconDivide from '../assets/icons/divide.png'
import iconPlaceValue from '../assets/icons/place-value.png'
import iconShapes from '../assets/icons/shapes.png'
import iconQuiz from '../assets/icons/quiz.png'
import iconAlphabet from '../assets/icons/alphabet.png'
import iconReading from '../assets/icons/reading.png'
import iconTense from '../assets/icons/tense.png'
import iconBee from '../assets/icons/science-bee.png'
import iconBookAz from '../assets/icons/book-az.png'
import iconWriting from '../assets/icons/writing.png'
import iconSolarSystem from '../assets/icons/solar-system.png'
import iconPlants from '../assets/icons/plants.png'
import iconHumanBody from '../assets/icons/human-body.png'
import iconForces from '../assets/icons/forces.png'
import iconStatesMatter from '../assets/icons/states-matter.png'
import iconFoodChain from '../assets/icons/food-chain.png'

export const ALL_LESSONS = [
  // Mathematics — Term 1: Whole Numbers & Operations
  { id: 1,  term: 1, title: 'Addition & Subtraction',      subject: 'Mathematics', type: 'video',     status: 'completed',   duration: '12 min', icon: iconAddSub,      difficulty: 'Easy',   desc: 'Master adding and subtracting numbers up to 100 using fun memory tricks!' },
  { id: 2,  term: 1, title: 'Multiplication Tables',        subject: 'Mathematics', type: 'flashcard', status: 'completed',   duration: '10 min', icon: iconMultiply,    difficulty: 'Easy',   desc: 'Flip your way through times tables 1–12 with our visual memory cards.' },
  // Mathematics — Term 2: Fractions & Division
  { id: 3,  term: 2, title: 'Fractions Basics',             subject: 'Mathematics', type: 'quiz',      status: 'in_progress', duration: '15 min', icon: iconFraction,    difficulty: 'Medium', desc: 'Learn numerators, denominators and simple fractions with pizza examples!' },
  { id: 11, term: 2, title: 'Division for Beginners',       subject: 'Mathematics', type: 'video',     status: 'pending',     duration: '14 min', icon: iconDivide,      difficulty: 'Easy',   desc: 'Sharing equally — understand division through real-life situations.' },
  // Mathematics — Term 3: Measurement & Geometry
  { id: 12, term: 3, title: 'Place Value & Digits',         subject: 'Mathematics', type: 'flashcard', status: 'pending',     duration: '12 min', icon: iconPlaceValue,  difficulty: 'Easy',   desc: 'Hundreds, tens, ones — know exactly what each digit means!' },
  { id: 13, term: 3, title: 'Geometry: Shapes',             subject: 'Mathematics', type: 'activity',  status: 'pending',     duration: '18 min', icon: iconShapes,      difficulty: 'Medium', desc: 'Identify 2D & 3D shapes and their properties through interactive drawing.' },
  // Mathematics — Term 4: Data Analysis & Problem Solving
  { id: 14, term: 4, title: 'Word Problems Challenge',      subject: 'Mathematics', type: 'quiz',      status: 'pending',     duration: '20 min', icon: iconQuiz,        difficulty: 'Hard',   desc: 'Apply maths to real-world problems. Think like a mathematician!' },

  // English — Term 1: Phonics & Reading
  { id: 4,  term: 1, title: 'Alphabet Flash Cards',         subject: 'English',     type: 'flashcard', status: 'in_progress', duration: '8 min',  icon: iconAlphabet,    difficulty: 'Easy',   desc: 'Review all 26 letters with pictures and phonics memory cues.' },
  { id: 5,  term: 1, title: 'Reading Comprehension',        subject: 'English',     type: 'reading',   status: 'pending',     duration: '20 min', icon: iconReading,     difficulty: 'Medium', desc: 'Read a short story then answer questions to check your understanding.' },
  // English — Term 2: Grammar & Spelling
  { id: 6,  term: 2, title: 'Grammar: Tenses',              subject: 'English',     type: 'quiz',      status: 'pending',     duration: '15 min', icon: iconTense,       difficulty: 'Medium', desc: 'Past, present and future tense — learn the rules with colourful examples!' },
  { id: 15, term: 2, title: 'Spelling Bee — Level 1',       subject: 'English',     type: 'quiz',      status: 'pending',     duration: '10 min', icon: iconBee,         difficulty: 'Easy',   desc: 'Spell 20 common words correctly using the Neurobix memory method.' },
  // English — Term 3: Vocabulary
  { id: 16, term: 3, title: 'Vocabulary Builder',           subject: 'English',     type: 'flashcard', status: 'pending',     duration: '12 min', icon: iconBookAz,      difficulty: 'Medium', desc: 'Expand your word bank with 30 new words and their meanings.' },
  // English — Term 4: Creative Writing
  { id: 17, term: 4, title: 'Creative Writing Starter',     subject: 'English',     type: 'activity',  status: 'pending',     duration: '25 min', icon: iconWriting,     difficulty: 'Medium', desc: 'Use story prompts and mind maps to write your own short story!' },

  // Science — Term 1: Space
  { id: 7,  term: 1, title: 'The Solar System',             subject: 'Science',     type: 'video',     status: 'in_progress', duration: '18 min', icon: iconSolarSystem,  difficulty: 'Easy',   desc: 'Journey through the 8 planets using the mnemonic "My Very Educated Mother".' },
  // Science — Term 2: Life Science
  { id: 8,  term: 2, title: 'Plants & Photosynthesis',      subject: 'Science',     type: 'reading',   status: 'pending',     duration: '14 min', icon: iconPlants,       difficulty: 'Medium', desc: "Discover how plants turn sunlight into food — nature's own factory!" },
  { id: 18, term: 2, title: 'The Human Body',               subject: 'Science',     type: 'flashcard', status: 'pending',     duration: '16 min', icon: iconHumanBody,    difficulty: 'Medium', desc: 'Learn the major organs and their functions with labelled flash cards.' },
  // Science — Term 3: Physics
  { id: 19, term: 3, title: 'Forces & Motion',              subject: 'Science',     type: 'video',     status: 'pending',     duration: '15 min', icon: iconForces,       difficulty: 'Medium', desc: 'Push, pull, gravity — understand forces through fun experiments!' },
  { id: 20, term: 3, title: 'States of Matter',             subject: 'Science',     type: 'quiz',      status: 'pending',     duration: '12 min', icon: iconStatesMatter, difficulty: 'Easy',   desc: 'Solid, liquid, gas — quiz yourself on how matter changes state.' },
  // Science — Term 4: Ecosystems
  { id: 21, term: 4, title: 'Food Chains & Ecosystems',     subject: 'Science',     type: 'activity',  status: 'pending',     duration: '20 min', icon: iconFoodChain,    difficulty: 'Hard',   desc: 'Build your own food chain and understand how ecosystems balance.' },
]

export const SUBJECTS     = ['All', 'Mathematics', 'English', 'Science']
export const TYPES        = ['All', 'video', 'flashcard', 'quiz', 'reading', 'activity']
export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

export const STATUS_STYLE = {
  completed:   'bg-green-100 text-green-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  pending:     'bg-gray-100 text-gray-500',
}
export const STATUS_LABEL = {
  completed:   '✅ Done',
  in_progress: '▶️ Continue',
  pending:     '🔒 Start',
}
export const DIFF_COLOR = {
  Easy:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard:   'bg-red-100 text-red-600',
}
export const TYPE_COLOR = {
  video:     'bg-blue-100 text-blue-700',
  flashcard: 'bg-purple-100 text-purple-700',
  quiz:      'bg-orange-100 text-orange-700',
  reading:   'bg-nb-cream text-nb-dark border border-nb-olive/30',
  activity:  'bg-pink-100 text-pink-700',
}
export const TYPE_ICON = { video:'🎬', flashcard:'🃏', quiz:'📝', reading:'📄', activity:'🎨' }

export const SUBJECT_META = {
  Mathematics: { emoji: '🔢', color: '#3b82f6', sequential: true  },
  English:     { emoji: '📖', color: '#9333ea', sequential: false },
  Science:     { emoji: '🔬', color: '#36913F', sequential: false },
}
export const SUBJECT_BADGE = {
  Mathematics: 'bg-blue-100 text-blue-700',
  English:     'bg-purple-100 text-purple-700',
  Science:     'bg-green-100 text-green-700',
}

// Returns a Set of lesson IDs that are locked.
// Mathematics only: a lesson is locked if the immediately previous Math lesson
// is not completed (lock propagates forward through the chain).
function computeLockedIds(lessons) {
  const mathLessons = lessons.filter(l => l.subject === 'Mathematics')
  const lockedIds = new Set()
  for (let i = 1; i < mathLessons.length; i++) {
    const prev = mathLessons[i - 1]
    if (prev.status !== 'completed' || lockedIds.has(prev.id)) {
      lockedIds.add(mathLessons[i].id)
    }
  }
  return lockedIds
}

export const LOCKED_IDS = computeLockedIds(ALL_LESSONS)
