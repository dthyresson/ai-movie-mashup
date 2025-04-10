"use server";
import { RequestInfo } from "@redwoodjs/sdk/worker";
import MashupAgentClient from "./MashupAgentClient";

interface MashupAgentPageParams {
  firstMovieId?: string;
  secondMovieId?: string;
}

export default function MashupAgentPage({ params }: RequestInfo<MashupAgentPageParams>) {
  return (
    <div className="w-full mx-auto">
      <MashupAgentClient firstMovieId={params.firstMovieId} secondMovieId={params.secondMovieId} />
    </div>
  );
}
