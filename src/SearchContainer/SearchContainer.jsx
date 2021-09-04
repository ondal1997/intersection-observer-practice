import { useRef, useState } from 'react';
import { fetchPosts } from '../api';
import PostList from '../PostList/PostList';
import Trigger from '../Trigger/Trigger';

// TODO : order, filter 추가하기
// TODO : 내부함수 잘 분리하기, 이름 잘 정하기
const LIMIT = 3;

export default function SearchContainer() {
  const [query, setQuery] = useState('');

  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEnd = totalCount === null ? false : posts.length === totalCount;

  // fetch 후 비동기 상태변경 통제하기 위함
  const lastFetchPromise = useRef(null);

  const handleInputQuery = (event) => {
    const { value } = event.target;
    setQuery(value);

    setPosts([]);
    setTotalCount(null);

    if (!value) {
      lastFetchPromise.current = null;
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const fetchPromise = fetchPosts({ query: value, limit: LIMIT });
    lastFetchPromise.current = fetchPromise;

    fetchPromise
      .then(({ posts: fetchedPosts, totalCount: fetchedTotalCount }) => {
        if (lastFetchPromise.current !== fetchPromise) return;
        setIsLoading(false);
        setPosts(fetchedPosts);
        setTotalCount(fetchedTotalCount);
      })
      .catch(() => {
        console.error('fetchPosts() 실패');
      });
  };

  const fetchNextPosts = () => {
    setIsLoading(true);

    const cursor = posts[posts.length - 1].id;
    const fetchPromise = fetchPosts({ query, cursor, limit: LIMIT });
    lastFetchPromise.current = fetchPromise;

    fetchPromise
      .then(({ posts: fetchedPosts, totalCount: fetchedTotalCount }) => {
        if (lastFetchPromise.current !== fetchPromise) return;
        setIsLoading(false);
        setPosts([...posts, ...fetchedPosts]);
        setTotalCount(fetchedTotalCount);
      })
      .catch(() => {
        console.error('fetchPosts() 실패');
      });
  };

  return (
    <div>
      <input value={query} onChange={handleInputQuery} />
      <PostList posts={posts} />
      {isLoading && <div>로드 중...</div>}
      {isEnd && <div>끝</div>}
      {query && !isLoading && !isEnd && <Trigger onIntersect={fetchNextPosts} />}
    </div>
  );
}
