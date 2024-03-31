import { Heading } from "@/components/ui/heading";
import { authOptions } from "@/utils/authoptions";
import { getServerSession } from "next-auth";

export default async function Home() {
    const Session = await getServerSession(authOptions);

    return (
        <>
            <Heading 
                title={`Merhaba ${Session?.user?.username}`}
                description=""
            />
        </>
    );
}
