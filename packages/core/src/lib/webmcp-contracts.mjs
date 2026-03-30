import { z } from 'zod';

const WEBMCP_TOOL_REQUEST_TYPE = 'olonjs:webmcp:tool-call';
const WEBMCP_TOOL_RESULT_TYPE = 'olonjs:webmcp:tool-result';

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function getTypeName(schema) {
  return schema?._def?.typeName;
}

function unwrapSchema(schema) {
  let current = schema;
  let isOptional = false;
  let isNullable = false;
  let defaultValue;

  for (;;) {
    const typeName = getTypeName(current);
    if (typeName === z.ZodFirstPartyTypeKind.ZodOptional) {
      isOptional = true;
      current = current._def.innerType;
      continue;
    }
    if (typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
      isOptional = true;
      if (defaultValue === undefined) {
        try {
          defaultValue = current._def.defaultValue();
        } catch {
          defaultValue = undefined;
        }
      }
      current = current._def.innerType;
      continue;
    }
    if (typeName === z.ZodFirstPartyTypeKind.ZodNullable) {
      isNullable = true;
      current = current._def.innerType;
      continue;
    }
    break;
  }

  return { schema: current, isOptional, isNullable, defaultValue };
}

function withSchemaMetadata(schema, jsonSchema, meta) {
  const next = cloneJson(jsonSchema) ?? {};
  if (schema?.description && next.description == null) {
    next.description = schema.description;
  }
  if (meta.defaultValue !== undefined && next.default == null) {
    next.default = meta.defaultValue;
  }
  if (meta.isNullable) {
    return { anyOf: [next, { type: 'null' }] };
  }
  return next;
}

function unionToEnum(options) {
  const values = [];
  let primitiveType = null;

  for (const option of options) {
    const unwrapped = unwrapSchema(option).schema;
    const typeName = getTypeName(unwrapped);

    if (typeName === z.ZodFirstPartyTypeKind.ZodLiteral) {
      values.push(unwrapped._def.value);
      primitiveType = primitiveType ?? typeof unwrapped._def.value;
      continue;
    }

    if (typeName === z.ZodFirstPartyTypeKind.ZodEnum) {
      for (const value of unwrapped._def.values) values.push(value);
      primitiveType = primitiveType ?? 'string';
      continue;
    }

    return null;
  }

  if (values.length === 0) return null;

  if (primitiveType === 'number') return { type: 'number', enum: values };
  if (primitiveType === 'boolean') return { type: 'boolean', enum: values };
  return { type: 'string', enum: values.map((value) => String(value)) };
}

function zodToJsonSchema(schema) {
  const meta = unwrapSchema(schema);
  const current = meta.schema;
  const typeName = getTypeName(current);

  switch (typeName) {
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const shape = current._def.shape();
      const properties = {};
      const required = [];

      for (const [key, childSchema] of Object.entries(shape)) {
        const childMeta = unwrapSchema(childSchema);
        properties[key] = zodToJsonSchema(childSchema);
        if (!childMeta.isOptional) required.push(key);
      }

      const objectSchema = {
        type: 'object',
        properties,
        additionalProperties: false,
        ...(required.length > 0 ? { required } : {}),
      };
      return withSchemaMetadata(schema, objectSchema, meta);
    }

    case z.ZodFirstPartyTypeKind.ZodString:
      return withSchemaMetadata(schema, { type: 'string' }, meta);

    case z.ZodFirstPartyTypeKind.ZodBoolean:
      return withSchemaMetadata(schema, { type: 'boolean' }, meta);

    case z.ZodFirstPartyTypeKind.ZodNumber: {
      const checks = Array.isArray(current._def.checks) ? current._def.checks : [];
      const isInteger = checks.some((check) => check.kind === 'int');
      return withSchemaMetadata(schema, { type: isInteger ? 'integer' : 'number' }, meta);
    }

    case z.ZodFirstPartyTypeKind.ZodArray:
      return withSchemaMetadata(schema, { type: 'array', items: zodToJsonSchema(current._def.type) }, meta);

    case z.ZodFirstPartyTypeKind.ZodEnum:
      return withSchemaMetadata(schema, { type: 'string', enum: [...current._def.values] }, meta);

    case z.ZodFirstPartyTypeKind.ZodLiteral: {
      const literal = current._def.value;
      const primitiveType = literal === null ? 'null' : typeof literal;
      return withSchemaMetadata(schema, { const: literal, ...(primitiveType !== 'object' ? { type: primitiveType } : {}) }, meta);
    }

    case z.ZodFirstPartyTypeKind.ZodRecord:
      return withSchemaMetadata(schema, { type: 'object', additionalProperties: zodToJsonSchema(current._def.valueType) }, meta);

    case z.ZodFirstPartyTypeKind.ZodUnion: {
      const enumSchema = unionToEnum(current._def.options);
      if (enumSchema) return withSchemaMetadata(schema, enumSchema, meta);
      return withSchemaMetadata(
        schema,
        { anyOf: current._def.options.map((option) => zodToJsonSchema(option)) },
        meta
      );
    }

    default:
      return withSchemaMetadata(schema, {}, meta);
  }
}

function buildMutationInputSchema(sectionType, sectionDataSchema) {
  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      slug: {
        type: 'string',
        description: 'Canonical page slug currently open in Studio.',
      },
      sectionId: {
        type: 'string',
        description: 'Concrete section instance id inside the current draft.',
      },
      scope: {
        type: 'string',
        enum: ['local', 'global'],
        default: 'local',
      },
      data: sectionDataSchema,
      itemPath: {
        type: 'array',
        description: 'Optional root-to-leaf selection path for targeted field mutation.',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            fieldKey: { type: 'string' },
            itemId: { type: 'string' },
          },
          required: ['fieldKey'],
        },
      },
      value: {
        description: 'Value written to the final field targeted by itemPath.',
      },
    },
    required: ['sectionId'],
    oneOf: [
      { required: ['data'] },
      { required: ['itemPath', 'value'] },
    ],
  };
}

function getSectionTypes(pageConfig) {
  return Array.from(
    new Set((Array.isArray(pageConfig?.sections) ? pageConfig.sections : []).map((section) => section?.type).filter(Boolean))
  );
}

function inferSectionLabel(section) {
  const data = section?.data && typeof section.data === 'object' ? section.data : {};
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim();
  if (typeof data.sectionTitle === 'string' && data.sectionTitle.trim()) return data.sectionTitle.trim();
  if (typeof data.label === 'string' && data.label.trim()) return data.label.trim();
  return section?.type ?? 'section';
}

function buildToolName(sectionType) {
  return `update-${String(sectionType)}`;
}

export function buildPageContractHref(slug) {
  return `/schemas/${slug}.schema.json`;
}

export function buildPageManifestHref(slug) {
  return `/mcp-manifests/${slug}.json`;
}

function getPageSections(pageConfig, siteConfig) {
  const pageSections = Array.isArray(pageConfig?.sections) ? pageConfig.sections : [];
  const site = siteConfig && typeof siteConfig === 'object' ? siteConfig : {};
  const globalSections = [];

  if (site.header && pageConfig?.['global-header'] !== false) {
    globalSections.push({ ...site.header, scope: 'global' });
  }
  if (site.footer) {
    globalSections.push({ ...site.footer, scope: 'global' });
  }

  return [
    ...globalSections,
    ...pageSections.map((section) => ({ ...section, scope: 'local' })),
  ];
}

export function buildPageContract({ slug, pageConfig, schemas, siteConfig }) {
  const pageMeta = pageConfig?.meta && typeof pageConfig.meta === 'object' ? pageConfig.meta : {};
  const title = typeof pageMeta.title === 'string' ? pageMeta.title : slug;
  const description = typeof pageMeta.description === 'string' ? pageMeta.description : '';
  const pageSections = getPageSections(pageConfig, siteConfig);
  const sectionTypes = Array.from(new Set(pageSections.map((section) => section?.type).filter(Boolean)));

  const sectionSchemas = Object.fromEntries(
    sectionTypes
      .filter((sectionType) => schemas?.[sectionType] != null)
      .map((sectionType) => [sectionType, zodToJsonSchema(schemas[sectionType])])
  );

  const sectionInstances = pageSections.map((section) => ({
    id: section.id,
    type: section.type,
    scope: section.scope === 'global' ? 'global' : 'local',
    label: inferSectionLabel(section),
  }));

  const tools = sectionTypes
    .filter((sectionType) => sectionSchemas[sectionType] != null)
    .map((sectionType) => ({
      name: buildToolName(sectionType),
      sectionType,
      description: `Update a ${sectionType} section in OlonJS Studio and persist immediately to file.`,
      inputSchema: buildMutationInputSchema(sectionType, sectionSchemas[sectionType]),
    }));

  return {
    version: '1.0.0',
    kind: 'olonjs-page-contract',
    slug,
    title,
    description,
    manifestHref: buildPageManifestHref(slug),
    systemPrompt: `You are operating the "${title}" page in OlonJS Studio. Use only the declared tools and keep mutations valid against the section schema.`,
    sectionTypes,
    sectionInstances,
    sectionSchemas,
    tools,
  };
}

export function buildPageManifest({ slug, pageConfig, schemas, siteConfig }) {
  const contract = buildPageContract({ slug, pageConfig, schemas, siteConfig });
  return {
    version: '1.0.0',
    kind: 'olonjs-page-mcp-manifest',
    generatedAt: new Date().toISOString(),
    slug,
    title: contract.title,
    description: contract.description,
    contractHref: buildPageContractHref(slug),
    transport: {
      kind: 'window-message',
      requestType: WEBMCP_TOOL_REQUEST_TYPE,
      resultType: WEBMCP_TOOL_RESULT_TYPE,
      target: 'window',
    },
    capabilities: {
      resources: [
        {
          uri: `olon://pages/${slug}`,
          name: `${contract.title} Data`,
          mimeType: 'application/json',
          description: `Structured content for the ${slug} page.`,
        },
      ],
    },
    sectionTypes: contract.sectionTypes,
    sectionInstances: contract.sectionInstances,
    tools: contract.tools.map(({ name, sectionType, description }) => ({
      name,
      sectionType,
      description,
    })),
  };
}

export function buildSiteManifest({ pages, schemas, siteConfig }) {
  const pageEntries = Object.entries(pages ?? {}).sort(([a], [b]) => a.localeCompare(b));

  return {
    version: '1.0.0',
    kind: 'olonjs-mcp-manifest-index',
    generatedAt: new Date().toISOString(),
    pages: pageEntries.map(([slug, pageConfig]) => {
      const pageManifest = buildPageManifest({ slug, pageConfig, schemas, siteConfig });
      return {
        slug,
        title: pageManifest.title,
        description: pageManifest.description,
        manifestHref: buildPageManifestHref(slug),
        contractHref: buildPageContractHref(slug),
        sectionTypes: pageManifest.sectionTypes,
      };
    }),
  };
}