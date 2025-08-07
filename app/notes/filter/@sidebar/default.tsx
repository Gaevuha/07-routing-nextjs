// app/notes/filter/@sidebar/default.tsx

import css from './SidebarNotes.module.css';
import Link from 'next/link';
import { fetchTags } from '@/lib/api';

const NotesSidebar = async () => {
  const tags = await fetchTags();

  return (
    <div>
      <ul className={css.menuList}>
        <li className={css.menuItem}>
          <Link href="/notes/filter/all" className={css.menuLink}>
            All notes
          </Link>
        </li>

        {tags.map(tag => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              className={css.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesSidebar;
