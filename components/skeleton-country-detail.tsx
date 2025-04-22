export function SkeletonCountryDetail() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        <div className="w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[3/2] w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>

        <div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-6 w-3/4"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                ))}
            </div>

            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                  </div>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3 mb-2"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                </div>
              ))}
          </div>

          <div className="mt-8">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4 mb-4"></div>
            <div className="flex flex-wrap gap-2">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
