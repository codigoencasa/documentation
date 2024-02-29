import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';

const LanguageSelector = () => {
    const router = useRouter();
    const [locale, setLocale] = useState(router.route.slice(0, 3).replace('/',''));
    const pathname = usePathname()

    const handleChangeLanguage = useCallback((event) => {
        const newLocale = event.target.value;
        const path = pathname.split('/').at(2)

        if (newLocale !== locale) {
            setLocale(newLocale);
            router.push(`/${newLocale}/${path}`);
        }

    }, [locale]);

    return (
        <div className="p-1 transparent">
            <select className="p-1 bg-transparent w-[50px] rounded-md dark:text-white text-black" onChange={handleChangeLanguage} defaultValue={locale}>
                <option value="en">En</option>
                <option value="pt">Pt</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
