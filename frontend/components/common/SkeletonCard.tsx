export function TourCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[4/5] bg-gray-800 rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
          <div className="h-4 bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-10 bg-gray-700 rounded w-32 mt-4"></div>
        </div>
      </div>
    </div>
  )
}

export function DestinationCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative aspect-[3/4] bg-gray-800 rounded-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 space-y-3">
          <div className="h-3 bg-gray-700 rounded w-20"></div>
          <div className="h-7 bg-gray-700 rounded w-2/3"></div>
          <div className="h-3 bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center bg-black animate-pulse">
      <div className="text-center space-y-4">
        <div className="h-12 bg-gray-800 rounded w-64 mx-auto"></div>
        <div className="h-4 bg-gray-800 rounded w-96 mx-auto"></div>
      </div>
    </div>
  )
}
