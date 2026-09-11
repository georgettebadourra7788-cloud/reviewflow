const LABELS = ["", "Poor", "Fair", "Good", "Great", "Exceptional"];

export default function StarRating({ value, onChange, size = 48 }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => onChange(n)}
              className="star-btn"
              style={{ width: size, height: size }}
            >
              <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                fill={filled ? "#F59E0B" : "white"}
                stroke={filled ? "#F59E0B" : "#CBD5E1"}
                strokeWidth="1.5"
                className={filled ? "scale-[1.05]" : ""}
              >
                <path d="M12 2.5l2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.8l7.1-.7L12 2.5z" />
              </svg>
            </button>
          );
        })}
      </div>
      <span className="text-xs font-medium tracking-wide text-slate-400 h-4">
        {value ? (
          <span className="text-teal-700 font-semibold">{LABELS[value]}</span>
        ) : (
          "Tap a star to rate"
        )}
      </span>
    </div>
  );
}
