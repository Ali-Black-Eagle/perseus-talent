import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  // Only accessible in development
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Defence in depth: even a non-production build only serves CVs to the local machine
  const hostname = req.nextUrl.hostname;
  if (hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "[::1]") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  const file = searchParams.get("file");

  if (!folder || !file) {
    return new NextResponse("Missing parameters", { status: 400 });
  }

  // Prevent path traversal
  const sanitizedFolder = path.basename(folder);
  const sanitizedFile = path.basename(file);
  const filePath = path.join(
    process.cwd(),
    ".local-submissions",
    sanitizedFolder,
    sanitizedFile
  );

  try {
    const fileBuffer = await fs.readFile(filePath);
    let contentType = "application/octet-stream";
    if (sanitizedFile.endsWith(".pdf")) contentType = "application/pdf";
    else if (sanitizedFile.endsWith(".doc"))
      contentType = "application/msword";
    else if (sanitizedFile.endsWith(".docx"))
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${sanitizedFile}"`,
      },
    });
  } catch (e) {
    return new NextResponse("File not found", { status: 404 });
  }
}
