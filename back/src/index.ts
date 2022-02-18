import "reflect-metadata";
import { SESSION_COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { ConnectionOptions, createConnection } from "typeorm";
import { User } from "./entities/User";
import { Post } from "./entities/Post";

const main = async () => {
  const options: ConnectionOptions = {
    type: "postgres",  
    database: "lireddit2",
    username: "lireddit",
    password: "lireddit",
    logging: true,
    synchronize: true,
    entities: [User, Post]
  };
  const conn = await createConnection(options);
  // conn.runMigrations();
  const app = express();
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  // session middleware is available to apollo be\cause it runs first
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // ten years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      name: SESSION_COOKIE_NAME,
      resave: false,
      saveUninitialized: false, // don't always create session
      secret: "keyboard cat", // TODO: secret from environment variable
      store: new RedisStore({
        client: redis,
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
    context: ({ req, res }): MyContext => ({ req, res, redis }),
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
