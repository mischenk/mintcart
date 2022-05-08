import Link from "next/link";
import { BsBoxArrowUpRight } from "react-icons/bs";

const ProductsTable = ({ products }) => {
  return (
    <table className="mb-8 w-full text-sm text-gray-700">
      <thead>
        <tr className="mb-4">
          <th className="pr-4 text-left">Name</th>
          <th className="pr-4 w-20 text-center">Price</th>
          <th className="pr-4 w-12 md:w-20 text-center">Sold</th>
          <th className="w-4"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, i) => (
          <tr key={i} className=" border-b border-b-gray-300">
            <td className="py-8 pr-4">{p.name}</td>
            <td className="py-8 pr-4 text-center">{p.price} eth</td>
            <td className="py-8 pr-4 text-center">
              {p.sold} <span className="hidden sm:inline"> / {p.supply}</span>
            </td>
            <td className="pr-4 py-8 flex justify-end">
              <Link href={`/${p.seller}/${p.slug}`}>
                <a target="_blank" className="mr-4 ">
                  <BsBoxArrowUpRight
                    className="h-4 w-4"
                    title="View checkout page"
                  />
                </a>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsTable;
