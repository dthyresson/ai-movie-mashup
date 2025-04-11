import { link } from "./links";

export const Navigation = () => (
  <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg border-b-2 border-neutral-900 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold hover:text-neutral-200 transition-colors">
          <a
            href="/"
            className="font-banner font-black text-2xl hover:text-purple-200 transition-colors"
          >
            <img
              src="/favicon.svg"
              alt="Movie Mashups Logo"
              className="inline-block h-6 w-6 mr-2"
            />
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
                href={link("/presets")}
                className="hover:text-purple-700 font-bold transition-colors text-lg bg-purple-400 px-4 py-2 rounded-md"
              >
                Presets
              </a>
            </li>
            <li>
              <a
                href={link("/mashups/new")}
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
);
