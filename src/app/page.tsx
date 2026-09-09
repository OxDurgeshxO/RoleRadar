import { Landing } from "@/components/landing";
import { ROLE_SEEDS } from "@/db/roles-data";

export default function HomePage() {
  return <Landing roles={ROLE_SEEDS} />;
}
