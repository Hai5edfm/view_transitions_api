
const checkIsNavigationSupported = () => {
    return Boolean(document.startViewTransition);
}

const fetchPage = async (url) => {
    // fetch the new page
    const response = await fetch(url);
    const html = await response.text();

    // regex to get the body content
    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];

    // update the page title
    const title = html.match(/<title[^>]*>([\s\S]*)<\/title>/i)[1];

    return [body, title];
}
    


export const startViewTransition = () => {
    if(!checkIsNavigationSupported()) return;

    window.navigation.addEventListener('navigate', (event) => {
        const toUrl = new URL(event.destination.url);

        // if it is an external link, open it in a new tab
        if (toUrl.origin !== window.location.origin) {
            window.open(event.destination.url, '_blank');
            event.preventDefault();
        } 

        event.intercept({
            async handler() {

                const [body, title] = await fetchPage(toUrl.pathname);
                
                document.title = title;
                // update the page content
                document.startViewTransition(() => {

                    document.getElementById('content').innerHTML = body;
                    // scroll to the top
                    document.documentElement.scrollTop = 0;

                })
            }
        })
    });
}