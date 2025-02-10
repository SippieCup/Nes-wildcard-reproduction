import Nes from "@hapi/nes";
import minimist from "minimist";

// Example usage:
//   npx ts-node client.ts --object items [--instance 42] [--action update]
// or short aliases:
//   npx ts-node client.ts -o items -i 42 -a update

const argv = minimist(process.argv.slice(2), {
  alias: { object: "o", id: "i", action: "a" },
});

const basePath = argv.object;
const id = argv.id;
const action = argv.action;

if (!basePath) {
  console.error(
    "Usage: npx ts-node client.ts --object items [--id 42] [--action update]"
  );
  process.exit(1);
}

let subscriptionPath = `/${basePath}/changes`;

if (action) {
  subscriptionPath += `/${action}`;
}

if (id) {
  subscriptionPath += `/${id}`;
}

// Create a Nes client instance
const client = new Nes.Client("ws://localhost:3000");

async function startWebSocket() {
  try {
    await client.connect({ delay: 1000, maxDelay: 5000, retries: Infinity });

    console.log("Connected to WebSocket server");
    console.log(`Opening channel ${subscriptionPath}`);

    await client.subscribe(subscriptionPath, (update) => {
      console.log("Received:", update);
    });

    console.log(`Subscribed to ${subscriptionPath}`);
    process.stdin.resume();
  } catch (err) {
    console.error("Connection error:", err);
    setTimeout(() => {
      console.log("Reconnecting...");
      startWebSocket();
    }, 5000);
  }
}

startWebSocket();
