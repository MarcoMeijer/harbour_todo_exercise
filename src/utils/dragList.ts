export default function dragList<T>(list: T[], from: number, to: number): T[] {
  return from < to
    ? [
        ...list.slice(0, from),
        ...list.slice(from + 1, to + 1),
        list[from],
        ...list.slice(to + 1),
      ]
    : [
        ...list.slice(0, to),
        list[from],
        ...list.slice(to, from),
        ...list.slice(from + 1),
      ];
}
