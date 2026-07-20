import { brainIcon } from '../assets/icons'

export default function ComingSoon({ title = 'Coming Soon', description }) {
  return (
    <div className="flex items-center justify-center py-10 sm:py-16">
      <div className="bg-white rounded-3xl border-2 border-nb-olive/20 p-8 sm:p-12 text-center max-w-lg">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center p-3.5"
             style={{ background: '#FFEB3C1A' }}>
          <img src={brainIcon} alt="" className="w-full h-full object-contain" />
        </div>
        <span className="inline-block text-[11px] font-black uppercase tracking-widest text-nb-dark px-3 py-1 rounded-full mb-3"
              style={{ background: '#FFEB3C' }}>🚧 Coming Soon</span>
        <h2 className="text-xl sm:text-2xl font-black text-nb-dark">{title}</h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
