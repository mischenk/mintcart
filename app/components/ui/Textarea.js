const Textarea = ({ className, children, ...rest }) => {
  return (
    <textarea
      className={`mb-4 p-4  border border-gray-500 w-full h-40 text-base ${className}`}
      {...rest}
    >
      {children}
    </textarea>
  );
};

export default Textarea;
