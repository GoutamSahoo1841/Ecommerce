import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20',
    outline: 'border border-border bg-background hover:bg-muted hover:text-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-lg px-3 text-xs',
    lg: 'h-11 rounded-2xl px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
