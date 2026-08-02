"use client";

import { useEffect } from "react";
import { register } from "@/services/auth.service";

export default function TestPage() {
  useEffect(() => {
    console.log("Frontend connected");
  }, []);

  return <h1>Testing...</h1>;
}