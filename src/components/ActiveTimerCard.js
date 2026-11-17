import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {getJobById} from '../config/apiConfig';

const formatTime = ms => {
  const sec = Math.max(0, Math.floor((ms || 0) / 1000));
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDate = date =>
  date
    ? new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '--';

const toSeconds = hms => {
  const [h = 0, m = 0, sec = 0] = String(hms || '0:0:0')
    .split(':')
    .map(n => parseInt(n, 10) || 0);
  return h * 3600 + m * 60 + sec;
};

const todayStr = (d = new Date()) => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const readJson = async key => {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Home screen card for the work timer of the last job whose timer was started.
 * - Header: job name, status and live time (or a Start button when no timer is in progress).
 * - Below: the job's full activity history, same as "All Activity Log" on the Timer screen.
 * - Tapping the card opens that job's Timer screen.
 * Starting a timer on another job replaces the card with that job.
 */
const ActiveTimerCard = ({navigation}) => {
  const {isRunning, elapsedTime} = useSelector(state => state.timer);
  const user = useSelector(state => state.user.user);
  const token = useSelector(state => state.user.token);
  const [job, setJob] = useState(null);
  const [inProgress, setInProgress] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [breaks, setBreaks] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    const [activeId, activeName, activeAddress] = await Promise.all([
      AsyncStorage.getItem('activeJobId'),
      AsyncStorage.getItem('activeJobName'),
      AsyncStorage.getItem('activeJobAddress'),
    ]);
    const last = await readJson('lastTimerJob');

    const current = activeId
      ? {id: activeId, name: activeName || 'Work', address: activeAddress || ''}
      : last;
    setInProgress(!!activeId);
    setJob(current?.id ? current : null);
    if (!current?.id) {
      setHistory([]);
      setBreaks([]);
      return;
    }

    // breaks of the session running right now (kept on the phone until the timer is stopped)
    let bufferBreaks = [];
    try {
      const [bStart, bJob] = await Promise.all([
        AsyncStorage.getItem('ts_buffer_startISO'),
        AsyncStorage.getItem('ts_buffer_jobId'),
      ]);
      if (
        activeId &&
        bStart &&
        String(bJob) === String(current.id) &&
        todayStr(new Date(bStart)) === todayStr()
      ) {
        const pauses = await readJson('ts_buffer_pauseList');
        bufferBreaks = (pauses || []).map(p => ({
          title: p.title,
          duration: p.duration || '00:00:00',
        }));
      }
    } catch {}

    try {
      setLoadingHistory(true);
      const res = await getJobById(current.id, token);
      const sheets = res?.data?.labor_timesheets || [];
      const mine = sheets
        .filter(
          t =>
            (user?.labor?.id && t.labor_id === user.labor.id) ||
            (user?.lead_labor?.id && t.lead_labor_id === user.lead_labor.id),
        )
        .map(t => ({
          start: t?.start_time || '--:--:--',
          end: t?.job_status === 'completed' ? t?.end_time || '--:--:--' : null,
          total: t?.work_activity || 0,
          date: t?.date || '',
        }))
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      setHistory(mine);

      const apiBreaks = sheets
        .filter(
          t =>
            t.date === todayStr() &&
            ((user?.labor?.id && t.labor_id === user.labor.id) ||
              (user?.lead_labor?.id && t.lead_labor_id === user.lead_labor.id)),
        )
        .flatMap(t => t.pause_timer || [])
        .map(p => ({title: p.title, duration: p.duration || '00:00:00'}));
      // same rule as the Timer screen: saved breaks first, else the running session's breaks
      setBreaks(apiBreaks.length > 0 ? apiBreaks : bufferBreaks);
    } catch (e) {
      setHistory([]);
      setBreaks(bufferBreaks);
    } finally {
      setLoadingHistory(false);
    }
  }, [token, user?.labor?.id, user?.lead_labor?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!job?.id) {
    return null;
  }

  const breakSeconds = breaks.reduce((sum, b) => sum + toSeconds(b.duration), 0);
  const status = !inProgress ? 'LAST JOB' : isRunning ? 'TIMER RUNNING' : 'TIMER PAUSED';
  const statusColor = !inProgress ? '#6b7280' : isRunning ? '#16a34a' : '#d97706';

  const openTimer = () => {
    navigation.navigate('TimerScreen', {
      jobId: Number(job.id),
      job: {id: Number(job.id), job_title: job.name, address: job.address},
    });
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={openTimer}>
      <View style={styles.headRow}>
        <View style={[styles.iconWrap, {backgroundColor: statusColor + '22'}]}>
          <MaterialIcons name="timer" size={26} color={statusColor} />
        </View>
        <View style={styles.middle}>
          <View style={styles.statusRow}>
            <View style={[styles.dot, {backgroundColor: statusColor}]} />
            <Text style={[styles.status, {color: statusColor}]}>{status}</Text>
          </View>
          <Text style={styles.jobName} numberOfLines={1}>
            {job.name}
          </Text>
          <Text style={styles.hint}>
            {inProgress ? 'Tap to open timer' : 'Tap to open timer and start'}
          </Text>
        </View>
        {inProgress ? (
          <Text style={styles.time}>{formatTime(elapsedTime)}</Text>
        ) : (
          <View style={styles.startPill}>
            <Text style={styles.startText}>Start</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      {expanded && breaks.length > 0 && (
        <View style={{marginBottom: 12}}>
          <Text style={styles.historyTitle}>Today's Activity Log</Text>
          {breaks.map((b, i) => (
            <View key={`${b.title}-${i}`} style={styles.breakRow}>
              <Text style={styles.logText}>{b.title}</Text>
              <Text style={styles.logText}>
                {b.duration === '00:00:00' ? 'Start' : b.duration}
              </Text>
            </View>
          ))}
          <View style={styles.breakRow}>
            <Text style={styles.logTotal}>Total</Text>
            <Text style={styles.logTotal}>{formatTime(breakSeconds * 1000)}</Text>
          </View>
        </View>
      )}

      <Text style={styles.historyTitle}>All Activity Log</Text>

      {loadingHistory && history.length === 0 ? (
        <ActivityIndicator style={{marginVertical: 12}} color="#2563eb" />
      ) : history.length === 0 ? (
        <Text style={styles.empty}>No activity found</Text>
      ) : (
        (expanded ? history : history.slice(0, 1)).map((item, index, arr) => (
          <View
            key={`${item.date}-${item.start}-${index}`}
            style={[styles.logItem, index < arr.length - 1 && styles.logBorder]}>
            <View style={{flex: 1}}>
              <Text style={styles.logText}>Start: {item.start}</Text>
              <Text style={[styles.logText, {marginTop: 8}]}>
                Date: {formatDate(item.date)}
              </Text>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={styles.logText}>End: {item.end ?? '--:--:--'}</Text>
              <Text style={[styles.logTotal, {marginTop: 8}]}>Total: {item.total}</Text>
            </View>
          </View>
        ))
      )}

      {!expanded && breaks.length > 0 && (
        <Text style={styles.breakSummary}>
          Breaks today: {breaks.length}  -  {formatTime(breakSeconds * 1000)}
        </Text>
      )}

      {(history.length > 1 || breaks.length > 0) && (
        <TouchableOpacity
          style={styles.expandBtn}
          activeOpacity={0.7}
          onPress={() => setExpanded(v => !v)}>
          <Text style={styles.expandText}>{expanded ? 'Show less' : 'View more'}</Text>
          <MaterialIcons
            name={expanded ? 'expand-less' : 'expand-more'}
            size={20}
            color="#2563eb"
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headRow: {flexDirection: 'row', alignItems: 'center'},
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  middle: {flex: 1, marginRight: 8},
  statusRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 2},
  dot: {width: 7, height: 7, borderRadius: 4, marginRight: 6},
  status: {fontSize: 11, fontWeight: '700', letterSpacing: 0.5},
  jobName: {fontSize: 16, fontWeight: '700', color: '#111827'},
  hint: {fontSize: 11, color: '#6b7280', marginTop: 2},
  time: {fontSize: 22, fontWeight: '800', color: '#2563eb', fontVariant: ['tabular-nums']},
  startPill: {
    backgroundColor: '#16a34a',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  startText: {color: '#fff', fontWeight: '700', fontSize: 14},
  divider: {height: 1, backgroundColor: '#e5e7eb', marginTop: 12, marginBottom: 10},
  historyTitle: {fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6},
  empty: {textAlign: 'center', color: '#6b7280', paddingVertical: 14},
  logItem: {flexDirection: 'row', paddingVertical: 10},
  logBorder: {borderBottomWidth: 1, borderBottomColor: '#e5e7eb'},
  logText: {fontSize: 13, color: '#374151'},
  logTotal: {fontSize: 13, fontWeight: '700', color: '#16a34a'},
  breakRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6},
  breakSummary: {fontSize: 12, color: '#6b7280', marginTop: 8},
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 6,
  },
  expandText: {color: '#2563eb', fontWeight: '600', fontSize: 13, marginRight: 2},
});

export default ActiveTimerCard;
