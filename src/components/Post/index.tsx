import Link from 'next/link';
import { FaCalendar, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import styles from './post.module.scss';

interface PostProps {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export default function PostPreviewr({
  post,
}: {
  post: PostProps;
}): JSX.Element {
  const { title, subtitle, author } = post.data;
  return (
    <div className={styles.container}>
      <Link href={`/post/${post.uid}`}>
        <h1>{title}</h1>
      </Link>
      <p>{subtitle}</p>
      <footer>
        <time>
          <FaCalendar />
          {format(new Date(post.first_publication_date), 'd  MMM yyyy', {
            locale: ptBR,
          })}
        </time>
        <span>
          <FaUser />
          {author}
        </span>
      </footer>
    </div>
  );
}
