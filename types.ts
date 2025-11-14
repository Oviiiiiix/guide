import React from 'react';

export interface Section {
  id: string;
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  content: React.ReactNode;
  keywords: string;
}
