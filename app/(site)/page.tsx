import { catalog } from "@/lib/docs";
import { HomePanel } from "@/components/site/home-panel";

export default function Home() {
  return <HomePanel components={catalog.length} />;
}
