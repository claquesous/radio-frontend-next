'use client'

interface LoginButtonProps {
  onClick: () => void
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 dark:bg-slate-600 dark:hover:bg-slate-500
                 text-white font-semibold py-2 px-4 rounded text-sm
                 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-slate-400
                 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-150"
      aria-label="Open login modal"
    >
      Login
    </button>
  )
}
