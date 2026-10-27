import { design } from '@/data/design';
export function PageShell({page,eyebrow,title,description,children}:{page:string;eyebrow:string;title:string;description?:string;children:React.ReactNode}){
 const bg=design.backgrounds[page]; return <main id="main" className={`page-shell page-${page}`} style={bg?{backgroundImage:`linear-gradient(#102334b3,#102334ed),url("${bg}")`}:undefined}><div className="content-wrap"><div className="page-intro"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description&&<p className="page-description">{description}</p>}<span className="intro-rule" aria-hidden="true" /></div>{children}</div></main>;
}
