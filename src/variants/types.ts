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
  surveyIntros: Record<SurveyId, SurveyIntroContent>;
  metadata: SiteVariantMetadata;
};

export type SurveyIntroContent = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  startLabel: string;
};

export type ResultMetadataTemplate = {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage: string;
  openGraphImageAlt: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

export type SiteVariantMetadata = {
  siteName: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  creator: string;
  publisher: string;
  openGraph: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  twitter: {
    title: string;
    description: string;
    image: string;
  };
  results: {
    cbti: ResultMetadataTemplate;
    nutri: ResultMetadataTemplate;
  };
};

export type IntroViewProps = {
  surveys: Survey[];
  onStart: (surveyId: SurveyId) => void;
};
