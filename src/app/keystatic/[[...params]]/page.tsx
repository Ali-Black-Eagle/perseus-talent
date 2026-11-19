import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";
import { isAdminEnabled } from "@/lib/admin";

// Decide at request time, so the live server's settings (not the build machine's) apply.
export const dynamic = "force-dynamic";

export default function KeystaticPage() {
  if (!isAdminEnabled()) notFound();
  return <KeystaticApp />;
}
