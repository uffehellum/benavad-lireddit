import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient, dedupExchange, fetchExchange } from "urql";
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";

export function createUrqlClient(ssrExchange: any) {
  return createClient({
    url: "http://localhost:4000/graphql",
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (result, _args, cache, _info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.login.errors) {
                    return query;
                  }
                  return {
                    me: res.login.user,
                  };
                }
              );
            },
            logout: (result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                () => ({ me: null })
              );
            },
            register: (result, _args, cache, _info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (res, query) => {
                  if (res.register.errors) {
                    return query;
                  }
                  return {
                    me: res.register.user,
                  };
                }
              );
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
