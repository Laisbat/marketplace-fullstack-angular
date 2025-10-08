import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user';
import { UserAuthService } from '../services/user-auth';

export const loginAuthGuard: CanActivateFn = async (route, state) => {
  const _userService = inject(UserService);
  const _userAuthService = inject(UserAuthService);
  const _router = inject(Router);

  // Verifica se possui token no localstorage
  const HAS_TOKEN = _userAuthService.getUserToken();

  // Se não possui token, redireciona para a rota de login
  if (!HAS_TOKEN) {
    return true;
  }

  try {
    await firstValueFrom(_userService.validateUser());
    // Se o token é válido, redireciona para a rota de produtos
    return _router.navigate(['/products']);
  } catch (error) {
    console.log(error);
    return true; // Se o token é inválido, permite o acesso à rota de login
  }
};
