export type ToolRoute =
  | "/merge-pdf"
  | "/split-pdf"
  | "/compress-pdf"
  | "/organize-pdf"
  | "/rotate-pdf"
  | "/image-to-pdf"
  | "/pdf-to-image"
  | "/sign-pdf"
  | "/page-numbers"
  | "/text-watermark";

export type NavRoute = "/tools" | "/how-it-works" | "/privacy" | "/about";

export const mainNav: { label: string; to: NavRoute }[] = [
  { label: "Tools", to: "/tools" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Privacy", to: "/privacy" },
  { label: "About", to: "/about" },
];

export const tools: {
  name: string;
  to: ToolRoute;
  description: string;
  icon: string;
}[] = [
  {
    name: "Merge PDF",
    to: "/merge-pdf",
    description: "Combine several PDFs into one file.",
    icon: "merge",
  },
  {
    name: "Split PDF",
    to: "/split-pdf",
    description: "Extract pages or split into parts.",
    icon: "split",
  },
  {
    name: "Compress PDF",
    to: "/compress-pdf",
    description: "Reduce file size for easier sharing.",
    icon: "compress",
  },
  {
    name: "Rotate PDF",
    to: "/rotate-pdf",
    description: "Fix page orientation in seconds.",
    icon: "rotate",
  },
  {
    name: "Organize PDF",
    to: "/organize-pdf",
    description: "Reorder, remove and arrange pages.",
    icon: "organize",
  },
  {
    name: "Image to PDF",
    to: "/image-to-pdf",
    description: "Turn JPG or PNG files into a PDF.",
    icon: "image",
  },
  {
    name: "PDF to Image",
    to: "/pdf-to-image",
    description: "Export pages as image files.",
    icon: "export",
  },
  {
    name: "Sign PDF",
    to: "/sign-pdf",
    description: "Add a signature to your document.",
    icon: "sign",
  },
  {
    name: "Page Numbers",
    to: "/page-numbers",
    description: "Add page numbers to your document.",
    icon: "numbers",
  },
  {
    name: "Text Watermark",
    to: "/text-watermark",
    description: "Add a text watermark to your pages.",
    icon: "watermark",
  },
];
