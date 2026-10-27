// 실제 파일 제공 후 public 아래 경로를 등록합니다. 외부 이미지 의존성은 없습니다.
export const design: { homeImage: string | null; backgrounds: Record<string, string | null> } = {
 homeImage: null, backgrounds: { home: null, schedule: null, readings: null, archive: null, next: null },
};
