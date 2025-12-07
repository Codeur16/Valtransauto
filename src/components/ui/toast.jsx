import { cn } from '@/lib/utils';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { X } from 'lucide-react';
import React from 'react';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 right-0 z-[9999] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-4 sm:top-auto sm:flex-col md:max-w-md',
      'space-y-3 sm:space-y-3',
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl p-6 pr-10 shadow-xl transition-all duration-300 ease-out will-change-transform',
  {
    variants: {
      variant: {
        default: 'bg-white border border-gray-100 shadow-lg',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        info: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      },
    },
  }
);

const Toast = React.forwardRef(({ className, variant, ...props }, ref) => {
	return (
		<ToastPrimitives.Root
			ref={ref}
			className={cn(toastVariants({ variant }), className)}
			{...props}
		/>
	);
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-lg border-0 bg-white/20 px-4 text-sm font-medium text-white backdrop-blur-sm',
      'transition-all duration-200 hover:bg-white/30 hover:shadow-sm active:scale-95',
      'focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'group-[[data-variant=default]]:bg-gray-900 group-[[data-variant=default]]:text-white group-[[data-variant=default]]:hover:bg-gray-800',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-full p-1 text-white/70 opacity-0 transition-all',
      'hover:bg-white/20 hover:text-white focus:opacity-100 focus:outline-none',
      'group-hover:opacity-100',
      'group-[[data-variant=default]]:text-gray-500 group-[[data-variant=default]]:hover:text-gray-700',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      'text-sm font-semibold [&+div]:mt-1',
      'group-[[data-variant=default]]:text-gray-900',
      'group-[[data-variant=destructive]]:text-white',
      'group-[[data-variant=success]]:text-white',
      'group-[[data-variant=warning]]:text-white',
      'group-[[data-variant=info]]:text-white',
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      'text-sm leading-relaxed',
      'group-[[data-variant=default]]:text-gray-600',
      'group-[[data-variant=destructive]]:text-red-100',
      'group-[[data-variant=success]]:text-emerald-100',
      'group-[[data-variant=warning]]:text-amber-100',
      'group-[[data-variant=info]]:text-cyan-100',
      className
    )}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
};