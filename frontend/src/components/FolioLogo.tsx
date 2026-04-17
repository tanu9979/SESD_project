const FolioLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="22" height="28" rx="2" fill="#2D4A3E" />
    <rect x="8" y="6" width="22" height="28" rx="2" fill="#3D6B5A" />
    <path d="M30 22 Q36 18 34 30 Q28 32 30 22Z" fill="#C9A84C" />
    <line x1="13" y1="14" x2="24" y2="14" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="18" x2="24" y2="18" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="13" y1="22" x2="21" y2="22" stroke="#F5F0E8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default FolioLogo;
