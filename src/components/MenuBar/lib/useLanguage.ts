import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "next-export-i18n";

import { IMenu } from "@/components/MenuBar/lib/types";

import i18n from "../../../../i18n";

export function useLanguage(): [IMenu] {
  const { t } = useTranslation();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const language = t("__language__");

  function handlerLangItem(arg: any) {
    const tmp = new URLSearchParams(searchParams);
    tmp.set("lang", arg);
    router.push(pathname + "?" + tmp.toString());
  }

  const languages: IMenu = {
    label: language,
    items: Object.keys(i18n.translations).map((key, i) => {
      return {
        label:
          i18n.translations[key as unknown as keyof typeof i18n.translations][
            "__language__"
          ],
        handler: handlerLangItem,
        arg: key,
        enabled: true,
      };
    }),
  };

  return [languages];
}
