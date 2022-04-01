const Label = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block mb-1 font-semibold">
      {children}
    </label>
  );
};

export default Label;
