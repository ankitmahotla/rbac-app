export default function AuthLayout({ children }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-12 font-[family-name:var(--font-geist-sans)] bg-white">
      <main className="flex flex-col sm:flex-row gap-12 row-start-2 w-full max-w-6xl">
        <div className="hidden sm:block flex-1">
          <img
            src="auth.jpg"
            alt="auth"
            width={700}
            height={900}
            className="rounded-xl object-cover w-full h-[600px] shadow-lg"
          />
        </div>
        <div className="flex-1 flex flex-col items-center">
          <header className="w-full flex items-center justify-center py-8">
            <span className="text-3xl font-bold tracking-tight select-none">
              RBAC
            </span>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
