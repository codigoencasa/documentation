import { useState } from 'react';
import Link from 'next/link'
import clsx from 'clsx'

import { Heading } from '@/components/Heading'
import { Modal } from '@/components/Modal'

export const a = Link
export { Button } from '@/components/Button'
export { CodeGroup, Code as code, Pre as pre } from '@/components/Code'

export const h2 = function H2(props) {
  return <Heading level={2} {...props} />
}

export const Image = function Img(props) {
  const [isOpen, setIsOpen] = useState(false)
  const showModal = () => setIsOpen(true)

  return (
  <div className='my-6 bg-gray-100 rounded-2xl dark:bg-zinc-800'>
    {props?.label ? <div className="flex py-1 flex-wrap items-start gap-x-4 px-4  dark:border-zinc-800 dark:bg-transparent"><h3 className="mr-auto m-0 text-xs font-thin">{props.label}</h3></div> : <></> }
    <img 
      onClick={showModal}
      className='not-prose w-full justify-center text-center cursor-pointer aling-block max-w-full h-auto overflow-hidden max-h-[800px]  rounded-2xl bg-zinc-900 shadow-md dark:ring-1 dark:ring-white/10' {...props} />
            {isOpen && (
            <Modal
              src={props.src}
              alt="snow"
              caption="caption"
              onClose={() => setIsOpen(false)}
            />
          )}
  </div>
  )
}

export function Video(props) {
  return (
  <div className='my-6 bg-gray-100 rounded-2xl dark:bg-zinc-800 '>
    {props?.label ? <div className="flex py-1 flex-wrap items-start gap-x-4 px-4 dark:border-zinc-800 dark:bg-transparent"><h3 className="mr-auto m-0 text-xs font-thin">{props.label}</h3></div> : <></> }
    <iframe width="800" className='rounded-2xl w-full max-sm:w-full max-sm:h-[220px] ' height="450" src={'https://www.youtube.com/embed/'+props.yt} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />    
  </div>
  )
}

export function VideoVertical(props) {
  return (
  <div className='my-6 bg-gray-100 rounded-2xl dark:bg-zinc-800 w-[315px] h-[560px]'>
    {props?.label ? <div className="flex py-1 flex-wrap items-start gap-x-4 px-4 dark:border-zinc-800 dark:bg-transparent"><h3 className="mr-auto m-0 text-xs font-thin">{props.label}</h3></div> : <></> }
    <iframe width="800" className='rounded-2xl w-full max-sm:w-full max-sm:h-[220px] ' height="530" src={'https://www.youtube.com/embed/'+props.yt} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen />    
  </div>
  )
}

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="8" strokeWidth="0" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 7.75h1.5v3.5"
      />
      <circle cx="8" cy="4" r=".5" fill="none" />
    </svg>
  )
}

export function Note({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-4 leading-6 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:[--tw-prose-links-hover:theme(colors.emerald.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <InfoIcon className="mt-1 h-4 w-4 flex-none fill-emerald-500 stroke-white dark:fill-emerald-200/20 dark:stroke-emerald-200" />
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Error({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-50/50 p-4 leading-6 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/5 dark:text-rose-200 dark:[--tw-prose-links-hover:theme(colors.rose.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Warning({ children }) {
  return (
    <div className="my-6 flex gap-2.5 rounded-2xl border border-orange-500/20 bg-orange-50/50 p-4 leading-6 text-orange-900 dark:border-orange-500/30 dark:bg-orange-500/5 dark:text-orange-200 dark:[--tw-prose-links-hover:theme(colors.orange.300)] dark:[--tw-prose-links:theme(colors.white)]">
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

export function Row({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
      {children}
    </div>
  )
}

export function RowCenter({ children }) {
  return (
    <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:grid-cols-2">
      {children}
    </div>
  )
}

export function Col({ children, sticky = false }) {
  return (
    <div
      className={clsx(
        '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
        sticky && 'xl:sticky xl:top-24'
      )}
    >
      {children}
    </div>
  )
}

export function Properties({ children }) {
  return (
    <div className="my-6">
      <ul
        role="list"
        className="m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y divide-zinc-900/5 p-0 dark:divide-white/5"
      >
        {children}
      </ul>
    </div>
  )
}

export function Property({ name, type, children }) {
  return (
    <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
      <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
        <dt className="sr-only">Name</dt>
        <dd>
          <code>{name}</code>
        </dd>
        <dt className="sr-only">Type</dt>
        <dd className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          {type}
        </dd>
        <dt className="sr-only">Description</dt>
        <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
          {children}
        </dd>
      </dl>
    </li>
  )
}