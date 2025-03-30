"use client"
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-200 text-gray-800">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="text-6xl font-bold"
      >
        404
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-xl mt-2"
      >
        Üzgünüz, aradığınız sayfa bulunamadı.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6"
      >
        <Link  className="flex items-center p-3 bg-blue-500 text-white rounded cursor-pointer" href={"/"}>
           Ana Sayfaya Dön
        </Link>
      </motion.div>
    </div>
  );
}