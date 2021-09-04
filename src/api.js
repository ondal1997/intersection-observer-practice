// export async function fetchPosts({ query, cursor, limit }) {
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

export async function fetchPosts({ query, cursor, limit }) {
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
