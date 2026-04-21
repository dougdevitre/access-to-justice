import { Card } from "../components/Card";

export default function IntakePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Start an Intake</h1>
      <Card>
        <p>
          Answer a few questions so we can route your request to the right
          organization. All fields are optional.
        </p>
      </Card>

      <form className="space-y-3" action="#" method="post">
        <Field label="Full name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          />
        </Field>

        <Field label="Phone" htmlFor="phone">
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          />
        </Field>

        <Field label="ZIP code" htmlFor="zip">
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          />
        </Field>

        <Field label="Issue type" htmlFor="issue">
          <select
            id="issue"
            name="issue"
            defaultValue=""
            className="w-full min-h-11 px-3 rounded-xl border border-slate-300 bg-white"
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="housing">Housing / Eviction</option>
            <option value="family">Family</option>
            <option value="benefits">Public Benefits</option>
            <option value="immigration">Immigration</option>
            <option value="employment">Employment</option>
            <option value="consumer">Consumer / Debt</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="Describe your situation" htmlFor="details">
          <textarea
            id="details"
            name="details"
            rows={5}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
          />
        </Field>

        <button
          type="submit"
          className="w-full min-h-12 rounded-xl bg-brand text-white font-semibold"
        >
          Submit intake
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="block text-sm font-medium text-slate-800 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
