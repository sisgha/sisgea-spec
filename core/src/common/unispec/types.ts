export type UniTypeBase = {
  kind: 'type';
  nullable: boolean;
  required: boolean;
  description: string;
  default?: any;
};

export type UniTypeString = UniTypeBase & {
  type: 'string';

  format?: 'uuid' | 'date' | 'date-time' | 'time' | 'e-mail';

  constraints?: {
    minLength?: number | false;
    maxLength?: number | false;
  } & Record<`x-${string}`, any>;
};

export type UniTypeInteger = UniTypeBase & {
  type: 'integer';
  constraints?: {
    min?: number;
    max?: number;
    integer?: boolean;
    positive?: boolean;
  };
};

export type UniTypeReference = UniTypeBase & {
  type: 'reference';
  targetsTo: string;
};

export type UniTypeObject = UniTypeBase & {
  type: 'object';
  properties: Record<string, UniType>;
};

export type UniTypeView = UniTypeBase & {
  type: 'view';
  name: string;
  partialOf: string | null;
  properties: Record<string, UniType>;
};

export type UniTypeArray = UniTypeBase & {
  type: 'array';
  of: UniType;
};

export type UniTypeBoolean = UniTypeBase & {
  type: 'boolean';
};

export type UniType = UniTypeBase | UniTypeString | UniTypeInteger | UniTypeReference | UniTypeObject | UniTypeArray | UniTypeBoolean;

// ==================================================================================

type UniTypeBaseOptions = {
  nullable?: boolean;
  required?: boolean;
  description?: string;
};

export const UniTypeBase = <C extends UniTypeBase, K extends UniTypeBaseOptions = UniTypeBaseOptions>(k?: K): C =>
  ({
    kind: 'type',
    nullable: false,
    required: true,
    description: 'Descrição não fornecida.',
    ...k,
  }) as unknown as C;

export const UniTypeString = <K extends Partial<UniTypeString> = Partial<UniTypeString>>(k?: K): UniTypeString =>
  UniTypeBase<UniTypeString>({ type: 'string', ...k });

export const UniTypeInteger = <K extends Partial<UniTypeInteger> = Partial<UniTypeInteger>>(k?: K): UniTypeInteger =>
  UniTypeBase<UniTypeInteger>({ type: 'integer', ...k });

export const UniTypeReference = <K extends Partial<UniTypeReference> = Partial<UniTypeReference>>(k?: K): UniTypeReference =>
  UniTypeBase<UniTypeReference>({ type: 'reference', ...k });

export const UniTypeObject = <K extends Partial<UniTypeObject> = Partial<UniTypeObject>>(k?: K): UniTypeObject =>
  UniTypeBase<UniTypeObject>({ type: 'object', properties: {}, ...k });

export const UniTypeView = <K extends Partial<UniTypeView> = Partial<UniTypeView>>(k?: K): UniTypeView =>
  UniTypeBase<UniTypeView>({ type: 'view', name: 'UnamedView', partialOf: null, properties: {}, ...k });

export const UniTypeArray = <K extends Partial<UniTypeArray> = Partial<UniTypeArray>>(k?: K): UniTypeArray =>
  UniTypeBase<UniTypeArray>({ type: 'array', of: {}, ...k });

export const UniTypeBoolean = <K extends Partial<UniTypeBoolean> = Partial<UniTypeBoolean>>(k?: K): UniTypeBoolean =>
  UniTypeBase<UniTypeBoolean>({ type: 'boolean', ...k });

type UniTypeEntityOptions = Partial<UniTypeObject> & {
  id?: 'numeric' | 'uuid' | false;
  dated?: boolean;
};

export const UniTypeEntity = <K extends Partial<UniTypeEntityOptions> = Partial<UniTypeEntityOptions>>(k: K): UniTypeObject => {
  const properties: Record<string, UniType> = {};

  if (k) {
    const { id, dated, ...rest } = k;

    Object.assign(properties, rest);

    if (id) {
      const description = 'ID do Registro.';

      if (id === 'numeric') {
        properties.id = UniTypeInteger({ description });
      } else if (id === 'uuid') {
        properties.id = UniTypeString({ description, format: 'uuid' });
      }
    }

    if (dated) {
      properties.dateCreated = UniTypeString({ description: 'Data de Criação do Registro.', format: 'date-time' });
      properties.dateUpdated = UniTypeString({ description: 'Data de Atualização do Registro.', format: 'date-time' });
      properties.dateDeleted = UniTypeString({ description: 'Data de Exclusão do Registro.', format: 'date-time' });
    }
  }

  return UniTypeObject({
    type: 'object',
    properties,
    ...k,
  });
};

export const UniTypePick = <Obj extends UniTypeObject | UniTypeView, Properties extends keyof Obj['properties'] = keyof Obj['properties']>(
  obj: Obj,
  propertiesToPick: Properties[] | Record<Properties, boolean>,
): UniTypeObject['properties'] => {
  const checkProperty = (property: Properties | string) => {
    const permissivePropertiesToPick = <string[] | Record<string, boolean>>propertiesToPick;

    if (Array.isArray(permissivePropertiesToPick)) {
      return permissivePropertiesToPick.findIndex((i) => i === property) !== -1;
    } else {
      if (typeof property === 'string' && property in permissivePropertiesToPick && permissivePropertiesToPick[property]) {
        return true;
      }
    }

    return false;
  };
  const properties = Object.fromEntries(Object.entries(obj.properties).filter(([key]) => checkProperty(key)));
  return properties;
};

export const UniTypePartial = <Obj extends UniTypeObject | UniTypeView>(obj: Obj): UniTypeObject['properties'] => {
  const properties = Object.fromEntries(Object.entries(obj.properties).map(([key, value]) => [key, { ...value, required: false }]));

  return properties;
};

export const UniTypeMerge = (objects: UniTypeObject[]): UniTypeObject => {
  const obj = UniTypeObject();

  for (const object of objects) {
    const { properties, ...rest } = object;
    Object.assign(obj.properties, properties);
    Object.assign(obj, rest);
  }

  return obj;
};

export type UniDeclarator = {
  type: 'declarator';

  entity: string;

  operations?: {
    crud?: {
      findById?: false | { input: string; output: string };
      deleteById?: false | string;

      list?:
        | false
        | {
            view: string;
            filters?: [string, string[]][];
          };

      create?: false | string;
      updateById?: false | string;
    };

    extra?: {
      // [key: string]: IDeclarationExtraOperation;
    };
  };
};

export const UniDeclarator = <K extends UniDeclarator>(declarator: Partial<K> = {}): UniDeclarator => ({
  type: 'declarator',
  entity: '',
  ...declarator,
});
