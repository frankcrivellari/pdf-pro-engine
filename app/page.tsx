"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FileDown, Eye, Code2 } from "lucide-react";

export default function Home() {
  const [htmlContent, setHtmlContent] = useState(`
<div style="font-family: sans-serif; padding: 40px; color: #333;">
  <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 20px;">Rechnung #2024-001</h1>
  <p>Vielen Dank für Ihren Einkauf bei PDF Studio.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
    <thead>
      <tr style="background-color: #f8fafc; text-align: left;">
        <th style="padding: 12px; border-bottom: 2px solid #e2e8f0;">Beschreibung</th>
        <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Menge</th>
        <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Preis</th>
        <th style="padding: 12px; border-bottom: 2px solid #e2e8f0; text-align: right;">Gesamt</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Web Design Service</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">1</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">1.500,00 €</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">1.500,00 €</td>
      </tr>
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">Hosting (Jährlich)</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">1</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">120,00 €</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">120,00 €</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold;">Summe:</td>
        <td style="padding: 12px; text-align: right; font-weight: bold;">1.620,00 €</td>
      </tr>
    </tfoot>
  </table>

  <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #64748b;">
    <p>Bitte überweisen Sie den Betrag innerhalb von 14 Tagen.</p>
  </div>
</div>
  `);

  const handleEditorChange = (value: string | undefined) => {
    setHtmlContent(value || "");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Toolbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 h-16 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
            PS
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">PDF Studio</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors shadow-sm">
            <FileDown size={18} />
            Export PDF
          </button>
        </div>
      </header>

      {/* Main Content Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane: Editor */}
        <div className="w-1/2 flex flex-col border-r border-slate-200 bg-[#1e1e1e]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#333] text-gray-400 text-xs font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Code2 size={14} />
              <span>HTML Source</span>
            </div>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={htmlContent}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
              }}
            />
          </div>
        </div>

        {/* Right Pane: Preview */}
        <div className="w-1/2 bg-slate-100 flex flex-col relative">
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 text-slate-500 text-xs font-medium uppercase tracking-wider z-10">
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>Live Preview (A4)</span>
            </div>
            <div className="text-[10px] text-slate-400">
              210mm x 297mm
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start bg-slate-100/50">
            <div 
              className="bg-white shadow-2xl shrink-0 transition-all duration-200 ease-in-out"
              style={{
                width: '210mm',
                height: '297mm',
                maxWidth: '100%',
              }}
            >
              <iframe
                title="PDF Preview"
                srcDoc={htmlContent}
                className="w-full h-full border-none"
                sandbox="allow-scripts" 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
