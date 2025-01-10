import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest } from "next/server";

export type Locale = "en-US" | "zh-CN";
export const locales = ["en-US", "zh-CN"];
export const defaultLocale = "en-US";

export const getLocale = (request: NextRequest) => {
  const { headers } = request;
  const language = headers.get("accept-language");
  if (!language) {
    return defaultLocale;
  }

  const languages = new Negotiator({
    headers: { "accept-language": language },
  }).languages();

  return match(languages, locales, defaultLocale);
};
