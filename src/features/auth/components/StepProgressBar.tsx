export function StepProgressBar({
  currentStep,
  totalSteps = 3,
}: {
  currentStep: number
  totalSteps?: number
}) {
  return (
    <div className="mb-5 flex gap-1.5">
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const isFilledOrActive = idx + 1 <= currentStep

        return (
          <div
            key={idx}
            className="relative flex-1 overflow-hidden rounded-full bg-slate-200"
            style={{ height: '3px' }}
          >
            {/* Sliding fill bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-[#0a0e27] transition-all duration-500 ease-out"
              style={{
                width: isFilledOrActive ? '100%' : '0%',
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

