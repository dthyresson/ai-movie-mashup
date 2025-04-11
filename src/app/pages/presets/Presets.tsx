"use server";

import { PresetLink } from "@/app/pages/presets/components/PresetLink";
import { LuckyLink } from "@/app/pages/presets/components/LuckyLink";
import { getAllPresets } from "./functions";

export const Presets = async () => {
  const presets = await getAllPresets();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-banner text-3xl font-bold mb-8 text-neutral-800">
        Movie Mashup Presets
      </h1>

      <div className="mb-8">
        <LuckyLink />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => (
          <PresetLink key={preset.id} preset={preset} />
        ))}
      </div>
    </div>
  );
};
