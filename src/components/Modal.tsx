'use client';
import { FontIcon } from './FontIcon';
import { useEffect, useRef } from 'react';
export function Modal({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const dialog=ref.current!;const previous=document.activeElement as HTMLElement|null;dialog.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{dialog.close();document.body.style.overflow=overflow;previous?.focus();};},[]);
 return <dialog ref={ref} aria-label={title} className={`modal ${wide?'modal-wide':''}`} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-header"><h2>{title}</h2><button autoFocus className="icon-button" aria-label="닫기" onClick={onClose}><FontIcon kind="close" /></button></div>{children}</dialog>;
}
