import { useState } from 'react';
import { fetchPosts } from '../api';
import usePromiseExecutor from '../hooks/usePromiseExecutor';
import PostList from '../PostList/PostList';
import Trigger from '../Trigger/Trigger';

const LIMIT = 3;

// TODO : order, filter 추가하기
// TODO : 내부함수 잘 분리하기, 이름 잘 정하기
// TODO : totalCount로 isEnd를 처리하는 것은 분명한 결함이다. 픽스 요망!
export default function SearchContainer() {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [fetchExecutor, isLoading] = usePromiseExecutor();

  const handleInputQuery = ({ target }) => {
    const { value } = target;

    setQuery(value);
    setPosts([]);
    setTotalCount(null);

    if (!value) {
      fetchExecutor.stop();
      return;
    }

    fetchPostsWithUpdateState({ query: value, limit: LIMIT });
  };

  const fetchNextPostsWithUpdateState = () => {
    const cursor = posts[posts.length - 1].id;
    fetchPostsWithUpdateState({ query, cursor, limit: LIMIT });
  };

  const fetchPostsWithUpdateState = (fetchPostsOption) => {
    const promise = fetchPosts(fetchPostsOption);

    const onFullfilled = ({ posts: fetchedPosts, totalCount: fetchedTotalCount }) => {
      setPosts((currentPosts) => [...currentPosts, ...fetchedPosts]);
      setTotalCount(fetchedTotalCount);
    };

    const onRejected = (err) => {
      console.error(err);
    };

    fetchExecutor.execute(promise, onFullfilled, onRejected);
  };

  const isEnd = totalCount === null ? false : posts.length === totalCount;
  const isSearching = !!query;

  return (
    <div>
      <input value={query} onChange={handleInputQuery} />
      {posts.length > 0 && <PostList posts={posts} />}
      {isLoading && <div>로드 중...</div>}
      {isEnd && <div>끝</div>}
      {isSearching && !isLoading && !isEnd && <Trigger onIntersect={fetchNextPostsWithUpdateState} />}
    </div>
  );
}
