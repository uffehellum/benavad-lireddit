import { MikroORM } from "@mikro-orm/core";
import path from 'path';
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";

const mikroConfig: Parameters<typeof MikroORM.init>[0] = {
  dbName: "lireddit",
  debug: !__prod__,
  entities: [Post, User],
  migrations: {
    path: path.join(__dirname, 'migrations'), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[jt]s$/ // regex pattern for the migration files
  },
  password: "lireddit",
  type: "postgresql",
  user: "lireddit",
};

export default mikroConfig;
