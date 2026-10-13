import {computed, inject, Service, signal} from '@angular/core';
import {User} from '../domain/model/user.entity';
import {Router} from '@angular/router';

@Service()
export class ReservationStore {
  private readonly iamApi = inject(ReservationService);
  private readonly isSignedInSignal = signal<boolean>(false);
  private readonly currentUsernameSignal = signal<string | null>(null);
  private readonly currentUserIdSignal = signal<number | null>(null);
  private readonly usersSignal = signal<User[]>([]);

  readonly isSignedIn = this.isSignedInSignal.asReadonly();

  readonly loadingUsers = signal<boolean>(false);

  readonly currentUsername = this.currentUsernameSignal.asReadonly();

  readonly currentUserId = this.currentUserIdSignal.asReadonly();

  readonly currentToken = computed(() => this.isSignedIn() ? localStorage.getItem('token') : null);

  readonly users = this.usersSignal.asReadonly();

  readonly isLoadingUsers = this.loadingUsers.asReadonly();

  constructor() {
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
  }

  signIn(signInCommand: SignInCommand, router: Router) {
    console.log(signInCommand);
    this.ReservationApi.signIn(signInCommand).subscribe({
      next: (signInResource) => {
        localStorage.setItem('token', signInResource.token);
        this.isSignedInSignal.set(true);
        this.currentUsernameSignal.set(signInResource.username);
        this.currentUserIdSignal.set(signInResource.id);
        router.navigate(['/home']).then();
      },
      error: (err) => {
        console.error('Loaded failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/reservation/home']).then();
      }
    });
  }

  signUp(signUpCommand: SignUpCommand, router: Router) {
    this.iamApi.signUp(signUpCommand).subscribe({
      next: (signUpResource) => {
        console.log('Sign-up successful:', signUpResource);
        router.navigate(['/iam/sign-in']).then();
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        this.isSignedInSignal.set(false);
        this.currentUsernameSignal.set(null);
        this.currentUserIdSignal.set(null);
        router.navigate(['/iam/sign-up']).then();
      }
    });
  }

  signOut(router: Router) {
    localStorage.removeItem('token');
    this.isSignedInSignal.set(false);
    this.currentUsernameSignal.set(null);
    this.currentUserIdSignal.set(null);
    router.navigate(['/iam/sign-in']).then();
  }

  loadUsers() {
    this.loadingUsers.set(true);
    // TODO: Implement user loading logic
  }
}
