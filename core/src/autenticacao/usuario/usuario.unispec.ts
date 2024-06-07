import { BuildModule, Build as U } from "@unispec/ast-builder";
import {
  CoverImage,
  CoverImageView,
  GetCoverImage,
  GetProfileImage,
  PaginatedResultView,
  ProfileImage,
  ProfileImageView,
  SetCoverImage,
  SetProfileImage,
} from "../../-shared";
import { CommonEntity, CompileOperations } from "../../-shared/common-entity";
import { Tokens } from "../../tokens";

const UsuarioEntity = CommonEntity({
  id: "uuid",
  dated: true,

  description: "Usuario",

  properties: {
    nome: U.String({
      description: "Nome do usuário.",
      constraints: { minLength: 1 },
    }),

    matriculaSiape: U.String({
      description: "Matrícula Siape do usuário.",
      constraints: { minLength: 1 },
    }),

    email: U.String({
      format: "e-mail",
      description: "E-mail do usuário.",
    }),

    isSuperUser: U.Boolean({
      description: "Indentifica é um super usuário.",
    }),

    imagemCapa: CoverImage(),
    imagemPerfil: ProfileImage(),

    vinculosAtivos: U.Array({
      description: "Vínculos ativos do Usuário.",

      items: U.Reference({
        description: "Vínculos ativos do Usuário.",
        targetsTo: Tokens.Vinculo.Entity,
      }),
    }),
  },
});

export const UsuarioView = U.View({
  name: Tokens.Usuario.Entity,

  description: "Visão completa de um Usuário.",

  type: U.ObjectTransformer.From(UsuarioEntity)
    .Extends({
      properties: {
        imagemCapa: CoverImageView(),
        imagemPerfil: ProfileImageView(),
        vinculosAtivos: {
          items: {
            targetsTo: Tokens.Vinculo.Views.FindOneResult,
          },
        },
      },
    })
    .Node(),
});

export const UsuarioFindOneInputView = U.View({
  name: Tokens.Usuario.Views.FindOneInput,
  description: "Dados de entrada para encontrar um Usuario por ID.",
  type: U.ObjectTransformer.From(UsuarioEntity).Pick({ id: true }).Node(),
});

export const UsuarioFindOneResultView = U.View({
  name: Tokens.Usuario.Views.FindOneResult,

  description: "Visão FindOne de um Usuário.",

  type: U.ObjectTransformer.From(UsuarioEntity)
    .Extends({
      partialOf: Tokens.Usuario.Entity,
    })
    .Pick({
      id: true,
      //
      nome: true,
      matriculaSiape: true,
      email: true,
      isSuperUser: true,
      //
      imagemCapa: true,
      ProfileImage: true,
      vinculosAtivos: true,
      //
      dateCreated: true,
      dateUpdated: true,
      dateDeleted: true,
    })
    .Node(),
});

export const UsuarioFindAllResult = PaginatedResultView({
  name: Tokens.Usuario.Views.FindAllResult,
  description: "Resultados da busca a Usuários.",
  targetsTo: Tokens.Usuario.Views.FindAllResult,
});

export const UsuarioInputCreateView = U.View({
  name: Tokens.Usuario.Views.InputCreate,
  description: "Dados de entrada para a criação de um Usuario.",

  type: U.ObjectTransformer.From(UsuarioView.type)
    .Pick({
      nome: true,
      matriculaSiape: true,
      email: true,
    })
    .Node(),
});

export const UsuarioInputUpdateView = U.View({
  name: Tokens.Usuario.Views.InputUpdate,
  description: "Dados de entrada para a atualização de um Usuario.",
  type: U.ObjectTransformer.From(UsuarioInputCreateView.type).Partial().Node(),
});

export const UsuarioDeclarator = CompileOperations({
  entity: Tokens.Usuario.Entity,

  operations: {
    crud: {
      findById: {
        name: Tokens.Usuario.Operations.FindById,
        input: Tokens.Usuario.Views.FindOneInput,
        output: Tokens.Usuario.Views.FindOneResult,
      },

      deleteById: {
        name: Tokens.Usuario.Operations.DeleteById,
      },
      create: {
        name: Tokens.Usuario.Operations.Create,
        input: Tokens.Usuario.Views.InputCreate,
      },
      updateById: {
        name: Tokens.Usuario.Operations.UpdateById,
        input: Tokens.Usuario.Views.InputUpdate,
      },

      list: {
        name: Tokens.Usuario.Operations.List,
        view: Tokens.Usuario.Views.FindOneResult,
        filters: [],
      },
    },
    extra: {
      getCoverImage: GetCoverImage(),
      setCoverImage: SetCoverImage(),
      getProfileImage: GetProfileImage(),
      setProfileImage: SetProfileImage(),
    },
  },
});

export const UsuarioProvider = BuildModule({
  nodes: [
    UsuarioEntity,
    UsuarioView,
    UsuarioFindOneInputView,
    UsuarioFindOneResultView,
    UsuarioInputCreateView,
    UsuarioInputUpdateView,
    UsuarioDeclarator,
  ],
});
