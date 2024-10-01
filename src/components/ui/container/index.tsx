import { ReactNode } from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";

const Container = ({
  fullHeight,
  className,
  children,
}: {
  fullHeight?: boolean;
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div className={clsx(styles.container, fullHeight && styles.fullHeight, className)}>
      {children}
    </div>
  );
};

export default Container;
