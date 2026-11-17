// Placeholders that mirror the final layout so nothing jumps when data arrives.
function Status({ text }) {
  return <span className="sr-only" role="status">{text}</span>;
}

export function PosterSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="poster skeleton" />
      <div className="skeleton skeleton-line" style={{ width: "80%" }} />
      <div className="skeleton skeleton-line skeleton-line-sm" style={{ width: "40%" }} />
    </div>
  );
}

export function MovieGridSkeleton({ count = 12, label = "Loading movies" }) {
  return (
    <>
      <Status text={label} />
      <div className="grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <PosterSkeleton key={i} />
        ))}
      </div>
    </>
  );
}

export function HeroPostersSkeleton() {
  return (
    <div className="hero-posters" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="poster skeleton" />
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <>
      <Status text="Loading movie" />
      <div className="details" aria-hidden="true">
      <div className="details-poster poster skeleton" />
      <div className="details-info">
        <div className="skeleton skeleton-line skeleton-title" style={{ width: "70%" }} />
        <div className="skeleton skeleton-line" style={{ width: "35%" }} />
        <div className="skeleton skeleton-line skeleton-title" style={{ width: "25%" }} />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line" style={{ width: "60%" }} />
        <div className="skeleton skeleton-block" />
      </div>
      </div>
    </>
  );
}

export function ReviewsSkeleton() {
  return (
    <>
      <Status text="Loading reviews" />
      <div className="review-list" aria-hidden="true">
        {[0, 1].map((i) => (
          <div className="review" key={i}>
            <div className="skeleton skeleton-line" style={{ width: "45%" }} />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line" style={{ width: "70%" }} />
          </div>
        ))}
      </div>
    </>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <Status text="Calculating statistics" />
      <div aria-hidden="true">
      <div className="skeleton skeleton-line skeleton-title" style={{ width: "50%" }} />
      <div className="skeleton skeleton-line" style={{ width: "65%" }} />
      <div className="stats">
        {[0, 1, 2, 3].map((i) => (
          <div className="stat" key={i}>
            <div className="skeleton skeleton-line skeleton-line-sm" style={{ width: "60%" }} />
            <div className="skeleton skeleton-line skeleton-title" style={{ width: "45%" }} />
          </div>
        ))}
      </div>
      <div className="panels">
        {[0, 1, 2].map((i) => (
          <div className="panel" key={i}>
            <div className="skeleton skeleton-line" style={{ width: "40%" }} />
            <div className="skeleton skeleton-block" />
          </div>
        ))}
      </div>
      </div>
    </>
  );
}
