function PostCard({ post }) {
  const { title } = post;
  return <div>{title}</div>;
}

export default function PostList({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
