'use client'

import { useState, useEffect } from "react"
import i18n from "../../../i18n/index"

import { LanguageSwitcher, useTranslation, useSelectedLanguage } from "next-export-i18n"

interface language {
  id: string;
  name: string;
}

export default function Language() {
  const { lang, setLang } = useSelectedLanguage();
  const { t } = useTranslation();

  const [hidden, setHidden] = useState<boolean>(true);

  useEffect(() => {
    setHidden(true);
  }, [lang]);

  function handleClick() {
    setHidden(!hidden);
  }

  return (
    <div className="relative inline-block text-left">
      <button onClick={handleClick} className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-gray-100 focus:ring-blue-500">
        {t('__language__')}
      </button>
      <div hidden={hidden} className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 px-2 py-2">
        {
          Object.keys(i18n.translations).map((key, i) => {
            return (
              <div key={"lang-" + key} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <LanguageSwitcher lang={key}>
                  {i18n.translations[key as unknown as keyof typeof i18n.translations]['__language__']}
                </LanguageSwitcher>
              </div>
            )
          })}
      </div >
    </div >
  )
}
