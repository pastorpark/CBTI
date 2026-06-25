import type { Survey, SurveyId } from "@/types/test";
import { ivfVariant } from "@/variants/ivf/config";

type IvfIntroViewProps = {
  surveys: Survey[];
  onStart: (surveyId: SurveyId) => void;
};

export function IvfIntroView({ surveys, onStart }: IvfIntroViewProps) {
  return (
    <section className="section intro-section">
      <figure className="ivf-hero-deco" aria-hidden="true">
        <img src="/ivf/clay-hero.png" alt="" />
      </figure>
      <div className="intro-brand">
        <span className="brand">{ivfVariant.brand}</span>
        <span className="brand-full">{ivfVariant.brandFull}</span>
      </div>
      <div className="intro-copy">
        <h1 className="hero-title">{ivfVariant.introTitle}</h1>
        <p className="lead">{ivfVariant.introLead}</p>
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
