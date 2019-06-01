/* global Sentry */
import { isBot } from './helpers/isBot';

export default async () => {
    // Skip registration for unsupported browsers, bots
    if (!('serviceWorker' in navigator) || isBot) {
        return;
    }

    const swDisabled = false || localStorage.getItem('sw');

    if (swDisabled) {
        // If disabled, try to unregister it
        // usually for developments reasons
        const serviceWorker = await navigator.serviceWorker.getRegistration();
        if (serviceWorker) {
            await serviceWorker.unregister();
            console.info('Service worker successfully unregistered.');
        }
    } else {
        navigator.serviceWorker
            .register(`${window.location.origin}/service-worker.js`)
            // .then(() => console.info('Browser supports SW, PWA Enabled!'))
            .catch(err =>
                Sentry
                    ? Sentry.captureException(err)
                    : // eslint-disable-next-line no-console
                      console.error(`Failed to register SW: `, err),
            );
    }
};
