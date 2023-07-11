
const checkIsNavigationSupported = () => {
    return Boolean(document.startViewTransition);
}

const fetchPage = async (url) => {
    // fetch the new page
    const response = await fetch(url);
    const html = await response.text();

    // regex to get the body content
    const body = html.match(/<body>([\s\S]*)<\/body>/i)[1];

    // update the page title
    // const title = html.match(/<title[^>]*>([\s\S]*)<\/title>/i)[1];

    return [body];
}
    


export const startViewTransition = () => {
    if(!checkIsNavigationSupported()) return;

    window.navigation.addEventListener('navigate', (event) => {
        const toUrl = new URL(event.destination.url);

        // if it is an external link, open it in a new tab
        if (toUrl.origin !== window.location.origin) return;
        
        event.intercept({
            async handler() {

                const [body] = await fetchPage(toUrl.pathname);

                // update the page content
                document.startViewTransition(() => {

                    document.getElementById('content-app').innerHTML = body;
                    // scroll to the top
                    document.documentElement.scrollTop = 0;

                })
            }
        })
    });
}

startViewTransition();
