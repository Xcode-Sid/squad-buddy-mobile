import { useMemo } from 'react';
import { FIELDS } from '../data/mockData';

export function useField(id: string | undefined) {
  return useMemo(() => FIELDS.find((f) => f.id === id), [id]);
}
