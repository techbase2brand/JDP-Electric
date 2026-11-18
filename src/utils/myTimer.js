/** The logged-in user's own running/paused timer from the server-driven timers, optionally for one job. */
export const findMyTimer = (timers, user, jobId) =>
  Object.values(timers || {}).find(
    t =>
      (jobId == null || String(t.jobId) === String(jobId)) &&
      ((t.kind === 'lead' && user?.lead_labor?.id != null && t.personId === user.lead_labor.id) ||
        (t.kind === 'labor' && user?.labor?.id != null && t.personId === user.labor.id)),
  ) || null;
