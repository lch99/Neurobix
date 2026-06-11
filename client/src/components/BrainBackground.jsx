/* Full-screen cream page with the faint WHITE Neurobix brain-mark watermark.
   The mark is inlined as SVG so it is fully self-hosted (no external CDN).
   Shared by the login portal and the login pages so the backdrop stays identical. */

/* Returns a CSS url() of the tiled brain mark in the given stroke colour.
   Reused by the login pages (solid white) and the dashboard hero (faint white). */
export function brainWatermark(stroke = '#FFFFFF') {
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
  <g transform='translate(50,50)' fill='none' stroke='${stroke}' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
    <path d='M50 14 C44 8 34 9 32 18 C22 15 15 23 19 32 C10 35 10 49 19 53 C12 62 19 75 30 72 C33 84 45 85 50 80'/>
    <path d='M50 14 C56 8 66 9 68 18 C78 15 85 23 81 32 C90 35 90 49 81 53 C88 62 81 75 70 72 C67 84 55 85 50 80'/>
    <path d='M44 80 L44 24 L62 80 L62 24'/>
    <circle cx='38' cy='52' r='3.5' fill='${stroke}'/>
    <circle cx='68' cy='42' r='3.5' fill='${stroke}'/>
  </g>
</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const watermark = brainWatermark('#FFFFFF')

export default function BrainBackground({ children, className = '' }) {
  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden bg-nb-cream flex flex-col items-center justify-center px-4 py-10 ${className}`}
      style={{
        backgroundImage: `${watermark}, ${watermark}`,
        backgroundSize: '170px 170px',
        backgroundPosition: '0 0, 85px 85px',
      }}
    >
      {children}
    </div>
  )
}
