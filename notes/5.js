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
