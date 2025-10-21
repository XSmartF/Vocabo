import type { FC } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

// Default container spacing (previously in spacing.ts)
// Include horizontal padding so pages/components don't need to apply it individually.
const DEFAULT_CONTAINER_CLASSES = "flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6";

const Container: FC<Props> = ({ children, className = "" }) => {
  const classes = `${DEFAULT_CONTAINER_CLASSES} ${className}`.trim();
  return <div className={classes}>{children}</div>;
};

export default Container;