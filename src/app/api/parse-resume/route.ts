import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const MIN_TEXT = 30;

/**
 * Extracts raw text from an uploaded resume file (PDF, DOCX, TXT/MD).
 * Returns the unprocessed text — cleaning + skill extraction happen in the
 * analysis pipeline itself.
 */
export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart form upload." }, { status: 400 });
  }

  const entry = form.get("file");
  if (!entry || typeof entry === "string") {
    return NextResponse.json({ error: "Attach your resume as a form field named 'file'." }, { status: 400 });
  }
  const file = entry as File;
  if (file.size === 0) return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is larger than 5 MB — please upload a smaller resume." }, { status: 413 });
  }

  const name = (file.name || "resume").toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";
  let pages: number | null = null;

  try {
    if (name.endsWith(".pdf")) {
      const pdfModule = await import("pdf-parse");
      const pdfParse: any = (pdfModule as any).default || (pdfModule as any);

      const out = await pdfParse(buffer);
      text = out.text;
      pages = (out as any).numpages ?? null;
    } else if (name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const out = await mammoth.extractRawText({ buffer });
      text = out.value;
    } else if (name.endsWith(".txt") || name.endsWith(".md")) {
      text = buffer.toString("utf8");
    } else if (name.endsWith(".doc")) {
      return NextResponse.json(
        { error: "Legacy .doc files aren't supported — please save your resume as .docx or PDF." },
        { status: 415 },
      );
    } else {
      return NextResponse.json({ error: "Unsupported file type. Upload a PDF, DOCX, or TXT file." }, { status: 415 });
    }
  } catch (err) {
    console.error("parse-resume failed", err);
    return NextResponse.json(
      { error: "We couldn't read that file — it may be corrupted or protected. Try copy-pasting the text instead." },
      { status: 422 },
    );
  }

  text = text.replace(/\r\n?/g, "\n").replace(/[\u00A0\u202F\u2009]/g, " ").trim();
  if (text.length < MIN_TEXT) {
    return NextResponse.json(
      { error: "We couldn't find enough text in that file — it might be a scanned image. Try copy-pasting instead." },
      { status: 422 },
    );
  }

  return NextResponse.json({
    text,
    file_name: file.name || "resume",
    chars: text.length,
    pages,
  });
}
