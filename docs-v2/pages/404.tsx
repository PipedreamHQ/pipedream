import { useEffect } from "react"
import { useRouter } from "next/router"

/**
 * Custom 404 component - this is a fallback in case the middleware redirect doesn't work
 * The middleware.ts file handles the main redirect logic with a 301 status code
 * This component will only be shown if the middleware fails to redirect
 */
export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Fallback redirect if middleware didn't handle it
    // Using a short timeout to ensure middleware has a chance to run first
    const redirectTimeout = setTimeout(() => {
      router.replace("/")
    }, 100)

    return () => clearTimeout(redirectTimeout)
  }, [
    router,
  ])

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}>
      <div>
        <h1>Page not found</h1>
        <p>Redirecting to home page...</p>
      </div>
    </div>
  )
}
