'use client'

import { Variable } from '@/lib/types';

import { SystemMapCanvas, SystemMapCanvasMode } from '@/components/SystemMapCanvas/SystemMapCanvas';
import MenuBar from '@/components/MenuBar/MenuBar';

import {
  useTranslation,
  LanguageSwitcher,
  LinkWithLocale
} from "next-export-i18n";
import { useState, Suspense } from 'react';

function HomeImp() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SystemMapCanvasMode>(SystemMapCanvasMode.Change);
  const variables = new Array<Variable>;

  function handleVariablesChange(variables: Variable[]): void {

  }

  function handleModeClick(mode1: SystemMapCanvasMode) {
    setMode(mode1);
  }

  return (
    <>
      <MenuBar />
      <div className='flex'>
        <button
          onClick={() => { handleModeClick(SystemMapCanvasMode.Change); }}
          className={mode === SystemMapCanvasMode.Change ? 'btn-mode-active' : 'btn-mode'}
        >
          Change
        </button>
        <button
          onClick={() => { handleModeClick(SystemMapCanvasMode.AddVariable); }}
          className={mode === SystemMapCanvasMode.AddVariable ? 'btn-mode-active' : 'btn-mode'}
        >
          Add Variable
        </button>
        <button
          onClick={() => { handleModeClick(SystemMapCanvasMode.AddLink); }}
          className={mode === SystemMapCanvasMode.AddLink ? 'btn-mode-active' : 'btn-mode'}
        >
          Add Link
        </button>
        <button
          onClick={() => { handleModeClick(SystemMapCanvasMode.AddStock); }}
          className={mode === SystemMapCanvasMode.AddStock ? 'btn-mode-active' : 'btn-mode'}
        >
          Add Stock
        </button>
        <button
          onClick={() => { handleModeClick(SystemMapCanvasMode.AddFlow); }}
          className={mode === SystemMapCanvasMode.AddFlow ? 'btn-mode-active' : 'btn-mode'}
        >
          Add Flow
        </button>
      </div>
      <SystemMapCanvas
        mode={mode}
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
