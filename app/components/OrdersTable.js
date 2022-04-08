const OrdersTable = ({ orders }) => {
  return (
    <table className="mb-8 w-full text-sm text-gray-700">
      <thead>
        <tr className="flex mb-4">
          <th className="pr-4 grow text-left">Email</th>
          <th className="pr-4 grow text-left">Name</th>
          <th className="pr-4 w-32 text-center">Amount</th>
          <th className="pr-4 w-32 text-center">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="flex border-b border-b-gray-300">
            <td className="py-6 pr-4 grow">{o.email}</td>
            <td className="py-6 pr-4 grow">{o.name}</td>
            <td className="w-32 py-6 pr-4  text-center">{o.amount}</td>
            <td className="w-32 py-6 pr-4  text-center">{o.created}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
