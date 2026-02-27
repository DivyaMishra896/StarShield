export default function Controls({
  onRun,
  loading,
}: {
  onRun: () => void;
  loading: boolean;
}) {
  return (
    <button
      onClick={onRun}
      disabled={loading}
      className={`mt-4 px-4 py-2 rounded text-white ${
        loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {loading ? "Running…" : "Run Detection"}
    </button>
  );
}