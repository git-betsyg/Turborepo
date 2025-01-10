import 'server-only'
import {Locale} from "@/lib/locale";

const dictionaries = {
    'en-US': () => import('./dictionaries/en-US.json').then((module) => module.default),
    'zh-CN': () => import('./dictionaries/zh-CN.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) =>
    dictionaries[locale]()