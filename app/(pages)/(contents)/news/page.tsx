"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { fetchMergedNews, NewsItem } from "@/lib/news";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Zero from "@/components/layouts/zero";
import Error from "@/components/layouts/error";
import Skeleton from "@/components/layouts/sk_bar";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils";

const POSTS_PER_PAGE = 10;

/**
 * ✅ ラッパーコンポーネント
 * ここでは useSearchParams を使わず、Suspense でくるむだけ
 */
export default function NewsPage() {
  return (
    <Suspense
      fallback={
        <div className="sm:w-[70%] w-[90%] m-auto pb-32">
          <h1 id="news">お知らせ</h1>
          <Skeleton />
        </div>
      }
    >
      <NewsPageInner />
    </Suspense>
  );
}

/**
 * ✅ 本体コンポーネント
 * useSearchParams / useRouter / usePathname は全部ここで使う
 */
function NewsPageInner() {
  // news / tech-blog / work をまとめた全件（ページ分けはこの配列を切り出して行う）
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // クエリから現在ページを取得
  const pageFromQuery = Number(searchParams.get("page") || "1");
  const currentPage =
    Number.isNaN(pageFromQuery) || pageFromQuery < 1 ? 1 : pageFromQuery;

  // 総ページ数
  const totalPages =
    items.length > 0 ? Math.ceil(items.length / POSTS_PER_PAGE) : 1;

  // 現在ページに表示する分
  const pageItems = items.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // page クエリを書き換えた URL を生成
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      // 1ページ目は ?page を消してもOK（好み）
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  // ページ移動
  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages || 1);
    router.push(createPageUrl(safePage));
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError(false);

        const startTime = Date.now();
        setItems(await fetchMergedNews());

        const elapsedTime = Date.now() - startTime;
        const delay = Math.max(1000 - elapsedTime, 0);

        setTimeout(() => {
          setLoading(false);
        }, delay);
      } catch (error) {
        console.error("Error fetching microCMS data:", error);
        setError(true);
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []); // 全件を一度だけ取得し、ページ移動では取り直さない

  return (
    <div className="sm:w-[70%] w-[90%] m-auto pb-32">
      <h1 id="news">お知らせ</h1>

      {/* 🔄 ローディング表示 */}
      {loading && <Skeleton />}

      {/* ⚠ エラー表示 */}
      {error && (
        <div>
          <Error />
          <div className="flex justify-center">
            <Button asChild>
              <Link className="sm:w-1/4 w-full" href="/">
                トップへ戻る
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ❌ 記事がない場合の表示 */}
      {!loading && !error && pageItems.length === 0 && (
        <div>
          <Zero />
          <div className="flex justify-center">
            <Button asChild>
              <Link className="sm:w-[50%] w-full" href="/">
                トップへ戻る
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* ✅ 記事がある場合の表示 */}
      {!loading && !error && pageItems.length > 0 && (
        <>
          <Table>
            <TableBody>
              {pageItems.map((post) => (
                <TableRow
                  key={post.key}
                  className="flex flex-wrap sm:table-row border-b"
                >
                  <TableCell className="w-1/4 sm:w-1/12 align-text-top pl-2 sm:pl-4">
                    {formatDate(post.publishedAt)}
                  </TableCell>
                  <TableCell className="w-1/4 sm:w-1/12 text-[10px] align-text-top font-medium text-center min-w-32">
                    <p className="text-[10px] bg-gray-100 px-2 leading-5 rounded-sm">
                      {post.tag}
                    </p>
                  </TableCell>
                  <TableCell className="w-full sm:w-auto align-text-top pt-0 px-2 sm:px-4">
                    <Link
                      href={post.link}
                      className="hover:underline block sm:inline font-bold"
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* 🧭 ページネーション */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <Pagination>
                <PaginationContent>
                  {/* 前へ */}
                  <PaginationItem>
                    <PaginationPrevious
                      href={createPageUrl(currentPage - 1)}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) goToPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {/* ページ番号 */}
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href={createPageUrl(page)}
                          isActive={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            goToPage(page);
                          }}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {/* 次へ */}
                  <PaginationItem>
                    <PaginationNext
                      href={createPageUrl(currentPage + 1)}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          goToPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
