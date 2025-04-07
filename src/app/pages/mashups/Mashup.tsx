"use server";

import { getMashupById } from "./functions";
import { MashupDetail } from "@/app/pages/mashups/MashupDetail";

export async function Mashup({
  params,
  env,
}: {
  params: { id: string };
  env: Env;
}) {
  const mashup = await getMashupById(params.id);

  if (!mashup) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-neutral-800 mb-4">
          Mashup Not Found
        </h1>
        <p className="text-gray-700">
          The requested mashup could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <MashupDetail
        id={mashup.id}
        status={mashup.status}
        title={mashup.title}
        tagline={mashup.tagline}
        plot={mashup.plot}
        imageDescription={mashup.imageDescription}
        audioKey={mashup.audioKey ?? ""}
        movie1={mashup.movie1}
        movie2={mashup.movie2}
      />
    </div>
  );
}
