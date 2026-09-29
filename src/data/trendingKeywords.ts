export interface TrendingItem {
  keyword: string;
  category: string;
  tag: string;
}

export const TRENDING_KEYWORDS: TrendingItem[] = [
  { keyword: 'AirPods Pro 2', category: '음향기기', tag: '애플' },
  { keyword: '아이패드 에어 M2', category: '태블릿', tag: '인기' },
  { keyword: '소니 WH-1000XM5', category: '헤드폰', tag: '직구추천' },
  { keyword: '맥북 에어 M3', category: '노트북', tag: '가격비교' },
  { keyword: '닌텐도 스위치 OLED', category: '게임기', tag: '엔저특가' },
  { keyword: '플레이스테이션 5 프로', category: '콘솔', tag: '글로벌' },
  { keyword: '다이슨 에어랩', category: '뷰티/가전', tag: '베스트' },
  { keyword: '킨들 페이퍼화이트', category: '전자책', tag: '아마존독점' },
  { keyword: '보스 QC 울트라', category: '음향기기', tag: '노이즈캔슬링' },
  { keyword: '산토리 위스키 가쿠빈', category: '주류', tag: '일본직구' },
  { keyword: '로지텍 MX Master 3S', category: '주변기기', tag: '사무용품' },
  { keyword: '레고 밀레니엄 팔콘', category: '취미/완구', tag: '직구비교' },
];
