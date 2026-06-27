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
  metadata: SiteVariantMetadata;
};

export type ResultMetadataTemplate = {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  twitterTitle: string;
  twitterDescription: string;
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
    imageAlt: string;
  };
  twitter: {
    title: string;
    description: string;
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
