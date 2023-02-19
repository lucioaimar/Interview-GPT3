import { Spinner, SpinnerSizes } from 'flowbite-react';

export const Loader = ({ size }: { size?: keyof SpinnerSizes }) => {
  return (
    <div className="flex items-center">
      <p className="text-md mr-3">Loading...</p>
      <Spinner aria-label="Extra large spinner example" size={size || 'xl'} />
    </div>
  );
};
