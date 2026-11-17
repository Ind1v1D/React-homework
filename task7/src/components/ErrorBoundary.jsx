import { Component } from "react";
import OfflineNotice from "./OfflineNotice";

const CHUNK_ERROR = /Loading chunk|Loading CSS chunk|dynamically imported module|Importing a module script failed|Failed to fetch/i;

// Catches render errors, mainly failed lazy-page chunk loads while offline.
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isChunkError = CHUNK_ERROR.test(String(error?.message || error));
    const offlineLike = !navigator.onLine || isChunkError;
    // React.lazy caches the failed import, so a chunk error needs a full reload to recover.
    if (offlineLike) {
      return <OfflineNotice onRecovered={isChunkError ? () => window.location.reload() : this.reset} />;
    }

    return (
      <div className="error-box">
        <h3>Something went wrong</h3>
        <p>{error.message || "Unexpected error"}</p>
        <button className="btn btn-outline" onClick={this.reset}>Try again</button>
      </div>
    );
  }
}

export default ErrorBoundary;
