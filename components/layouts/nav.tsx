import React from 'react'
import Link from 'next/link'
import { SheetClose } from '@/components/ui/sheet'

const links = [
    { href: '/work', label: '作品一覧' },
    { href: '/profile', label: '自己紹介' },
    { href: '/news', label: 'お知らせ' },
    { href: '/blog', label: '技術ブログ' },
    { href: '/contact', label: 'お問い合わせ' },
]

const Nav = ({ inSheet = false }: { inSheet?: boolean }) => {
    return (
        <>
            {links.map(({ href, label }) => {
                const link = <Link href={href}>{label}</Link>
                return (
                    <li key={href}>
                        {inSheet ? <SheetClose asChild>{link}</SheetClose> : link}
                    </li>
                )
            })}
        </>
    )
}

export default Nav
