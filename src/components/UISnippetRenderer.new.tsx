import React, { useState } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { ErrorBoundary } from './ErrorBoundary';
import type { UISnippet } from '../types/chat';

interface UISnippetRendererProps {
  snippet: UISnippet;
}

// Глобальный scope для react-live
const scope = {
  React,
  useState: React.useState,
  useEffect: React.useEffect,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useReducer: React.useReducer,
  // Добавляем популярные JavaScript API
  console,
  setTimeout,
  setInterval,
  clearTimeout,
  clearInterval,
  JSON,
  Math,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  alert: window.alert,
};

export const UISnippetRenderer: React.FC<UISnippetRendererProps> = ({ snippet }) => {
  const [showCode, setShowCode] = useState(false);

  if (snippet.language !== 'jsx' && snippet.language !== 'tsx') {
    return (
      <div className="ui-snippet-container">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            {snippet.language.toUpperCase()} Code
          </span>
        </div>
        <pre className="code-preview bg-gray-100 p-4 rounded-lg overflow-x-auto">
          <code>{snippet.code}</code>
        </pre>
        {snippet.description && (
          <p className="text-sm text-gray-600 mt-2">{snippet.description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="ui-snippet-container">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-600">Interactive UI Component</span>
        <button
          onClick={() => setShowCode(!showCode)}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors font-medium"
        >
          {showCode ? 'Hide Code' : 'Show Code'}
        </button>
      </div>

      <LiveProvider
        code={snippet.code}
        scope={scope}
        theme={{
          plain: {
            color: '#393A34',
            backgroundColor: '#f6f8fa',
          },
          styles: [
            {
              types: ['comment', 'prolog', 'doctype', 'cdata'],
              style: {
                color: '#999988',
                fontStyle: 'italic',
              },
            },
            {
              types: ['namespace'],
              style: {
                opacity: 0.7,
              },
            },
            {
              types: ['string', 'attr-value'],
              style: {
                color: '#e3116c',
              },
            },
            {
              types: ['punctuation', 'operator'],
              style: {
                color: '#393A34',
              },
            },
            {
              types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'],
              style: {
                color: '#36acaa',
              },
            },
            {
              types: ['atrule', 'keyword', 'attr-name', 'selector'],
              style: {
                color: '#00a4db',
              },
            },
            {
              types: ['function', 'deleted', 'tag'],
              style: {
                color: '#d73a49',
              },
            },
            {
              types: ['function-variable'],
              style: {
                color: '#6f42c1',
              },
            },
            {
              types: ['tag', 'selector', 'keyword'],
              style: {
                color: '#00009f',
              },
            },
          ],
        }}
      >
        {/* Live Preview */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 mb-4">
          <ErrorBoundary>
            <LivePreview />
          </ErrorBoundary>
          <LiveError className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm" />
        </div>

        {/* Code Editor */}
        {showCode && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">JSX Code</span>
            </div>
            <LiveEditor
              style={{
                fontFamily: '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                padding: '16px',
                backgroundColor: '#f6f8fa',
                minHeight: '200px'
              }}
            />
          </div>
        )}
      </LiveProvider>

      {snippet.description && (
        <p className="text-sm text-gray-600 mt-3 italic">{snippet.description}</p>
      )}
    </div>
  );
};
