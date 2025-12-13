interface IconButtonProps {
    onClick: () => void;
    activated: boolean;
    icon: React.ReactNode;
    label?: string;
  }

export function IconButton({ onClick, activated, icon, label }: IconButtonProps) {
    return (
      <button
        onClick={onClick}
        title={label}
        className={`
          relative w-11 h-11 rounded-xl flex items-center justify-center
          transition-all duration-200 group
          ${activated 
            ? 'bg-orange-500 text-white shadow-md scale-105' 
            : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-2 border-gray-200'
          }
        `}
      >
        <div className="w-5 h-5 flex items-center justify-center">
          {icon}
        </div>
        
        {/* Tooltip */}
        {label && (
          <span className="absolute rounded-2xl z-10 left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {label}
          </span>
        )}
      </button>
    );
  }