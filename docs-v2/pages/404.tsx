import { useEffect } from "react"
import { useRouter } from "next/router"

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // 302 redirect (temporary) to home page
    router.replace("/")
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
