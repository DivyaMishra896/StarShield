export default function Controls({ onRun }: { onRun: () => void }) {
  return (
    <button
      onClick={onRun}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
    >
      Run Detection
    </button>
  );
}