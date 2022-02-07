import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(name: string = "Bob") {
    return "Hello " + name;
  }
}
