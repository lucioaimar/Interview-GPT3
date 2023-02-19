export type TagProps = {
  label?: string;
  color?: string;
  children: React.ReactNode;
};

export const Tag = ({ label, children, color }: TagProps) => {
  return (
    <span
      className={`flex items-center h-fit w-fit px-4 py-2 rounded-full border border-${color} text-${color}`}
    >
      <span className={`font-medium mr-2 text-${color}`}>{label} |</span>
      {children}
    </span>
  );
};
