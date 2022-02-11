import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { Posts } from "../components/Posts";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClient";

const PostsPage = () => (
  <Wrapper>
    <NavBar />
    <Posts />
  </Wrapper>
);

export default withUrqlClient(createUrqlClient)(PostsPage);
