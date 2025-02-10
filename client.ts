import Nes from "@hapi/nes";

// Get command-line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Please provide a subscription path.");
  process.exit(1);
}

const basePath = args[0];
const instanceId = args[1];
const subscriptionPath = `/${basePath}/changes${
  instanceId ? `/${instanceId}` : ""
}`;

// Create a Nes client instance
const client = new Nes.Client("ws://localhost:3000");

async function startWebSocket() {
  try {
    // Connect to the server with authentication headers
    await client.connect({
      // Reconnection options
      delay: 1000, // Initial reconnection delay (ms)
      maxDelay: 5000, // Maximum reconnection delay (ms)
      retries: Infinity, // Number of reconnection attempts
    });

    console.log("Connected to WebSocket server");

    // Subscribe to the desired path
    await client.subscribe(subscriptionPath, (update) => {
      console.log("Received:", update);
    });

    // await client.subscribe('/aservs/changes', (update) => {
    //     console.log('Received update:', update);
    //   });

    console.log(`Subscribed to ${subscriptionPath}`);

    // Keep the process running
    process.stdin.resume();
  } catch (err) {
    console.error("Connection error:", err);

    // Optional: Attempt to reconnect manually after a delay
    setTimeout(() => {
      console.log("Reconnecting...");
      startWebSocket();
    }, 5000);
  }
}

startWebSocket();
