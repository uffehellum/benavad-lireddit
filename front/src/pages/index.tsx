import { NavBar } from "../components/NavBar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Wrapper } from "../components/Wrapper";

const Index = () => {
  const [data] = usePostsQuery();
  return (
    <Wrapper>
      <NavBar />
      <h1>Halløj!</h1>
      {!data
        ? (<div>loading...</div>)
        : data?.data?.posts.map((r) => <div key={r.id}>{r.title}</div>)}
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
