// Site-wide accent colours, built around the logo's sky blue. The orange picks up the sunset in the
// hero photographs. Used in rotation so repeated cards read as a set rather than one flat colour.
export const accents = [
  { tile: "from-sky-400 to-blue-600", soft: "bg-sky-100", text: "text-sky-700 dark:text-sky-300" },
  { tile: "from-indigo-400 to-violet-600", soft: "bg-indigo-100", text: "text-indigo-700 dark:text-indigo-300" },
  { tile: "from-teal-400 to-emerald-600", soft: "bg-teal-100", text: "text-teal-700 dark:text-teal-300" },
  { tile: "from-orange-400 to-rose-500", soft: "bg-orange-100", text: "text-orange-700 dark:text-orange-300" },
  { tile: "from-cyan-400 to-sky-600", soft: "bg-cyan-100", text: "text-cyan-700 dark:text-cyan-300" },
  { tile: "from-violet-400 to-fuchsia-600", soft: "bg-violet-100", text: "text-violet-700 dark:text-violet-300" },
];

export function accent(index) {
  return accents[index % accents.length];
}
