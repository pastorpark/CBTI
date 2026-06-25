import type { SiteVariantId, Survey, SurveyId } from "@/types/test";

export type SiteVariant = {
  id: SiteVariantId;
  label: string;
  description: string;
  hostnames: string[];
  brand: string;
  brandFull: string;
  introTitle: string;
  introLead: string;
};

export type IntroViewProps = {
  surveys: Survey[];
  onStart: (surveyId: SurveyId) => void;
};
