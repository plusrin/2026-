export type Poster = { id: string; category: 'scene' | 'daily'; className: string; student: string; title?: string; front: string; back: string; description?: string };
export const posters: Poster[] = [];
export const archive = {
  title: '베르테르의 사각지대', philosophy: '문학과 심리학을 결합한 자기 객관화, 인지적 왜곡 발견, 시점 전환을 통한 전인적 상담교육',
  testTitle: '내 안의 베르테르 찾기', testDescription: '아론 벡(Aaron T. Beck)의 인지치료 이론을 바탕으로 학생이 직접 기획하고 코딩하여 제작한 ‘인지적 오류 찾기’ 심리테스트.',
  creator: '2학년 7반 성선혁', testUrl: 'https://cognitive-error.vercel.app/',
  galleries: [{id: 'scene' as const, title: '사건 현장(Scene) 분석 포스터', description: '작품 속에 드러난 인지적 오류를 분석한 학생 제작 포스터 전시.'}, {id: 'daily' as const, title: '일상생활 속 인지적 오류 찾기', description: '고등학생들이 일상에서 자주 겪는 인지 왜곡 상황을 그림으로 표현한 포스터 전시.'}],
};
