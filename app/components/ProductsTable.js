import Link from "next/link";
import { BsBoxArrowUpRight, BsXCircle } from "react-icons/bs";

const ProductsTable = ({ products }) => {
  return (
    <table className="mb-8 w-full text-sm text-gray-700">
      <thead>
        <tr className="flex mb-4">
          <th className="pr-4 grow text-left">Name</th>
          <th className="pr-4 w-32 text-center">Price</th>
          <th className="pr-4 w-32 text-center">Sold</th>
          <th className="w-24"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="flex border-b border-b-gray-300">
            <td className="py-6 pr-4 grow">{p.name}</td>
            <td className="w-32 py-6 pr-4  text-center">{p.price} eth</td>
            <td className="w-32 py-6 pr-4  text-center">
              {p.sold} <span className="hidden sm:inline"> / {p.supply}</span>
            </td>
            <td className="px-4 w-24 flex items-center justify-end">
              <Link href={`/${p.seller}/${p.slug}`}>
                <a target="_blank" className="mr-4 ">
                  <BsBoxArrowUpRight
                    className="h-4 w-4"
                    title="View checkout page"
                  />
                </a>
              </Link>

              <Link href="">
                <a>
                  <BsXCircle className="h-4 w-4" title="Delete product" />
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
