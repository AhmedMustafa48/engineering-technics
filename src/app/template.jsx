// template.jsx remounts on every navigation, so this CSS fade replays per page.
export default function Template({ children }) {
  return <div className="animate-page">{children}</div>;
}
