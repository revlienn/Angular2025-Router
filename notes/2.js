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

// COURSE 10
/*
Best Practices

all in app-routing.module.ts

1. Page Not Found Route (``)
    Implemented using the wildcard path ``, which matches notice any route.
    Displays the `PageNotFoundComponent`.
        If placed earlier, it will override all routes since `` matches everything.
    PageNotFound template
        add routerLink to / ,thats our next step

2. Root/Landing page Redirect Route 
    Handles the case when the user visits the root path
        with or without / are ok
    The goal is to redirect users to `/courses` (home screen).
    Configured with:
        `path: ""`
        `redirectTo: "/courses"`
        `pathMatch: "full"` — ensures it only matches an exact empty path and not every route.
    notice without `pathMatch: "full"`, this route would behave incorrectly by matching all paths as a prefix.

side notes Why Order Matters
    Angular matches routes from top to bottom.
    As soon as it finds a match, it stops.
    Therefore, placing the `` wildcard route anywhere but last will block access to all other routes.

summary
* Wildcard (``) routes provide a fallback for undefined paths, always at the end
* Root redirects (`""`) help direct users to the main landing screen.
* `pathMatch: "full"` is essential when redirecting from the empty path.
* Good routing hygiene improves both user experience and maintainability.


*/

// COURSE 11-12
/*

part router set up

want show a Course Page (`CourseComponent`) with each of its own details when "View Course" button is clicked in any of the Course card component
solution
    Course component has course prop
    Router will feed the data to that course prop using data resolver
    Data resolver is the one who fetches data from API
    Each course has a unique course.url, e.g. "angular-router-course"

1. Add Route for Individual Courses
courses-routing.module.ts
    path: ":courseUrl", component: CourseComponent
        : means dynamic
    Allows URLs like `/courses/angular-router-course`

2. Dynamic Navigation from Course List
courses-card-list.component.html
    this is where course card list is, the card not the content
    view course btn, `[routerLink]="[course.url]"` for relative navigation
    This builds URLs like `/courses/angular-router-course`

atm 
    CourseComponent course is not fed yet, so nothing shows up
    no resolver yet

part resolver set up
Goal
    Ensure `CourseComponent` receives its data before rendering.
    Prevent broken/empty states or visual jank caused by delayed data fetching.
    Achieve this using a router resolver, which preloads route data.

Problems with Fetching Data Inside the Component via HTTPRequest
    User will stil see CourseComp but with broken screen since there's no data from API
    UI might render before data arrives → leads to partially loaded page
    Causes a visual jank effect as the UI shifts when data finally appears.
        you can use spinner for this tho

Why Use a Resolver
    Resolver fetches data before component is shown
    Prevents showing a broken or empty page
    Navigates only if data loads successfully
    Avoids manual loading spinners or error states inside the component
        this means that if there's an error, you'll stay at courseCardList comp page, CourseComp itself wont be displayed unlike HTTPRequest where you'll be redirected regardless data error

1. Implement a Resolver Service
course.resolver.ts
    app>courses>services>new file, course.resolve.ts
    export `CourseResolver` class, implements, data type is Observable Course
        notice Course is a model Vasco has made
        also do injectable
    Add constructor
        inject `CoursesService`  
    add resolve
        pars are route and state
            route is the url
            state is whats happening inside the url
    basically, you need to fetch the last piece of the url
        localhost:4200/courses/courseName
        fetch the courseName bit, so its via the url
        new var courseUrl=route.paramMap.get('courseUrl')
            refresh in course-routing.module, path is :courseUrl
                so its based on that
        call the service.loadCourseByUrl, use the courseUrl, return
    side notes resolver wont load the page if fails, so if this observable fails, you wont get redirected to CourseComponent
        if for some context the http emits multiple value, you can force completion with .pipe.first, not now tho

2. Add Resolver to the Router Configuration
courses-routing.module.ts
    Add `CourseResolver` to `providers` array
    Apply the resolver to the `:courseUrl` 
        course is the CourseComponent's prop needs feeding
        the the resolver itself
    This tells Angular to feed the course before rendering the component

3. Access the Resolved Data in the Component
course.component.ts
    constructor, Inject `ActivatedRoute`
    ngOnInit, feed the course, route.snapshot.data['course']
    Now, the component has data immediately when rendered

4. Test the Resolver
    Open Chrome DevTools → Network → XHR
    Click "View Course"
    Observe API call to `/api/courses/:courseUrl`
    Confirm correct course data is loaded and page renders without flicker
        notice the API call name is based on :courseUrl so it works
    Repeat with different course links — everything works smoothly


You now know
    How to create dynamic routes using path parameters like :courseUrl
    How to navigate dynamically using [routerLink]="[course.url]" for relative paths
    That route order matters — "" routes should come before dynamic :param routes
    Why it’s better to preload data before component rendering rather than fetching inside the component
    What a router resolver is and how it improves user experience:
        Prevents broken or empty UI
        Ensures data is ready before the component appears
    How to implement a resolver service using Resolve<T> and return an observable
    How to access resolved data using ActivatedRoute.snapshot.data
    How to wire a resolver into route config using the resolve property
    That router transitions don’t complete until the resolver’s observable emits and completes

*/

// COURSE 13
/*

want
Show a global loading spinner
    While navigating between routes
    While resolving data (e.g. via resolvers)
    While lazy-loaded modules are being fetched

context 
Existing Setup
    app>shared>loading
    `LoadingComponent` uses `LoadingService` to show/hide a spinner via a boolean observable
        Controlled manually using loadingService.loadingOn() and loadingOff()
        No router integration yet
        <loading> is atm in app template

1. Add Router Awareness to LoadingComponent
loading.component.ts
    Add new `@Input() detectRoutingOngoing: boolean = false`
    Enables optional integration with Angular Router, because we dont want to turn it on for all route, only for some   
    app template
        inside loading, set `[detectRoutingOngoing]="true"` for the spinner

2. Detect Router Events
loading.component.ts
    Inject router
    NgOnInit, if detectRoutingOngoing true,
        Subscribe to router.events=
        `NavigationStart` when starting to redirect → call loadingOn()
        `NavigationEnd`, `NavigationCancel`, `NavigationError` → loadingOff()
            end: done succesfully
            error: eg connection error
            cancel: user presses back before finish

3. Handle Lazy Module Loading Events
    Also listen for:
    `RouteConfigLoadStart` → call `loadingOn()` (when lazy-loaded module begins loading)
    `RouteConfigLoadEnd` → call `loadingOff()` (when module is done loading)

4. Test
    Route Transitions
        Navigate from `/courses` to a course detail page
            → Loading spinner appears during resolver-based data fetching
        Navigate between courses
            → Spinner shows briefly while data resolves
    Lazy-Loading
        Start from `/login` (no courses module loaded yet)
        Navigate to `/courses`
            → Spinner shows while the lazy-loaded module is being fetched
        Subsequent visits don’t trigger loading again (module is cached)

You now know (Course 13)
    How to use Angular router events to detect navigation and module loading status
    How to conditionally show a loading spinner during route transitions and lazy loading
    How to extend a shared `LoadingComponent` to optionally integrate with routing
    That `RouteConfigLoadStart` and `RouteConfigLoadEnd` are specific to lazy-loaded modules
    How router-based UX improvements can give users real-time feedback during app loading


*/
