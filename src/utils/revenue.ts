export function revenueForRange(jobs: any[], from: Date, to: Date) {
  return jobs.filter((j:any) => {
    const d = j.createdAt ? new Date(j.createdAt) : null;
    if (!d) return false;
    return d >= from && d < to;
  }).reduce((s:number, j:any) => s + (Number(j.billAmount ?? j.services?.reduce((ss:any,it:any)=> ss + (it?.estimatedCost ?? 0),0) ?? 0) || 0), 0);
}

export function countForRange(jobs: any[], from: Date, to: Date) {
  return jobs.filter((j:any) => {
    const d = j.createdAt ? new Date(j.createdAt) : null;
    if (!d) return false;
    return d >= from && d < to;
  }).length;
}

export function buildRevenueSummary(jobs: any[]) {
  const startOf = (d: Date) => { const r = new Date(d); r.setHours(0,0,0,0); return r; };
  const today = startOf(new Date());
  const tomorrow = new Date(today.getTime() + 24*60*60*1000);
  const startOfWeek = startOf(new Date()); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const rToday = revenueForRange(jobs, today, tomorrow);
  const cToday = countForRange(jobs, today, tomorrow);
  const rWeek = revenueForRange(jobs, startOfWeek, new Date(startOfWeek.getTime() + 7*24*60*60*1000));
  const cWeek = countForRange(jobs, startOfWeek, new Date(startOfWeek.getTime() + 7*24*60*60*1000));
  const rMonth = revenueForRange(jobs, startOfMonth, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth()+1,1));
  const cMonth = countForRange(jobs, startOfMonth, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth()+1,1));

  return [
    { period: 'Today', amount: rToday, jobs: cToday, avgPerJob: cToday ? Math.round(rToday / cToday) : 0 },
    { period: 'This Week', amount: rWeek, jobs: cWeek, avgPerJob: cWeek ? Math.round(rWeek / cWeek) : 0 },
    { period: 'This Month', amount: rMonth, jobs: cMonth, avgPerJob: cMonth ? Math.round(rMonth / cMonth) : 0 },
  ];
}
