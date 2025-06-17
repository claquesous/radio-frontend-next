import dynamic from 'next/dynamic'
import Link from 'next/link'

const LoginFormClient = dynamic(() => import('./login-form-client'), {
  ssr: false,
  loading: () => null
})

export default function LoginForm() {
  return (
    <div className="ml-4 flex items-center gap-2">
      <LoginFormClient />
    </div>
  )
}
