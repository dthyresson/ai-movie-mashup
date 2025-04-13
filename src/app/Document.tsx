import stylesUrl from "./styles.css?url";

import { TurnstileScript } from "@redwoodjs/sdk/turnstile";
import { Navigation } from "./shared/Navigation";
import { Footer } from "./shared/Footer";

export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Movie Mashups</title>
      <meta
        name="description"
        content="AI Movie Mashups creates mashups of classic movies using AI built with RedwoodSDK and deployed on Cloudflare. It's Pretty Woman meets Die Hard!"
      />
      <meta
        name="keywords"
        content="AI, Movie, Mashups, Movies, Mashup, AI Movie Mashups, AI Movie Mashup, AI Movie Mashup Generator, AI Movie Mashup Creator, AI Movie Mashup Maker, AI Movie Mashup Editor, AI Movie Mashup Generator, AI Movie Mashup Creator, AI Movie Mashup Maker, AI Movie Mashup Editor, RedwoodSDK"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <TurnstileScript />
      <script type="module" src="/src/client.tsx"></script>
      <link rel="stylesheet" href={stylesUrl} />
    </head>
    <body className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-grow">
        <Navigation />
        <div
          id="root"
          className="container mx-auto max-w-screen-xl p-4 flex-grow"
        >
          {children}
        </div>
        <Footer />
      </main>
    </body>
  </html>
);
