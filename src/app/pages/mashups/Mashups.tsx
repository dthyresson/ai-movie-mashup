"use server";

import { getMashups } from "./functions";
import { MashupCard } from "@/app/pages/mashups/components/MashupCard";
import {
  PaginationInfo,
  PaginationControls,
} from "@/app/pages/mashups/components/Pagination";
import { PresetMashups } from "@/app/pages/presets/components/PresetMashups";
import { link } from "@/app/shared/links";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import { getFavoritePresets } from "@/app/pages/presets/functions";

export async function Mashups({ params }: RequestInfo<{ page: string }>) {
  const currentPage = Number(params.page) || 1;
  const {
    mashups,
    totalPages,
    currentPage: page,
    total,
  } = await getMashups(currentPage);

  const presets = await getFavoritePresets(3);

  return (
    <div className="px-4 py-8">
      {mashups.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-6 mt-4">
            <PresetMashups presets={presets} />
            <a
              href={link("/mashups/new")}
              className="text-white hover:text-purple-700 font-bold transition-colors text-lg bg-purple-400 px-4 py-2 rounded-md"
            >
              Create your first mashup!
            </a>
          </div>
        </div>
      ) : (
        <>
          <PresetMashups presets={presets} />
          <PaginationInfo page={page} total={total} />
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
          <PaginationControls currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
