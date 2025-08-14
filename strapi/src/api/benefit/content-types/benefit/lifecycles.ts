import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

async function getLocale(data) {
  let locale = data?.locale as string | undefined;
  if (!locale && strapi.plugin) {
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
          select: ['documentId', 'document_id'],
        });
        currentDocumentId = currentRecord?.documentId || currentRecord?.document_id;
        console.log('Fetched documentId for record id', where.id, ':', currentDocumentId);
      } catch (error) {
        console.log('Error fetching documentId:', error);
      }
    }
    console.log('Update operation - current documentId:', currentDocumentId);
    return currentDocumentId;
  }
  return data?.documentId;
}

async function checkDuplicateWithExclusion(title, locale, currentDocumentId) {
  const recordsWithSameTitle = await strapi.db.query('api::benefit.benefit').findMany({
    where: { 
      title,
      ...(locale ? { locale } : {}),
    },
    select: ['id', 'documentId', 'document_id', 'title', 'published_at'],
  });

  console.log('All records with same title:', JSON.stringify(recordsWithSameTitle, null, 2));

  const duplicateFromDifferentDocument = recordsWithSameTitle.find(record => {
    const recordDocumentId = record.documentId || record.document_id;
    return recordDocumentId && recordDocumentId !== currentDocumentId;
  });

  if (duplicateFromDifferentDocument) {
    console.log('Found duplicate from different document:', duplicateFromDifferentDocument);
    const message = `A benefit with the title "${title}" already exists. Please choose a different title.`;
    throw new ApplicationError(message, {
      title: 'Duplicate title',
    });
  } else {
    console.log('No duplicates from different documents found - allowing operation');
  }
}

async function checkBasicDuplicate(title, locale) {
  const existing = await strapi.db.query('api::benefit.benefit').findOne({
    where: {
      title,
      ...(locale ? { locale } : {}),
    },
    select: ['id', 'documentId', 'document_id', 'title'],
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

  const rawTitle = data?.title;
  if (!rawTitle || typeof rawTitle !== 'string') {
    return;
  }

  const title = rawTitle.trim();
  if (!title) {
    return;
  }

  const locale = await getLocale(data);

  const isPublishOperation = !isUpdate && data?.documentId;
  const needsExclusion = isUpdate || isPublishOperation;

  if (needsExclusion) {
    const currentDocumentId = await getCurrentDocumentId(data, where, isUpdate);
    if (currentDocumentId) {
      await checkDuplicateWithExclusion(title, locale, currentDocumentId);
      return;
    } else {
      console.log('WARNING: No documentId found for exclusion - falling back to basic check');
    }
  }

  if (!needsExclusion) {
    await checkBasicDuplicate(title, locale);
  }
}

export default {
  async beforeCreate(event) {
    await validateUniqueTitle(event, false);
  },

  async beforeUpdate(event) {
    await validateUniqueTitle(event, true);
  },
};
