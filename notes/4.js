// COURSE 20
/*

1. What Are Router Guards?
Guards = services that determine if a user can navigate to a route.
    eg Public can see CoursesList, but LessonDetails which is the LessonsList, can only be accessed by paRticular users
Types:
    CanActivate: block/allow access before loading a route.
    CanActivateChild, CanDeactivate, CanLoad – covered later.

2. Why Use CanActivate?
Prevent unauthorized users from accessing certain screens (e.g., courses).
Ensures no broken or partially loaded screens.
Stops navigation before component loads.

3. App Authentication Flow Overview
App uses a service called AuthenticationStore.
Users log in through the login form (/login route).
On login:
    Sends email/password to /api/login.
If successful:
    Stores user profile in localStorage.
    Emits user profile via a private BehaviorSubject.
These observables allow any component to reactively know auth state.
    user$: observable of user profile.
    isLoggedIn$: true if user exists.
    isLoggedOut$: true if no user.

4. Login Redirection After Success
Login script, inside login, redirect if success
    this.router.navigateByUrl('/courses');

5. Top Menu Integration
App’s top menu shows/hides login/logout buttons based on auth state.
App template
    inside the login a tag, *ngIf="auth.isLoggedIn$ | async" or 
    logout a tag, Vasco already added auth.isLoggedOut$ | async.
Displays the user’s profile picture using user$.

6. Persistent Login via Local Storage
On app startup, the service checks localStorage for saved profile.
If found, emits it through the subject, so user stays logged in after refresh.

✅ You now know (Course 20)
What router guards are and their purpose (CanActivate, etc.).
Why protecting routes using the router is better than just hiding buttons.
In this course, we only change button based on subject stored in local storage
    havent touched the authguard just yet, next course

*/

// COURSE 21
/*

1. What Is a CanActivate Guard?
Runs before a route is activated.
Decides whether navigation is allowed.
want protect CoursesComponent, so only logged-in user can see inside after clicking View Course button

2. Use Case
HomeComponent: public → no guard needed.
CourseComponent (shown after clicking "View Course"): protected → needs guard.
    If user is not logged in, redirect them to /login.

3. Create the Guard Service
app,services, new file auth.guard.ts
Boilerplate, injectable, export, implements
    const, inject authstore and router for redirection
        redirect to login page if user clicked on view course but not logged in
    check authStore.isLoggedIn$
        if true, the returns true
            refresh in auth.store isLoggedIn$ is an observable
            dont get confused, loggedIn is just the map's parName
        if false, redirect
            parseUrl is basically router.navigate but for AuthGuard

4. Register the Guard
courses-routing.module.ts
    Add AuthGuard to the providers array.
    add canActivate: [AuthGuard] to link you wanna protect, so :courseUrl

6. Test It
Start app in logged-out state.
Click "View Course" → you’re redirected to /login ✅.
Log in → click "View Course" → you see course page ✅.
Refresh /courses/angular-router-course URL while logged out → redirected to /login ✅.

7. Notes
notice The guard improves user experience, not backend security.
Doesn’t stop API access — backend should still validate auth on all endpoints eg inside the service
You can enhance UX further by adding a logout redirect to /login.

✅ You now know (Course 21)
How CanActivate guards work and when they’re triggered.
How to build a custom AuthGuard that uses an observable to control access.
How to redirect users before loading protected components.
Why frontend guards are for UX only, not real security.
How to plug your guard into route definitions and test the flow end-to-end.

*/

// COURSE 22
/*

1. Problem With Just CanActivate
The CourseComponent was protected using CanActivate.
If you logged in, go to certain course's page eg courses/courseName, then logged out, error point you'll stay at the same page even tho it's supopsed to be protected
You can also click one of the lesson/lesson details
This happens without refreShing the browser.
    Example: click "View Course" → logout → click a lesson → lesson detail is incorrectly accessible.

2. Root Cause
The original AuthGuard only protected the parent route.
It did not protect nested child routes like lesson/:seqNo.

3. Solution: Implement CanActivateChild
auth.guard.ts
Implement both CanActivate and CanActivateChild
Add this method
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return this.checkIfAuthenticated();
    }
Extract shared logic into a private method:
    the code is identical, so create a new function checkIfAuthenticated, refactor and return inside both canActivate and canActivateChild

4. Update Routing Configuration
In courses-routing.module.ts :courseUrl, protect child routes too:
    canActivateChild: [AuthGuard]

5. Testing Behavior
Notice, you'll still be in the course page, but cant go to course detail anymore, will be redirected to login page

You now know (Course 22)
Why CanActivate is not enough to protect nested routes.
How to implement CanActivateChild using the same logic.
How to update your routing config to secure both parent and child routes.
Confirmed behavior by simulating logout and child route access.
Guards only impact frontend routing, not backend security.

*/

// COURSE 23
/*

1. What is a CanDeactivate Guard?
Executes when navigating away from a component.
    notice doesnt apply to its Child Route, see later
Used to prevent leaving if:
    There’s unsaved data
    An operation is in progress
    To confirm user intent, "Are you sure ?"


2. Implementing the Guard
Course script
    new method, confirmExit, pop the confirm window

app,services, new file confirm-exit.guard.ts
    boilerplate injectable, implement CanDeactivate, par isthe component so CourseComponent
    inside CanDeactivate, execute confirmExit

3. Add to Router
add to providers array
add canDeactivate

4. Behavior When Testing
Navigating away from /courses/:courseUrl (e.g. to /about) → triggers the popup.
Clicking “Cancel” in the confirm dialog → prevents navigation.
Clicking “OK” → allows navigation.
notice Navigating to a child route (e.g. lesson detail) or details to details won't trigger CanDeactivate.

You now know (Course 23)
    CanDeactivate runs when navigating away from a component (not child routes).
    How to prompt users with window.confirm() to avoid accidental loss of state.
    That it’s useful for unsaved forms, active uploads, or just confirming navigation.
    CanDeactivate guards must be declared per-route like CanActivate, and support multiple guards.


*/

// COURSE 24
/*

1. What is a CanLoad Guard?
A route guard specific to lazy-loaded modules.
Runs before the code for the module is downloaded.#
CanActivate blocks access to components, but the module’s code still gets loaded.
CanLoad blocks both the navigation and the module's download, improving performance and security.

2. Use Case
You want to block unauthenticated users from accessing the CoursesModule, which is lazy-loaded.
If not logged-in, redirect to the login page

3. Implementing CanLoad
app, service, new file can-load-auth.guard.ts
    notice not service inside course
boilerplate injectable, export, implement
    constructor, inject AuthStore and router
canLoad must complete the observable, so    
    Use first(), completes with the first emitted value
    if not loggedIn, redirect, use tap

4. Configure Routes
app-routing.module.ts
    add to providers
    path: 'courses', canLoad: [CanLoadAuthGuard]

5. How it behaves
✅ If logged in, the module loads and navigation proceeds.
❌ If logged out, the user is redirected to /login and you cant open the courses page
    Confirm this via the Network tab (JS bundle not requested).

You now know (Course 24)
CanLoad guards prevent the download of lazy-loaded modules for unauthorized users.
Ideal for performance-sensitive or restricted routes.
Requires:
    An auth observable
    A redirect using Router if unauthenticated
Complements CanActivate, but handles module loading, not just rendering.

*/
