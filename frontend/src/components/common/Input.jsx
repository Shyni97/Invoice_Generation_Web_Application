const inputStyles =
  "mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

const Input = ({ as = "input", multiline = false, className = "", ...props }) => {
  const Component = multiline ? "textarea" : as;

  return <Component className={`${inputStyles} ${multiline ? "min-h-[110px] resize-none" : ""} ${className}`} {...props} />;
};

export default Input;
