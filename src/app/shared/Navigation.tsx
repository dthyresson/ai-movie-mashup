import { link } from "./links";
import { Film, Clapperboard, Palette, PlusCircle } from "lucide-react";

// Server-side navigation component
export const Navigation = () => (
  <nav className="bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-lg border-b-2 border-neutral-900 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold hover:text-neutral-200 transition-colors">
          <a
            href="/"
            className="font-banner font-black text-md md:text-xl lg:text-2xl sm:text-sm hover:text-purple-200 transition-colors flex items-center"
          >
            <img
              src="/favicon.svg"
              alt="Movie Mashups Logo"
              className="inline-block h-6 w-6 mr-2 sm:mr-1"
            />
            <span className="hidden sm:inline">Movie Mashups</span>
            <span className="sm:hidden">Mashups</span>
          </a>
        </h1>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="flex items-center gap-2">
            <a
              href={link("/mashups/new")}
              className="hover:bg-purple-500 font-bold transition-colors bg-purple-600 px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New</span>
            </a>
            <div className="relative group">
              <button
                type="button"
                className="p-2 rounded-md hover:bg-purple-700 transition-colors"
                aria-label="Toggle menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div className="font-banner absolute right-0 mt-2 w-48 bg-purple-800 rounded-md shadow-lg py-1 hidden group-hover:block hover:block before:absolute before:h-2 before:w-full before:-top-2 before:left-0">
                <a
                  href={link("/mashups")}
                  className="px-4 py-3 hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Clapperboard className="w-5 h-5" />
                  <span>Mashups</span>
                </a>
                <a
                  href={link("/movies")}
                  className="px-4 py-3 hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Film className="w-5 h-5" />
                  <span>Movies</span>
                </a>
                <a
                  href={link("/presets")}
                  className="px-4 py-3 hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Palette className="w-5 h-5" />
                  <span>Presets</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:block font-banner">
          <ul className="flex space-x-2 lg:space-x-4 text-sm md:text-lg lg:text-lg items-center">
            <li>
              <a
                href={link("/mashups")}
                className="hover:text-purple-200 font-bold transition-colors px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Clapperboard className="w-4 h-4 md:w-5 md:h-5" />
                <span>Mashups</span>
              </a>
            </li>
            <li>
              <a
                href={link("/movies")}
                className="hover:text-purple-200 font-bold transition-colors px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Film className="w-4 h-4 md:w-5 md:h-5" />
                <span>Movies</span>
              </a>
            </li>
            <li>
              <a
                href={link("/presets")}
                className="hover:text-purple-200 font-bold transition-colors px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
                <span>Presets</span>
              </a>
            </li>
            <li>
              <a
                href={link("/mashups/new")}
                className="hover:bg-purple-500 font-bold transition-colors bg-purple-600 px-6 py-2 rounded-full flex items-center gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span>New Mashup</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </nav>
);
