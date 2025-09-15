import { titleCase } from "text-case";

export default function WorkspaceMemberRow({ user }) {
  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium border-b border-white/10 hover:bg-white/5 transition-colors">
        <th scope="row" className="px-3 md:px-6 py-4 whitespace-nowrap font-medium">
          <div className="truncate max-w-[120px] md:max-w-none" title={user.username}>
            {user.username}
          </div>
        </th>
        <td className="px-3 md:px-6 py-4">
          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
            {titleCase(user.role)}
          </span>
        </td>
        <td className="px-3 md:px-6 py-4 hidden sm:table-cell text-white/60">
          {user.lastUpdatedAt}
        </td>
        <td className="px-3 md:px-6 py-4">
          {/* Action buttons can be added here if needed */}
        </td>
      </tr>
    </>
  );
}
