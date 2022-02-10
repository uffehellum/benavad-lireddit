import { usePostsQuery } from '../generated/graphql';


export const Posts = () => {
  const [result, reexecuteQuery] = usePostsQuery();
  console.log('result', result);
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <ul>
      {data.posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
};