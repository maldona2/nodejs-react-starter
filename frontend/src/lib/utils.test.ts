import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('keeps the last of two conflicting tailwind utilities', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('drops falsy values', () => {
    const hidden = false;
    expect(cn('flex', hidden && 'hidden', undefined, 'gap-2')).toBe(
      'flex gap-2'
    );
  });
});
