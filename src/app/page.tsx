"use server";
import HomePageComponent from "@/components/Homepage";
export default async function Home() {
  return (
    <main className=" flex items-center justify-center ">
      <HomePageComponent></HomePageComponent>
    </main>
  );
}
