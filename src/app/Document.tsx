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
      <link rel="stylesheet" href="/src/app.css" />
    </head>
    <body className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-grow">
        {/* Header Navigation */}
        <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg border-b-2 border-neutral-900 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold hover:text-neutral-200 transition-colors">
                <a
                  href="/"
                  className="font-banner font-black text-2xl hover:text-purple-200 transition-colors"
                >
                  AI Movie Mashups
                </a>
              </h1>

              <nav className="font-banner">
                <ul className="flex space-x-6">
                  <li>
                    <a
                      href={link("/mashups")}
                      className="hover:text-purple-700 font-bold transition-colors text-lg bg-purple-400 px-4 py-2 rounded-md"
                    >
                      All
                    </a>
                  </li>
                  <li>
                    <a
                      href={link("/agents/mashup")}
                      className="hover:text-purple-700 font-bold transition-colors text-lg bg-purple-400 px-4 py-2 rounded-md"
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
        <div
          id="root"
          className="container mx-auto max-w-screen-xl p-4 flex-grow"
        >
          {children}
        </div>

        {/* Footer */}
        <footer className="font-banner border-purple-600 border-t p-4">
          <div className="flex justify-between text-gray-600">
            <p>© {new Date().getFullYear()} DT</p>
            <p>
              Made with{" "}
              <a
                href="https://www.rwsdk.com"
                target="_blank"
                className="text-purple-600"
              >
                RedwoodSDK
              </a>
            </p>
          </div>
        </footer>
      </main>
    </body>
  </html>
);
