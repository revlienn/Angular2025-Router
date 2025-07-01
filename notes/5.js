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
