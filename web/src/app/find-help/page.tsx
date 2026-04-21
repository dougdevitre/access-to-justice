import { Card } from "../components/Card";

const sampleOrgs = [
  {
    name: "Legal Aid Society",
    area: "Housing, Family, Benefits",
    phone: "(555) 123-4567",
    zip: "10001",
  },
  {
    name: "Community Law Center",
    area: "Immigration, Employment",
    phone: "(555) 987-6543",
    zip: "10002",
  },
  {
    name: "Volunteer Lawyers Project",
    area: "Consumer, Debt",
    phone: "(555) 246-1357",
    zip: "10003",
  },
];

export default function FindHelpPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Find Legal Help</h1>

      <form className="flex gap-2" role="search">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="Enter ZIP"
          aria-label="ZIP code"
          className="flex-1 min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
        />
        <button
          type="submit"
          className="min-h-11 px-4 rounded-xl bg-brand text-white font-semibold"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3">
        {sampleOrgs.map((org) => (
          <Card
            key={org.name}
            title={org.name}
            footer={
              <a
                href={`tel:${org.phone.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center justify-center min-h-11 px-4 rounded-xl bg-brand-soft text-brand font-semibold"
              >
                Call {org.phone}
              </a>
            }
          >
            <p>
              <span className="font-medium text-slate-900">Practice areas:</span>{" "}
              {org.area}
            </p>
            <p>
              <span className="font-medium text-slate-900">ZIP:</span> {org.zip}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
