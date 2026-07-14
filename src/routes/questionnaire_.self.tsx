import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { QuestionnaireRunner } from "@/components/QuestionnaireRunner";
import { SELF_SECTIONS, loadSelf, saveSelf } from "@/lib/questionnaire";

export const Route = createFileRoute("/questionnaire_/self")({ component: SelfPage });

function SelfPage() {
  const navigate = useNavigate();
  const existing = typeof window !== "undefined" ? loadSelf() : null;
  return (
    <QuestionnaireRunner
      title="卒中患者自评问卷"
      subtitle="约 5 分钟 · 共 5 个部分"
      sections={SELF_SECTIONS}
      initial={existing?.answers}
      backTo="/questionnaire"
      onSubmit={(answers) => {
        saveSelf(answers);
        navigate({ to: "/questionnaire" });
      }}
    />
  );
}