import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function OngoingDetail() {
  const [animeList, setAnimeList] = useState([]);
  const [allAnimeData, setAllAnimeData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = "http://localhost:3001";
  const itemsPerPage = 15;

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      let currentPage = 1;
      let allAnime = [];
      let hasMore = true;

      try {
        while (hasMore) {
          const res = await fetch(
            `${apiBaseUrl}/otakudesu/ongoing?page=${currentPage}`
          );
          const data = await res.json();
          const newAnimeList = data.data.animeList.map((anime) => ({
            id: anime.animeId,
            title: anime.title,
            imageUrl: anime.poster,
          }));

          allAnime = [...allAnime, ...newAnimeList];
          hasMore = newAnimeList.length === itemsPerPage;
          currentPage++;
          if (currentPage > 100) {
            console.warn(
              "Reached page limit of 100 for ongoing. Assuming this is the end."
            );
            break;
          }
        }

        console.log(`Total items for ongoing: ${allAnime.length}`);
        setAllAnimeData(allAnime);
        setTotalPages(Math.ceil(allAnime.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching all ongoing anime:", error);
        setAllAnimeData([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Update displayed anime whenever page changes or all data is loaded
  useEffect(() => {
    if (allAnimeData.length > 0) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setAnimeList(allAnimeData.slice(startIndex, endIndex));
    }
  }, [page, allAnimeData]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white pt-16 px-4 md:px-12">
        <nav className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2 mt-12">
          <Link
            to="/"
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-white">Ongoing Anime</span>
        </nav>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {animeList.length > 0 ? (
                animeList.map((anime) => (
                  <div
                    key={anime.id}
                    className="group w-full aspect-[2/3] cursor-pointer relative transition-transform duration-200 ease-out hover:scale-105"
                  >
                    <img
                      src={anime.imageUrl || "/placeholder.svg"}
                      alt={anime.title}
                      className="rounded-md object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                      <p className="text-xs sm:text-sm md:text-base text-white font-medium truncate drop-shadow-md">
                        {anime.title}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No ongoing anime available.</p>
              )}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="text-red-500 hover:text-red-600 mb-12 mt-12"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <p className="text-sm md:text-base mb-12 mt-12">
                  <b>
                    {page} of {totalPages}
                  </b>
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="text-red-500 hover:text-red-600 mb-12 mt-12"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
