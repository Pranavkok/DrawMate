"use client"
import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Users, Lock, Globe, Palette, Sparkles, Plus } from "lucide-react";
import axios from "axios";
import { http_server } from "@/config";

const CreateRoom = () => {
  const navigate = useRouter();
  const [roomName, setRoomName] = useState("");
  const [privacy, setPrivacy] = useState<"private" | "public">("private");
  const [template, setTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const templates = [
    { id: "blank", name: "Blank Canvas", icon: Sparkles },
    { id: "brainstorm", name: "Brainstorming", icon: Palette },
    { id: "wireframe", name: "Wireframe", icon: Users },
    { id: "flowchart", name: "Flowchart", icon: Sparkles },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    try {
        setIsCreating(true);
        const token = localStorage.getItem("token");
        const response = await axios.post(`${http_server}/create-room`,{
            roomId : roomName
        },{
            headers : {
                Authorization : token
            }
        });

        if(response.data.success){
            alert(response.data.message);
            navigate.push(`/canvas/${response.data.roomId}`);
        }
    } catch (error) {
        console.log(error);
    }finally{
        setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">


      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b-2 border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
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
                <Plus />
                <span className="hidden sm:inline">Create Room</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-2xl flex items-center justify-center"
            >
              <Pencil className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-3">
              Create New Room
            </h1>
            <p className="text-gray-600 font-body text-lg">
              Set up your collaborative canvas in seconds
            </p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white border-2 border-gray-200 rounded-2xl p-8"
          >
            {/* Room Name */}
            <div className="mb-8">
              <label className="block font-display text-lg text-gray-900 mb-3">
                Room Name
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., My_Room"
                className="w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-xl font-body text-lg focus:outline-none focus:border-orange-500 transition-colors text-black"
                required
              />
            </div>

            {/* Privacy Settings */}
            <div className="mb-8">
              <label className="block font-display text-lg text-gray-900 mb-3">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPrivacy("private")}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    privacy === "private"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-200 hover:border-orange-500/50"
                  }`}
                >
                  <Lock
                    className={`w-8 h-8 ${
                      privacy === "private" ? "text-orange-500" : "text-gray-600"
                    }`}
                  />
                  <span className="font-display text-gray-900">Private</span>
                  <span className="text-sm text-gray-600 font-body">
                    Invite only
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy("public")}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                    privacy === "public"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-gray-200 hover:border-orange-500/50"
                  }`}
                >
                  <Globe
                    className={`w-8 h-8 ${
                      privacy === "public" ? "text-orange-500" : "text-gray-600"
                    }`}
                  />
                  <span className="font-display text-gray-900">Public</span>
                  <span className="text-sm text-gray-600 font-body">
                    Anyone with link
                  </span>
                </button>
              </div>
            </div>

            {/* Templates */}
            <div className="mb-8">
              <label className="block font-display text-lg text-gray-900 mb-3">
                Start with a template (optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(template === t.id ? null : t.id)}
                    className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      template === t.id
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-gray-200 hover:border-orange-500/50"
                    }`}
                  >
                    <t.icon
                      className={`w-6 h-6 ${
                        template === t.id ? "text-orange-500" : "text-gray-600"
                      }`}
                    />
                    <span className="text-sm font-body text-gray-900">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!roomName.trim() || isCreating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-display text-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isCreating ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Creating Room...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Create Room
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 font-body text-sm">
              💡 Tip: You can invite collaborators after creating the room
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateRoom;
