/**
 * Resource hints for improved page load performance
 * Add this to your root layout's head
 */
export function ResourceHints() {
  return (
    <>
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS prefetch for less critical origins */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Preload critical assets */}
      {/* Add your critical CSS/fonts here */}
    </>
  );
}
