Walkthrough of Ben Awad full stack exsample
https://github.com/uffehellum/benavad-lireddit
https://www.youtube.com/watch?v=I6ypD7qv3Z8&list=WL&index=135


[Running the app]
    docker-compose up -d

    docker-compose down

    cd back
    yarn watch
    yarn dev

    cd front
    yarn dev


[Docker compose]
- Postgres
- Redis

[Server side]
- yarn watch for continuously building TS
- yarn dev for running Node server
- MikroORM on pg for database
- MikroORM cli for creating db migrations
- ApolloServer for GraphQL schema
- Redis for storing user session
- QID cookie with session id

[Web UI]
- NextJS for react app with pages as routes
- Chakra for UI styles
- URQL for graphQL client
- Codegen for building TS client classes for GraphQL


[Redis]
Note that with newer redis, you need to explicitly connect. Wasted a couple of days thinking I had some configuration wrong.

    const redisClient = createClient({legacyMode: true}); 
    await redisClient.connect();

[urql]
https://formidable.com/open-source/urql/docs/basics/react-preact/

[react-hook-form]
https://react-hook-form.com/ts


[codegen]
front end typescript generation for graphql

yarn add -D @graphql-codegen/cli
yarn add -D @graphql-codegen/typescript-urql
