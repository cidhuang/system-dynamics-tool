
import { Suspense } from 'react';
import Content from './content';

export default function Home() {

  return (
    <Suspense>
      <Content />
    </Suspense>
  );
}
