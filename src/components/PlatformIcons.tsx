import React from 'react';

export const AmazonIcon: React.FC<{ className?: string; isJp?: boolean }> = ({ className = 'w-5 h-5', isJp = false }) => (
  <div className="relative inline-flex items-center justify-center">
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      {/* Minimal Amazon signature smile-arrow */}
      <path d="M15.42 16.94c-3.77 2.06-8.35 1.57-11.83-.87-.36-.25-.43-.72-.16-1.04.26-.31.73-.34 1.05-.1 3.03 2.12 7.04 2.53 10.33.74.45-.25.96.14.86.63-.05.27-.12.51-.25.64z" fill="#FF9900" />
      <path d="M16.48 15.34c-.16-.21-.86-.1-1.34.1-.14.06-.2.21-.13.34.42.78.9 1.48 1.57 2.08.15.13.38.1.48-.05.57-.86.3-2.07-.58-2.47z" fill="#FF9900" />
      <path d="M12.87 5.25c.02 1.34-.35 2.56-1.38 3.42-1.01.84-2.22 1.09-3.48 1.02-.32-.02-.45-.2-.42-.51.04-.37.33-.51.65-.5 1.52.05 2.87-.52 3.32-2.02.13-.43.19-.89.24-1.34.03-.28.19-.4.47-.39.35.01.58.12.6.32z" />
      <path d="M8.61 8.8c.84-.71 1.74-.78 2.76-.32.22.1.33.26.27.48-.07.24-.26.3-.48.2-1.01-.48-1.92-.37-2.67.37-.16.16-.33.15-.47-.01-.15-.17-.12-.34.09-.54l.5-.18z" />
    </svg>
    {isJp && (
      <span className="absolute -bottom-1 -right-1 text-[9px] font-bold text-red-500 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/50 px-1 rounded-sm leading-none">
        JP
      </span>
    )}
  </div>
);

export const NaverIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#03C75A" />
    <path
      d="M6.5 6.5H9.77L14.23 13.5V6.5H17.5V17.5H14.23L9.77 10.5V17.5H6.5V6.5Z"
      fill="white"
    />
  </svg>
);
