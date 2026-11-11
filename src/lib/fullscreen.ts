/**
 * Full screen for the exercise. Browsers that cannot do it (iPhone Safari, for one) simply do
 * nothing here, and the exercise screen already fills the window.
 */
export function enterFullscreen(): void {
  try {
    const el = document.documentElement
    if (document.fullscreenElement || !el.requestFullscreen) return
    void el.requestFullscreen({ navigationUI: 'hide' }).catch(() => {})
  } catch {
    /* Not available. */
  }
}

export function exitFullscreen(): void {
  try {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
  } catch {
    /* Not available. */
  }
}
