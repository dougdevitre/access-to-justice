import type { Metadata } from "next";
import { Card } from "../components/Card";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Plain-language answers to common legal questions for renters, families, and consumers.",
};

const faqs = [
  {
    q: "What do I do if I get an eviction notice?",
    a: "Do not ignore it. Note the deadline, gather your lease and payment records, and contact a legal aid organization as soon as possible.",
  },
  {
    q: "Can I get free legal help?",
    a: "Many organizations offer free help based on income. Use Find Legal Help to search by ZIP.",
  },
  {
    q: "How do I prepare for a court date?",
    a: "Bring a photo ID, all related documents, and a written timeline. Arrive at least 30 minutes early.",
  },
  {
    q: "What is a legal intake?",
    a: "A short set of questions that helps an organization understand your situation and decide how to help.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Resources</h1>
      <div className="grid grid-cols-1 gap-3">
        {faqs.map((item) => (
          <Card key={item.q} title={item.q}>
            <p>{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
