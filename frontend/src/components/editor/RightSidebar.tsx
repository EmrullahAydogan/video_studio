'use client';

import { useState } from 'react';
import { Sparkles, Settings, Sliders } from 'lucide-react';
import { AIPanel } from '../ai/AIPanel';
import { ScenePropertiesPanel } from './ScenePropertiesPanel';

type TabType = 'ai' | 'properties';

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<TabType>('ai');

  const tabs = [
    { id: 'ai' as TabType, label: 'AI Studio', icon: Sparkles },
    { id: 'properties' as TabType, label: 'Properties', icon: Settings },
  ];

  return (
    <div className="w-80 flex flex-col border-l">
      {/* Tabs */}
      <div className="flex border-b bg-card">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'ai' && <AIPanel />}
        {activeTab === 'properties' && <ScenePropertiesPanel />}
      </div>
    </div>
  );
}
