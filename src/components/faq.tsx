import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "Is QuickScan PDF really free?",
    answer:
      "Yes. The app is free to download and use, with no subscription and no in-app purchases. Ads cover the cost of keeping it free, and there is no watermark on your PDFs.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. There is no sign-up, login, or profile. Open the app, point the camera at the page, and scan.",
  },
  {
    question: "Where do my scans go?",
    answer:
      "They stay on your phone. Edge detection, filters, and PDF creation all run on-device, and nothing is uploaded. Your files stay on your device until you share, export, or delete them.",
  },
  {
    question: "Can I use it without an internet connection?",
    answer:
      "Scanning and PDF creation work offline. The app's ads may need a connection to load, but your documents do not.",
  },
  {
    question: "What happens if I delete the app?",
    answer:
      "Local scans and PDFs go with it. QuickScan PDF has no cloud backup or sync, so keep a copy of anything important before you uninstall.",
  },
  {
    question: "Can I scan more than one page?",
    answer:
      "Yes. Add pages in one session, rotate the sideways ones, reorder or delete them, then export the set as a single PDF. You can also import photos you already have from your gallery.",
  },
  {
    question: "Which phones does it support?",
    answer: "Android 9 and newer. A flat page and ordinary room light give the best results.",
  },
];

export function FaqAccordion() {
  return (
    <Accordion.Root type="single" collapsible className="border-t border-line">
      {FAQS.map((item, index) => (
        <Accordion.Item key={item.question} value={`faq-${index}`} className="border-b border-line">
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between gap-6 py-5 text-left text-[15px] font-medium leading-snug text-foreground transition-colors duration-150 hover:text-primary">
              <span>{item.question}</span>
              <Plus
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out group-data-[state=open]:rotate-45 group-data-[state=open]:text-foreground"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
            <p className="max-w-[43rem] pb-5 pr-8 text-[14px] leading-[1.7] text-muted-foreground">
              {item.answer}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
