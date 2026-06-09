import {useCallback, useEffect, useRef} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {getBlueSheets} from '../config/apiConfig';

export const BLUESHEET_POLL_INTERVAL_MS = 15000;

export const normalizeBlueSheetsResponse = res => {
  const blue = Array.isArray(res)
    ? res
    : res?.data ?? res?.items ?? res?.rows ?? res ?? [];
  if (Array.isArray(blue)) {
    return blue;
  }
  return blue.bluesheets ?? [];
};

export const fetchBlueSheetsList = async (token, user) => {
  const res = await getBlueSheets(token, user);
  return normalizeBlueSheetsResponse(res);
};

/**
 * Polls bluesheet list while the screen is focused so status changes from the
 * backend appear without navigating away.
 */
export function useBlueSheetsAutoRefresh({
  token,
  user,
  onData,
  onError,
  enabled = true,
  intervalMs = BLUESHEET_POLL_INTERVAL_MS,
}) {
  const isFocused = useIsFocused();
  const onDataRef = useRef(onData);
  const onErrorRef = useRef(onError);
  onDataRef.current = onData;
  onErrorRef.current = onError;

  const refresh = useCallback(async () => {
    if (!enabled || !token || !user) {
      return;
    }
    try {
      const sheets = await fetchBlueSheetsList(token, user);
      onDataRef.current?.(sheets);
    } catch (err) {
      console.error('Error refreshing bluesheets:', err);
      onErrorRef.current?.(err);
    }
  }, [enabled, token, user]);

  useEffect(() => {
    if (!enabled || !isFocused) {
      return undefined;
    }

    refresh();
    const id = setInterval(refresh, intervalMs);
    return () => clearInterval(id);
  }, [enabled, isFocused, refresh, intervalMs]);

  return {refresh};
}
