"use client";

interface MashupResultsProps {
  title: string | null;
  tagline: string | null;
  plot: string | null;
  imageKey: string | null;
  imageDescription: string | null;
  audioKey: string | null;
  isGenerating: boolean;
}

export const MashupResults: React.FC<MashupResultsProps> = ({
  title,
  tagline,
  plot,
  imageKey,
  imageDescription,
  audioKey,
  isGenerating,
}) => {
  if (
    !isGenerating &&
    !title &&
    !tagline &&
    !plot &&
    !imageKey &&
    !imageDescription &&
    !audioKey
  ) {
    return null;
  }

  return (
    <div className="font-screenwriter w-full mx-auto p-6 bg-purple-50 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        {title ? (
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">{title}</h1>
        ) : (
          <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
        )}
        {tagline ? (
          <h2 className="text-2xl italic text-gray-600 mb-4">{tagline}</h2>
        ) : (
          <div className="h-8 bg-gray-200 rounded-lg w-2/3 mx-auto mb-4 animate-pulse"></div>
        )}
        {audioKey && audioKey !== "" ? (
          <div className="mt-auto">
            <audio src={`/api/audio/${audioKey}`} controls className="w-full" />
          </div>
        ) : (
          <div className="mt-4 w-full bg-gray-100 p-2 rounded-lg flex items-center justify-center h-8">
            <div className="text-center flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <p className="text-gray-500 text-sm">
                Audio will generate after plot is written
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-2 flex flex-col items-center">
          {imageKey ? (
            <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-2 border-neutral-300">
              <img
                src={`/api/poster/${imageKey}`}
                alt={imageDescription || "Movie poster"}
                className="w-full h-full object-cover rounded-lg p-2"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-lg overflow-hidden shadow-xl border-2 border-neutral-300 bg-gray-100 flex items-center justify-center">
              <div className="text-center p-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">Poster coming soon</p>
                <p className="text-gray-400 text-sm mt-2">
                  AI will generate a poster when the design is complete
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 flex flex-col">
          {plot ? (
            <p className="text-xl text-gray-900 leading-relaxed mb-6">{plot}</p>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-700">
                  Plot Summary
                </h3>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <p className="text-gray-500 text-sm mt-4">
                AI is writing your movie mashup ...
              </p>
            </div>
          )}
        </div>
      </div>

      {imageDescription ? (
        <div className="w-full bg-purple-100 p-4 rounded-lg">
          <p className="text-md text-neutral-500">{imageDescription}</p>
        </div>
      ) : (
        <div className="w-full bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-500 text-sm mt-2 text-center">
            Once we know the mashup plot, we'll design a poster ...
          </p>
        </div>
      )}
    </div>
  );
};
