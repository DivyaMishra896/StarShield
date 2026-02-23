type RiskUser = {
  user_id: string;
  risk_score: number;
};

export default function RiskTable({ data }: { data?: RiskUser[] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="mt-4 text-gray-500">No suspicious users yet.</p>;
  }

  return (
    <table className="mt-4 w-full border">
      <thead>
        <tr>
          <th className="border p-2">User ID</th>
          <th className="border p-2">Risk Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map((u) => (
          <tr key={u.user_id}>
            <td className="border p-2">{u.user_id}</td>
            <td className="border p-2">{u.risk_score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}