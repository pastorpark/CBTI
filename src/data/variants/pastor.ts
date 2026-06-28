import { createTestContent } from "@/data/test";
import type { TestContent } from "@/types/test";

const content = {
  personaLabels: {
    Orthodox: "정통 수호형",
    Intellectual: "합리적 지성형",
    Progressive: "진보적 포용형",
    Social: "사회 참여형",
    Liturgical: "예전 전통형",
    Charismatic: "영적 체험형",
    Relational: "관계 중심형"
  },
  personaEnglishLabels: {
    Orthodox: "Orthodox Christian",
    Intellectual: "Intellectual Christian",
    Progressive: "Progressive Christian",
    Social: "Social Christian",
    Liturgical: "Liturgical Christian",
    Charismatic: "Charismatic Christian",
    Relational: "Relational Christian"
  },
  nutritionLabels: {
    CARB: "지적 탄수화물",
    PROTEIN: "관계의 단백질",
    VITAMIN: "연대의 비타민",
    MINERAL: "안식의 미네랄",
    PROBIOTICS: "치유의 유산균"
  },
  surveys: [
    {
      id: "cbti",
      title: "CBTI",
      description: "상세한 질문과 답변을 통해 나의 신앙 성향을 확인하고 추천 교파까지 분석합니다.",
      questions: [
        {
          id: "q1",
          title: "주일 아침, 예배당에 처음 들어설 때 당신이 가장 기대하는 것은?",
          options: [
            {
              id: "q1-o1",
              label: "장엄하고 경건한 성찬식과 분위기",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            },
            {
              id: "q1-o2",
              label: "가슴을 뛰게 하는 뜨거운 밴드 찬양",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q1-o3",
              label: "체계적이고 깊이 있는 목사님의 설교",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q1-o4",
              label: "성도들과 웃으며 나누는 따뜻한 인사",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            },
            {
              id: "q1-o5",
              label: "한 주간 세상 속에서 실천할 다짐",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q2",
          title: "성경을 읽고 묵상할 때, 나의 스타일은?",
          options: [
            {
              id: "q2-o1",
              label: "원어의 뜻과 역사적 배경까지 깊이 파고들기",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q2-o2",
              label: "일점일획도 틀림없는 절대 진리로 굳게 믿기",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q2-o3",
              label: "현대 사회의 소외된 이웃을 향한 메시지 찾기",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q2-o4",
              label: "지금 내 마음을 울리는 성령님의 감동 느끼기",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q2-o5",
              label: "시대의 변화에 맞춰 포용적으로 재해석하기",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q3",
          title: "내가 생각하는 기독교 신앙의 가장 핵심적인 가치는?",
          options: [
            {
              id: "q3-o1",
              label: "십자가 대속을 통한 굳건한 영혼 구원",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q3-o2",
              label: "부조리한 세상을 바꾸는 하나님 나라 실현",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q3-o3",
              label: "2천 년을 변함없이 이어온 거룩한 예식",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            },
            {
              id: "q3-o4",
              label: "이성과 신앙이 조화를 이루는 합리적 믿음",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q3-o5",
              label: "차별과 혐오를 넘어선 조건 없는 환대",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q4",
          title: "예수님은 나에게 어떤 분으로 가장 깊이 다가오시나요?",
          options: [
            {
              id: "q4-o1",
              label: "내 죄를 대속하신 유일한 구원자",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q4-o2",
              label: "억눌린 약자들을 해방하시는 실천가",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q4-o3",
              label: "깊은 진리의 세계로 인도하시는 스승",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q4-o4",
              label: "내 삶에 기적과 위로를 베푸시는 치유자",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q4-o5",
              label: "언제나 내 곁에서 이야기를 들어주시는 친구",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q5",
          title: "심각한 사회 문제를 볼 때 나의 생각은?",
          options: [
            {
              id: "q5-o1",
              label: "교회가 앞장서서 잘못된 제도를 바꿔야 해!",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q5-o2",
              label: "다양한 입장을 포용하며 열린 대화를 해야 해!",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            },
            {
              id: "q5-o3",
              label: "흔들림 없이 성경적인 가치관을 수호해야 해!",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q5-o4",
              label: "이 땅의 회복과 치유를 위해 눈물로 기도해야 해!",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q5-o5",
              label: "거창한 구호보다 내 주변 이웃부터 직접 도와야 해!",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q6",
          title: "내가 가장 선호하고 은혜받는 기도 방식은?",
          options: [
            {
              id: "q6-o1",
              label: "정해진 기도문이나 묵상을 통한 조용한 관상 기도",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            },
            {
              id: "q6-o2",
              label: "두 손을 들고 뜨겁게 부르짖는 통성/방언 기도",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q6-o3",
              label: "논리 정연하게 하나님의 뜻을 구하는 말씀 기도",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q6-o4",
              label: "일상의 소소한 고민을 나누고 지인들을 챙기는 기도",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            },
            {
              id: "q6-o5",
              label: "고통받는 세상의 정의와 평화를 구하는 탄원 기도",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q7",
          title: "교회에서 봉사를 하나 맡아야 한다면, 가장 끌리는 사역은?",
          options: [
            {
              id: "q7-o1",
              label: "성경 공부반 리더나 교리 교육 교사",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q7-o2",
              label: "주일 예배 찬양팀 또는 금요 기도회 인도자",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q7-o3",
              label: "소그룹 리더나 새가족 환영 및 식사 봉사",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            },
            {
              id: "q7-o4",
              label: "지역 사회 소외계층 돕기 및 NGO 연대 활동",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q7-o5",
              label: "예배 예식 준비, 성찬식 도우미, 교회력 관리",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q8",
          title: "내가 생각할 때 '이런 교회는 정말 힘들다' 싶은 곳은?",
          options: [
            {
              id: "q8-o1",
              label: "시대가 변해도 옛날 방식만 고집하는 꽉 막힌 교회",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            },
            {
              id: "q8-o2",
              label: "감정만 앞세우고 말씀과 교리의 깊이가 없는 교회",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q8-o3",
              label: "예배의 거룩함이 무너지고 세속적인 이벤트만 남은 교회",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            },
            {
              id: "q8-o4",
              label: "친목 모임만 있고 복음의 순수성이 흐려진 교회",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q8-o5",
              label: "예배만 드리고 흩어져 끈끈한 정과 돌봄이 없는 교회",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q9",
          title: "내가 생각하는 '가장 건강한 믿음'이란?",
          options: [
            {
              id: "q9-o1",
              label: "세상과 타협하지 않고 정통 교리를 지켜내는 것",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q9-o2",
              label: "이성과 과학 앞에서도 합리적으로 설명할 수 있는 것",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q9-o3",
              label: "이웃 사랑과 사회 정의를 위한 행동으로 증명되는 것",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q9-o4",
              label: "살아계신 하나님을 매일 피부로 뜨겁게 체험하는 것",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q9-o5",
              label: "다름을 인정하고 삶의 모순 속에서도 서로 품어주는 것",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q10",
          title: "역사 속 신앙의 선배들 중, 나의 가슴을 더 뛰게 하는 인물은?",
          options: [
            {
              id: "q10-o1",
              label: "치밀한 논리로 기독교의 뼈대를 세운 바울이나 칼빈",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q10-o2",
              label: "빈민과 인권을 위해 싸운 테레사 수녀나 마틴 루터 킹",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q10-o3",
              label: "성령의 불길로 대부흥을 일으킨 수많은 부흥사들",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q10-o4",
              label: "거룩한 수도원에서 오랜 침묵을 지킨 사막의 교부들",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            },
            {
              id: "q10-o5",
              label: "시대의 아픔에 공감하며 목소리를 낸 디트리히 본회퍼",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q11",
          title: "주일 예배 외에, 나의 신앙을 가장 쑥쑥 자라게 하는 것은?",
          options: [
            {
              id: "q11-o1",
              label: "체계적인 기독교 세계관 교육이나 신학 서적 독서",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q11-o2",
              label: "평일 밤이나 새벽에 성전에서 드리는 뜨거운 기도",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q11-o3",
              label: "평일 저녁, 카페나 집에서 모이는 속회/셀 모임의 나눔",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            },
            {
              id: "q11-o4",
              label: "기후 위기 극복, 인권 보호 등을 위한 기독교 시민 운동",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q11-o5",
              label: "매일 정해진 시간, 일정한 순서대로 드리는 묵상과 기도",
              scores: [
                {
                  persona: "Liturgical",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q12",
          title: "교회 안에서 의견 충돌이나 갈등이 생겼을 때, 가장 이상적인 해결책은?",
          options: [
            {
              id: "q12-o1",
              label: "성경 말씀과 정해진 교회법의 원칙대로 단호하게 처리한다.",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q12-o2",
              label: "감정을 배제하고 논리적인 토론과 합리적인 대화로 조율한다.",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q12-o3",
              label: "서로의 다양성을 인정하고 열린 마음으로 포용하며 화해한다.",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            },
            {
              id: "q12-o4",
              label: "다 함께 모여 금식하며 성령님의 인도하심을 간절히 구한다.",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q12-o5",
              label: "일단 밖에서 따로 만나 밥부터 먹으며 관계부터 회복한다.",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q13",
          title: "세상의 문화를 대하는 나의 기본적인 태도는?",
          options: [
            {
              id: "q13-o1",
              label: "신앙에 방해가 될 수 있으니 철저히 분별하고 거리를 둔다.",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q13-o2",
              label: "기독교적 세계관의 잣대로 분석하고 비판적으로 수용한다.",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q13-o3",
              label: "그 속에 담긴 시대정신을 이해하고 문화 그 자체로 존중한다.",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            },
            {
              id: "q13-o4",
              label: "문화 자체보다 그 속에서 선한 행동과 가치를 찾아 실천한다.",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q13-o5",
              label: "성도들과 함께 즐길 수 있는 좋은 교제와 소통의 도구로 삼는다.",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q14",
          title: "타 종교인이나 비신자를 대할 때, 나의 입장에 가장 가까운 것은?",
          options: [
            {
              id: "q14-o1",
              label: "오직 예수만이 구원이므로 기회가 될 때마다 명확히 복음을 전한다.",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q14-o2",
              label: "합리적인 변증을 통해 기독교 진리의 우수성을 논리적으로 설득한다.",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q14-o3",
              label: "그들의 신념을 깊이 존중하며 평화롭게 공존하는 방법을 찾는다.",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                }
              ]
            },
            {
              id: "q14-o4",
              label: "종교를 따지기 전에 사회 정의와 평화를 위해 먼저 손잡고 연대한다.",
              scores: [
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q14-o5",
              label: "논쟁하기보단 먼저 친근한 이웃이 되어 내 삶으로 사랑을 보여준다.",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        },
        {
          id: "q15",
          title: "만약 내가 어쩔 수 없이 교회를 옮긴다면, 그 결정적인 이유는?",
          options: [
            {
              id: "q15-o1",
              label: "강단의 설교가 성경적이지 않고 복음의 본질이 변질되었을 때",
              scores: [
                {
                  persona: "Orthodox",
                  weight: 1
                }
              ]
            },
            {
              id: "q15-o2",
              label: "교회의 운영 방식이 너무 비합리적이고 반지성적일 때",
              scores: [
                {
                  persona: "Intellectual",
                  weight: 1
                }
              ]
            },
            {
              id: "q15-o3",
              label: "교회가 시대의 아픔이나 사회적 약자를 외면하고 차별할 때",
              scores: [
                {
                  persona: "Progressive",
                  weight: 1
                },
                {
                  persona: "Social",
                  weight: 1
                }
              ]
            },
            {
              id: "q15-o4",
              label: "예배에 성령의 임재가 사라지고 은혜의 감격이 식어버렸을 때",
              scores: [
                {
                  persona: "Charismatic",
                  weight: 1
                }
              ]
            },
            {
              id: "q15-o5",
              label: "성도 간의 진실한 사랑과 끈끈한 공동체성이 완전히 메말랐을 때",
              scores: [
                {
                  persona: "Relational",
                  weight: 1
                }
              ]
            }
          ]
        }
      ],
      resultKeys: [
        "Orthodox",
        "Intellectual",
        "Progressive",
        "Social",
        "Liturgical",
        "Charismatic",
        "Relational"
      ],
      resultLabels: {
        Orthodox: "정통 수호형",
        Intellectual: "합리적 지성형",
        Progressive: "진보적 포용형",
        Social: "사회 참여형",
        Liturgical: "예전 전통형",
        Charismatic: "영적 체험형",
        Relational: "관계 중심형"
      }
    },
    {
      id: "nutri",
      title: "영적 영양상태 분석",
      description: "지금 나의 영적 상태는 어떤 영양소가 필요할까요?",
      questions: [
        {
          id: "nutri-q1",
          title: "설교를 들을 때 \"왜 그럴까?\" 질문하고 논리적으로 파고들기",
          options: [
            {
              id: "nutri-q1-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "CARB",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q1-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "CARB",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q1-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q2",
          title: "신앙적 궁금증을 풀어줄 조금 묵직한 신학/인문학 책 읽기",
          options: [
            {
              id: "nutri-q2-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "CARB",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q2-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "CARB",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q2-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q3",
          title: "'무조건 믿어라'는 말 대신 이성적이고 합리적인 설명 듣기",
          options: [
            {
              id: "nutri-q3-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "CARB",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q3-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "CARB",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q3-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q4",
          title: "정답을 강요하지 않고 내 고민을 있는 그대로 들어주는 모임",
          options: [
            {
              id: "nutri-q4-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q4-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q4-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q5",
          title: "딱딱한 성경 공부보다 각자의 일상과 감정을 솔직하게 나누는 대화",
          options: [
            {
              id: "nutri-q5-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q5-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q5-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q6",
          title: "완벽한 척하지 않아도 되는 다정하고 느슨한 사람들과의 연대",
          options: [
            {
              id: "nutri-q6-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q6-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROTEIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q6-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q7",
          title: "기후 위기, 차별 등 현실 사회 문제에 교회가 적극적으로 목소리 내기",
          options: [
            {
              id: "nutri-q7-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q7-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q7-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q8",
          title: "'우리끼리의 은혜'를 넘어 세상과 이웃을 위해 직접 행동하기",
          options: [
            {
              id: "nutri-q8-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q8-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q8-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q9",
          title: "아픈 사회 뉴스를 볼 때 기독교적 가치관으로 소리 내고 돕기",
          options: [
            {
              id: "nutri-q9-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q9-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "VITAMIN",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q9-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q10",
          title: "의무적인 교회 사역이나 봉사를 잠시 내려놓고 푹 쉬는 시간",
          options: [
            {
              id: "nutri-q10-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q10-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q10-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q11",
          title: "시끌벅적한 모임 대신 혼자 일기를 쓰거나 산책하며 묵상하기",
          options: [
            {
              id: "nutri-q11-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q11-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q11-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q12",
          title: "거창한 종교적 열심보다 무리하지 않고 내 마음의 평안 지키기",
          options: [
            {
              id: "nutri-q12-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q12-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "MINERAL",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q12-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q13",
          title: "억압적이고 답답했던 예전 교회의 문화를 솔직하게 꼬집고 비판하기",
          options: [
            {
              id: "nutri-q13-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q13-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q13-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q14",
          title: "낡은 신앙의 틀을 깨고 내 신앙을 처음부터 완전히 새롭게 세워보기",
          options: [
            {
              id: "nutri-q14-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q14-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q14-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        },
        {
          id: "nutri-q15",
          title: "맹목적인 신앙이 주던 죄책감을 내려놓고 상처받은 마음 치유하기",
          options: [
            {
              id: "nutri-q15-yes",
              label: "💊 필요해",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 2
                }
              ]
            },
            {
              id: "nutri-q15-normal",
              label: "🤔 그냥 그래",
              scores: [
                {
                  persona: "PROBIOTICS",
                  weight: 1
                }
              ]
            },
            {
              id: "nutri-q15-no",
              label: "🌿 별로 필요없어",
              scores: []
            }
          ]
        }
      ],
      resultKeys: [
        "CARB",
        "PROTEIN",
        "VITAMIN",
        "MINERAL",
        "PROBIOTICS"
      ],
      resultLabels: {
        CARB: "지적 탄수화물",
        PROTEIN: "관계의 단백질",
        VITAMIN: "연대의 비타민",
        MINERAL: "안식의 미네랄",
        PROBIOTICS: "치유의 유산균"
      }
    }
  ],
  personaResults: {
    Orthodox: {
      key: "Orthodox",
      title: "정통 수호형 그리스도인",
      subtitle: "절대 진리와 복음의 본질을 붙드는 사람",
      keywords: [
        "성경무오",
        "복음주의",
        "정통교리",
        "절대진리"
      ],
      tone: "shield",
      description: "당신은 변화하는 세상 속에서도 성경의 가르침과 복음의 본질을 흔들림 없이 지켜내는 것을 중요하게 여깁니다. 정통 교리와 십자가의 은혜를 깊이 사랑하며, 신앙의 기준을 분명히 붙드는 단단한 믿음의 소유자입니다.",
      spiritualStrength: "복음의 본질을 분별하고 지켜내는 선명함, 흔들리는 상황에서도 신앙의 기준을 붙드는 단단함.",
      growthRoutine: "교리문답이나 신앙고백서를 차분히 읽기, 말씀 묵상 후 오늘 지킬 신앙의 기준을 한 문장으로 정리하기.",
      characterImage: "/characters/orthodox.svg",
      denominations: [
        {
          name: "대한예수교장로회 (합동, 고신 등)",
          description: "개혁주의 신학과 성경의 절대적 권위를 강조하는 보수적인 장로교단입니다."
        },
        {
          name: "기독교한국침례회 (보수 진영)",
          description: "성경 중심주의와 개교회의 독립성을 중시하는 교파입니다."
        },
        {
          name: "대한예수교장로회 (백석 등)",
          description: "복음주의적 신앙을 굳건히 지키는 장로교단입니다."
        }
      ]
    },
    Intellectual: {
      key: "Intellectual",
      title: "합리적 지성형 그리스도인",
      subtitle: "말씀과 이성의 균형을 탐구하는 사람",
      keywords: [
        "말씀연구",
        "합리적신앙",
        "논리적",
        "균형감각"
      ],
      tone: "book",
      description: "당신은 신앙을 깊이 이해하고 납득하며 따라가기를 원합니다. 성경을 역사적, 문맥적으로 살피고 논리적이고 체계적인 가르침을 통해 하나님을 알아가는 데서 큰 기쁨을 느끼는 사람입니다.",
      spiritualStrength: "말씀을 시대적 배경 속에서 깊이 있게 해석하는 지혜, 감정에 치우치지 않는 균형 잡힌 사고.",
      growthRoutine: "관심 있는 주제의 신학 서적 읽기, 일방적 강의보다는 질문과 토론이 있는 성경 공부 모임 참여하기.",
      characterImage: "/characters/intellectual.svg",
      denominations: [
        {
          name: "대한예수교장로회 (통합)",
          description: "신학적 균형을 중시하며 학구적이고 체계적인 말씀 훈련이 강한 장로교단입니다."
        },
        {
          name: "기독교대한감리회 (중도 진영)",
          description: "존 웨슬리의 전통에 따라 이성과 성경, 전통의 조화를 중요하게 생각합니다."
        },
        {
          name: "한국기독교장로회 (기장 - 학구적 성향)",
          description: "깊이 있는 신학적 탐구와 자유로운 학문적 분위기를 제공합니다."
        }
      ]
    },
    Progressive: {
      key: "Progressive",
      title: "진보적 포용형 그리스도인",
      subtitle: "다름을 환대하며 오늘의 언어로 신앙을 묻는 사람",
      keywords: [
        "포용성",
        "다양성존중",
        "시대적맥락",
        "환대"
      ],
      tone: "rainbow",
      description: "당신은 신앙이 오늘의 현실 속에서 어떻게 사랑과 환대로 드러날 수 있는지 깊이 고민합니다. 다양한 삶과 생각을 존중하며, 소외된 이들을 향한 열린 마음과 다름을 품는 넓은 시야를 가진 사람입니다.",
      spiritualStrength: "다른 목소리 안에서도 하나님의 형상을 발견하는 포용력, 시대의 아픔을 신앙의 질문으로 끌어안는 감수성.",
      growthRoutine: "다양한 배경의 사람들과 대화하기, 복음서 속 예수님의 환대 장면을 묵상하며 일상에서 실천할 작은 환대 정하기.",
      characterImage: "/characters/progressive.svg",
      denominations: [
        {
          name: "한국기독교장로회 (기장)",
          description: "시대의 변화에 열려 있고 다양한 신학적 해석을 포용하는 진보적 교파입니다."
        },
        {
          name: "기독교대한감리회 (진보 진영)",
          description: "사회의 다양한 목소리에 귀 기울이며 유연한 신학적 사고를 지향합니다."
        },
        {
          name: "대한성공회",
          description: "전통적인 예전을 지키면서도 신학적, 사회적으로 개방적이고 포용적인 교파입니다."
        }
      ]
    },
    Social: {
      key: "Social",
      title: "사회 참여형 그리스도인",
      subtitle: "신앙을 이웃 사랑과 정의의 실천으로 드러내는 사람",
      keywords: [
        "사회정의",
        "이웃사랑실천",
        "연대",
        "행동하는신앙"
      ],
      tone: "dove",
      description: "당신은 신앙이 교회 문턱을 넘어 세상을 변화시켜야 한다고 굳게 믿습니다. 빈곤, 인권, 환경 등 사회 문제에 깊이 공감하며 기독교적 가치관을 바탕으로 구조적인 악에 맞서 행동하는 실천가입니다.",
      spiritualStrength: "고통받는 이웃을 외면하지 않는 민감함, 믿음을 말이 아니라 행동으로 드러내는 실천력.",
      growthRoutine: "지역 봉사나 시민 참여 활동에 꾸준히 함께하기, 한 주의 기도 제목에 사회적 약자와 공공의 선을 위한 기도를 포함하기.",
      characterImage: "/characters/social.svg",
      denominations: [
        {
          name: "한국기독교장로회 (기장)",
          description: "역사적으로 민주화와 사회 정의, 인권 운동에 앞장서 온 교파입니다."
        },
        {
          name: "구세군 대한본영",
          description: "영혼 구원과 더불어 적극적인 사회 구호와 봉사 활동을 교회의 핵심 사명으로 삼습니다."
        },
        {
          name: "대한성공회",
          description: "가난하고 소외된 이웃과의 연대를 중요하게 생각하며 사회 문제에 적극적으로 참여합니다."
        }
      ]
    },
    Liturgical: {
      key: "Liturgical",
      title: "예전 전통형 그리스도인",
      subtitle: "전통의 리듬과 거룩한 예전 안에서 쉬는 사람",
      keywords: [
        "역사적정통성",
        "거룩한예식",
        "성찬",
        "관상기도"
      ],
      tone: "candle",
      description: "당신은 초대교회부터 이어져 온 깊은 역사와 예식을 사랑합니다. 시끌벅적하고 자유로운 분위기보다는 정돈된 순서와 거룩한 성찬, 교회력에 따른 예배에서 깊은 영적 안정감과 경건함을 경험합니다.",
      spiritualStrength: "오래된 신앙의 리듬 안에서 깊이를 발견하는 감각, 침묵과 예식 속에서 하나님께 집중하는 경건함.",
      growthRoutine: "교회력에 맞춘 묵상과 기도 이어가기, 하루 한 번 정해진 시간에 짧은 침묵 기도나 정해진 기도문으로 마음을 정돈하기.",
      characterImage: "/characters/liturgical.svg",
      denominations: [
        {
          name: "대한성공회",
          description: "가톨릭의 전통적 예전과 개신교의 신학을 아름답게 조화시킨 대표적인 교파입니다."
        },
        {
          name: "기독교한국루터회",
          description: "종교개혁의 전통을 이으면서도 풍성한 예식과 성찬을 중요하게 지켜갑니다."
        },
        {
          name: "기독교대한감리회 (고교회파 성향)",
          description: "존 웨슬리의 성공회적 배경을 바탕으로 전통 예식을 강조하는 성향의 교회들입니다."
        }
      ]
    },
    Charismatic: {
      key: "Charismatic",
      title: "영적 체험형 그리스도인",
      subtitle: "성령의 임재와 살아 있는 예배를 갈망하는 사람",
      keywords: [
        "성령충만",
        "뜨거운찬양과기도",
        "은사",
        "영적체험"
      ],
      tone: "flame",
      description: "당신은 머리로 이해하는 신앙을 넘어 삶 속에서 실제로 경험되는 하나님의 임재를 갈망합니다. 뜨거운 찬양과 기도, 은사와 역동적인 예배를 통해 성령님의 인도하심을 새롭게 경험하고자 하는 사람입니다.",
      spiritualStrength: "하나님의 임재를 사모하는 뜨거운 갈망, 기도와 찬양 속에서 공동체의 영적 분위기를 깨우는 힘.",
      growthRoutine: "찬양과 기도로 하루를 여는 시간 만들기, 받은 감동을 말씀과 공동체의 분별 안에서 점검하며 기록하기.",
      characterImage: "/characters/charismatic.svg",
      denominations: [
        {
          name: "기독교대한하나님의성회 (순복음)",
          description: "성령 세례와 은사, 뜨거운 기도를 강조하는 오순절 교단입니다."
        },
        {
          name: "기독교대한성결교회",
          description: "중생, 성결, 신유, 재림의 사중복음을 바탕으로 뜨거운 영적 체험을 사모합니다."
        },
        {
          name: "기독교대한감리회 (부흥운동 성향)",
          description: "초기 감리교 부흥 운동의 전통을 이어받아 뜨거운 성령의 역사를 사모합니다."
        }
      ]
    },
    Relational: {
      key: "Relational",
      title: "관계 중심형 그리스도인",
      subtitle: "공동체 안에서 사랑과 성장을 경험하는 사람",
      keywords: [
        "공동체성",
        "성도의교제",
        "소그룹",
        "가족같은교회"
      ],
      tone: "cup",
      description: "당신은 거창한 교리나 화려한 예식보다 성도들이 서로 진실하게 사랑하고 삶을 나누는 공동체성이 교회의 본질이라 믿습니다. 소그룹 모임에서 기쁨과 슬픔을 나누며 함께 성장하는 것을 가장 행복해합니다.",
      spiritualStrength: "사람의 마음을 살피고 곁을 지키는 따뜻함, 관계 안에서 믿음을 자라게 하는 공동체적 감각.",
      growthRoutine: "소그룹이나 식탁 교제를 정기적으로 이어가기, 한 주에 한 사람에게 안부를 묻고 구체적으로 기도해주기.",
      characterImage: "/characters/relational.svg",
      denominations: [
        {
          name: "독립교회 / 비교파 복음주의 교회",
          description: "특정 교단의 교리에 얽매임 없이 유연하고 가족 같은 공동체성을 강조하는 교회들이 많습니다."
        },
        {
          name: "대한예수교장로회 (소그룹/제자훈련 중심 교회)",
          description: "교단을 불문하고 가정교회나 셀 목회 시스템을 강력하게 구축한 교회들입니다."
        },
        {
          name: "기독교대한침례회",
          description: "회중 중심의 교회 정치 제도를 통해 성도 개개인의 참여와 끈끈한 교제를 중시합니다."
        }
      ]
    }
  },
  nutritionResults: {
    CARB: {
      key: "CARB",
      title: "🍞 지적 탄수화물",
      status: "질문하는 당신의 뇌를 위해 덮어놓고 믿으라는 말은 이제 그만! 내 신앙엔 더 날카로운 이성과 텍스트가 필요해!",
      keywords: [
        "질문",
        "텍스트",
        "신학",
        "북클럽"
      ],
      description: "주일 설교를 들으며 생겨나는 궁금증은 지적으로 성장하고 있다는 아주 좋은 신호입니다! 가짜 포만감을 주는 정크푸드 같은 신앙에서 벗어나, 꼬리에 꼬리를 무는 질문을 던지며 꼭꼭 씹어 넘길 수 있는 배움의 시간이 필요합니다. 당신의 일상에 지적 탄수화물을 더해보세요.",
      recommendation: "청어람 북클럽, 신학/인문학 강좌",
      cta: "매주 목요일, 당신의 지적 허기를 채워줄 청어람 뉴스레터를 받아보세요!"
    },
    PROTEIN: {
      key: "PROTEIN",
      title: "🥩 관계의 단백질",
      status: "아는 교회 사람은 많은데, 진짜 내 신앙의 고민을 털어놓고 기댈만한 안전한 사람은 없네...",
      keywords: [
        "안전한대화",
        "공동체",
        "경청",
        "살롱"
      ],
      description: "혼자 고민하는 시간도 의미 있지만, 안전한 사람들과 함께 나눌 때 우리의 신앙은 더욱 단단해집니다. 당신에게는 정답을 가르치려 들지 않고, 의심과 방황을 있는 그대로 들어주며 서로를 지탱해 주는 공동체가 필요합니다. 당신의 일상에 관계의 단백질을 더해보세요.",
      recommendation: "청어람 안전한 대화 모임, 살롱 청어람",
      cta: "평가 없이 안전하게 연결되는 느슨한 연대, 청어람 뉴스레터로 초대합니다."
    },
    VITAMIN: {
      key: "VITAMIN",
      title: "🍋 연대의 비타민",
      status: "교회 안의 언어와 세상의 언어가 너무 달라. 기독교는 왜 세상의 아픔에 침묵할까? 당신에게 필요한 것은 세상과의 소통과 연대!",
      keywords: [
        "공공신학",
        "사회이슈",
        "연대",
        "실천"
      ],
      description: "세상의 아픔에 공감하는 당신의 넓은 시야는 아주 귀중한 은사입니다! 꽉 막힌 교회 안의 공기를 환기하고, 세상 속에서 신앙을 실천할 수 있는 상큼하고 톡 쏘는 에너지가 필요합니다. 더 나은 세상을 위해 당신의 일상에 연대의 비타민을 더해보세요.",
      recommendation: "공공신학 포럼, 사회 이슈 연대 세미나",
      cta: "세상의 아픔에 응답하는 기독교의 목소리, 청어람 뉴스레터에서 만나보세요."
    },
    MINERAL: {
      key: "MINERAL",
      title: "💧 안식의 미네랄",
      status: "봉사, 사역, 모임... 열정적인 내 신앙생활이 마치 무보수 노동 같이 느껴져요. 내면을 촉촉하게 채울 미네랄 팩 붙이고 잠시 쉬고 싶어요.",
      keywords: [
        "쉼",
        "번아웃",
        "일상영성",
        "글쓰기"
      ],
      description: "그동안 교회를 위해 참 애쓰셨습니다. 이제는 스스로의 영혼을 다정하게 돌볼 때입니다! 무언가를 자꾸 해내야 한다는 압박에서 벗어나, 일상 속에서 조용히 내면을 돌아보고 쉼을 누리는 시간이 필요합니다. 메마른 당신의 일상에 안식의 미네랄을 더해보세요.",
      recommendation: "일상 영성 훈련, 신앙 글쓰기 워크샵, 묵상 모임",
      cta: "숨 가쁜 일상 속, 나를 돌보는 고요한 읽을거리 청어람 뉴스레터를 배달해 드려요."
    },
    PROBIOTICS: {
      key: "PROBIOTICS",
      title: "💊 치유의 유산균",
      status: "폭력적인 신앙 강요에 체했어요. 장을 튼튼하게 할 유산균으로 신앙의 질문들을 소화하고 내 신앙체질을 건강하게 바꾸고 싶어요.",
      keywords: [
        "신앙재구성",
        "디톡스",
        "회복",
        "자유"
      ],
      description: "기존의 방식에 의문을 품고 새로운 길을 모색하려는 당신의 용기를 응원합니다! 상처를 줬던 낡은 교리들을 건강하게 배출해 내고, 내면의 영적 장내 환경을 평화롭게 다시 만들어줄 디톡스의 시간이 필요합니다. 당신의 일상에 치유의 유산균을 더해보세요.",
      recommendation: "가나안 성도를 위한 모임, 신앙 재구성 세미나",
      cta: "폭력적이지 않은 다정한 언어로 신앙을 묻는 시간, 청어람 뉴스레터를 구독해 보세요."
    }
  }
} as Partial<TestContent>;

export const pastorTestContent: TestContent = createTestContent(content);
