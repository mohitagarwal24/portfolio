import Link from "next/link";
export default function NotFound() {
  return (
    <div className="not-found section-inner">
      <Link className="wordmark" href="/">
        MA
      </Link>
      <p className="eyebrow">404 / Page not found</p>
      <h1 className="display-heading">A loose end.</h1>
      <p>
        This page doesn&apos;t exist. There&apos;s plenty to explore back at the
        portfolio.
      </p>
      <Link href="/#work" className="button button-dark">
        Explore my work ↗
      </Link>
    </div>
  );
}
