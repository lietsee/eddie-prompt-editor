import React from 'react';

export function TitleInput({ value, onChange, placeholder = 'プロンプトのタイトル' }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-lg font-semibold bg-white/80 backdrop-blur-sm border border-secondary-200 rounded-xl shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 placeholder-secondary-400"
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/5 to-accent-500/5 pointer-events-none"></div>
    </div>
  );
}