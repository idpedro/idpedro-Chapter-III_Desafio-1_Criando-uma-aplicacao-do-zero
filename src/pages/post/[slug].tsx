import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  if (!post)
    return (
      <section className={styles.loading}>
        <p>Carregando...</p>
      </section>
    );

  const getReadTime = (): number => {
    const words = post.data.content.reduce((wordCount, section) => {
      return wordCount + RichText.asText(section.body).split(' ').length;
    }, 0);
    return Math.ceil(words / 200);
  };
  return (
    <section>
      <div className={styles.imgWrapper}>
        <img src={post.data.banner.url} alt="" />
      </div>
      <div className={styles.container}>
        <h1>{post.data.title}</h1>
        <div className={styles.postInfo}>
          <time>
            <FaCalendar />
            {format(new Date(post.first_publication_date), 'd  MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <span>
            <FaUser />
            {post.data.author}
          </span>
          <span>
            <FaClock />
            {`${getReadTime()} min`}
          </span>
        </div>

        {post.data.content.map(json => (
          <div key={json.heading} className={styles.content}>
            <h2>{json.heading}</h2>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: RichText.asHtml(json.body),
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.predicates.at('document.type', 'posts'),
    {
      fetch: ['post.title', 'post.content'],
    }
  );
  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));
  return {
    paths: [{ params: { slug: 'none' } }],
    fallback: true,
  };
};
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.slug as string;
  const prismic = getPrismicClient();
  const post = await prismic.getByUID('posts', slug, {});
  return {
    props: {
      post,
    },
  };
};
