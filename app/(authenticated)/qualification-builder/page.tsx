'use client';

import { QualificationBuilderProvider } from '@/lib/context/QualificationBuilderContext';
import { QualificationBuilder } from '@/components/qualification-builder/QualificationBuilder';

export default function QualificationBuilderPage() {
  return (
    <QualificationBuilderProvider>
      <QualificationBuilder />
    </QualificationBuilderProvider>
  );
}
