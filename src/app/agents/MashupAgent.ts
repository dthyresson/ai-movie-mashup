import { z } from "zod";
import { Agent, unstable_callable as callable } from "agents";
import type { Connection, ConnectionContext } from "agents";

import { mashupMovies } from "./functions/index";

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

  // Called when a WebSocket connection is established
  // Access the original request via ctx.request for auth etc.
  async onConnect(connection: Connection, ctx: ConnectionContext) {
    // Connections are automatically accepted by the SDK.
    // You can also explicitly close a connection here with connection.close()
    // Access the Request on ctx.request to inspect headers, cookies and the URL
  }

  // Called for each message received on a WebSocket connection
  // Message can be string, ArrayBuffer, or ArrayBufferView
  async onMessage(connection: Connection, message: string) {
    // Handle incoming messages
    // In this case, we are expecting a message with two movie ids
    // to start the mashup process

    let parsedMessage = {
      movie1: "",
      movie2: "",
    };
    try {
      const messageSchema = z.object({
        movie1: z.string(),
        movie2: z.string(),
      });

      try {
        parsedMessage = messageSchema.parse(JSON.parse(message));

        console.log(
          `Selected movies: ${parsedMessage.movie1} and ${parsedMessage.movie2}`,
        );
      } catch (error) {
        if (error instanceof z.ZodError) {
          // send the error to the client?
          console.error(
            `Error: Invalid message format. ${error.errors.map((e) => e.message).join(", ")}`,
          );
        } else {
          console.error("Error: Failed to parse message", error);
        }
        connection.close(1011, "Invalid message format");
        return;
      }
    } catch (error) {
      console.error("Error parsing message to start mashup:", error);
      connection.close(2011, "Error parsing message");
    }
    try {
      await mashupMovies(
        connection,
        parsedMessage.movie1,
        parsedMessage.movie2,
      );
    } catch (error) {
      console.error("Error during mashup:", error);
      connection.close(2012, "Error during mashup");
    }
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
    console.log(`Connection closed: ${code} - ${reason} (clean: ${wasClean})`);

    // Clean up any resources associated with this connection
    try {
      // If there are any ongoing operations for this connection, cancel them
      // This is a good place to clean up any state or resources associated with this connection

      // Log the connection ID for debugging
      console.log(`Cleaned up resources for connection: ${connection.id}`);
    } catch (error) {
      console.error(`Error during connection cleanup: ${error}`);
    }
  }
}
