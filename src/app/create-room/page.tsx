import React from "react";
import CreateZenRealmForm from "./user-form";

const room = () => {
  return (
    <div className="mx-auto px-auto p-3 m-6 flex flex-col gap-8 font-bold">
      <h1 className="text-4xl mr-2 ">Create Room </h1>
      <CreateZenRealmForm></CreateZenRealmForm>
    </div>
  );
};

export default room;
