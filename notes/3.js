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



*/
