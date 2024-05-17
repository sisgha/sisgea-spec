import { UniProvider } from '../common';
import { SharedModuleProvider } from './-shared';
import { AmbientesModulesProvider } from './ambientes';
import { AutenticacaoModulesProvider } from './autenticacao';
import { BaseModuleProvider } from './base/base.unispec';
import { CalendarioModulesProvider } from './calendario';
import { EnsinoModulesProvider } from './ensino/ensino.unispec';

export const ModulesProvider = UniProvider((ctx) => {
  ctx.Add(SharedModuleProvider);
  ctx.Add(BaseModuleProvider);
  ctx.Add(AutenticacaoModulesProvider);
  ctx.Add(AmbientesModulesProvider);
  ctx.Add(EnsinoModulesProvider);
  ctx.Add(CalendarioModulesProvider);
});