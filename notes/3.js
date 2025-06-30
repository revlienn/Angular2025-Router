// COURSE 14
/*

refresh 
    to run server: npm run server
    to run ng: npm run start

1. Application Shell Structure
AppComponent/landing page contains:
    Top menu
        Courses
            lazy-loaded
            its own module
            have a child route for each lesson fed by resolver, see course11-12
                Any routes in CoursesRoutingModule are children of /courses
        About
        Login
    The template contains the <router-outlet>, where the routed content is displayed


2. Adding Child Routes to CourseComponent
    CourseComponent (for a single course) will now have its own <router-outlet>
    want show nested content inside the course page
        eg Course 1, will have a list of lessons material, when clicking one of the lesson, user'll be redirected to another page
            eg courses/angular/lessons/17
            notice see /lessons/17, so its nested child

3. Example Child Routes for CourseComponent
Inside CoursesRoutingModule.ts:
    {
    path: ':courseUrl',
    component: CourseComponent,
    children: [
        { path: '', component: LessonsListComponent }, // default child
        { path: 'lessons/:lessonSeqNo', component: LessonDetailComponent } // specific lesson
        ]
    }
notice LessonsListComponent is the /lessons/
            but we only add this on the route if users click one of the lesson
            so technically, user cant just type courses/angular/lessons/
       LessonDetailComponent is the number
            courses/angular/lessons/17
            again, /lessons/ will only be displayed once users click a lesson

4. Template Changes in CourseComponent
Add <router-outlet></router-outlet> in the CourseComponent template
    This is where LessonsListComponent or LessonDetailComponent will be rendered
    Based on what the URL path resolves to
    refresh add <router-outlet> in the parent comp

5. How Angular Resolves Nested Routes
Example URL: /courses/angular-router-course
    First segment /courses, triggers lazy-load of CoursesModule
    Second segment /angular-router-course, matches CourseComponent in child routes, fed by data resolver
    Empty path '' after second segment, renders LessonsListComponent

URL: /courses/angular-router-course/lessons/17
    Still loads CourseComponent (outer route)
    Remaining path matches LessonDetailComponent (child route)
    So both CourseComponent and LessonDetailComponent are rendered
        Each in their respective router outlet

6. Summary of Matching Process
    Angular processes the route segment by segment, starting from root
    For each matched route with a component, it renders it into the parent’s <router-outlet>
    Child routes render into the <router-outlet> defined inside their parent component's template

You now know (Course 14)
    How to configure child routes inside a lazy-loaded module
    How to use nested <router-outlet> to display sub-routes within a component
    That Angular matches routes top-down and renders each component in its respective outlet
    How child routes allow you to build master-detail views like:
    /courses/angular-router-course → Course + Lessons List
    /courses/angular-router-course/lessons/17 → Course + Lesson Detail

*/

// COURSE 15
/*

1. Purpose of the Lesson
    Display LessonsList inside the CourseComponent view.
    Populate LessonsListComponent with data before it renders, using a router resolver.

2. What’s in LessonsListComponent
Template
    Table that loops through an array of lessons
Script
    lessons: LessonSummary in the script, Vasco premade the model
    inject activated route, so we can use data resolver to fetch lesson list
    execute in ngOnInit, route.snapshot.data["lessons"];

3. Why We Need a Resolver
    Component doesn’t fetch data itself to avoid visual jank or broken screens.
    Follows same approach as CourseComponent using a CourseResolver.

4. Creating the Lessons Resolver
In lessons.resolver.ts
    skeleton, export, injectable, implements Resolve<paR type>
        in this case LessonSummary[]
    constructor, CoursesService to fetch lesson summaries from the backend.
    In resolve(), do the following:
        const courseUrl = route.paramMap.get('courseUrl');
            refresh this is bcos you set the var in courses-routing 
                path: ":courseUrl"
        return this.coursesService.loadAllCourseLessonsSummary(courseUrl);

5. Register the Resolver in Routing
courses-routing.module.ts
    Add LessonsResolver to providers[]
    Inside LessonsListComponent
        resolve: { lessons: LessonsResolver }
        why lessons? refresh because in lessons-list script
            this.lessons = this.route.snapshot.data["lessons"];

6. Testing
Click one of the course, lessons list now displayed 
LessonsListComponent gets the resolved data via:
    this.route.snapshot.data['lessons']

7. What Happens on Page Load
Click "View Course"
URL matches CourseComponent and its child route (empty path → LessonsListComponent)
Two backend calls occur, inspect, go to network tab:
    coursesName
        fetch course data via CourseResolver 
    lessons
        Fetch lesson summaries via LessonsResolver
Both components are rendered with data ready.

You now know (Course 15)
    How to use a resolver to preload data for a child route.
    How to pass path variables from the route (e.g., courseUrl) into a resolver.
    How to connect backend APIs like /api/lessons via services and use the data in a component.
    That Angular matches child routes and their resolvers simultaneously, ensuring smoother UX.


*/

// COURSE 16
/*

1. Goal of the Lesson
    atm nothing happened when you click one of the lesson in the LessonsList
    want Enable navigation from LessonsListComponent to LessonDetailComponent when a lesson row is clicked.
    Prepare for a master-detail view with upcoming detail-to-detail navigation.

2. Current Setup Recap
LessonDetailComponent is already configured in the courses-routing:
    path: 'lessons/:lessonSeqNo',
    component: LessonDetailComponent

3. Adding Navigation via RouterLink
LessonsListComponent template (the table view).
    [routerLink]="['lessons', lesson.seqNo]"
    refresh again, lesson.seqNo is the var you set in courses-routing
    summary
        'lessons': static 
        lesson.seqNo: dynamic  (e.g., 17)
Together, this forms a valid route to the lesson detail view.
This creates a relative path, meaning:
    If you're currently at: /courses/angular-router-course
    Clicking a lesson with seqNo = 17 navigates to: /courses/angular-router-course/lessons/17

4. Why Use Relative/Dynamic Navigation
    Easier and cleaner than building an absolute path from the root.
    Works because the route is a child of the current one (i.e., CourseComponent).

5. Preview of Next Steps
LessonDetailComponent currently doesn’t fetch its data, still does nothing
In the next lesson:
    We’ll create a LessonResolver to fetch lesson details.
    We’ll address a common router quirk when navigating between two details (same component but different data).

You now know (Course 16)
    How to link a table row to a detail route using routerLink and dynamic values.

*/

// COURSE 17
/*

1. Goal
    Display full details of a specific lesson using LessonDetailComponent.
    Securely fetch data using a route resolver before the component loads.
    Integrate video playback via a trusted YouTube URL.

2. Lesson Detail Component Overview
Template
    Lesson description, duration
    Previous/Next lessons buttons
    Back to course button, back to lessons list
    Video player, uses a safe URL pipe to sanitize the YouTube embed link for Angular templates.
Script
    lesson: LessonDetail[] 
        notice LessonDetail has videoId, the goal is to only show the vid to loggedin/premium user
        LessonDetail Fetched via a secure REST endpoint: /api/lesson-details.
        hence LessonsList and LessonDetail are fetched by different API requests
            so we need a new resolver for lesson detail

4. Creating LessonDetailResolver
Courses, services, new file lesson-detail.resolver.ts
Resolver boilerplate, injectable, implements, par type
    constructor, injects CoursesService 
Resolve
    return Observable<LessonDetail> 
    const courseUrl = route.parent?.paramMap.get('courseUrl');
        notice why .parent
            because it’s the parent route (CourseComponent), not the last par
            eg /courses/courseName/lesson/17
            courseUrl is courseName
                refresh why courseUrl, cos you set this var in courses-routing
    const lessonSeqNo = route.paramMap.get('lessonSeqNo');
        .parent not needed because this is the last par eg 17 in the above
    return this.coursesService.loadLessonDetail(courseUrl, lessonSeqNo);

5. Integrating Resolver in the Router
courses-routing.module.ts:
    Providers, Add LessonDetailResolver
    component: LessonDetailComponent, add resolve

6. Fetching Resolved Data in the Component
LessonDetailComponent script
    ngOnInit, this.lesson = this.route.snapshot.data['lesson'];
    why lesson? 
        refresh in courses-routing, resolve: { lesson: LessonsDetailResolver }

7. Testing the Flow
Click a lesson from the LessonsListComponent.
Navigation triggers:    
    LessonDetailResolver fetches data.
LessonDetailComponent renders
    Title, description, video (via iframe), nav buttons.

You now know (Course 17)
    How to create and use a route resolver to preload component data.
    How to retrieve parent route params in nested child resolvers.
    Why splitting public and private APIs (e.g., summary vs detail) is a good security practice.
    How to properly configure and test router data preloading with resolve.


*/

// COURSE 18
/*

1. want Enable users to
Go back to the course’s lessons list
Navigate to the previous or next lesson from the detail view
Understand a key behavior of Angular Router related to reusing component instances

2. Implement "Back to Course" Button
When you're in lesson-detail, 
    your url is /courses/courseName/lessons/1
    want go to course /courses/courseName
    so grandparent
lesson-detail template, find the back to course
    <a [routerLink]="['../..']">Back to Course</a>

3. Implement "Previous" and "Next" Navigation (Programmatic)
template    
    Both next and prev buttons have condition
        eg *ngIf="!lesson.last"
script
    inject router
        route is to fetch url, routeR is directing to other place
    new method previous
        par is lesson, your current location
        refresh is courses-routing
            /courses/:courseUrl/lessons/1 parent is /courses/:courseUrl
            dont get confused courseUrl is just courseName
        navigate should be relative to parent, so dynamic
        inside array lessons, then the seqNo
    do the same with next

4. Runtime Issue Discovered
Clicking Next/Previous updates the URL, but not the lesson data
This is because
    ngOnInit() does not run again on parameter change
    hence Resolver runs only once 

see next course

*/

// COURSE 19
/*
1. error point
Clicking “Previous” or “Next” updated the URL, but not the displayed lesson
Why? ngOnInit() and the constructor run only once, so the new data wasn't reloaded

2. Why Snapshot Fails
ActivatedRoute.snapshot.data holds only the initial data when the component is created
It doesn’t update on future navigations because Angular doesn't reinstantiate the component
notice you have console log inside the constr, when you click next, console log wont get renewed because the angular doesnt reproduce a new component

3. The Fix: Use ActivatedRoute.data Observable
Replace .snapshot.data with the .data observable
    .snapshot.data only retrieve the first result, hence not updating
    .data emits new values on each navigation, even within the same component
        notice it produces an Observable type
Lesson-detail script
    snapshot.data['lesson'] to .data, pipe it
    assign to lesson$
        notice Vasco pre-changed this so you wont see it on git
Lesson-detail template
    change lesson to *ngIf="lesson$ | async as lesson
    the rest can stay the same bcos you use alias as above

4. Why This Works
    The resolver still fetches data correctly on every navigation
        bcos now you use .data, instead of snapshot.data#

You now know (Course 19)
    That Angular reuses components for same-route navigations (e.g., lesson → another lesson)
    Why ActivatedRoute.snapshot doesn’t update after initial component load
    How to use ActivatedRoute.data observable to get updated values from resolvers
    How to combine resolvers + observables + async pipe to handle route reuse correctly
    That this master-detail navigation pattern is common and reusable in real Angular apps

*/
