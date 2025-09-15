import { titleCase } from "text-case";

export default function WorkspaceMemberRow({ user }) {
  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-300';
      case 'manager':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <>
      <tr className="bg-transparent text-white text-opacity-80 text-sm font-medium border-b border-white/5 hover:bg-white/5 transition-colors">
        <th scope="row" className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap font-medium">
          <div className="truncate max-w-[100px] sm:max-w-[140px] md:max-w-none" title={user.username}>
            {user.username}
          </div>
        </th>
        <td className="px-3 md:px-6 py-3 md:py-4">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
            {titleCase(user.role)}
          </span>
        </td>
        <td className="px-3 md:px-6 py-3 md:py-4 hidden sm:table-cell text-white/60 text-xs">
          {user.lastUpdatedAt}
        </td>
        <td className="px-3 md:px-6 py-3 md:py-4 text-center">
          <span className="text-white/40 text-xs">Member</span>
        </td>
      </tr>
    </>
  );
}
