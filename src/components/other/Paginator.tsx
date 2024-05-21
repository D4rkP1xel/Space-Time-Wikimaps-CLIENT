import { useRouter, useSearchParams } from "next/navigation"
import React, { useEffect, useState } from "react"

function Paginator({
  curPage,
  totalPages,
  scrollToTop,
}: {
  curPage: number
  totalPages: number
  scrollToTop?: boolean
}) {
  const [pagesToShow, setPagesToShow] = useState<number[]>([])

  function handlePages() {
    const numPagesToShow = 5
    let pages = []

    // Calculate the start and end page numbers
    let startPage = Math.max(1, curPage - Math.floor(numPagesToShow / 2))
    let endPage = startPage + numPagesToShow - 1

    if (startPage === 1 && totalPages === 1) {
      setPagesToShow([1])
      return
    }
    // Adjust the endPage if it exceeds the totalPages
    if (endPage > totalPages) {
      endPage = totalPages

      startPage = Math.max(1, endPage - numPagesToShow + 1)
    }

    // Populate the pages array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    //console.log(pages)
    setPagesToShow(pages)
  }

  function changeToPage(page: number) {
    const currentUrl = window.location.href

    // Create a new URL object
    const url = new URL(currentUrl)

    // Get the search parameters from the URL
    const searchParams = new URLSearchParams(url.search)

    // Set or update the query parameter
    searchParams.set("page", page.toString())

    // Update the URL object with the new search parameters
    url.search = searchParams.toString()

    // Use history.pushState to update the browser's URL without reloading the page
    history.pushState({}, "", url.toString())
    if (scrollToTop) window.scrollTo(0, 0)
  }

  useEffect(() => {
    handlePages()
  }, [curPage, totalPages])

  return (
    <>
      {totalPages > 1 ? (
        <div className="w-full justify-center flex gap-3 my-8">
          {pagesToShow.map((p: number) => {
            return (
              <div
                onClick={() => changeToPage(p)}
                className={
                  curPage === p
                    ? "border-black border-2 bg-slate-50 w-10 h-10 flex justify-center items-center select-none cursor-pointer"
                    : "border-gray-500 border bg-slate-50 w-10 h-10 flex justify-center items-center select-none cursor-pointer"
                }
                key={p}>
                {p}
              </div>
            )
          })}
        </div>
      ) : null}
    </>
  )
}

export default Paginator
