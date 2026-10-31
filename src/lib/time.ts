const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const two = (n: number) => (n < 10 ? `0${n}` : String(n));

/** Local date and time, e.g. "31 Oct, 09:12" or with weekday "Sat 31 Oct, 09:12". */
export function dateTime(ms: number, weekday = false): string {
  const d = new Date(ms);
  return `${weekday ? `${DAY[d.getDay()]} ` : ''}${d.getDate()} ${MON[d.getMonth()]}, ${two(d.getHours())}:${two(d.getMinutes())}`;
}
