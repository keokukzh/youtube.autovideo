export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
              Create 10x More Content in 10% of the Time
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Transform YouTube videos, podcasts, and blog posts into 10+
              ready-to-publish content formats with AI.
            </p>
            <div className="mt-10 flex justify-center gap-6">
              <button className="rounded-lg bg-indigo-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-indigo-700">
                Get Started Free
              </button>
              <button className="rounded-lg border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
