import {UserApi} from '../domain/model/user.entity';

export class SignInAssembler {
  toResourceFromResponse = (response: UserApi): SignInResource => ({
    id: response.id,
    username: response.username,
    token: response.token,
  } as UserApi);

  toRequestFromCommand = (command: SignInCommand): SignInRequest =>
    ({
      username: command.username,
      password: command.password,
    } as SignInRequest)
}
