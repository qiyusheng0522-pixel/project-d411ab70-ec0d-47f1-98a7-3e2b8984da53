import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuestionnaireRunner } from "@/components/QuestionnaireRunner";
import { LIFE_SECTIONS, loadLife, saveLife } from "@/lib/questionnaire";

export const Route = createFileRoute("/questionnaire_/life")({ component: LifePage });

function LifePage() {
  const navigate = useNavigate();
  const existing = typeof window !== "undefined" ? loadLife() : null;
  return (
    <QuestionnaireRunner
      title="患者生活问卷"
      subtitle="约 3 分钟 · 共 5 个部分"
      sections={LIFE_SECTIONS}
      initial={existing?.answers}
      backTo="/questionnaire"
      onSubmit={(answers) => {
        saveLife(answers);
        navigate({ to: "/questionnaire" });
      }}
    />
  );
}