import Loader from "./Loader";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <Loader />
    </div>
  );
}
