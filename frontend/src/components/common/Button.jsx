const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  outline: "border border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  icon: "h-10 w-10 border border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
};

const Button = ({ children, variant = "primary", className = "", type = "button", ...props }) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
