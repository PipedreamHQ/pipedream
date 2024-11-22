import { Component } from "react"

type Props = {
  children: React.ReactNode 
  fallback: (err: any) => React.ReactNode 
}

export class ErrorBoundary extends Component<Props> {
  state = {err: undefined}

  static getDerivedStateFromError(err: any) {
    return {err}
  }

  render() {
    const { err } = this.state
    if (err) {
      return this.props.fallback(err)
    }
    return this.props.children
  }
}
