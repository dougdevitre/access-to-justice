import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

function isValidLocale(value: string | undefined): value is Locale {
  return (routing.locales as readonly string[]).includes(value ?? "");
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isValidLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
