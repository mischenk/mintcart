import { format, parseISO } from "date-fns";

const OrdersTable = ({ orders }) => {
  return (
    <table className="mb-8 w-full text-sm text-gray-700">
      <thead>
        <tr className=" mb-4">
          <th className="pr-4  text-left">Product</th>
          <th className="pr-4 w-28 md:w-64 text-left">Buyer</th>
          <th className="pr-4 w-12 md:w-20 text-center">Amount</th>
          <th className="pr-4 w-32 text-left hidden md:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o, i) => (
          <tr key={i} className="border-b border-b-gray-300">
            <td className="py-8 pr-4">{o.product.name}</td>
            <td className=" py-8 pr-4 text-left">
              <div className="block md:hidden">
                {o.buyer && `${o.buyer.slice(0, 6)}...${o.buyer.slice(-4)}`}
              </div>
              <div className="hidden md:block">{o.buyer}</div>
            </td>
            <td className=" py-8 pr-4 text-center">{o.amount}</td>
            <td className=" py-8 pr-4 text-left hidden md:table-cell">
              {format(parseISO(o.created), "MMM dd, yyyy")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
