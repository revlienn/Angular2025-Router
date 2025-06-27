// COURSE 5
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

// COURSE 6 - 7
/*

1. Initial State
    The app currently has no routing capabilities.
    The goal is to integrate the Angular Router and configure basic routes.

2. Setting Up Angular Router
    app.module.ts
        ensure bootstrap has AppRoutingModule
    app-routing.module.ts
        Import `RouterModule.forRoot([])` with an initially empty routes array
            { path: "urltext", component: chooseComponent }
        Export `RouterModule` so it's available app-wide.

3. Displaying Routed Components
    app.component.html
        add <router-outlet></router-outlet>
        This tells Angular where to render the component that matches the current route.
        Add Router Links:
            [routerLink]="['about']", good for relative/dynamically produced
            routerLink="about", ok for static

4. Active link styling
    adds a CSS class when the link is active
    app.component.css
        make the class, e.g., menu-item-active
    app.component.html
        inside the tag, routerLinkActive="menu-item-active"


5. Discuss Path Types:
    Relative paths are good for flexibility and refactoring.
        [routerLink]="['about']"
    But in this case (top menu), absolute paths are used to ensure correct behavior, especially when navigating from deeply nested routes.
        notice use /, eg routerLink="/login"

summary
You now know:
    How to define paths and matching components
    How to use <router-outlet> to display components
    How to navigate using routerLink
    How to visually indicate the active route using routerLinkActive

Next Steps in Course:
    Build the HomeComponent showing a list of courses.
    Navigate to individual course detail pages via child routes.
    Start developing a realistic master-detail navigation structure.


*/
