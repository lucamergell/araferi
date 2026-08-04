import { Match, SkillLevel } from '../types';

export const formatDisplayName = (fullName: string | undefined | null): string => {
  if (!fullName || !fullName.trim()) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0];
  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const initial = lastName.replace(/[^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u10A0-\u10FF]/g, '').charAt(0).toUpperCase();
  if (!initial) return firstName;
  return `${firstName} ${initial}.`;
};

/**
  Formats date string as dd.mm.yyyy
 */
export const formatDateDDMMYYYY = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '';
  const str = dateStr.trim();
  
  // If already in dd.mm.yyyy format
  if (/^\d{2}\.\d{2}\.\d{4}$/.test(str)) return str;

  // If ISO format YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}.${month}.${year}`;
  }

  // General Date parsing
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  return str;
};

/**
  Returns localized day of week for a given YYYY-MM-DD or date string
 */
export const getLocalizedDayOfWeek = (dateStr: string | undefined | null, lang: 'ka' | 'en'): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  
  const daysKa = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const dayIndex = d.getDay();
  return lang === 'ka' ? daysKa[dayIndex] : daysEn[dayIndex];
};

/**
  Returns localized skill level / difficulty
 */
export const getLocalizedSkillLevel = (skill: SkillLevel | string | undefined | null, lang: 'ka' | 'en'): string => {
  if (!skill) return '';
  const map: Record<string, { ka: string; en: string }> = {
    'Beginner': { ka: 'დამწყები', en: 'Beginner' },
    'Intermediate': { ka: 'საშუალო', en: 'Intermediate' },
    'Advanced': { ka: 'მაღალი', en: 'Advanced' },
    'Expert': { ka: 'ექსპერტი', en: 'Expert' },
    'Pro': { ka: 'პრო', en: 'Pro' },
    'Open to All': { ka: 'ყველასთვის', en: 'Open to All' }
  };
  return map[skill] ? map[skill][lang] : skill;
};

/**
  Returns localized fields for a Match object based on current active language
 */
export const getLocalizedMatch = (match: Match, lang: 'ka' | 'en') => {
  const isKa = lang === 'ka';

  const title = isKa 
    ? (match.titleKa || match.title) 
    : (match.titleEn || match.title);

  const locationName = isKa 
    ? (match.locationNameKa || match.locationName) 
    : (match.locationNameEn || match.locationName);

  const address = isKa 
    ? (match.addressKa || match.address) 
    : (match.addressEn || match.address);

  const description = isKa 
    ? (match.descriptionKa || match.description) 
    : (match.descriptionEn || match.description);

  const dayOfWeek = match.date 
    ? getLocalizedDayOfWeek(match.date, lang) 
    : (isKa ? (match.dayOfWeekKa || match.dayOfWeek) : (match.dayOfWeekEn || match.dayOfWeek));

  const formattedDate = formatDateDDMMYYYY(match.date);
  const skillLevel = getLocalizedSkillLevel(match.skillLevelRequired, lang);

  return {
    title,
    locationName,
    address,
    description,
    dayOfWeek,
    formattedDate,
    skillLevel
  };
};

