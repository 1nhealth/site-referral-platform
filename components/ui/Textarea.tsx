'use client';

import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showCount = false,
      maxLength,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-primary mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3
            bg-bg-secondary/50 dark:bg-bg-tertiary/50
            border border-glass-border
            rounded-xl
            text-text-primary
            placeholder:text-text-muted
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-mint/50 focus:border-mint
            disabled:opacity-50 disabled:cursor-not-allowed
            resize-none
            ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
            ${className}
          `}
          {...props}
        />
        <div className="flex items-center justify-between mt-1.5">
          <div>
            {error && <p className="text-sm text-error">{error}</p>}
            {helperText && !error && (
              <p className="text-sm text-text-muted">{helperText}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p
              className={`text-xs ${
                charCount >= maxLength ? 'text-error' : 'text-text-muted'
              }`}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
