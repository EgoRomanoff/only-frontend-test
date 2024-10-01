import styles from './styles.module.scss'
import Container from "@components/ui/container";

const HistoryBlock = ({ title }: { title: string }) => {
  return (
    <Container fullHeight>
      <section className={styles.block}>
        <h2 className={styles.title}>
          {title}
        </h2>
      </section>
    </Container>
  );
};

export default HistoryBlock;
