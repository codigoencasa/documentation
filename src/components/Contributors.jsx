import { useEffect, useState } from 'react';
import Image from 'next/image'
import { getProfiles } from 'services/get-profiles';

export function Contributors({users}) {
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const profiles = await getProfiles(users);
        setListUsers(profiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    }

    fetchProfiles();
  }, []);

  if (!listUsers.length) return <></>;

  return (
    <div className='place-content-center'>
      <ul className='flex flex-wrap gap-2 p-0 m-0'>
        {listUsers.map((contributor) => (
          <li key={'contributor-'+contributor.id} className='list-none p-0 m-0'>
            <a href={contributor.profile} target='_blank'>
            <Image
              src={contributor.avatar}
              alt={contributor.name}
              width={30}
              height={30}
              className="rounded-full hover:shadow-md transition-all shadow-slate-400 m-0 bg-fuchsia-200"
            />
            </a>
        
          </li>
        ))}
      </ul>
    </div>
  );
}
