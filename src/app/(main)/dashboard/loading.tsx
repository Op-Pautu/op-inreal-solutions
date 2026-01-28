export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header Skeleton */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse" />
              <div>
                <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-9 w-32 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-white/10 rounded animate-pulse" />
        </div>

        {/* Create Task Form Skeleton */}
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 mb-6">
          <div className="h-7 w-40 bg-white/10 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />
            <div className="h-24 w-full bg-white/10 rounded-lg animate-pulse" />
            <div className="h-12 w-full bg-white/10 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Task List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-5 h-5 bg-white/10 rounded animate-pulse mt-1" />
                <div className="flex-1">
                  <div className="h-6 w-3/4 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="w-9 h-9 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
