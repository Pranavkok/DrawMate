"use client"
import { JSX, useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, Clock, MoreVertical, Trash2, Copy, ExternalLink, Search, Grid, List, Pencil } from "lucide-react";
import axios from "axios";
import { http_server } from "@/config";
import { useRouter } from "next/navigation";

interface Room {
  id: string;
  slug: string;
  createdAt: string;
}

const Home = () => {

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  async function getRooms(): Promise<Room[]> {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return [];
      }
      const response = await axios.get(`${http_server}/get-rooms`,{
        headers : {
          Authorization : token
        }
      })
      if(response.data.success){
        return response.data.userRooms ;
      }
      else{
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  useEffect(() => {
    const fetchRooms = async () => {
      const fetchedRooms = await getRooms();
      setRooms(fetchedRooms);
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredRooms = rooms.filter((room) =>
    room.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getThumbnailPattern = (type: string) => {
    const patterns: Record<string, JSX.Element> = {
      brainstorm: (
        <>
          <circle cx="30" cy="30" r="15" className="stroke-orange-500" strokeWidth="2" fill="none" />
          <circle cx="70" cy="50" r="12" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <line x1="45" y1="30" x2="58" y2="45" className="stroke-gray-900/40" strokeWidth="2" />
          <rect x="50" y="70" width="30" height="20" rx="3" className="stroke-orange-500" strokeWidth="2" fill="none" />
        </>
      ),
      wireframe: (
        <>
          <rect x="10" y="10" width="80" height="15" rx="2" className="stroke-gray-900/40" strokeWidth="2" fill="none" />
          <rect x="10" y="35" width="35" height="50" rx="2" className="stroke-orange-500" strokeWidth="2" fill="none" />
          <rect x="55" y="35" width="35" height="25" rx="2" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <rect x="55" y="70" width="35" height="15" rx="2" className="stroke-gray-900/40" strokeWidth="2" fill="none" />
        </>
      ),
      diagram: (
        <>
          <rect x="30" y="10" width="40" height="20" rx="3" className="stroke-orange-500" strokeWidth="2" fill="none" />
          <line x1="50" y1="30" x2="50" y2="45" className="stroke-gray-900/40" strokeWidth="2" />
          <rect x="10" y="50" width="30" height="20" rx="3" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <rect x="60" y="50" width="30" height="20" rx="3" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <line x1="50" y1="45" x2="25" y2="50" className="stroke-gray-900/40" strokeWidth="2" />
          <line x1="50" y1="45" x2="75" y2="50" className="stroke-gray-900/40" strokeWidth="2" />
        </>
      ),
      planning: (
        <>
          <rect x="10" y="10" width="25" height="75" rx="2" className="stroke-orange-500" strokeWidth="2" fill="none" />
          <rect x="40" y="10" width="25" height="75" rx="2" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <rect x="70" y="10" width="25" height="75" rx="2" className="stroke-gray-900/40" strokeWidth="2" fill="none" />
          <rect x="15" y="20" width="15" height="10" rx="1" className="fill-orange-500/30" />
          <rect x="45" y="20" width="15" height="10" rx="1" className="fill-orange-400/30" />
        </>
      ),
      flow: (
        <>
          <circle cx="20" cy="50" r="12" className="stroke-orange-500" strokeWidth="2" fill="none" />
          <line x1="32" y1="50" x2="48" y2="50" className="stroke-gray-900/40" strokeWidth="2" />
          <polygon points="50,40 70,50 50,60" className="stroke-orange-400" strokeWidth="2" fill="none" />
          <line x1="70" y1="50" x2="85" y2="50" className="stroke-gray-900/40" strokeWidth="2" />
          <rect x="85" y="40" width="10" height="20" rx="2" className="stroke-orange-500" strokeWidth="2" fill="none" />
        </>
      ),
      design: (
        <>
          <circle cx="25" cy="25" r="10" className="fill-orange-500/40" />
          <circle cx="50" cy="25" r="10" className="fill-orange-400/40" />
          <circle cx="75" cy="25" r="10" className="fill-gray-900/20" />
          <rect x="15" y="50" width="70" height="8" rx="2" className="fill-gray-900/20" />
          <rect x="15" y="65" width="50" height="8" rx="2" className="fill-gray-900/20" />
          <rect x="15" y="80" width="30" height="8" rx="2" className="fill-gray-900/20" />
        </>
      ),
    };
    const arry = ["brainstorm","design","flow","wireframe","diagram","planning"] ;
    const length = arry.length ;
    const rand = Math.floor(Math.random()*length-1)
    return patterns[arry[rand]] || patterns.brainstorm;
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center border-gray-200">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-2xl text-gray-900">Sketchboard</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/join-room"
                className="hidden sm:flex items-center gap-2 px-4 py-2 border-2 text-black border-black rounded-lg hover:bg-gray-50 transition-colors font-body"
              >
                <Users className="w-4 h-4" />
                Join Room
              </Link>
              <Link
                href="/create-room"
                className="flex items-center gap-2 px-4 py-2 bg-orange-500  text-white rounded-lg hover:bg-orange-600 transition-colors border-black font-body"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Room</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-2">
            Welcome back! <span className="inline-block animate-wiggle">✏️</span>
          </h1>
          <p className="text-gray-600 font-body text-lg">
            Continue where you left off or start something new
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Search your rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-body focus:outline-none text-black focus:border-orange-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border-2 border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-orange-500 text-white" : "hover:bg-gray-50 text-black"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list" ? "bg-orange-500 text-white" : "hover:bg-gray-50 text-black"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Rooms Grid/List */}
        {loading ? (
          <div className="text-center py-16">
            <h3 className="font-display text-2xl text-gray-900 mb-2">Loading rooms...</h3>
          </div>
        ) : filteredRooms.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            {filteredRooms.map((room, index) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`group relative bg-white border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-all hover:shadow-lg ${
                  viewMode === "list" ? "flex items-center" : ""
                }`}
              >
                {/* Thumbnail */}
                <div
                  className={`bg-gray-50 ${
                    viewMode === "grid" ? "aspect-video" : "w-24 h-24 flex-shrink-0"
                  }`}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full p-4"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {getThumbnailPattern("diagram")}
                  </svg>
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1 flex items-center justify-between" : ""}`}>
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <h3 className="font-display text-xl text-gray-900 group-hover:text-orange-500 transition-colors">
                      {room.slug}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 font-body">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {room.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative ">
                    <button
                      aria-label="Delete message"
                      onClick={() => setOpenMenuId(openMenuId === room.id ? null : room.id)}
                      className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    <AnimatePresence>
                      {openMenuId === room.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 w-48 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-40"
                        >
                          <button onClick={()=>{
                            router.push(`/canvas/${room.id}`)
                          }} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex text-black items-center gap-2 font-body">
                            <ExternalLink className="w-4 h-4" />
                            Open
                          </button>
                          <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-500 font-body">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="font-display text-2xl text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 font-body mb-6">
              {searchQuery ? "Try a different search term" : "Create your first room to get started"}
            </p>
            <Link
              href="/create-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors border-gray-200 font-body"
            >
              <Plus className="w-5 h-5" />
              Create Room
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Home;
