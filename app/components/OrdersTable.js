import { format, parseISO } from "date-fns";

const OrdersTable = ({ orders }) => {
  return (
    <table className="mb-8 w-full text-sm text-gray-700">
      <thead>
        <tr className=" mb-4">
          <th className="pr-4 text-left">Email</th>
          <th className="pr-4 text-left">Name</th>
          <th className="pr-4 text-left">Product</th>
          <th className="pr-4 w-32 text-left">Amount</th>
          <th className="pr-4 w-32 text-left">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id} className="border-b border-b-gray-300">
            <td className="py-8 pr-4">{o.email}</td>
            <td className="py-8 pr-4">{o.name}</td>
            <td className="py-8 pr-4">{o.product.name}</td>
            <td className="w-32 py-8 pr-4 text-left">{o.amount}</td>
            <td className="w-32 py-8 pr-4 text-left">
              {format(parseISO(o.created), "MMM dd, yyyy")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
