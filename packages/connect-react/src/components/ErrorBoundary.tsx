import {
  Component, type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  fallback: (err: unknown) => ReactNode;
};

export class ErrorBoundary extends Component<Props> {
  state = {
    err: undefined,
  };

  static getDerivedStateFromError(err: unknown) {
    return {
      err,
    };
  }

  render() {
    const { err } = this.state;
    if (err) {
      return this.props.fallback(err);
    }
    return this.props.children;
  }
}
