import { nutritionImagePaths } from "@/lib/nutrition-assets";
import type { SurveyId } from "@/types/test";

type IvfLoadingView = {
  title: string;
  description: string;
  imagePaths: string[];
};

const resultImagePaths = [
  nutritionImagePaths.CARB,
  nutritionImagePaths.PROTEIN,
  nutritionImagePaths.VITAMIN,
  nutritionImagePaths.MINERAL,
  nutritionImagePaths.PROBIOTICS
];

export const ivfLoadingViews: Record<SurveyId, IvfLoadingView> = {
  cbti: {
    title: "당신은 이런 신앙인이었군요!",
    description: "잠시만 기다려주세요. 당신의 신앙 색깔을 살펴보고 있어요.",
    imagePaths: resultImagePaths
  },
  nutri: {
    title: "당신에게 필요한 영양소를 추천해줄게요!",
    description: "잠시만 기다려주세요. 곧 나아질거에요!",
    imagePaths: resultImagePaths
  }
};

export function getIvfLoadingView(surveyId: SurveyId) {
  return ivfLoadingViews[surveyId];
}
