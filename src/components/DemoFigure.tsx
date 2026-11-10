import { motion, useReducedMotion } from 'motion/react'

type Point = [number, number]

interface Pose {
  neck: Point
  hip: Point
  elbow: Point
  hand: Point
  knee: Point
  foot: Point
  knee2: Point
  foot2: Point
}

interface PosePair {
  start: Pose
  end: Pose
  startLabel: string
  endLabel: string
  prop?: 'weight'
  view: string
}

const LYING = '0 50 240 104'
const STANDING = '0 8 240 144'

const standing = (): Pose => ({
  neck: [120, 52],
  hip: [120, 92],
  elbow: [124, 72],
  hand: [124, 92],
  knee: [120, 116],
  foot: [120, 140],
  knee2: [120, 116],
  foot2: [120, 140],
})

// Authored placeholder poses (synthetic), side view, floor at y = 140.
const POSES: Record<string, PosePair> = {
  'push-up': {
    view: LYING,
    startLabel: 'Start',
    endLabel: 'Bottom',
    start: {
      neck: [176, 80],
      hip: [110, 106],
      elbow: [178, 108],
      hand: [180, 134],
      knee: [75, 120],
      foot: [40, 134],
      knee2: [75, 120],
      foot2: [40, 134],
    },
    end: {
      neck: [176, 116],
      hip: [110, 125],
      elbow: [150, 122],
      hand: [180, 134],
      knee: [75, 130],
      foot: [40, 134],
      knee2: [75, 130],
      foot2: [40, 134],
    },
  },
  'reverse-lunge': {
    view: STANDING,
    startLabel: 'Start',
    endLabel: 'Bottom',
    start: standing(),
    end: {
      neck: [130, 50],
      hip: [132, 98],
      elbow: [138, 72],
      hand: [146, 86],
      knee: [156, 116],
      foot: [154, 140],
      knee2: [100, 122],
      foot2: [72, 136],
    },
  },
  plank: {
    view: LYING,
    startLabel: 'Hold',
    endLabel: 'Hold',
    start: {
      neck: [166, 104],
      hip: [104, 119],
      elbow: [166, 134],
      hand: [196, 134],
      knee: [72, 127],
      foot: [40, 134],
      knee2: [72, 127],
      foot2: [40, 134],
    },
    end: {
      neck: [166, 102],
      hip: [104, 115],
      elbow: [166, 134],
      hand: [196, 134],
      knee: [72, 125],
      foot: [40, 134],
      knee2: [72, 125],
      foot2: [40, 134],
    },
  },
  'goblet-squat': {
    view: STANDING,
    startLabel: 'Start',
    endLabel: 'Bottom',
    prop: 'weight',
    start: {
      ...standing(),
      elbow: [134, 76],
      hand: [140, 66],
    },
    end: {
      neck: [114, 62],
      hip: [96, 106],
      elbow: [134, 84],
      hand: [140, 70],
      knee: [134, 98],
      foot: [122, 140],
      knee2: [134, 98],
      foot2: [122, 140],
    },
  },
}

const BONES: [keyof Pose, keyof Pose][] = [
  ['neck', 'hip'],
  ['neck', 'elbow'],
  ['elbow', 'hand'],
  ['hip', 'knee'],
  ['knee', 'foot'],
  ['hip', 'knee2'],
  ['knee2', 'foot2'],
]

function head(p: Pose): Point {
  const dx = p.neck[0] - p.hip[0]
  const dy = p.neck[1] - p.hip[1]
  const len = Math.hypot(dx, dy) || 1
  return [p.neck[0] + (dx / len) * 17, p.neck[1] + (dy / len) * 17]
}

const LIMB = { stroke: 'var(--color-ink)', strokeWidth: 9, strokeLinecap: 'round' as const }

function Floor() {
  return (
    <line
      x1="14"
      x2="226"
      y1="146"
      y2="146"
      stroke="var(--tape)"
      strokeWidth="5"
      strokeLinecap="round"
    />
  )
}

function StaticFrame({ pose, prop, view }: { pose: Pose; prop?: 'weight'; view: string }) {
  const h = head(pose)
  return (
    <svg viewBox={view} className="h-full w-full" aria-hidden="true">
      <Floor />
      {BONES.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={pose[a][0]}
          y1={pose[a][1]}
          x2={pose[b][0]}
          y2={pose[b][1]}
          {...LIMB}
        />
      ))}
      <circle cx={h[0]} cy={h[1]} r="11" fill="var(--color-ink)" />
      {prop === 'weight' && (
        <circle cx={pose.hand[0]} cy={pose.hand[1]} r="8" fill="var(--tape)" />
      )}
    </svg>
  )
}

function LoopingFigure({ pair }: { pair: PosePair }) {
  const hs = head(pair.start)
  const he = head(pair.end)
  const transition = {
    duration: 1.2,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    repeatDelay: 0.3,
    ease: 'easeInOut' as const,
  }
  return (
    <svg viewBox={pair.view} className="h-full w-full" aria-hidden="true">
      <Floor />
      {BONES.map(([a, b]) => (
        <motion.line
          key={`${a}-${b}`}
          initial={{
            x1: pair.start[a][0],
            y1: pair.start[a][1],
            x2: pair.start[b][0],
            y2: pair.start[b][1],
          }}
          animate={{
            x1: pair.end[a][0],
            y1: pair.end[a][1],
            x2: pair.end[b][0],
            y2: pair.end[b][1],
          }}
          transition={transition}
          {...LIMB}
        />
      ))}
      <motion.circle
        r="11"
        fill="var(--color-ink)"
        initial={{ cx: hs[0], cy: hs[1] }}
        animate={{ cx: he[0], cy: he[1] }}
        transition={transition}
      />
      {pair.prop === 'weight' && (
        <motion.circle
          r="8"
          fill="var(--tape)"
          initial={{ cx: pair.start.hand[0], cy: pair.start.hand[1] }}
          animate={{ cx: pair.end.hand[0], cy: pair.end.hand[1] }}
          transition={transition}
        />
      )}
    </svg>
  )
}

export function DemoFigure({ exerciseId, name }: { exerciseId: string; name: string }) {
  const reduce = useReducedMotion()
  const pair = POSES[exerciseId] ?? POSES['push-up']

  return (
    <figure
      className="relative m-0 aspect-[240/104] short:aspect-[240/68] w-full overflow-hidden rounded-3xl bg-surface"
      aria-label={`${name} demo`}
      data-testid="media-slot"
    >
      {reduce ? (
        <div className="grid h-full grid-cols-2 gap-px bg-line">
          <div className="relative bg-surface">
            <StaticFrame pose={pair.start} prop={pair.prop} view={pair.view} />
            <span className="absolute bottom-2 left-3 text-sm font-medium text-muted">
              {pair.startLabel}
            </span>
          </div>
          <div className="relative bg-surface">
            <StaticFrame pose={pair.end} prop={pair.prop} view={pair.view} />
            <span className="absolute bottom-2 left-3 text-sm font-medium text-muted">
              {pair.endLabel}
            </span>
          </div>
        </div>
      ) : (
        <LoopingFigure key={exerciseId} pair={pair} />
      )}
      <figcaption className="absolute top-3 left-4 text-sm font-medium text-muted">
        Demo figure
      </figcaption>
    </figure>
  )
}
