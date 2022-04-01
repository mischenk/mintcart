import { TailSpin } from "react-loader-spinner";

const Loading = () => {
  return (
    <div className="w-full h-full flex align-center justify-center">
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
