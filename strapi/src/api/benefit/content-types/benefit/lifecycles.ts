import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

async function getLocale(data, isUpdate = false) {
  let locale = data?.locale as string | undefined;
  // If locale isn't provided in payload (and not resolved from DB during updates), attempt to use default locale
  if (!locale && !isUpdate && strapi.plugin) {
    try {
      const i18nLocalesService = strapi.plugin('i18n')?.service('locales');
      if (i18nLocalesService?.getDefaultLocale) {
        locale = await i18nLocalesService.getDefaultLocale();
      }
    } catch {
      // Ignore if i18n is not available
    }
  }
  return locale;
}

async function getCurrentDocumentId(data, where, isUpdate) {
  if (isUpdate) {
    let currentDocumentId = data?.documentId || where?.documentId;
    if (!currentDocumentId && where?.id) {
      try {
        const currentRecord = await strapi.db.query('api::benefit.benefit').findOne({
          where: { id: where.id },
          select: ['documentId', 'locale'],
        });

        currentDocumentId = currentRecord?.documentId;
        if (!data?.locale && currentRecord?.locale) {
          data.locale = currentRecord.locale;
        }
        strapi.log.debug(`Fetched documentId for record id ${where.id}: ${currentDocumentId}`);
      } catch (error) {
        strapi.log.warn('Error fetching documentId', error);
      }
    }
    strapi.log.debug(`Update operation - current documentId: ${currentDocumentId}`);
    return currentDocumentId;
  }
  return data?.documentId;
}

async function checkDuplicateWithExclusion(title, locale, currentDocumentId) {
  const existing = await strapi.db.query('api::benefit.benefit').findOne({
    where: {
      title,
      ...(locale ? { locale } : {}),
      ...(currentDocumentId != null ? { documentId: { $ne: currentDocumentId } } : {}),
    },
    select: ['id'],
  });

  if (existing) {
    const message = `A benefit with the title "${title}" already exists. Please choose a different title.`;
    throw new ApplicationError(message, { title: 'Duplicate title' });
  }
}

async function checkBasicDuplicate(title, locale) {
  const existing = await strapi.db.query('api::benefit.benefit').findOne({
    where: {
      title,
      ...(locale ? { locale } : {}),
    },
    select: ['id'],
  });

  if (existing) {
    const message = `A benefit with the title "${title}" already exists. Please choose a different title.`;
    throw new ApplicationError(message, {
      title: 'Duplicate title',
    });
  }
}

async function validateUniqueTitle(event, isUpdate = false) {
  const { data, where } = event.params;

  // Resolve title from payload or DB (for update/publish when title isn't sent)
  let title: string | undefined =
    typeof data?.title === 'string' ? data.title.trim() : undefined;
  if (!title && (isUpdate || data?.documentId) && where?.id) {
    const record = await strapi.db.query('api::benefit.benefit').findOne({
      where: { id: where.id },
      select: ['title', 'locale'],
    });
    title = record?.title?.trim();
    // Hydrate locale from DB so locale-scoped duplicate checks are accurate
    if (!data?.locale && record?.locale) {
      data.locale = record.locale;
    }
  }
  if (!title) {
    return;
  }

  const locale = await getLocale(data, isUpdate);

  const isPublishOperation = !isUpdate && data?.documentId;
  const needsExclusion = isUpdate || isPublishOperation;

  if (needsExclusion) {
    const currentDocumentId = await getCurrentDocumentId(data, where, isUpdate);
    if (currentDocumentId) {
      await checkDuplicateWithExclusion(title, locale, currentDocumentId);
      return;
    } else {
      strapi.log.warn('WARNING: No documentId found for exclusion - falling back to basic check');
    }
  }

  await checkBasicDuplicate(title, locale);
}

export default {
  async beforeCreate(event) {
    await validateUniqueTitle(event, false);
  },

  async beforeUpdate(event) {
    await validateUniqueTitle(event, true);
  },
};
