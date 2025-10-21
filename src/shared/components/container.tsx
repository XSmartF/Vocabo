import type { FC } from "react";

const Container: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
  );
};
export default Container;
