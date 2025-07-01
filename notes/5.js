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
✅ /courses ➝ menu-item-active is added.
❌ /courses/1 or /courses/1/lessons/2 ➝ menu-item-active is not added.

You now know (Course 28)
    How to highlight menu items using routerLinkActive.
    Why Angular highlights parent routes by default when child routes are active.
    How to enforce exact matching with [routerLinkActiveOptions]="{ exact: true }" when needed.

*/
