import React from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-900 shadow-sm transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500': variant === 'primary',
            'bg-purple-50 text-purple-700 hover:bg-purple-100 focus:ring-purple-500': variant === 'secondary',
            'border-2 border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500': variant === 'outline',
            'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500': variant === 'danger',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
