import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";

import { useChainId, Web3Provider } from "../../../context/Web3Context";

import { BsCheckCircle } from "react-icons/bs";

import SimpleLayout from "../../../components/SimpleLayout";
import Loading from "../../../components/ui/Loading";

const OrderSummaryContent = () => {
  const router = useRouter();
  const { seller, id } = router.query;

  const chainId = useChainId();

  const [product, setProduct] = useState();
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seller || !id) return;

    axios.get(`/api/${chainId}/${seller}/orders/${id}`).then((result) => {
      setProduct(result.data.product);
      setOrder(result.data.order);
      setLoading(false);
    });
  }, [seller, id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h2 className="mb-8 md:mb-16 font-semibold text-2xl text-center">
        <BsCheckCircle className="h-12 w-12 mx-auto mb-4" />
        Thank you for your purchase!
      </h2>

      <section className="mb-8">
        <h3 className="mb-4 font-semibold">Customer</h3>
        <div className="text-gray-800 text-sm">
          <div>{order.name}</div>
          <div>{order.email}</div>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="mb-4 font-semibold">Order summary</h3>
        <div className="flex w-full text-gray-800  text-sm">
          <div className="grow">
            {order.amount} x {product.name}
          </div>
          <div>{Number(product.price) * Number(order.amount)} eth</div>
        </div>
      </section>
    </div>
  );
};

const OrderSummary = (props) => {
  return (
    <Web3Provider>
      <SimpleLayout>
        <OrderSummaryContent {...props} />
      </SimpleLayout>
    </Web3Provider>
  );
};

export default OrderSummary;
