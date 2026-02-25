interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

// Sharp star SVG component
const SharpStar = ({ className, size }: { className?: string; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      strokeLinejoin="miter"
      strokeLinecap="square"
    />
  </svg>
)

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = false,
  interactive = false,
  onRatingChange
}: StarRatingProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24
  }

  const pixelSize = sizeMap[size]

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= Math.round(rating)
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0
        
        return (
          <button
            key={i}
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            type="button"
          >
            <SharpStar
              size={pixelSize}
              className={
                isFilled 
                  ? 'fill-yellow-400 stroke-black stroke-[1.5]' 
                  : isPartial
                  ? 'fill-yellow-400/50 stroke-black stroke-[1.5]'
                  : 'fill-white stroke-black stroke-[1.5]'
              }
            />
          </button>
        )
      })}
      {showNumber && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
