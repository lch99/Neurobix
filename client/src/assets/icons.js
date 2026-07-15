// Central barrel for the new_assets icon/illustration set.
// Import semantic names from here instead of reaching into assets/new_assets directly,
// so every page stays in sync if an asset is swapped later.
//
// A number of the source "SVG" files are actually multi-megabyte raster images
// (photos/renders) wrapped in an SVG tag, some over 2.5MB each. Those have been
// re-rendered once at icon resolution into src/assets/new_assets_optimized/*.webp
// (see client/optimize_assets.cjs history — 15.76MB -> 0.25MB total, alpha preserved).
// Everything below that is a genuinely small/vector file is still imported straight
// from new_assets/.

// ── Brand ──
export { default as logo }          from './new_assets/logo (green) horizontal 1.png'

// ── Mascots ──
export { default as mascotFemale }  from './new_assets/mascot female hero 1.png'
export { default as mascotMale }    from './new_assets/mascot male hero 1.png'
export { default as mascotRead }    from './new_assets/read mascot.png'
export { default as mascotPoint }   from './new_assets/point mascot.png'
export { default as mascotRocket }  from './new_assets/rocket mascot.png'
export { default as mascotTeach }   from './new_assets/teach mascot.png'
export { default as notebookFemale } from './new_assets/f notebook 1.png'
export { default as notebookMale }   from './new_assets/m notebook 1.png'

// ── Subject icons — optimized, were 2.8MB each ──
export { default as subjectMicroscope } from './new_assets_optimized/Icon 3 (Microscope).webp'

// ── Points / achievements ──
export { default as starYellow }    from './new_assets/star yellow icon.svg'
export { default as starGray }      from './new_assets_optimized/star gray icon.webp'
export { default as starOutline }   from './new_assets/star icon.svg'
export { default as pointsIcon }    from './new_assets/points icon.svg'
// NB: the source "medal icon.svg" is actually a 10-medal numbered sprite sheet
// (same content as assets/badges/rank-N.png) — not usable as a single generic
// medal, so this points at the ribbon/star badge art instead for a clean trophy.
export { default as medalIcon }     from './new_assets_optimized/badge icon.webp'
export { default as badgeIcon }     from './new_assets_optimized/badge icon.webp'
export { default as badgeLockIcon } from './new_assets_optimized/badge lock icon.webp'
export { default as brainIcon }     from './new_assets_optimized/brain icon.webp'
export { default as bookIcon }      from './new_assets_optimized/book icon.webp'
export { default as streakIcon }    from './new_assets_optimized/streak icon.webp'
export { default as rankIcon }      from './new_assets_optimized/rank icon.webp'
export { default as scoreboardIcon } from './new_assets_optimized/scoreboard icon.webp'
export { default as scoreIcon }     from './new_assets_optimized/score icon.webp'

// ── Certificates ──
export { default as certDesign }      from './new_assets/cert design.svg'
export { default as certScience }     from './new_assets_optimized/science cert icon.webp'

// ── Content / feature icons ──
export { default as flashcardIcon }  from './new_assets_optimized/flashcard icon.webp'
export { default as lightBulbIcon }  from './new_assets_optimized/light bulb icon.webp'
export { default as playIcon }       from './new_assets/play icon.svg'

// ── Status icons (small, inline) ──
export { default as lockIcon }        from './new_assets/lock icon.svg'
export { default as inProgressIcon }  from './new_assets/in progress icon.svg'
export { default as overdueIcon }     from './new_assets/overdue icon.svg'
export { default as noDeadlineIcon }  from './new_assets_optimized/no deadline icon.webp'
export { default as passIcon }        from './new_assets_optimized/pass icon.webp'
export { default as assessmentPassIcon } from './new_assets_optimized/quiz pass icon.webp'
export { default as retryIcon }       from './new_assets_optimized/retry icon.webp'
export { default as retryFlatIcon }   from './new_assets/retry flat icon.svg'
export { default as durationIcon }    from './new_assets/duration icon.svg'

// ── Status icons (large, decorative) ──
export { default as inProgress3dIcon } from './new_assets_optimized/in progress 3d icon.webp'
export { default as overdue3dIcon }    from './new_assets_optimized/overdue 3d icon.webp'

// ── Actions / roles ──
export { default as downloadIcon } from './new_assets/download icon.svg'
export { default as previewIcon }  from './new_assets/preview icon.svg'
export { default as signOutIcon }  from './new_assets/sign out icon.svg'
export { default as teacherIcon }  from './new_assets/teacher icon.svg'
export { default as parentIcon }   from './new_assets_optimized/parent icon.webp'

// ── Background pattern ──
export { default as neurobixBgPattern } from './new_assets/neurobix icon background.svg'
