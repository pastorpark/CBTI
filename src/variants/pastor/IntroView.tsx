import type { Survey, SurveyId } from "@/types/test";
import { pastorVariant } from "@/variants/pastor/config";

type PastorIntroViewProps = {
  surveys: Survey[];
  onStart: (surveyId: SurveyId) => void;
};

export function PastorIntroView({ surveys, onStart }: PastorIntroViewProps) {
  return (
    <section className="section intro-section">
      <div className="intro-brand">
        <span className="brand">{pastorVariant.brand}</span>
        <span className="brand-full">{pastorVariant.brandFull}</span>
      </div>
      <div className="intro-copy">
        <h1 className="hero-title">{pastorVariant.introTitle}</h1>
        <p className="lead">{pastorVariant.introLead}</p>
      </div>
      <div className="survey-picker" aria-label="설문 선택">
        {surveys.map((survey) => (
          <button key={survey.id} className="survey-card" onClick={() => onStart(survey.id)}>
            <span className="survey-card-kicker">{survey.id === "additional" ? "15개 문항/1분" : "15개 문항/5분"}</span>
            <strong>{survey.title}</strong>
            <span>{survey.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
