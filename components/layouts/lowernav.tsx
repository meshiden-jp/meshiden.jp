import React from 'react'
import Link from 'next/link'
import { SheetClose } from '@/components/ui/sheet'

const links = [
  { href: '/disclaimer', label: '免責事項' },
  { href: '/privacy', label: 'プライバシーポリシー' },
  { href: '/ai', label: 'AIポリシー' },
  { href: '/accessibility', label: 'ウェブアクセシビリティ' },
  { href: '/pride', label: 'プライドポリシー' },
  // { href: '/sns', label: 'SNS' },
]

const Lowernav = ({ inSheet = false }: { inSheet?: boolean }) => {
  return (
    <>
      {links.map(({ href, label }) => {
        const link = <Link href={href}><small>{label}</small></Link>
        return (
          <li key={href}>
            {inSheet ? <SheetClose asChild>{link}</SheetClose> : link}
          </li>
        )
      })}
    </>
  )
}

export default Lowernav
