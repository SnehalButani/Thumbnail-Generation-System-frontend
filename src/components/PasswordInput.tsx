import React, { useState } from 'react';
import Input from './Input';

interface PasswordInputProps {
  id: string;
  name: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  placeholder = 'Enter your password',
  value,
  required = false,
  disabled = false,
  autoComplete = 'current-password',
  className = '',
  onChange,
  onFocus,
  onBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const eyeIcon = (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      {showPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>

      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      )}
    </button>
  );

  return (
    <Input
      id={id}
      name={name}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      value={value}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      className={className}
      rightIcon={eyeIcon}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default PasswordInput; 