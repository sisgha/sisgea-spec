import { UniProvider } from '../../common';
import { AulaProvider } from './aula';
import { CalendarioLetivoProvider } from './calendario-letivo';
import { IntervaloDeTempoProvider } from './intervalo-de-tempo';

export const CalendarioModulesProvider = UniProvider((ctx) => {
  ctx.Add(IntervaloDeTempoProvider);
  ctx.Add(CalendarioLetivoProvider);
  ctx.Add(AulaProvider);
});
