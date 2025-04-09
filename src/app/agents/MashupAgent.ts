import { z } from "zod";
import { Agent, unstable_callable as callable } from "agents";
import type { Connection } from "agents";
import { getMovie } from "@/app/pages/movies/functions";
import {
  generatePosterImage,
  generateAudio,
} from "@/app/pages/mashups/functions";
import type { Mashup, Movie } from "@prisma/client";
import { createWorkersAI } from "workers-ai-provider";
import { streamText } from "ai";
import { env } from "cloudflare:workers";
import {
  getMashupPlotPrompt,
  getMashupTitlePrompt,
  getMashupTaglinePrompt,
  getPosterPrompt,
} from "@/app/pages/mashups/prompts";
import { info } from "console";
import { db } from "@/db";
// Pass the Env as a TypeScript type argument
// Any services connected to your Agent or Worker as Bindings
// are then available on this.env.<BINDING_NAME>

// The core class for creating Agents that can maintain state, orchestrate
// complex AI workflows, schedule tasks, and interact with users and other
// Agents.
export class MashupAgent extends Agent<Env> {
  // Called when a new Agent instance starts or wakes from hibernation
  // async onStart() {
  //   console.log("Agent started with state:", this.state);
  // }

  // Handle HTTP requests coming to this Agent instance
  // Returns a Response object
  async onRequest(request: Request): Promise<Response> {
    return new Response("Hello from Agent!");
  }

  // // Called when a WebSocket connection is established
  // // Access the original request via ctx.request for auth etc.
  // async onConnect(connection: Connection, ctx: ConnectionContext) {
  //   // Connections are automatically accepted by the SDK.
  //   // You can also explicitly close a connection here with connection.close()
  //   // Access the Request on ctx.request to inspect headers, cookies and the URL
  // }

  // Called for each message received on a WebSocket connection
  // Message can be string, ArrayBuffer, or ArrayBufferView
  async onMessage(connection: Connection, message: string) {
    // Handle incoming messages
    try {
      const messageSchema = z.object({
        movie1: z.string(),
        movie2: z.string(),
      });

      try {
        const parsedMessage = messageSchema.parse(JSON.parse(message));

        console.log(
          `Selected movies: ${parsedMessage.movie1} and ${parsedMessage.movie2}`,
        );
        console.log(info, "info", connection.id, "connection.id");

        await this.pickMovies(
          connection,
          parsedMessage.movie1,
          parsedMessage.movie2,
        );
      } catch (error) {
        if (error instanceof z.ZodError) {
          // send the error to the client?
          console.error(
            `Error: Invalid message format. ${error.errors.map((e) => e.message).join(", ")}`,
          );
        } else {
          console.error("Error: Failed to parse message");
        }
        return;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
      connection.send("Error: Invalid JSON format");
    }
    connection.send(`Received your message: ${message}`);
    console.log("Message received:", message);
  }

  // Handle WebSocket connection errors
  async onError(
    connectionOrError: Connection | unknown,
    error?: unknown,
  ): Promise<void> {
    if (error !== undefined) {
      // Two parameter version
      console.error(`Connection error:`, error);
    } else {
      // Single parameter version
      console.error(`Error:`, connectionOrError);
    }
  }

  // Handle WebSocket connection close events
  async onClose(
    connection: Connection,
    code: number,
    reason: string,
    wasClean: boolean,
  ): Promise<void> {
    console.log(`Connection closed: ${code} - ${reason}`);
  }

  // Helper function to stream text and update state
  private async streamTextAndUpdateState(
    connection: Connection,
    model: any,
    systemPrompt: string,
    userPrompt: string,
    assistantPrompt: string,
    stateKey: keyof Mashup,
    initialValue: string = "",
    maxTokens?: number,
  ): Promise<string> {
    let result = initialValue;

    connection.send(result);

    const { textStream } = streamText({
      model,
      maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
        { role: "assistant", content: assistantPrompt },
      ],
    });

    for await (const delta of textStream) {
      const s = {
        [stateKey]: delta,
      };

      result += delta;

      connection.send(JSON.stringify(s));
    }

    return result;
  }

  // Helper function to generate poster image
  private async generatePoster(
    connection: Connection,
    model: any,
    title: string,
    tagline: string,
    plot: string,
  ): Promise<{ imageKey: string; imageDescription: string }> {
    // Generate poster description
    const {
      systemPrompt: posterSystemPrompt,
      userPrompt: posterUserPrompt,
      assistantPrompt: posterAssistantPrompt,
    } = getPosterPrompt(title, tagline, plot);

    const imageDescription = await this.streamTextAndUpdateState(
      connection,
      model,
      posterSystemPrompt,
      posterUserPrompt,
      posterAssistantPrompt,
      "imageDescription",
      "",
      512,
    );

    connection.send(JSON.stringify({ imageDescription }));

    // Generate the poster image
    const imageKey = await generatePosterImage(imageDescription);

    connection.send(JSON.stringify({ imageKey }));
    return { imageKey, imageDescription };
  }

  // Helper function to generate audio
  private async generateAudioContent(
    connection: Connection,
    title: string,
    tagline: string,
    plot: string,
  ): Promise<string> {
    const audioKey = await generateAudio(title, tagline, plot);

    connection.send(JSON.stringify({ audioKey }));

    return audioKey;
  }

  private async pickMovies(
    connection: Connection,
    movie1: string,
    movie2: string,
  ) {
    console.log("Picking movies:", movie1, movie2);

    const workersai = createWorkersAI({ binding: env.AI });
    const model = workersai("@cf/meta/llama-3.1-8b-instruct", {
      safePrompt: true,
    });

    // Find both movies
    const movie1Data = await getMovie(movie1);
    const movie2Data = await getMovie(movie2);

    // If both movies are found, generate the mashup content
    if (movie1Data && movie2Data) {
      // Generate title
      const {
        systemPrompt: titleSystemPrompt,
        userPrompt: titleUserPrompt,
        assistantPrompt: titleAssistantPrompt,
      } = getMashupTitlePrompt(movie1Data, movie2Data);

      const title = await this.streamTextAndUpdateState(
        connection,
        model,
        titleSystemPrompt,
        titleUserPrompt,
        titleAssistantPrompt,
        "title",
        "",
      );

      // Generate tagline
      const {
        systemPrompt: taglineSystemPrompt,
        userPrompt: taglineUserPrompt,
        assistantPrompt: taglineAssistantPrompt,
      } = getMashupTaglinePrompt(title, movie1Data, movie2Data);

      const tagline = await this.streamTextAndUpdateState(
        connection,
        model,
        taglineSystemPrompt,
        taglineUserPrompt,
        taglineAssistantPrompt,
        "tagline",
        "",
        512,
      );

      // Generate plot
      const {
        systemPrompt: plotSystemPrompt,
        userPrompt: plotUserPrompt,
        assistantPrompt: plotAssistantPrompt,
      } = getMashupPlotPrompt(title, tagline, movie1Data, movie2Data);

      const plot = await this.streamTextAndUpdateState(
        connection,
        model,
        plotSystemPrompt,
        plotUserPrompt,
        plotAssistantPrompt,
        "plot",
        "",
      );

      // Generate poster
      const { imageKey, imageDescription } = await this.generatePoster(
        connection,
        model,
        title,
        tagline,
        plot,
      );

      // Generate audio
      const audioKey = await this.generateAudioContent(
        connection,
        title,
        tagline,
        plot,
      );

      const mashup = await db.mashup.create({
        data: {
          title,
          tagline,
          plot,
          imageKey,
          imageDescription,
          audioKey,
          movie1: {
            connect: {
              id: movie1,
            },
          },
          movie2: {
            connect: {
              id: movie2,
            },
          },
          status: "COMPLETED",
        },
      });

      console.log(`created mashup: ${mashup.title}`);

      return `created mashup: ${mashup.title}`;
    }

    return `failed to pick movies`;
  }
}
