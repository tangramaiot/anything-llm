export default function CTAButton({
  children,
  disabled = false,
  onClick,
  className = "",
}) {
  return (
    <button
      disabled={disabled}
      onClick={() => onClick?.()}
      className={`
        text-xs md:text-sm
        px-2 sm:px-3 md:px-4
        py-1 sm:py-1.5 md:py-2
        font-semibold
        rounded-lg
        bg-purple-600 
        hover:bg-purple-800
        hover:text-white 
        min-h-[30px] sm:min-h-[32px] md:min-h-[34px]
        whitespace-nowrap
        shadow-[0_4px_14px_rgba(0,0,0,0.25)]
        w-fit
        transition-all
        duration-200
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {children}
      </div>
    </button>
  );
}
