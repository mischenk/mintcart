import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center">
      <TailSpin
        ariaLabel="loading-indicator"
        color="#111"
        width={40}
        height={40}
      />
    </div>
  );
};

export default Loading;
