import { useQuery } from 'urql';

const PostsQuery = `
  query {
    posts {
      id
      title
    }
  }
`;

export const Posts = () => {
  const [result, reexecuteQuery] = useQuery({
    query: PostsQuery,
  });
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