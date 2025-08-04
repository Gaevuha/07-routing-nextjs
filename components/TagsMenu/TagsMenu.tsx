'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import css from './TagsMenu.module.css';
import { fetchTags } from '@/lib/api';

const TagsMenu = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      const tagsById = await fetchTags();
      setTags(tagsById);
    };

    loadTags();
  }, []);

  return (
    <div className={css.menuContainer}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={css.menuButton}
      >
        Notes ▾
      </button>

      {isOpen && (
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
      )}
    </div>
  );
};

export default TagsMenu;
