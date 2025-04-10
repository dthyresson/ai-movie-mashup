"use server";

import { link } from "@/app/shared/links";

interface PresetMashup {
    id: string;
    movie1: {
        id: string;
        title: string;
    };
    movie2: {
        id: string;
        title: string;
    };
}

const PRESET_MASHUPS: PresetMashup[] = [
    {
        id: "ghost-manchurian",
        movie1: {
            id: "251-ghost",
            title: "Ghost"
        },
        movie2: {
            id: "982-the-manchurian-candidate",
            title: "The Manchurian Candidate"
        }
    },
    {
        id: "highlander-pink",
        movie1: {
            id: "8009-highlander",
            title: "Highlander"
        },
        movie2: {
            id: "11522-pretty-in-pink",
            title: "Pretty in Pink"
        }
    },
    {
        id: "die-hard-woman",
        movie1: {
            id: "562-die-hard",
            title: "Die Hard"
        },
        movie2: {
            id: "114-pretty-woman",
            title: "Pretty Woman"
        }
    }
];

export const PresetMashups = () => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800">Try These Mashups</h2>
            <div className="flex flex-wrap gap-3">
                {PRESET_MASHUPS.map((preset) => (
                    <a
                        key={preset.id}
                        href={link(`/agents/mashup/:firstMovieId/:secondMovieId`, {
                            firstMovieId: preset.movie1.id,
                            secondMovieId: preset.movie2.id
                        })}
                        className="text-purple-600 hover:text-purple-800 bg-purple-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                        {preset.movie1.title} + {preset.movie2.title}
                    </a>
                ))}
                <a
                    href={link('/api/random-mashup')}
                    className="text-green-600 hover:text-green-800 bg-green-100 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                    I'm Feeling Lucky!
                </a>
            </div>
        </div>
    );
}; 