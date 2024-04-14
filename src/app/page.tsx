'use client'

import { Variable } from '@/lib/types';

import SystemMapCanvas from '@/components/SystemMapCanvas';

import MenuBar from '@/components/MenuBar/MenuBar';

import {
  useTranslation,
  LanguageSwitcher,
  LinkWithLocale
} from "next-export-i18n";
import { Suspense } from 'react';

function HomeImp() {
  const { t } = useTranslation();
  const variables = new Array<Variable>;

  function handleVariablesChange(variables: Variable[]): void {

  }

  return (
    <>
      <MenuBar />
      <div>
      </div>
      <SystemMapCanvas
        variables={variables}
        onVariablesChange={handleVariablesChange}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomeImp />
    </Suspense>
  );
}
