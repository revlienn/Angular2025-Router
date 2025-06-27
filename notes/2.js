// COURSE 8-9
/*
context
    The app currently shows login and about components via eager loading.
    Lazy-load the Courses module instead of importing it directly.
        so it's only downloaded when needed, keeping the initial app bundle small.
        notice separate module also has a separate routing.module.ts
    home.component is the main component to display a list of course cards.
        uses CoursesService with loadAllCourses() to fetch data from /api/courses.

Benefits
    CoursesModule and all its components/services will be compiled into a separate JS bundle.
    This bundle is not downloaded unless a /courses/... route is visited.
    Reduces initial load time and JS footprint.

1. Define Lazy-Loaded Route
app-routing.module.ts
    Add a new route with path "courses"
    Instead of component, use loadChildren
        import('./courses/courses.module').then(m => m.CoursesModule)
        with loadChildren, can do courses/... , so multiple links under courses/
        also this loads the module only if the user navigates to /courses or any child of it.
app.component.html
    inside a tag, give routerLink and routerLinkActive
2. Define route in the Courses module
courses-routing.module.ts
    inside imports, RouterModule.forChild(routes)
        routes is const routes: Routes
        .forChild refresh because of loadChildren in app-routing.module.ts
        app-routing itself uses .forRoot bcos its the roor
    inside const routes, define a clear path, use home component
        the path is "" because its already "/courses" in app-routing.module.ts
        if you enter courses here, it'll be /courses/courses
3. Adjust standalone
Inside every components' script, add standalone:false
    refresh because this is a module

side notes
    test run, right click inspect, network, fetch/xhr
    note that /api/courses only made when you open the courses page
        hence, lightweight website, faster loading

summary you now know
    How to lazy-load a feature module using loadChildren
    That lazy-loaded modules reduce JS bundle size and improve load performance
    The difference between forRoot (root-level) and forChild (feature module) in routing
    That routes inside the lazy-loaded module use a "" path to map to /courses
    How to structure and test a lazy-loaded route
    That module components need standalone: false when declared inside a module
    That API calls (like /api/courses) only trigger when the corresponding route is visited
*/
