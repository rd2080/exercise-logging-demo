import type { CSSProperties } from 'react'

/** Five empty tape slots. The first has a strip of tape entering it. */
export function EmptySlots() {
  return (
    <div className="flex gap-1" style={{ '--cut': '12px' } as CSSProperties}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="tape-cut relative h-16 flex-1 overflow-hidden bg-surface-2">
          {i === 0 && (
            <span
              className="tape-fill absolute inset-y-0 left-0 my-auto h-6 w-[58%]"
              style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}
            />
          )}
        </span>
      ))}
    </div>
  )
}
