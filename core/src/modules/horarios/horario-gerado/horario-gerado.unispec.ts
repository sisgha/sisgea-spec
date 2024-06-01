import { PaginatedResultView } from '@/modules/-shared';
import { Tokens } from '@/modules/tokens';
import { U } from '@unispec/core';

export const HorarioGeradoEntity = U.ObjectEntity({
  id: 'uuid',
  dated: true,

  description: 'HorarioGerado',

  properties: {
    status: U.String({
      description: 'Status do horário gerado.',
      nullable: true,
    }),
    tipo: U.String({
      description: 'Tipo do horário gerado.',
      nullable: true,
    }),
    dataGeracao: U.String({
      format: 'date-time',
      description: 'Data em que o horário foi gerado.',
      nullable: true,
    }),
    vigenciaInicio: U.String({
      format: 'date',
      description: 'Início da vigência da preferência de agendamento.',
      nullable: true,
    }),
    vigenciaFim: U.String({
      format: 'date',
      description: 'Fim da vigência da preferência de agendamento.',
      nullable: true,
    }),
    //
    calendario: U.Reference({
      description: 'calendário.',
      targetsTo: Tokens.CalendarioLetivo.Entity,
    }),
  },
});

export const HorarioGeradoView = U.View({
  name: Tokens.HorarioGerado.Entity,

  description: 'Horário gerado.',

  type: U.ObjectTransformer.From(HorarioGeradoEntity)
    .Extends({
      properties: {
        calendario: {
          targetsTo: Tokens.CalendarioLetivo.Views.FindOneResult,
        },
      },
    })
    .Node(),
});

export const HorarioGeradoFindOneInputView = U.View({
  name: Tokens.HorarioGerado.Views.FindOneInput,
  description: 'Dados de entrada para encontrar um Horario Gerado por ID.',
  type: U.ObjectTransformer.From(HorarioGeradoView.type).Pick({ id: true }).Node(),
});

export const HorarioGeradoFindOneResultView = U.View({
  name: Tokens.HorarioGerado.Views.FindOneResult,

  partialOf: Tokens.HorarioGerado.Entity,
  description: 'Visão FindOne de um Horario Gerado.',

  type: U.ObjectTransformer.From(HorarioGeradoView.type)
    .Pick({
      id: true,
      //
      status: true,
      tipo: true,
      dataGeracao: true,
      vigenciaInicio: true,
      vigenciaFim: true,
      //
      calendario: true,
      //
      dateCreated: true,
      dateUpdated: true,
      dateDeleted: true,
    })
    .Node(),
});

export const HorarioGeradoInputCreateView = U.View({
  name: Tokens.HorarioGerado.Views.InputCreate,
  description: 'Dados de entrada para a criação de um Horario Gerado.',
  type: U.ObjectTransformer.From(HorarioGeradoView.type)
    .Pick({
      status: true,
      tipo: true,
      dataGeracao: true,
      vigenciaInicio: true,
      vigenciaFim: true,
      calendario: true,
    })
    .Extends({
      properties: {
        calendario: {
          targetsTo: Tokens.CalendarioLetivo.Views.FindOneInput,
        },
      },
    })
    .Node(),
});

export const HorarioGeradoInputUpdateView = U.View({
  name: Tokens.HorarioGerado.Views.InputUpdate,
  description: 'Dados de entrada para a atualização de um Horario Gerado.',
  type: U.ObjectPartial(HorarioGeradoInputCreateView.type),
});

export const HorarioGeradoFindAllResult = PaginatedResultView({
  name: Tokens.HorarioGerado.Views.FindAllResult,
  description: 'Resultados da busca a Horarios Gerados.',
  targetsTo: Tokens.HorarioGerado.Views.FindOneResult,
});

export const HorarioGeradoDeclarator = U.Declarator({
  entity: Tokens.HorarioGerado.Entity,

  operations: {
    crud: {
      findById: {
        name: Tokens.HorarioGerado.Operations.FindById,
        input: Tokens.HorarioGerado.Views.FindOneInput,
        output: Tokens.HorarioGerado.Views.FindOneResult,
      },

      deleteById: {
        name: Tokens.HorarioGerado.Operations.DeleteById,
      },

      create: {
        name: Tokens.HorarioGerado.Operations.Create,
        input: Tokens.HorarioGerado.Views.InputCreate,
      },
      updateById: {
        name: Tokens.HorarioGerado.Operations.UpdateById,
        input: Tokens.HorarioGerado.Views.InputUpdate,
      },

      list: {
        name: Tokens.HorarioGerado.Operations.List,
        view: Tokens.HorarioGerado.Views.FindAllResult,
        filters: [],
      },
    },
  },
});

export const HorarioGeradoProvider = U.Provider((ctx) => {
  ctx.Add(HorarioGeradoEntity);
  ctx.Add(HorarioGeradoView);
  ctx.Add(HorarioGeradoFindOneInputView);
  ctx.Add(HorarioGeradoFindOneResultView);
  ctx.Add(HorarioGeradoInputCreateView);
  ctx.Add(HorarioGeradoInputUpdateView);
  ctx.Add(HorarioGeradoFindAllResult);
  ctx.Add(HorarioGeradoDeclarator);
});