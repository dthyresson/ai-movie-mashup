"use server";

import { getMashups } from "./functions";
import { MashupCard } from "@/app/pages/mashups/components/MashupCard";
import { link } from "@/app/shared/links";

export async function Mashups() {
  const mashups = await getMashups();

  return (
    <div className="px-4 py-8">
      {mashups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-800 text-lg">No mashups found.</p>
          <div className="flex justify-center mt-4">
            <a
              href={link("/agents/mashup")}
              className="text-white hover:text-purple-700 font-bold transition-colors text-lg bg-purple-400 px-4 py-2 rounded-md"
            >
              Create your first mashup!
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {mashups.map((mashup) => (
            <MashupCard
              key={mashup.id}
              id={mashup.id}
              title={mashup.title}
              tagline={mashup.tagline}
              plot={mashup.plot}
              movie1={mashup.movie1}
              movie2={mashup.movie2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
