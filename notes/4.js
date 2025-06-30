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
