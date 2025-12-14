declare module 'sonner';
declare module 'react/jsx-runtime';

// Allow any import for xlsx if types are missing
declare module 'xlsx';

// Generic fallback for modules without types used in the app
declare module '*';

// Provide a minimal JSX namespace so TS doesn't complain in editor environments
declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}
