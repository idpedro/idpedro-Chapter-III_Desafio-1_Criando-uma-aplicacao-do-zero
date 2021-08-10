import { GetStaticProps } from 'next';
import { useState } from 'react';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import PostPreviewr from '../components/Post';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(postsPagination: PostPagination): JSX.Element {
  const { results, next_page } = postsPagination;
  const [posts, setPosts] = useState(results);
  const [nextPage, setPageNext] = useState<string | null>(next_page);

  const handlerLoadMorePosts = async (): Promise<void> => {
    try {
      const response = await (await fetch(nextPage)).json();
      const newPosts = response.results as Post[];
      setPageNext(response.next_page);
      setPosts([...posts, ...newPosts]);
    } catch (error) {
      setPageNext(null);
    }
  };

  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      {posts && posts.map(post => <PostPreviewr key={post.uid} post={post} />)}
      {nextPage && (
        <button
          type="button"
          className={styles.loadMore}
          onClick={handlerLoadMorePosts}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 1,
    }
  );
  const { next_page, results } = postsResponse;

  return {
    props: {
      next_page,
      results,
    },
  };
};
