// COURSE 25
/*

refresh
    lazy-loaded module, only loaded when accessing the url
    lighten the network burden, as it won't be loaded on init

1. What is Preloading?
Preloading allows you to load them earlier in the background, after the app starts.
    avoids long wait time
    reduce init load size
    improves performance, for a likely used module
notice By default, angular uses NoPreloading strategy by default.
    meaning no modules are preloaded

2. Use Case
CoursesModule is used by most users → good candidate for preloading.
An admin-only module should not be preloaded (used by few users).

3. How to Enable Preloading
app-routing.module.ts
    imports: [
    RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })
    ]
notice this wont override lazy-loaded modules with canLoad prop, because canLoad applies to specific module thus has higher precedence than routermodule.forroot which is general
    see inside path: "courses"

4. Testing It
app-routing.module.ts
    comment out, path: "courses", canLoad:...
Reload the app on a non-courses route (e.g. /about).
In the Network tab, confirm that:
    Main app bundle loads.
    Courses module is preloaded in the background.

You now know (Course 25)
    Angular offers two built-in strategies:
        NoPreloading (default)
        PreloadAllModules
    You can configure them using RouterModule.forRoot().
    Preloading is ignored if a module has a CanLoad guard.
    For better control, you can create a custom preloading strategy, which is the topic of the next lesson.



*/

// COURSE 26
/*

1. Goal
Create a custom strategy to control which lazy-loaded modules are preloaded.
refresh Angular has built-in strategies:
    NoPreloading (default)
    PreloadAllModules
want preload only some modules (e.g. courses)
    User profile, eg preload premium course module for premium user
    Authentication state, eg preload admin module for admin users
    Route-specific config

2. Set Up Route Configuration
In AppRoutingModule, add data: { preload: true } to a route:
{
  path: 'courses',
  ...
  data: { preload: true }
}

3. Create the Custom Strategy
app, service, new filecustom-preloading.strategy.ts
boilerplate, export class, injectable, implements preloadingstrategy
change fn to load()
    basically, if route has preload prop, return load
        refresh we just set it above for course
    else null

4. Plug the Strategy into the Router
Register in providers
In AppRoutingModule
    RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloadingStrategy
    })

5. Test the Behavior
With preload: true, the lazy-loaded module (e.g. courses) is loaded in the background.
notice if you change path:course preload: false, it waits until the user navigates to that route, so lazy-loaded in place

You now know (Course 26)
    How to build and register a custom preloading strategy.
    How to control preloading via data: { preload: true/false } on routes.
    When preload() is called: before navigation occurs, Angular decides whether to load a module.
    Custom strategies allow optimized, user-aware preloading.



*/

// COURSE 27
/*

1. What Are Query Parameters?
Parameters in the URL after a ?, like:  
    /courses/1?couponCode=newYear
    /courses/1?couponCode=newYear&couponSource=udemy, multiple with &ampersand&
Used for things like promotions, filters, tracking, etc.

2. How to Access Query Params in Angular
In a component (e.g. CourseComponent)
    inject ActivatedRoute.
    onInit, this.route.snapshot.queryParamMap.get('paramName');
Alternatively, subscribe to changes over time:
    this.route.queryParams.subscribe(params => {
        this.couponCode = params['couponCode'];
    });

3. How to add Query Params Programmatically
In template, the tag with routerLink, use queryParams prop
    <a [routerLink]="['/courses', course.id]" [queryParams]="{ couponCode: 'newYear' }">
    View Course
    </a>

4. Real Example
Clicking a “View Course” link adds ?couponCode=newYear to the URL.
The course page reads the query param and shows the discount message.

You now know (Course 27)
    What URL query parameters are and when to use them.
    How to read them from ActivatedRoute.snapshot or via queryParams observable.
    How to add query parameters to a route using queryParams in routerLink.
    Snapshot is fine for initial load; use observable if query parameters might change while staying on the same component instance.

*/

// COURSE 28
/*

1. refresh routerLinkActive Directive
Used to apply a CSS class (e.g., menu-item-active) to a navigation element when the associated route is active.
    <a routerLink="/courses" routerLinkActive="css class name">Courses</a>


2. Default Behavior
The CSS class is applied not only when the route matches exactly, but also when notice any child route is active. e.g.,
        /courses
        /courses/1 
        /courses/1/lessons/2 
All will still trigger menu-item-active because they're child routes.

3. The Problem
You don’t want the link to stay active/have css applied when a child route is active. Example:
    only want Courses menu item highlighted if the route is exactly /courses, not when on /courses/1.

4. The Solution: routerLinkActiveOptions
Inside the routerLink and routerLinkActive tag
    <a 
    routerLink="/courses" 
    routerLinkActive="menu-item-active" 
    [routerLinkActiveOptions]="{ exact: true }"> notice
    Courses
    </a>

5. Behavior with exact: true
/courses ➝ menu-item-active is added.
❌ /courses/1 or /courses/1/lessons/2 ➝ menu-item-active is not added.

You now know (Course 28)
    How to highlight menu items using routerLinkActive.
    Why Angular highlights parent routes by default when child routes are active.
    How to enforce exact matching with [routerLinkActiveOptions]="{ exact: true }" when needed.

*/

// COURSE 29
/*

1. What Are Secondary Outlets?
Angular's router-outlet is where route components are rendered.
    Normally, only one primary outlet exists, in app.component.html
Secondary outlets allow displaying multiple components in different areas of the page — regardless of the URL.
    Example: A Helpdesk Chat Window at the bottom of the app, opened by clicking a “?” icon in the menu.
    This chat window should remain visible even if you navigate across routes like /courses, /about, etc.

2. How to Define a Secondary Outlet
app.component.html
    Ath the bottom, Add a named router-outlet in the template:
        <router-outlet name="chat"></router-outlet>
    The unnamed outlet is the primary outlet.

3. How to Configure a Route for the Secondary Outlet
app-routing.module.ts, new path
    {
    path: 'helpdesk-chat',
    component: ChatComponent,
    outlet: 'chat' notice similar to name="chat" above
    }

4. Navigating to a Secondary Outlet
Inside the tag eg button that'll open the chat above, add routerLink
    [routerLink]="[{ outlets: { chat: ['helpdesk-chat'] } }]"
    refresh routeroutletname:['pathname in app routing module']
You can keep the primary route unchanged and open the secondary outlet separately.

5. URL Format for Secondary Outlets
URL becomes:
    /courses(aux:chat:helpdesk/chat)
        /courses → primary outlet
        (aux:chat:...) → secondary outlet
Multiple secondary outlets can be chained:
/page(chat:helpdesk-chat)(othername:otherpath)

6. What Happens During Navigation
    Clicking Help opens the ChatComponent in the chat outlet.
    The main content (primary outlet) stays unchanged.
    Navigating to other routes like /about still preserves the chat window.
    Refreshing the page retains the state, because the URL fully represents the routing state/keeping the secondary outlet

You Now Know (Course 29):
    How to use multiple router outlets.
    How to create and configure named outlets.
    How to navigate to secondary outlets using [routerLink] and custom paths.
    How Angular maintains the state of multiple outlets via the URL.

*/

// COURSE 30
/*

1. Recap of Secondary Outlet (Chat Example)
The app uses a secondary outlet named chat to show a chat window while browsing.
Chat appears using a router outlet:
    <router-outlet name="chat"></router-outlet>

2. How to Close a Secondary Outlet
The close chat button is in chat.comp.html
    [routerLink]="['/', { outlets: { chat: null } }]
This removes the component from the secondary outlet.

3. Temporary Workaround Needed
notice atm July2025, there's no bug anymore
    closing the chat

4. Known Bug
notice atm July2025, there's no bug anymore
    closing the chat will remove the secondary outlet
    reloading the page didnt cause app to crash
Vasco's bug, not on mine:
    Even when closed, the URL may retain an empty secondary outlet, like:
        /courses(routerName:routerPath)
    Reloading the page with this URL may cause the app to crash.
    The issue is still open at the time of recording.

5. Recommendation: Don't Use Secondary Outlets in Production
Unstable behavior makes secondary outlets not production-safe.
Better alternatives:
    Use Angular Material Dialog.
    Or use Angular CDK overlays/dialogs.

6. Selective Import in Angular Material
You don’t need the full Angular Material library.
You can import only what you need, e.g., just:
    MatDialogModule
    MatDatepickerModule

You Now Know (Course 30):
    How to close a secondary outlet using routerLink.
    Why secondary outlets are not recommended for production use.
    A more stable solution is to use modal dialogs like Angular Material's.
    Angular Material can be selectively imported to keep bundle size small.

*/

// COURSE 31
/*

1. RouterModule Configuration Basics
To use routing, we call:
    RouterModule.forRoot(routes, configObject)
        const routes:Routes
            thats where your route list is
        configObject is optional but lets you customize router behavior.
            eg preloading strategy
                refresh Controls how lazy-loaded modules are preloaded.
                Can use:
                    NoPreloading (default)
                    PreloadAllModules
                    Or a custom strategy

2. Other Common Extra Configuration Options
enableTracing
    if Set to true, will activate debug mode for router events, console log a bunch of things
    RouterModule.forRoot(routes, { enableTracing: true })
    Logs:
        NavigationStart
        GuardsCheckStart
        NavigationEnd
            notice Useful for debugging but should be disabled in production.

3. Use Hash Location Strategy
If your server can’t handle fallback to index.html on unknown routes:
    Set useHash: true
    Changes URLs from: /courses >> /#/courses
Why use it?
    Anything after # is ignored by the server.
    Ensures the browser always loads index.html, even if user refreshes a deep link.
    Good fallback when server config changes aren't possible.

How to enable:
    RouterModule.forRoot(routes, { useHash: true })

You Now Know (Course 31):
    How to use the RouterModule.forRoot() configuration object.
    How to debug router transitions with enableTracing.
    How and when to use the hash location strategy (useHash: true) to prevent server-side routing issues.
    That useHash URLs work reliably across any server without extra config.

*/

// COURSE 32
/*

1. Scroll Position Restoration
Purpose: Controls how the scroll behaves after navigation.
Options:
    "disabled" (default) – no scroll changes on navigation.
    "top" – scrolls to the top on every navigation.
    "enabled" – scrolls to top on forward nav, and restores previous position on back nav.
Recommended:
scrollPositionRestoration: 'enabled'

2. Parameters Inheritance Strategy
Default: "emptyOnly" – only includes parameters from the current route/the last
Recommended:
    paramsInheritanceStrategy: 'always'
    Lets you access all route parameters (including parent routes) from one place—simplifies code, especially in resolvers.
refresh lesson-detail.resolver you need parent.paramMap because :courseUrl isn't the last param
    with paramsInheritanceStrategy: 'always', you can access all without parent because it inherits the knowledge


3. Relative Link Resolution, not in 2025
Default: "legacy" – causes issues with components using path: ''.
Recommended:
    relativeLinkResolution: 'corrected'
Why? Fixes odd behavior when using relative links inside components mapped to empty paths.

4. Malformed URI Error Handler, not in 2025
Catches parsing errors in the URL, prevents your app from crashing on bad URLs.
Example setup:#
    malformedUriErrorHandler: (error, urlSerializer, url) => {
    return urlSerializer.parse('/page-not-found');
    }

5. Hash Location Strategy
useHash: true, see previous course
if your server cannot handle HTML5 pushState URLs (e.g., can’t fallback to index.html).
notice Not recommended unless necessary.

6. Enable Tracing
Set to true for debugging, see previous course
    enableTracing: true
notice Only for development — too verbose for production.

Example Final Router Setup:
RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'enabled',
  paramsInheritanceStrategy: 'always',
  relativeLinkResolution: 'corrected',
  malformedUriErrorHandler: (error, urlSerializer, url) =>
    urlSerializer.parse('/page-not-found'),
})

You Now Know (Course 32):
The essential router configuration flags for a robust, bug-free Angular app.
Why to avoid legacy defaults and activate modern behavior from the start.
How to ensure smooth scrolling, simpler parameter access, and graceful handling of invalid URLs.

*/
