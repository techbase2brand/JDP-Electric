import {useEffect, useState} from 'react';
import {supabase} from '../lib/supabase';

export function useNotifications(userId) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  //   useEffect(() => {
  //     if (!userId) return;

  //     const fetchInitialCount = async () => {
  //       const { count, error } = await supabase
  //         .from('notification_recipients')
  //         .select('id', { count: 'exact', head: true })
  //         .eq('user_id', userId)
  //         .eq('status', 'unread');

  //       if (!error) setUnreadCount(count || 0);
  //       setLoading(false);
  //     };

  //     fetchInitialCount();

  //     const channel = supabase
  //       .channel(`user-${userId}-notifications`)
  //       .on(
  //         'postgres_changes',
  //         {
  //           event: '*',
  //           schema: 'public',
  //           table: 'notification_recipients',
  //           filter: `user_id=eq.${userId}`,
  //         },
  //         payload => {
  //           const { eventType, new: newRow, old: oldRow } = payload;

  //           if (eventType === 'INSERT' && newRow?.status === 'unread') {
  //             setUnreadCount(prev => prev + 1);
  //           }

  //           if (
  //             eventType === 'UPDATE' &&
  //             oldRow?.status === 'unread' &&
  //             newRow?.status === 'read'
  //           ) {
  //             setUnreadCount(prev => Math.max(0, prev - 1));
  //           }
  //         }
  //       )
  //       .subscribe();

  //     return () => {
  //       supabase.removeChannel(channel);
  //     };
  //   }, [userId]);

  useEffect(() => {
    if (!userId) {
      console.log('No userId, skipping Supabase subscription');
      return;
    }
    // Initial count fetch
    const fetchUnreadCount = async () => {
      try {
        // First, test the connection with a simple query
        const {data: testData, error: testError} = await supabase
          .from('notification_recipients')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (testError) {
          console.error('❌ Supabase connection error:', testError);
          console.error('Error details:', {
            message: testError.message,
            details: testError.details,
            hint: testError.hint,
            code: testError.code,
          });
          return;
        }

        // Now get the count
        const {count, error} = await supabase
          .from('notification_recipients')
          .select('id', {count: 'exact', head: true})
          .eq('user_id', userId)
          .eq('status', 'unread');

        console.log('Initial count result:', {count, error});

        if (error) {
          console.error('Error fetching unread count:', error);
          return;
        }

        if (count !== null) {
          console.log('✅ Setting initial unread count:', count);
          setUnreadCount(count);
        } else {
          console.log('Count is null, setting to 0');
          setUnreadCount(0);
        }
      } catch (err) {
        console.error('❌ Exception in fetchUnreadCount:', err);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription
    console.log('Creating Supabase channel for user:', userId);
    const channel = supabase
      .channel(`user-${userId}-notifications`, {
        config: {
          broadcast: {self: true},
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_recipients',
          filter: `user_id=eq.${userId}`,
        },
        async (payload: any) => {
          console.log('🔔 Real-time notification change received:', payload);
          console.log('Event type:', payload.eventType);
          console.log('New record:', payload.new);
          console.log('Old record:', payload.old);

          // Refetch count after any change
          try {
            const {count, error} = await supabase
              .from('notification_recipients')
              .select('id', {count: 'exact', head: true})
              .eq('user_id', userId)
              .eq('status', 'unread');

            console.log('Updated count after change:', {count, error});

            if (error) {
              console.error('Error fetching updated count:', error);
              return;
            }

            if (count !== null) {
              console.log('Updating unread count to:', count);
              setUnreadCount(count);
            }
          } catch (err) {
            console.error('Error in count update:', err);
          }

          // If notification was added, refresh the notifications list
          if (payload.eventType === 'INSERT') {
            console.log('New notification inserted, refreshing list');
            //   fetchNotifications();
          }
        },
      )
      .subscribe(status => {
        console.log('Supabase subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time notifications');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error in Supabase subscription');
        } else if (status === 'TIMED_OUT') {
          console.error('❌ Subscription timed out');
        } else if (status === 'CLOSED') {
          console.log('Subscription closed');
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up Supabase subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {unreadCount, loading};
}
