"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Users, Plus, Hash, ArrowRight } from "lucide-react";
import axios from "axios";
import { http_server } from "@/config";

const JoinRoom = () => {
  const navigate = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isJoining, setIsJoining] =useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;

    try {
      setIsJoining(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.get(`${http_server}/join-room/${roomCode}`,{
        headers : {
          Authorization : token
        }
      });

      if(response.data.success){
        if(response.data.isExists){
          alert(response.data.message);
          navigate.push(`/canvas/${response.data.roomId}`)
        }
        else{
          alert(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally{
      setIsJoining(false);
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
          className="max-w-lg mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-2xl flex items-center justify-center"
            >
              <Users className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl text-gray-900 mb-3">
              Join a Room
            </h1>
            <p className="text-gray-600 font-body text-lg">
              Enter a room code to join a collaborative canvas
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
            {/* Room Code Input */}
            <div className="mb-6">
              <label className="block font-display text-lg text-gray-900 mb-3">
                Room Code
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => {
                    setRoomCode(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter the Room ID "
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-xl text-black font-body text-lg transition-colors ${
                    error
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-orange-500"
                  } focus:outline-none`}
                  required
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-red-600 font-body text-sm"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!roomCode.trim() || isJoining}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-orange-500 text-white rounded-xl font-display text-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isJoining ? (
                <>
                  <motion.div
                    className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Joining...
                </>
              ) : (
                <>
                  Join Room
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Create Room CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 font-body">
              Want to start your own canvas?{" "}
              <Link href="/create-room" className="text-orange-500 hover:underline font-medium">
                Create a new room
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default JoinRoom;
