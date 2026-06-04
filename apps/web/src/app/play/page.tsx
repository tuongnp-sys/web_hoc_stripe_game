import { QuizGame } from "@/components/QuizGame";
import { PlayerStatus } from "@/components/PlayerStatus";

export default function PlayPage() {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <PlayerStatus />
      <QuizGame />
    </div>
  );
}
