import { client } from "@/lib/client";

// お知らせ一覧に並べる 1 件分（手書きのお知らせ・技術ブログ・作品を共通の形にそろえたもの）
export type NewsItem = {
  key: string;
  title: string;
  link: string;
  tag: string;
  publishedAt: string;
};

// microCMS の tag はセレクトフィールドなので配列で返る（例: ["更新"]）
type NewsContent = { id: string; title: string; link: string; tag: string[]; publishedAt: string };
type ArticleContent = { id: string; title: string; publishedAt: string };

// limit があれば新しい順に limit 件（トップページ用）、なければ全件（お知らせページ用）を取得
async function fetchList<T>(endpoint: string, fields: string, limit?: number): Promise<T[]> {
  const queries = { fields, orders: "-publishedAt" };
  if (!limit) return client.getAllContents<T>({ endpoint, queries });
  const res = await client.get<{ contents: T[] }>({ endpoint, queries: { ...queries, limit } });
  return res.contents;
}

/**
 * microCMS の news / tech-blog / work を取得し、公開日の新しい順に 1 つの一覧にまとめる。
 * limit を渡すと、各 API から limit 件ずつ取ってまとめた上位 limit 件を返す。
 */
export async function fetchMergedNews(limit?: number): Promise<NewsItem[]> {
  const [news, blogs, works] = await Promise.all([
    fetchList<NewsContent>("news", "id,title,link,tag,publishedAt", limit),
    fetchList<ArticleContent>("tech-blog", "id,title,publishedAt", limit),
    fetchList<ArticleContent>("work", "id,title,publishedAt", limit),
  ]);

  const manual: NewsItem[] = news.map((n) => ({ key: `news-${n.id}`, title: n.title, link: n.link, tag: n.tag.join(" / "), publishedAt: n.publishedAt }));
  const auto: NewsItem[] = [
    ...blogs.map((b) => ({ key: `blog-${b.id}`, title: b.title, link: `/blog/${b.id}`, tag: "技術ブログ", publishedAt: b.publishedAt })),
    ...works.map((w) => ({ key: `work-${w.id}`, title: w.title, link: `/work/${w.id}`, tag: "作品", publishedAt: w.publishedAt })),
  ];

  // 同じ記事へのお知らせを手で書いてある場合は、そちらを優先して自動の分は出さない
  const manualLinks = new Set(manual.map((m) => m.link));
  const items = [...manual, ...auto.filter((a) => !manualLinks.has(a.link))].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return limit ? items.slice(0, limit) : items;
}
