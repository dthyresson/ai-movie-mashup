import { Agent, unstable_callable as callable, } from "agents";
import type { Connection } from "agents";

// Pass the Env as a TypeScript type argument
// Any services connected to your Agent or Worker as Bindings
// are then available on this.env.<BINDING_NAME>

type State = {
  counter: number;
  messages: string[];
  lastUpdated: Date | null;
};

// The core class for creating Agents that can maintain state, orchestrate
// complex AI workflows, schedule tasks, and interact with users and other
// Agents.
export class MyAgent extends Agent<Env, State> {
  // Optional initial state definition
  initialState = {
    counter: 0,
    messages: [],
    lastUpdated: null,
  };

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
    connection.send("Received your message");
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

  // // Called when the Agent's state is updated from any source
  // // source can be "server" or a client Connection
  // onStateUpdate(state: State, source: "server" | Connection) {
  //   console.log("State updated:", state, "Source:", source);
  // }

  // // You can define your own custom methods to be called by requests,
  // // WebSocket messages, or scheduled tasks
  // async customProcessingMethod(data: any) {
  //   // Process data, update state, schedule tasks, etc.
  //   this.setState({ ...this.state, lastUpdated: new Date() });
  // }
}
