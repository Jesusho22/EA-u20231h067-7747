import {inject, Service} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';



@Service()
export class IamService extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly signUpEndpoint = new SignUpApiEndpoint(this.http, new SignUpAssembler());
  private readonly signInEndpoint = new SignInApiEndpoint(this.http, new SignInAssembler());

  signUp = (signUpCommand: SignUpCommand): Observable<SignUpResource> =>
    this.signUpEndpoint.signUp(signUpCommand);

  signIn = (signInCommand: SignInCommand): Observable<SignInResource> =>
    this.signInEndpoint.signIn(signInCommand);
}
