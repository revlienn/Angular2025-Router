// COURSE 4
/*

Single Page Applications (SPAs) vs. Multi-Page Applications (MPAs)
Traditional MPAs (e.g., Wikipedia):
    Load a new HTML page from the server on each navigation.    
    Each link click results in a full-page reload.

SPAs (e.g., Angular.io):
    Load a single HTML page with minimal content initially.
    JavaScript (e.g., Angular) fetches and displays content dynamically.
    Navigation is faster and smoother, with no full-page reloads.
    URL changes reflect navigation, but the page stays the same.

How SPAs Work
    Initial load: Empty HTML + scripts.
    Angular framework initializes and renders content on the client.
        Content changes are handled on the client side using JavaScript.
    Data is fetched via REST API calls, not embedded in HTML.

Benefits of SPAs
    Faster user experience – instant navigation without full-page reloads.
        eg go to angular.io and move from page to page, no reload==no load spinning indicator activated, swift change
    Simpler back-end – only a static server and REST API needed.
        so basically it'll serve a static html&css, contents including text etc are delivered by rest API
    Efficient development – no need for server-side rendering engines.
    summary improved UX, improved performance

Downsides
    SEO limitations with some search engines (e.g., Bing), unless server-side rendering is used. Google is ok with this tho
    Not ideal if public SEO visibility is crucial, but good for private enterprise.

Use Cases
    Ideal for private apps (e.g., enterprise dashboards, membership-based services).
    Less suitable for public-facing content-heavy sites needing high SEO performance.

Next Steps in the Course
    Set up Angular routing from scratch.

Learn about:

    Route configuration
    <router-outlet>
    Navigation basics
    Lazy loading
     Auxiliary routes

*/
