"use server";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import MashupCreator from "@/app/pages/mashups/components/MashupCreator";
export interface NewMashupParams {
  firstMovieId?: string;
  secondMovieId?: string;
}

export function NewMashup({ params }: RequestInfo<NewMashupParams>) {
  return (
    <div className="w-full mx-auto">
      <MashupCreator
        firstMovieId={params.firstMovieId}
        secondMovieId={params.secondMovieId}
      />
    </div>
  );
}
