import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={`${commonStyles.container} ${styles.container}`}>
      <a href="/">
        <img src="/Logo.svg" alt="logo" />
      </a>
    </div>
  );
}
