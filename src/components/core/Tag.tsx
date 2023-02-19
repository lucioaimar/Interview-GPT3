export type TagProps = {
  label?: string;
  color?: string;
  children: React.ReactNode;
};

export const Tag = ({ label, children, color }: TagProps) => {
  return (
    <span
      className={`flex h-fit w-fit items-center rounded-full border px-4 py-2 border-${
        color || ""
      } text-${color || ""}`}
    >
      <span className={`mr-2 font-medium text-${color || ""}`}>{label} |</span>
      {children}
    </span>
  );
};
