import {
  SiYoutube, 
  SiInstagram, 
  SiX,
  SiPinterest, 
  SiReddit, 
  SiThreads, 
  SiBluesky, 
  SiBehance,
  SiApplemusic,
  SiGithub, 
  SiQiita, 
  SiZenn,
  SiSpeakerdeck,
  SiSnapchat,
  SiBereal,
  SiClubhouse,
  SiPixiv,
  SiDiscord,
  SiTiktok,
  SiSpotify,
  SiTwitch,
  SiNote,
  SiFigma,
} from 'react-icons/si'
import { FaLinkedin } from 'react-icons/fa'
import { Globe } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

const url = 'https://meshiden.jp/sns'
const title = 'SNS｜飯田優斗のポートフォリオサイト'
const description = '飯田優斗が運用している各種SNSアカウントの一覧です。'
const ogImage = 'https://meshiden.jp/ogp-default.jpg'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    images: [{ url: ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
}

type ServiceItem = {
  label: string
  icon: React.ReactNode
  url: string
}

type Category = {
  label: string
  items: ServiceItem[]
}

const G = () => <Globe size={24} />

const categories: Category[] = [
  {
    label: 'ソーシャルメディア',
    items: [
      { label: 'YouTube',   icon: <SiYoutube />,   url: 'https://www.youtube.com/@meshiden_jp' },
      { label: 'Instagram', icon: <SiInstagram />, url: 'https://www.instagram.com/meshiden.jp' },
      { label: 'TikTok',    icon: <SiTiktok />,    url: 'https://www.tiktok.com/@meshiden.jp' },
      { label: 'X',         icon: <SiX />,         url: 'https://x.com/meshiden_jp' },
      { label: 'Pinterest', icon: <SiPinterest />, url: 'https://jp.pinterest.com/meshiden_jp' },
      { label: 'Reddit',    icon: <SiReddit />,    url: 'https://www.reddit.com/user/meshiden_jp' },
      { label: 'Twitch',    icon: <SiTwitch />,    url: 'https://www.twitch.tv/meshiden_jp' },
      { label: 'Bluesky',   icon: <SiBluesky />,   url: 'https://bsky.app/profile/meshiden.jp' },
      { label: 'Clubhouse', icon: <SiClubhouse />, url: 'https://www.clubhouse.com/@meshiden.jp' },
      { label: 'Bereal',    icon: <SiBereal />,    url: 'https://bere.al/meshiden.jp' },
      { label: 'Behance',   icon: <SiBehance />,   url: 'https://www.behance.net/meshiden_jp' },
      { label: 'pixiv',     icon: <SiPixiv />,     url: 'https://www.pixiv.net/users/38016775' },
      { label: 'LinkedIn',  icon: <FaLinkedin />,  url: 'https://www.linkedin.com/in/meshiden' },
    ],
  },
  {
    label: '開発',
    items: [
      { label: 'GitHub',     icon: <SiGithub />,      url: 'https://github.com/meshiden-jp' },
      { label: 'Figma',      icon: <SiFigma />,       url: 'https://www.figma.com/@meshiden_jp' },
      { label: 'Qiita',      icon: <SiQiita />,       url: 'https://qiita.com/meshiden_jp' },
      { label: 'Zenn',       icon: <SiZenn />,        url: 'https://zenn.dev/meshiden_jp' },
      { label: 'Topaz',      icon: <G />,             url: 'https://topaz.dev/meshiden_jp' },
      { label: 'Note',       icon: <SiNote />,        url: 'https://note.com/meshiden' },
      { label: 'Speakerdeck',icon: <SiSpeakerdeck />, url: 'https://speakerdeck.com/meshiden' },
      { label: 'Discord',    icon: <SiDiscord />,     url: 'https://discord.com/users/1287985017615679513' },
    ],
  },
  {
    label: '音楽',
    items: [
      { label: 'Spotify',     icon: <SiSpotify />,    url: 'https://open.spotify.com/user/21gbe4fz7hmhevi4ooxj6k7ry' },
      { label: 'Apple Music', icon: <SiApplemusic />, url: 'https://music.apple.com/profile/meshiden_jp' },
    ],
  },
]

const Page = () => {
  return (
    <div className="sm:w-[70%] w-[90%] m-auto pb-32">
      <h1>SNS</h1>
      {categories.map((category) => (
        <section key={category.label}>
          <h2 className="text-sm font-semibold text-gray-500 mb-2 pt-0 sm:pt-6 lg:pt-12">
            {category.label}
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-8 pb-8 sm:pb-4 lg:pb-0">
            {category.items.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 hover:opacity-60 transition-opacity"
              >
                <div className="text-2xl">{item.icon}</div>
                <span className="text-xs text-center leading-tight">
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
      <div className="flex justify-center pt-16">
        <Button asChild>
          <Link className="sm:w-[50%] w-full" href="/">
            トップへ戻る
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Page