import { cancelOrder } from "../../../services/api/orderService";

export default function OrderCard({ order, onOrderCancelled }) {
    const handleCancelOrder = async () => {
        try {
            let data = await cancelOrder(order.id);
            if (data) {
                onOrderCancelled(order.id);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="order-card">
            <h3>Order ID: {order.id}</h3>
            <p>Date: {order.orderDate}</p>
            <p>Total: ${order.amount}</p>
            <p>Status: {order.orderStatus}</p>
            {order.orderStatus !== "CANCELLED" && (
                <button className="cancel-order-button" onClick={handleCancelOrder}>
                    Cancel Order
                </button>
            )}
        </div>
    );
}