import { link } from "@/app/shared/links";

export const LuckyLink = () => {
  return (
    <a
      href={link("/mashups/random-mashup")}
      className="font-banner flex items-center justify-center text-green-600 hover:text-green-800 bg-green-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
    >
      <span>I'm Feeling Lucky!</span>
    </a>
  );
};
