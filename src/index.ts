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

    server.subscription(`/items/{type}/{id?}`, {
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
  setInterval(() => {
    const id = Math.floor(Math.random() * 2) + 1;
    const value = Math.floor(Math.random() * 100) + 1;
    srv.publish(`/items/changes/${id}`, {
      action: "update",
      item: {
        id,
        value,
      },
    });
    console.log(`Published ${value} on channel /items/${id}`);

    /* 
        Because the subscription path is /item/{type}/{id?}, the following
        subscription should not be necessary, as the id is optional.

        It should be enough to publish on /item/changes/{id} and the 
        subscription on /item/changes should match to it's path.
    */
    // srv.publish(`/items/changes`, action: 'update',
    //    item: {
    //        id: randomId,
    //        value: randomNumber,
    //    });
    // console.log(`Published ${randomNumber} on channel /items/changes`);
  }, 1000);
}

async function init(): Promise<void> {
  await start();
}

void init();
