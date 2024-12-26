"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      
      if (!session) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
