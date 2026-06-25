import type { Survey, SurveyId } from "@/types/test";
import { ivfVariant } from "@/variants/ivf/config";

type IvfIntroViewProps = {
  surveys: Survey[];
  onStart: (surveyId: SurveyId) => void;
};

export function IvfIntroView({ surveys, onStart }: IvfIntroViewProps) {
  return (
    <section className="section intro-section ivf-intro-section">
      <div className="intro-brand">
        <span className="brand">{ivfVariant.brand}</span>
        <span className="brand-full">{ivfVariant.brandFull}</span>
      </div>
      <div className="intro-copy">
        <h1 className="hero-title">{ivfVariant.introTitle}</h1>
        <p className="lead">{ivfVariant.introLead}</p>
      </div>
      <div className="survey-picker ivf-survey-picker" aria-label="설문 선택">
        {surveys.map((survey) => (
          <button key={survey.id} className="survey-card ivf-survey-card" onClick={() => onStart(survey.id)}>
            <span className="survey-card-kicker">{survey.questions.length}개 문항</span>
            <strong>{survey.title}</strong>
            <span>{survey.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
