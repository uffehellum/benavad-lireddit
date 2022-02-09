import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();
  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  try {
    await redisClient.connect();
  } catch (e) {
    console.error(e);
  }

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
  }));

  // session middleware is available to apollo be\cause it runs first
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // ten years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      name: "qid", // session cookie name
      resave: false,
      saveUninitialized: false, // don't always create session
      secret: "keyboard cat", // TODO: secret from environment variable
      store: new RedisStore({
        // TypeScript: client is incompatible with client so do a double cast
        client: redisClient as unknown as connectRedis.Client,
        disableTouch: true,
        disableTTL: true,
      }),
    })
  );

  const schema = await buildSchema({
    resolvers: [HelloResolver, PostResolver, UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });

  await apolloServer.start();

  // apollo middleware uses session
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(4000, () => {
    console.log("ready");
  });
};

main().catch((err) => console.error("main error:", err));
