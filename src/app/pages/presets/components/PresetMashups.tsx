"use server";

import { PresetLink } from "@/app/pages/presets/components/PresetLink";
import { LuckyLink } from "@/app/pages/presets/components/LuckyLink";
import { PresetWithMovies } from "@/app/pages/presets/types";

export function PresetMashups({ presets }: { presets: PresetWithMovies[] }) {
  return (
    <div className="mb-8">
      <h2 className="font-banner text-xl font-semibold mb-4 text-neutral-800">
        Try These ...
      </h2>
      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <PresetLink key={preset.id} preset={preset} />
        ))}
        <LuckyLink />
      </div>
    </div>
  );
}
