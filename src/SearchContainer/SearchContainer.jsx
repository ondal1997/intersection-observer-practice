import { useRef, useState } from 'react';
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

const mockPosts = [
  {
    id: '0',
    title: '문제가 어려워요',
  },
  {
    id: '1',
    title: '문제 쉬운걸요?',
  },
  {
    id: '2',
    title: '문제 쉬운걸요?2',
  },
  {
    id: '3',
    title: '문제 쉬운걸요?3',
  },
  {
    id: '4',
    title: '문제 쉬운걸요?4',
  },
  {
    id: '5',
    title: '문제 쉬운걸요?5',
  },
  {
    id: '6',
    title: '문제가 어려워요6',
  },
  {
    id: '7',
    title: '문제 쉬운걸요?7',
  },
  {
    id: '8',
    title: '문제 쉬운걸요?8',
  },
  {
    id: '9',
    title: '문제 쉬운걸요?9',
  },
  {
    id: '10',
    title: '문제 쉬운걸요?10',
  },
  {
    id: '11',
    title: '문제 쉬운걸요?11',
  },
  {
    id: '12',
    title: '문제 쉬운걸요?12',
  },
  {
    id: '13',
    title: '문제 쉬운걸요?13',
  },
];

async function fetchPosts({ query, cursor, limit }) {
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  let posts = mockPosts.filter((post) => {
    return post.title.includes(query);
  });

  const totalCount = posts.length;

  if (cursor) {
    posts = posts.filter((post) => {
      return Number(post.id) > Number(cursor);
    });
  }

  if (limit) {
    posts = posts.slice(0, limit);
  }

  return { posts, totalCount };
}

// async function fetchPosts({ query, cursor, limit }) {
//   const searchParams = new URLSearchParams();
//   if (query) searchParams.set('query', query);
//   if (cursor) searchParams.set('cursor', cursor);
//   if (limit) searchParams.set('limit', limit);

//   try {
//     const res = await fetch(`/api/posts?${searchParams}`);
//     const result = await res.json();

//     const { posts, totalCount } = result;
//     return { posts, totalCount };
//   } catch {
//     // TODO : 더 구체적으로 전달하기 또는 try-catch문 없애기
//     throw new Error('fetch 실패');
//   }
// }
