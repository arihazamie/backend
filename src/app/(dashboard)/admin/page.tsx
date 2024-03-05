import { auth0ptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(auth0ptions);

  return <div>Admin ${session?.user?.username} Here</div>;
};

export default page;
