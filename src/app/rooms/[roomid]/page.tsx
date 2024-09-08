import RoomPage from "@/components/RoomPage";
import React from "react";

export default function Page({ params }: { params: { roomid: string } }) {
  // You should receive `params` from the dynamic route
  return (
    <div>
      <RoomPage params={params} />
    </div>
  );
}
