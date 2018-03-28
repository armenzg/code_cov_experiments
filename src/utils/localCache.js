import * as localForage from 'localforage';
import settings from '../settings';

const CACHING_KEY = 'cachedTime';

export const isExpiredCache = (lastCaching) => {
  const MSTOS = 1000;
  const currentTime = (new Date()).getTime();
  const secondsDifference = (currentTime - lastCaching) / MSTOS;
  console.debug((currentTime - lastCaching) / MSTOS);
  return (
    (typeof lastCaching === 'number') &&
    (secondsDifference > settings.CACHE_CONFIG.SECONDS_TO_EXPIRE))
    || false;
};

export const getFromCache = async (key) => {
  let data;
  try {
    const lastCaching = await localForage.getItem(CACHING_KEY);
    data = await localForage.getItem(key);
    if (!isExpiredCache(lastCaching) && data) {
      console.debug('Retrieved data from the local cache.');
    } else {
      console.debug('The cache has expired');
      data = undefined;
    }
  } catch (e) {
    // We only log since we want to fetch the changesets from Hg
    console.error(e);
  }
  return data;
};

export const saveInCache = async (key, data) => {
  const currentTime = (new Date()).getTime();
  console.debug('Storing on local cache.');
  await localForage.setItem(key, data);
  await localForage.setItem(CACHING_KEY, currentTime);
};

export const clearCache = () => {
  try {
    localForage.clear();
    return true;
  } catch (e) {
    console.log(e);
    throw e;
  }
};
