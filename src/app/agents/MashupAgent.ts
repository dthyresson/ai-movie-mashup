import { Agent, unstable_callable as callable } from "agents";
import type { Connection } from "agents";
import { db } from "@/db";
import {
  generateMashupTitle,
  generateMashupPlot,
  generateMashupTagline,
  generatePosterImage,
  generatePosterPrompt,
  generateAudio,
} from "@/app/pages/mashups/functions";

import type { Mashup } from "@prisma/client";
// Pass the Env as a TypeScript type argument
// Any services connected to your Agent or Worker as Bindings
// are then available on this.env.<BINDING_NAME>

interface State
  extends Pick<
    Mashup,
    | "title"
    | "tagline"
    | "plot"
    | "movie1Id"
    | "movie2Id"
    | "imageKey"
    | "imageDescription"
    | "audioKey"
  > {}

// The core class for creating Agents that can maintain state, orchestrate
// complex AI workflows, schedule tasks, and interact with users and other
// Agents.
export class MashupAgent extends Agent<Env, State> {
  // Optional initial state definition
  initialState = {
    title: "Pick some movies",
    tagline: "I'll make a mashup of the two movies you choose",
    plot: "And tell you the story of the mashup",
    movie1Id: "",
    movie2Id: "",
    imageKey: "",
    imageDescription: "",
    audioKey: "",
  } as State;

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

  // Called when the Agent's state is updated from any source
  // source can be "server" or a client Connection
  onStateUpdate(state: State, source: "server" | Connection) {
    console.log("State updated:", state, "Source:", source);
  }

  // // You can define your own custom methods to be called by requests,
  // // WebSocket messages, or scheduled tasks
  // async customProcessingMethod(data: any) {
  //   // Process data, update state, schedule tasks, etc.
  //   this.setState({ ...this.state, lastUpdated: new Date() });
  // }

  // @ts-ignore
  @callable()
  async pickMovies(movie1: string, movie2: string) {
    console.log("Picking movies:", movie1, movie2);

    const movie1Data = await db.movie.findUnique({
      where: {
        id: movie1,
      },
    });

    const movie2Data = await db.movie.findUnique({
      where: {
        id: movie2,
      },
    });

    // If both movies are found, generate the mashup content
    if (movie1Data && movie2Data) {
      this.setState({
        ...this.state,
        title: `Mashing up ${movie1Data.title} and ${movie2Data.title} ...`,
        tagline: `...`,
        plot: `...`,
        movie1Id: movie1,
        movie2Id: movie2,
        imageKey: "",
        imageDescription: "",
        audioKey: "",
      });

      const title = await generateMashupTitle(movie1Data, movie2Data);

      this.setState({
        ...this.state,
        title: title,
        tagline: "Writing a tagline...",
      });

      const tagline = await generateMashupTagline(
        title,
        movie1Data,
        movie2Data,
      );

      this.setState({
        ...this.state,
        tagline: tagline,
        plot: "I'm screenwriting a plot ...",
      });

      const plot = await generateMashupPlot(
        title,
        tagline,
        movie1Data,
        movie2Data,
      );

      this.setState({
        ...this.state,
        plot: plot,
      });

      this.setState({
        ...this.state,
        imageDescription: "Designing a poster...",
        imageKey: "",
      });

      // Generate the poster image prompt
      const posterDescription = await generatePosterPrompt(
        title,
        tagline,
        plot,
      );

      this.setState({
        ...this.state,
        imageDescription: posterDescription,
        imageKey: "",
      });

      // Generate the poster image
      const imageKey = await generatePosterImage(posterDescription);

      this.setState({
        ...this.state,
        imageKey,
        imageDescription: posterDescription,
      });

      const audioKey = await generateAudio(title, tagline, plot);

      this.setState({
        ...this.state,
        audioKey,
      });
    }

    return `picked movies: ${movie1} and ${movie2}`;
  }
}
