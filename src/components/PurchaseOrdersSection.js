import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {getJobOrdersForMobile} from '../services/purchaseOrdersApi';

const PAGE_SIZE = 50;

const dash = v => (v === null || v === undefined || v === '' ? '-' : String(v));

// USD with 2 decimals: $1,234.50
const money = v => {
  if (v === null || v === undefined || v === '') return '-';
  const n = Number(v);
  if (!Number.isFinite(n)) return '-';
  const [whole, dec] = Math.abs(n).toFixed(2).split('.');
  return `${n < 0 ? '-' : ''}$${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${dec}`;
};

// "2026-11-03" -> "11/03/2026" (read from the text, so no timezone shifts the day)
const fmtDate = v => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(v || ''));
  return m ? `${m[2]}/${m[3]}/${m[1]}` : '-';
};

const statusLook = status => {
  const s = String(status || '').toLowerCase();
  if (s === 'completed') return {bg: '#D1FAE5', fg: '#059669'};
  if (s === 'pending') return {bg: '#FEF3C7', fg: '#B45309'};
  if (s === 'cancelled' || s === 'rejected') return {bg: '#FEE2E2', fg: '#DC2626'};
  return {bg: '#F1F5F9', fg: '#64748B'};
};
const capitalize = t => (t ? t.charAt(0).toUpperCase() + t.slice(1) : '-');

const Pulse = ({style}) => {
  const opacity = useRef(new Animated.Value(0.45)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {toValue: 1, duration: 700, useNativeDriver: true}),
        Animated.timing(opacity, {toValue: 0.45, duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={[{backgroundColor: '#E1E9EE', borderRadius: 6, opacity}, style]} />;
};

const SkeletonCard = () => (
  <View style={styles.orderCard}>
    <View style={styles.rowBetween}>
      <Pulse style={{width: 110, height: 16}} />
      <Pulse style={{width: 70, height: 20, borderRadius: 10}} />
    </View>
    <Pulse style={{width: 150, height: 12, marginTop: 12}} />
    <View style={[styles.rowBetween, {marginTop: 12}]}>
      <Pulse style={{width: 60, height: 12}} />
      <Pulse style={{width: 70, height: 16}} />
    </View>
  </View>
);

const OrderCard = ({order}) => {
  const [open, setOpen] = useState(false);
  const look = statusLook(order.status);
  const items = Array.isArray(order.items) ? order.items : [];
  return (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.85} onPress={() => setOpen(v => !v)}>
      <View style={styles.rowBetween}>
        <Text style={styles.orderNumber}>{dash(order.orderNumber)}</Text>
        <View style={[styles.chip, {backgroundColor: look.bg}]}>
          <Text style={[styles.chipText, {color: look.fg}]}>{capitalize(order.status)}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {fmtDate(order.orderDate)}  -  {dash(order.supplierName)}
      </Text>
      <View style={[styles.rowBetween, {marginTop: 10}]}>
        <Text style={styles.meta}>{dash(order.totalItems)} items</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.total}>{money(order.itemsTotal)}</Text>
          <Icon name={open ? 'expand-less' : 'expand-more'} size={22} color="#64748B" />
        </View>
      </View>

      {open && (
        <View style={styles.itemsWrap}>
          {items.length === 0 ? (
            <Text style={styles.meta}>No items</Text>
          ) : (
            items.map((it, i) => (
              <View key={String(it.id ?? i)} style={[styles.itemRow, i < items.length - 1 && styles.itemBorder]}>
                <View style={{flex: 1, paddingRight: 8}}>
                  <Text style={styles.itemName}>{dash(it.name)}</Text>
                  {it.sku ? <Text style={styles.sku}>{it.sku}</Text> : null}
                  <Text style={styles.meta}>
                    {dash(it.quantity)} x {money(it.unitPrice)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>{money(it.total)}</Text>
              </View>
            ))
          )}
          {order.notes ? (
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.meta}>{order.notes}</Text>
            </View>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * Read-only "Purchase Orders" section for one job. Parent can call ref.refresh() (pull to refresh)
 * and ref.loadMore() (when scrolled to the bottom).
 */
const PurchaseOrdersSection = forwardRef(({jobId}, ref) => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const reqId = useRef(0);
  const state = useRef({});
  state.current = {orders, total, page, status, loadingMore, jobId};

  const load = useCallback(async (pageNo, mode) => {
    const id = ++reqId.current;
    const forJob = state.current.jobId;
    if (forJob == null) return;
    if (mode === 'more') setLoadingMore(true);
    if (mode === 'initial') setStatus('loading');
    try {
      const res = await getJobOrdersForMobile(forJob, {page: pageNo, limit: PAGE_SIZE});
      if (id !== reqId.current) return; // a newer request / another job replaced this one
      setOrders(prev => (mode === 'more' ? [...prev, ...res.orders] : res.orders));
      setTotal(res.total);
      setPage(res.page || pageNo);
      setErrorMsg('');
      setStatus('ready');
    } catch (e) {
      if (id !== reqId.current) return;
      setErrorMsg(e?.message || 'Something went wrong');
      // keep the last loaded list on screen if there is one
      setStatus(state.current.orders.length > 0 ? 'ready' : 'error');
    } finally {
      if (id === reqId.current) setLoadingMore(false);
    }
  }, []);

  // a different job must never show the previous job's orders
  useEffect(() => {
    reqId.current += 1;
    setOrders([]);
    setTotal(0);
    setPage(1);
    setErrorMsg('');
    setLoadingMore(false);
    if (jobId != null) load(1, 'initial');
  }, [jobId, load]);

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => load(1, 'refresh'),
      loadMore: () => {
        const s = state.current;
        if (s.status === 'ready' && !s.loadingMore && s.orders.length < s.total) {
          return load(s.page + 1, 'more');
        }
        return undefined;
      },
    }),
    [load],
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Icon name="receipt" size={20} color="#3B82F6" />
        <Text style={styles.title}>Purchase Orders</Text>
        {status === 'ready' && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{total}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {status === 'error' && (
          <View style={styles.center}>
            <Icon name="error-outline" size={32} color="#EF4444" />
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => load(1, 'initial')}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === 'ready' && orders.length === 0 && (
          <View style={styles.center}>
            <Icon name="inbox" size={32} color="#94A3B8" />
            <Text style={styles.emptyText}>No purchase orders for this job</Text>
          </View>
        )}

        {status === 'ready' && orders.length > 0 && (
          <>
            {errorMsg ? (
              <TouchableOpacity style={styles.banner} onPress={() => load(1, 'refresh')}>
                <Text style={styles.bannerText}>{errorMsg}. Tap to retry.</Text>
              </TouchableOpacity>
            ) : null}
            {orders.map(o => (
              <OrderCard key={String(o.id)} order={o} />
            ))}
            {loadingMore && <ActivityIndicator style={{marginVertical: 10}} color="#3B82F6" />}
            {!loadingMore && orders.length < total && (
              <TouchableOpacity style={styles.moreBtn} onPress={() => load(page + 1, 'more')}>
                <Text style={styles.moreText}>Load more</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16},
  title: {fontSize: 16, fontWeight: '600', color: '#1E293B'},
  countBadge: {backgroundColor: '#EBF4FF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2},
  countText: {color: '#2563EB', fontSize: 12, fontWeight: '700'},
  content: {paddingHorizontal: 16, paddingBottom: 16},
  orderCard: {borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 10, backgroundColor: '#FFFFFF'},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderNumber: {fontSize: 15, fontWeight: '700', color: '#1E293B'},
  chip: {borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3},
  chipText: {fontSize: 11, fontWeight: '700'},
  meta: {fontSize: 12, color: '#64748B', marginTop: 4},
  total: {fontSize: 15, fontWeight: '700', color: '#1E293B'},
  itemsWrap: {marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: '#E2E8F0'},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8},
  itemBorder: {borderBottomWidth: 1, borderBottomColor: '#F1F5F9'},
  itemName: {fontSize: 13, fontWeight: '600', color: '#1E293B'},
  sku: {fontSize: 11, color: '#94A3B8', marginTop: 1},
  itemTotal: {fontSize: 13, fontWeight: '700', color: '#1E293B'},
  notes: {marginTop: 8, backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10},
  notesLabel: {fontSize: 11, fontWeight: '700', color: '#64748B'},
  center: {alignItems: 'center', paddingVertical: 20},
  emptyText: {marginTop: 8, fontSize: 14, color: '#64748B'},
  errorText: {marginTop: 8, fontSize: 13, color: '#64748B', textAlign: 'center'},
  retryBtn: {marginTop: 12, backgroundColor: '#3B82F6', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 8},
  retryText: {color: '#FFFFFF', fontWeight: '700'},
  banner: {backgroundColor: '#FEF3C7', borderRadius: 8, padding: 8, marginBottom: 10},
  bannerText: {color: '#B45309', fontSize: 12, textAlign: 'center'},
  moreBtn: {alignSelf: 'center', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 16, backgroundColor: '#EBF4FF'},
  moreText: {color: '#2563EB', fontWeight: '600', fontSize: 13},
});

export default PurchaseOrdersSection;
