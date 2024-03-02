import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const LanguageSelector = () => {
    const router = useRouter();
    const [locale, setLocale] = useState(router.route.slice(0, 3));
    const [newRoute, setNewRoute] = useState(router.route);
    const pathname = usePathname()

    const handleChangeLanguage = (event) => {
        const newLocale = event.target.value;
        if (newLocale !== locale) {
            const newRoute = pathname.replace(locale, newLocale);
            setLocale(newLocale);
            setNewRoute(newRoute);
            
            router.push(`/${newRoute}`);
            
        }
    };

    useEffect(() => undefined, [newRoute]);

    return (
        <div className="p-1 transparent">
            <select className="p-1 bg-transparent w-[50px] rounded-md dark:text-white text-black"
            onChange={handleChangeLanguage} defaultValue={locale}>
                <option value="en">En</option>
                <option value="pt">Pt</option>
            </select>
        </div>
    );
};

export default LanguageSelector;
