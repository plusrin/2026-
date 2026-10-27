import { PageShell } from '@/components/PageShell';
import { Reader } from '@/components/Reader';
export const metadata = { title: '원고' };
export default function Page(){return <PageShell page="readings" eyebrow="FIFTEEN VOICES, ONE VOYAGE" title="목소리를 따라" description="열다섯 번의 낭독, 나로부터 너에게."><Reader/></PageShell>}
