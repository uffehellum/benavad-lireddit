import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
// import {
//   LoginMutation,
//   LogoutMutation,
//   MeDocument,
//   MeQuery,
//   RegisterMutation
// } from "../generated/graphql";
// import { betterUpdateQuery } from "./betterUpdateQuery";

export function createUrqlClient(ssrExchange: any) {
  return createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            changePassword: (_result, _args, cache, _info) => {
              console.log('clearing me');
              cache.invalidate("me");
            },
            login: (_result, _args, cache, _info) => {
              console.log('clearing me');
              cache.invalidate("me");
              // betterUpdateQuery<LoginMutation, MeQuery>(
              //   cache,
              //   { query: MeDocument },
              //   result,
              //   (res, query) => {
              //     if (res.login.errors) {
              //       return query;
              //     }
              //     return {
              //       me: res.login.user,
              //     };
              //   }
              // );
            },
            logout: (_result, _args, cache, _info) => {
              console.log('logout clearing me');
              cache.invalidate("me");
              // betterUpdateQuery<LogoutMutation, MeQuery>(
              //   cache,
              //   { query: MeDocument },
              //   result,
              //   () => ({ me: null })
              // );
            },
            Logout: (_result, _args, cache, _info) => {
              console.log('Logout clearing me');
              cache.invalidate("me");
              // betterUpdateQuery<LogoutMutation, MeQuery>(
              //   cache,
              //   { query: MeDocument },
              //   result,
              //   () => ({ me: null })
              // );
            },
            register: (_result, _args, cache, _info) => {
              console.log('register clearing me');
              cache.invalidate("me");
              // betterUpdateQuery<RegisterMutation, MeQuery>(
              //   cache,
              //   { query: MeDocument },
              //   result,
              //   (res, query) => {
              //     if (res.register.errors) {
              //       return query;
              //     }
              //     return {
              //       me: res.register.user,
              //     };
              //   }
              // );
            },
          },
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
    fetchOptions: {
      credentials: "include" as const,
    },
  });
}
