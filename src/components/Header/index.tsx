import Link from 'next/link';
import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';
import {} from 'next';

export default function Header(): JSX.Element {
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <Link href="/">
        <img src="/Logo.svg" alt="logo" />
      </Link>
    </div>
  );
}
