import Image from 'next/image';
import logoBot from '@/images/logos/logo.png'

export function Logo(props) {
  return (
    <div className='flex gap-2'>
      <Image src={logoBot} alt="Logo" width={30} unoptimized />
      <div className='grid place-content-center'>
        <h4 className='font-bold dark:text-white text-zinc-900'>ChatBot</h4>
      </div>
    </div>
  );
}
