/* eslint-disable no-undef */
import { CX_FETCH_MEW_ACCS } from '../cxEvents';
import store from '@/store';
import cxHelpers from '../cxHelpers';
import { ExtensionHelpers } from '@/helpers';
export default async ({ event, payload }, res, next) => {
  if (event !== CX_FETCH_MEW_ACCS) return next();
  const currentAccount = store.state.currentAddr;
  const q = cxHelpers.queryBuilder(payload);
  if (currentAccount) {
    res(currentAccount);
  } else {
    ExtensionHelpers.getAccounts(acc => {
      console.log(payload, q);
      if (Object.keys(acc).length > 0) {
        chrome.windows.create({
          url: chrome.runtime.getURL(
            `index.html#/extension-popups/account-access?connectionRequest=${payload.url}&${q}`
          ),
          type: 'popup',
          height: 500,
          width: 300,
          focused: true
        });
      } else {
        chrome.tabs.create({
          url: chrome.runtime.getURL(`index.html#/access-my-wallet`)
        });
      }
    });
  }
};
