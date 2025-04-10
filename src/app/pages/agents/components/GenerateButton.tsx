"use client";

import { LoadingSpinnerIcon, CreateIcon } from "./icons";

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isLoading,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="font-banner w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <LoadingSpinnerIcon />
          Generating...
        </>
      ) : (
        <>
          <CreateIcon />
          Generate Mashup
        </>
      )}
    </button>
  );
};
