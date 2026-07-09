import {useCallback, useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {supabase} from '../lib/supabase';
import {getNotificationsByUser} from '../config/apiConfig';
import {setUnreadCount} from '../redux/notificationSlice';

async function fetchUnreadCountFromApi(userId, token) {
  const res = await getNotificationsByUser(userId, 1, 1, token, 'all');
  const apiCount = res?.data?.pagination?.unread_count;
  if (apiCount != null) {
    return Math.max(0, Number(apiCount) || 0);
  }
  return null;
}

async function fetchUnreadCountFromSupabase(userId) {
  const {count, error} = await supabase
    .from('notification_recipients')
    .select('id', {count: 'exact', head: true})
    .eq('user_id', userId)
    .eq('status', 'unread');

  if (error || count == null) {
    return null;
  }
  return Math.max(0, count);
}

export function useNotifications(userId, token) {
  const dispatch = useDispatch();
  const unreadCount = useSelector(state => state.notification?.unreadCount ?? 0);
  const appStateRef = useRef(AppState.currentState);

  const refreshUnreadCount = useCallback(async () => {
    if (!userId) {
      dispatch(setUnreadCount(0));
      return 0;
    }

    try {
      let count = null;
      if (token) {
        count = await fetchUnreadCountFromApi(userId, token);
      }
      if (count == null) {
        count = await fetchUnreadCountFromSupabase(userId);
      }
      dispatch(setUnreadCount(count ?? 0));
      return count ?? 0;
    } catch (err) {
      console.error('refreshUnreadCount failed:', err);
      return null;
    }
  }, [dispatch, token, userId]);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`user-${userId}-notifications`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_recipients',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          refreshUnreadCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refreshUnreadCount]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      const prev = appStateRef.current;
      appStateRef.current = nextState;
      if (
        (prev === 'background' || prev === 'inactive') &&
        nextState === 'active'
      ) {
        refreshUnreadCount();
      }
    });
    return () => sub.remove();
  }, [refreshUnreadCount]);

  return {unreadCount, refreshUnreadCount};
}
