import React from 'react';

interface InputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  rightIcon,
  onChange,
  onFocus,
  onBlur
}) => {
  const baseClasses = 'appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200';
  
  const rightPaddingClasses = rightIcon ? 'pr-10' : 'pr-3';
  
  const classes = `${baseClasses} ${rightPaddingClasses} ${className}`;
  
  return (
    <div className="relative">
      
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={classes}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors">
            {rightIcon}
          </div>
        </div>
      )}
    </div>
  );
};

export default Input; 