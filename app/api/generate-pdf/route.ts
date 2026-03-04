import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Local development executable path for macOS/Linux/Windows
const localExecutablePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export async function POST(req: NextRequest) {
  try {
    const { html } = await req.json();

    if (!html) {
      return NextResponse.json({ error: "No HTML content provided" }, { status: 400 });
    }

    const isDev = process.env.NODE_ENV === "development";

    let browser;
    if (isDev) {
      // Use local Chrome for development
      browser = await puppeteer.launch({
        args: [],
        executablePath: localExecutablePath,
        headless: true,
      });
    } else {
      // Use @sparticuz/chromium for production (Vercel)
      // Cast to any because the types might be slightly outdated or mismatching
      const chromiumPack = chromium as any;
      browser = await puppeteer.launch({
        args: chromiumPack.args,
        defaultViewport: chromiumPack.defaultViewport,
        executablePath: await chromiumPack.executablePath(),
        headless: chromiumPack.headless,
      });
    }

    const page = await browser.newPage();

    // Wrap the user HTML in a full HTML document with Tailwind CSS
    // Using CDN for simplicity in this generated PDF context
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PDF Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          /* Ensure backgrounds are printed */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    await page.setContent(fullHtml, {
      waitUntil: "networkidle0", // Wait for Tailwind CDN and fonts to load
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    await browser.close();

    // Create a response
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (error: any) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message || String(error) },
      { status: 500 }
    );
  }
}
