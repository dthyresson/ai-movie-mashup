import { TurnstileScript } from "@redwoodjs/sdk/turnstile";
import { link } from "@/app/shared/links";
export const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Movie Mashups</title>
      <TurnstileScript />
      <script type="module" src="/src/client.tsx"></script>
      <link rel="stylesheet" href="/src/styles.css" />
    </head>
    <body>
      <main className="container mx-auto max-w-full">
        {/* Header Navigation */}
        <nav className="bg-neutral-600 text-white shadow-md">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold hover:text-neutral-200 transition-colors">
                <a
                  href="/"
                  className="text-2xl font-bold hover:text-neutral-200 transition-colors"
                >
                  AI Movie Mashups
                </a>
              </h1>

              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href={link("/mashups")}
                      className="hover:text-neutral-200 transition-colors"
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      href={link("/mashups/new")}
                      className="hover:text-neutral-200 transition-colors"
                    >
                      New
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div id="root" className="container mx-auto max-w-screen-lg p-4">
          {children}
        </div>

        {/* Footer */}
        <footer className="border-t p-4">
          <div className="flex justify-between text-gray-600">
            <p>© {new Date().getFullYear()} DT</p>
            <p>Made with RedwoodSDK</p>
          </div>
        </footer>
      </main>
    </body>
  </html>
);
