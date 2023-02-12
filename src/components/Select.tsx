import { Dropdown, Spinner } from 'flowbite-react';
import React, { useState } from 'react';

interface Props<T> {
  data: T[];
  label: string;
  isLoading: boolean;
  onChange: (value: T) => void;
}

export function Select<T extends { id: number; name: string; image?: string }>({
  data,
  label,
  isLoading,
  onChange,
}: Props<T>) {
  const [selectedValue, setSelectedValue] = useState<T | null>(null);

  const handleOnChange = (value: T) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <Dropdown
      fullSized={true}
      label={
        <div className="w-full flex gap-5">
          {data && (
            <React.Fragment>
              <p className="text-md">
                {selectedValue ? selectedValue.name : label}
              </p>
              {selectedValue && selectedValue.image && (
                <img
                  width="20"
                  height="20"
                  className="ml-auto"
                  src={selectedValue.image}
                  alt="Framework image"
                />
              )}
            </React.Fragment>
          )}
          {isLoading && (
            <React.Fragment>
              <p className="text-md">Loading...</p>
              <Spinner aria-label="Extra large spinner example" size="xl" />
            </React.Fragment>
          )}
        </div>
      }
    >
      {data &&
        data.map((item) => (
          <Dropdown.Item
            onClick={() => handleOnChange(item)}
            key={item.id}
            value={item.id}
          >
            <div className="w-full flex gap-5">
              <p className="text-xl">{item.name}</p>
              {item.image && (
                <img
                  width="30"
                  height="30"
                  className="ml-auto"
                  src={item.image}
                  alt="Item image"
                />
              )}
            </div>
          </Dropdown.Item>
        ))}
    </Dropdown>
  );
}
