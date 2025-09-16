import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outline' | 'filled' | 'elevated';
    hoverEffect?: boolean;
  }
>(({ className, variant = 'default', hoverEffect = false, ...props }, ref) => {
  const variants = {
    default: 'bg-card border-border/50',
    outline: 'bg-transparent border-border',
    filled: 'bg-muted/50 border-border/30',
    elevated: 'bg-card border-border/50 shadow-md hover:shadow-lg transition-shadow',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border transition-all duration-200',
        variants[variant],
        hoverEffect && 'hover:border-primary/30 hover:shadow-md',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-1.5 p-6 pb-3',
      'border-b border-border/30',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  }
>(({ className, level: Level = 'h3', ...props }, ref) => (
  <Level
    ref={ref}
    className={cn(
      'font-semibold leading-tight tracking-tight',
      {
        'text-3xl': Level === 'h1',
        'text-2xl': Level === 'h2',
        'text-xl': Level === 'h3',
        'text-lg': Level === 'h4',
        'text-base': Level === 'h5' || Level === 'h6',
      },
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground/90 leading-relaxed', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('p-6 pt-4 space-y-4', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: 'start' | 'center' | 'end' | 'between' | 'around';
  }
>(({ className, align = 'start', ...props }, ref) => {
  const alignment = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-6 pt-0',
        alignment[align],
        'gap-2',
        className
      )}
      {...props}
    />
  );
});
CardFooter.displayName = 'CardFooter';

// Additional card components
const CardImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-hidden rounded-t-xl">
    <img
      ref={ref}
      className={cn('w-full h-auto object-cover', className)}
      {...props}
    />
  </div>
));
CardImage.displayName = 'CardImage';

const CardAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mt-4 pt-4 border-t border-border/20',
      'flex items-center justify-end space-x-2',
      className
    )}
    {...props}
  />
));
CardAction.displayName = 'CardAction';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardAction,
};
