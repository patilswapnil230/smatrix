// src/components/LoadingSpinner.jsx
export function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4" role="status">
      <div className="w-10 h-10 rounded-full border-4 border-brand-200 border-t-brand-600 animate-spin" />
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}

// src/components/ErrorMessage.jsx
export function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <span className="text-4xl">⚠️</span>
      <p className="text-red-600 font-medium">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="btn-secondary text-sm py-2 px-4"
      >
        Try Again
      </button>
    </div>
  );
}
