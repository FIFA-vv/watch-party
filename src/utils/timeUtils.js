/**
 * Converts a given Date (or current time) to IST components (hours, minutes, seconds).
 * IST is UTC + 5:30.
 */
export function getISTComponents(date = new Date()) {
  const optionsDate = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const optionsTime = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const options24Hour = {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
  const time24 = new Intl.DateTimeFormat('en-GB', options24Hour).format(date);

  const parts = time24.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  const period = hours >= 12 ? 'PM' : 'AM';

  return {
    hours,
    minutes,
    seconds,
    formattedTime,
    formattedDate,
    period,
    fullISTString: `${formattedDate}, ${formattedTime} IST`,
  };
}

/**
 * Parses a custom simulated time string (e.g. "10:30 AM", "11:45", "14:15") or uses current IST.
 * Returns total minutes from midnight IST.
 */
export function parseTimeToMinutesIST(timeStr) {
  if (!timeStr) {
    const { hours, minutes, formattedTime } = getISTComponents();
    return { minutesFromMidnight: hours * 60 + minutes, formatted: formattedTime };
  }

  const cleanStr = timeStr.trim().toUpperCase();
  const isPM = cleanStr.includes('PM');
  const isAM = cleanStr.includes('AM');

  const numbersOnly = cleanStr.replace(/[^0-9:]/g, '');
  const [hStr, mStr] = numbersOnly.split(':');

  let hours = parseInt(hStr || '0', 10);
  const minutes = parseInt(mStr || '0', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return {
    minutesFromMidnight: hours * 60 + minutes,
    formatted: timeStr,
  };
}

/**
 * Checks if the given IST time falls between 10:00 AM and 12:00 PM IST (inclusive).
 * 10:00 AM IST = 10 * 60 = 600 minutes
 * 12:00 PM IST = 12 * 60 = 720 minutes
 */
export function isLightModeISTWindow(customTimeIST) {
  let minutesFromMidnight;
  let displayTimeIST;

  if (customTimeIST) {
    const parsed = parseTimeToMinutesIST(customTimeIST);
    minutesFromMidnight = parsed.minutesFromMidnight;
    displayTimeIST = `${parsed.formatted} (Simulated IST)`;
  } else {
    const ist = getISTComponents();
    minutesFromMidnight = ist.hours * 60 + ist.minutes;
    displayTimeIST = `${ist.formattedTime} IST`;
  }

  const startWindow = 10 * 60; // 10:00 AM (600 mins)
  const endWindow = 12 * 60;   // 12:00 PM (720 mins)

  const isLightMode = minutesFromMidnight >= startWindow && minutesFromMidnight <= endWindow;

  const reason = isLightMode
    ? `Login time (${displayTimeIST}) is within 10:00 AM – 12:00 PM IST. Light Theme enabled automatically.`
    : `Login time (${displayTimeIST}) is outside 10:00 AM – 12:00 PM IST. Dark Theme applied by default.`;

  return {
    isLightMode,
    minutesFromMidnight,
    displayTimeIST,
    reason,
  };
}

/**
 * Determines theme mode based on IST time.
 */
export function determineLoginTheme(customTimeIST) {
  const { isLightMode } = isLightModeISTWindow(customTimeIST);
  return isLightMode ? 'light' : 'dark';
}
