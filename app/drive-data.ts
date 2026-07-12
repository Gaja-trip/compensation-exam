export type LessonTone = "coral" | "blue" | "yellow";

export type DriveImage = {
  id: string;
  title: string;
  sceneLabel: string;
  thumbnail: string;
  driveUrl: string;
};

export type VisualLesson = {
  id: string;
  subject: string;
  questionLabel: string;
  title: string;
  shortTitle: string;
  summary: string;
  answer: string;
  statute: string;
  tone: LessonTone;
  images: DriveImage[];
  sourceUrl: string;
};

const examSource = "https://drive.google.com/file/d/1Vzi8r4e2wBro7_KJQg64QnrAmef1UW_t/view?usp=drivesdk";

function image(id: string, title: string): DriveImage {
  const sceneLabel = title
    .replace(/^보상관리사_민법_/, "")
    .replace(/\.png$/, "")
    .replace(/_/g, " · ");

  return {
    id,
    title,
    sceneLabel,
    thumbnail: `https://drive.google.com/thumbnail?id=${id}&sz=w1400`,
    driveUrl: `https://drive.google.com/file/d/${id}/view?usp=drivesdk`,
  };
}

const landImages = [
  image("1_DP5XgmHwfYpBHN6Vw7o9CtBn0pfFbkm", "보상관리사_민법_토지소유권_아이소메트릭3D_01_지하광물_개요.png"),
  image("1i-gXM9K1b2wqVFaPnOvjiA-AoODuZPTd", "보상관리사_민법_토지소유권_아이소메트릭3D_02_상하범위.png"),
  image("17TD1O_cenKGX2Y0ekxWVdxTQNWzZHeXL", "보상관리사_민법_토지소유권_아이소메트릭3D_03_지하공간이용.png"),
  image("1tZd2kxLYS882xCmxKnNgZcvhuu1pbkTT", "보상관리사_민법_토지소유권_아이소메트릭3D_04_미채굴광물_특별법.png"),
  image("1ZUgyvBTpRjCb_Sc4TBacpuZSXRtQqZn7", "보상관리사_민법_토지소유권_아이소메트릭3D_05_채굴권_필요.png"),
  image("1tu8BjDbrxufIzm3POmSYtQ8rVCgnpFWT", "보상관리사_민법_토지소유권_아이소메트릭3D_06_토지소유권과_채굴권_구별.png"),
  image("1u2JJQd0XClSwrd36lnZuJvCyPVRwCVWY", "보상관리사_민법_토지소유권_아이소메트릭3D_07_금맥발견_토지주.png"),
  image("1Srg8ZuVLnScdWFZAd39zCFNloOP03OBj", "보상관리사_민법_토지소유권_아이소메트릭3D_08_토지사용_절차와보상.png"),
  image("1r64zBQo8x4i9YB_4zWEEnDWY--lXORD_", "보상관리사_민법_토지소유권_아이소메트릭3D_09_우연히분리된광물_예외.png"),
  image("10fKIjVS_pN34WQB1iE_tsSSq_L1Z89B6", "보상관리사_민법_토지소유권_아이소메트릭3D_10_핵심정리.png"),
  image("1MyPUJYeFnWtvoXmhzRCVu5Fj9ooVlren", "보상관리사_민법_토지소유권_01_땅속금도내것일까.png"),
  image("19eguQnUY1USO-orgRqKuWmo2trBgsEcd", "보상관리사_민법_토지소유권_02_민법212조_토지상하_정당한이익.png"),
  image("1htv1jKWxPZXWEZYQ4AcmvR6YG4W7x106", "보상관리사_민법_토지소유권_03_광물은_특별법_예외.png"),
  image("1NaPxBYaFWMirZTHjIHCn4OQq0U_4XGHj", "보상관리사_민법_토지소유권_04_광업법_채굴권_핵심.png"),
  image("13cHbs90QVp1JofFRKT8qL9O_5TRoRVQv", "보상관리사_민법_토지소유권_05_만화_산을산갑_금맥발견.png"),
  image("1Zu0tvSHKouN3rQeicJ77u7vxdRSaU6Um", "보상관리사_민법_토지소유권_06_만화_채굴권있어야_채굴가능.png"),
  image("1VVlHoZhHB5Qz0RoI_axjH2Tl7nhQ66rs", "보상관리사_민법_토지소유권_07_토지소유권과_채굴권_구별.png"),
  image("1UEiJycbYz7zq2-zoVb37SuA_OArB89PF", "보상관리사_민법_토지소유권_08_광업권자_토지사용_절차와보상.png"),
  image("1A_Zu5H4YxW6H0sKBFvsof5h2GnYP3nhj", "보상관리사_민법_토지소유권_09_우연히분리된광물_예외.png"),
  image("1r190zKGmu1zKw0U2tpSiZPpbhSjPde3X", "보상관리사_민법_토지소유권_10_시험직전_3줄암기.png"),
];

const possessionImages = [
  image("1HCs2R04dfJxqJzk9qmrlezcgSuyzYKr2", "보상관리사_민법_점유_01_자주점유·타주점유_현존이익_개요.png"),
  image("1Vc_JATuTnPdHLuihMb4anh2OZXQSFCSu", "보상관리사_민법_점유_02_자주점유와_타주점유_비교.png"),
  image("1Y6A4UDKV_3O0CjOqZCpXbUFHnzx4rbQw", "보상관리사_민법_점유_03_실제소유자아닌_자주점유.png"),
  image("1gxTAWVVWeWh804BQBMcYodckw2cZmeTU", "보상관리사_민법_점유_04_선의와_악의_비교.png"),
  image("1wj2LSZ4cEii1t081fZJ8XrE4Kg5TqM8k", "보상관리사_민법_점유_05_민법202조_책임표.png"),
  image("17bzM0hk-ROMim4HZchXZvc1xbjJqy2Ob", "보상관리사_민법_점유_06_선의의_자주점유자_현존이익20만원.png"),
  image("1g92-OBfw1VpDldmg7MS0rSOYok_-HwCs", "보상관리사_민법_점유_07_악의의_자주점유자_손해전부.png"),
  image("1O95r0JLy6YMwJnxY6L5RFMgtRYbZwfaF", "보상관리사_민법_점유_08_선의의_타주점유자_손해전부.png"),
  image("1tjXy7qwO3ZizpswSj-nCHKP8AI5QFRLH", "보상관리사_민법_점유_09_소송제기시점부터_악의.png"),
  image("1OlTAT_Ald7GFaTeQS18stIvzi4gMZ3Cw", "보상관리사_민법_점유_10_시험직전_4줄암기.png"),
];

const prescriptionImages = [
  image("1P0WqB2w8xeV2mbtsJ6jVApOM7SNYNaky", "보상관리사_민법_점유취득시효_불법행위_01_시효완성알고_제3자등기.png"),
  image("1Nk9L4prz40m6aUK3BzgGkOz-5uXw0EUo", "보상관리사_민법_점유취득시효_불법행위_02_갑을병_등장인물.png"),
  image("1tdi9tOlUQxb6Fp1Ms6J3FaotJMAw588w", "보상관리사_민법_점유취득시효_불법행위_03_20년점유_등기청구권.png"),
  image("1AJ2sYr_vCagd29pUg6uXX5732gY0AhH4", "보상관리사_민법_점유취득시효_불법행위_04_갑의_이전등기협력의무.png"),
  image("1GMn4O4G0Tp3rTQbQ6osvILU1f0Izg4D_", "보상관리사_민법_점유취득시효_불법행위_05_갑의_시효완성인식.png"),
  image("1RXJW4s357JG94BVmCP2mNz96M2a5olbS", "보상관리사_민법_점유취득시효_불법행위_06_병에게_처분및등기.png"),
  image("1tmVdl0E25TglKZNk5ojLxkHbNfw9aRmL", "보상관리사_민법_점유취득시효_불법행위_07_시효완성후_제3자병.png"),
  image("1KUeje3RD4NpMvdzaoMNhFRA25TxzDrqS", "보상관리사_민법_점유취득시효_불법행위_08_갑의_불법행위책임.png"),
  image("1L1iQVRmM0s-WO-lidLXfFhWEDmq9DguT", "보상관리사_민법_점유취득시효_불법행위_09_알고처분_모르고처분.png"),
  image("1H-NjioEcsIityYtlBV7CpHngAMQcpIYl", "보상관리사_민법_점유취득시효_불법행위_10_시험직전_사건순서.png"),
  image("1lqZVlS5CCQGkEATuV4hJ0N-Q89CSmYwc", "보상관리사_민법_점유취득시효_11_종합정리_요건효과제3자.png"),
];

export const driveFolderUrl = "https://drive.google.com/drive/folders/1iuqEaL-qQ_DhkO9NHtsgFPcrOg2PBZts?usp=drive_link";

export const visualLessons: VisualLesson[] = [
  {
    id: "land-ownership",
    subject: "민법 · 물권",
    questionLabel: "2020년 1차 · 민법 14번",
    title: "토지소유권은 어디까지 미칠까?",
    shortTitle: "토지소유권의 위·아래",
    summary: "지표만이 아니라 지상과 지하까지. 다만 소유자의 정당한 이익이 닿는 범위에서만 생각합니다.",
    answer: "민법 제212조의 핵심은 ‘정당한 이익이 있는 범위’입니다. 미채굴 광물처럼 특별법이 우선하는 영역도 함께 구분해야 합니다.",
    statute: "민법 제212조 · 토지소유권의 범위",
    tone: "coral",
    images: landImages,
    sourceUrl: examSource,
  },
  {
    id: "possession",
    subject: "민법 · 점유",
    questionLabel: "2020년 1차 · 민법 10·13번",
    title: "점유자는 선의일까, 악의일까?",
    shortTitle: "선의·악의 점유",
    summary: "같은 물건을 들고 있어도 점유의 모습과 손해배상 범위는 달라집니다. 장면을 순서대로 비교해보세요.",
    answer: "선의·악의, 자주·타주점유를 먼저 나누고, 과실 취득과 멸실·훼손 책임을 이어서 판단합니다.",
    statute: "민법 제201조·제202조 · 점유자의 책임",
    tone: "blue",
    images: possessionImages,
    sourceUrl: examSource,
  },
  {
    id: "prescription",
    subject: "민법 · 취득시효",
    questionLabel: "2020년 1차 · 민법 15번",
    title: "20년의 점유 뒤, 제3자가 나타났다",
    shortTitle: "점유취득시효와 제3자",
    summary: "시효기간이 끝난 뒤 소유자가 제3자에게 처분했다면 누구에게 무엇을 청구할 수 있을까요?",
    answer: "20년 점유만으로 바로 등기되는 것은 아닙니다. 완성 시점, 등기청구권, 제3자 등기와 불법행위 여부를 시간순으로 봅니다.",
    statute: "민법 제245조 · 부동산소유권의 점유취득시효",
    tone: "yellow",
    images: prescriptionImages,
    sourceUrl: examSource,
  },
];
