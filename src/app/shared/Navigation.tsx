import { link } from "./links";
import { Film, Clapperboard, Palette, PlusCircle } from "lucide-react";

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

        <nav className="font-banner">
          <ul className="flex space-x-2 lg:space-x-4 text-sm md:text-lg lg:text-lg">
            <li>
              <a
                href={link("/mashups")}
                className="hover:text-purple-700 font-bold transition-colors bg-purple-400 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Clapperboard className="w-4 h-4 md:w-5 md:h-5" />
                <span>Mashups</span>
              </a>
            </li>
            <li>
              <a
                href={link("/movies")}
                className="hover:text-purple-700 font-bold transition-colors bg-purple-400 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Film className="w-4 h-4 md:w-5 md:h-5" />
                <span>Movies</span>
              </a>
            </li>
            <li>
              <a
                href={link("/presets")}
                className="hover:text-purple-700 font-bold transition-colors bg-purple-400 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <Palette className="w-4 h-4 md:w-5 md:h-5" />
                <span>Presets</span>
              </a>
            </li>
            <li>
              <a
                href={link("/mashups/new")}
                className="hover:text-purple-700 font-bold transition-colors bg-purple-400 px-4 py-2 rounded-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                <span>New</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </nav>
);
