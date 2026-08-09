export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header skeleton */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-36 bg-gray-100 dark:bg-gray-800 rounded mt-2 animate-pulse" />
          </div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Agent cards skeleton */}
        <section>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                    <div className="h-3 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1" />
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mt-1" />
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j}>
                      <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-1" />
                      <div className="h-5 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
            >
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 7 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="h-3 w-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-3 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sessions table skeleton */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-9 w-56 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="h-4 w-full max-w-md bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 border-b border-gray-100 dark:border-gray-800/50 flex gap-4"
              >
                <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
