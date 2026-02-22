import { useState, useCallback } from 'react';

export type SquadStatus = 'none' | 'scouted' | 'invite_received' | 'teammate';

interface SquadState {
  [playerId: string]: SquadStatus;
}

export function useFriends(
  initialTeammates: string[],
  initialInvites: string[],
  initialScouted: string[],
) {
  const [state, setState] = useState<SquadState>(() => {
    const s: SquadState = {};
    initialTeammates.forEach((id) => (s[id] = 'teammate'));
    initialInvites.forEach((id) => (s[id] = 'invite_received'));
    initialScouted.forEach((id) => (s[id] = 'scouted'));
    return s;
  });

  const sendRequest = useCallback((id: string) => {
    setState((prev) => ({ ...prev, [id]: 'scouted' }));
  }, []);

  const acceptRequest = useCallback((id: string) => {
    setState((prev) => ({ ...prev, [id]: 'teammate' }));
  }, []);

  const rejectRequest = useCallback((id: string) => {
    setState((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const release = useCallback((id: string) => {
    setState((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  const getStatus = useCallback(
    (id: string): SquadStatus => state[id] ?? 'none',
    [state],
  );

  return { getStatus, sendRequest, acceptRequest, rejectRequest, release };
}
