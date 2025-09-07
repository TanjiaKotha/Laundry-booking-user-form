// function Confirmation({ orderId, room, slot, pickup }) {
//   return (
//     <div className="confirm">
//       <h3>Order Confirmed ✅</h3>
//       <pre>
//         Order ID: {orderId}
//         Room: {room}
//         Pickup Slot: {slot}
//         Pickup Method: {pickup}
//         Created: {new Date().toLocaleString()}
//       </pre>
//     </div>
//   );
// }

// export default Confirmation;



function Confirmation({ orderId, room, slot, pickup, camp }) {
  return (
    <div className="confirm">
      <h3>Order Confirmed ✅</h3>
      <pre>
        Order ID: {orderId}
        Camp: {camp}
        Room: {room}
        Pickup Slot: {slot}
        Pickup Method: {pickup}
        Created: {new Date().toLocaleString()}
      </pre>
    </div>
  );
}

export default Confirmation;
