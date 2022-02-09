
```
docker-compose up -d

docker-compose down

cd back
yarn watch
yarn dev

cd front
yarn dev
```

[About Redis]
Note that with newer redis, you need to explicitly connect. Wasted a couple of days thinking I had some configuration wrong.
const redisClient = createClient({legacyMode: true}); 
await redisClient.connect();

[urql]
https://formidable.com/open-source/urql/docs/basics/react-preact/

[codegen]
front end typescript generation for graphql

yarn add -D @graphql-codegen/cli
yarn add -D @graphql-codegen/typescript-urql