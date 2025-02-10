import * as Hapi from "@hapi/hapi";
import Nes from "@hapi/nes";

async function start(): Promise<void> {
  try {
    const server = new Hapi.Server({
      router: {
        isCaseSensitive: false,
        stripTrailingSlash: true,
      },
      debug: { request: ["error"] },
      host: "0.0.0.0",
      port: 3000,
      routes: {
        auth: false,
      },
    });

    await server.register(Nes);

    server.subscription(`/items/{params*}`, {
      auth: false,
    });

    publishRandomNumbers(server);

    await server.start();
  } catch (e: any) {
    console.error(`Error starting server: ${e.message}`);
    throw e;
  }
}

// Publish a random number every second on a random ID
function publishRandomNumbers(srv: Hapi.Server) {
  const actions = ["update", "delete", "create"];
  setInterval(() => {
    const action = actions[Math.floor(Math.random() * 3)];
    const item = {
      id: Math.floor(Math.random() * 2) + 1,
      value: Math.floor(Math.random() * 100) + 1,
    };
    srv.publish(`/items/changes/${action}/${item.id}`, {
      action,
      item,
    });
    console.log(
      `Published ${item.value} on channel /items/${action}/${item.id}`
    );
  }, 1000);
}

async function init(): Promise<void> {
  await start();
}

void init();
