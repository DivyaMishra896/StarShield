"use client";

interface ControlsProps {
  onRun: () => void;
  isLoading: boolean;
}

export default function Controls({ onRun, isLoading }: ControlsProps) {
  return (
    <div className="flex justify-center w-full">
      <button
        onClick={onRun}
        disabled={isLoading}
        className={`
          relative flex items-center justify-center gap-2 px-8 py-4 font-bold text-white 
          rounded-full transition-all duration-300 ease-out outline-none
          ${isLoading 
            ? "bg-slate-700 cursor-not-allowed opacity-80" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer"
          }
        `}
      >
        {isLoading ? (
          <>
            {/* Tailwind Spinner */}
            <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Analyzing Swarm Topology...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
            </svg>
            <span>Run Detection Engine</span>
          </>
        )}
      </button>
    </div>
  );
}