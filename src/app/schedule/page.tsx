import { PageShell } from '@/components/PageShell';
import { Schedule } from '@/components/Schedule';
export const metadata = { title: '식순' };
export default function Page(){return <PageShell page="schedule" eyebrow="THE ORDER OF OUR VOYAGE" title="오늘의 식순" description="한 편의 문학을, 서로의 목소리로 만나는 시간."><Schedule/></PageShell>}
