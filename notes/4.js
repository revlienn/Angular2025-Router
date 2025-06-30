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
How the app's auth system is structured around AuthenticationStore.
How BehaviorSubject enables reactive auth state across components.
How to check user state in templates using isLoggedIn$, isLoggedOut$, user$.
How login success is handled with router.navigateByUrl() to redirect users.
That the auth state is persisted in local storage and restored on reload.

*/
