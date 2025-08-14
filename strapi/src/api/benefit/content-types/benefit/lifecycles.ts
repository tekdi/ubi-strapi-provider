import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

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

  let locale = data?.locale as string | undefined;

  // If locale isn't provided in payload, attempt to use default locale
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

  // Determine if this is a publish operation or update that needs exclusion
  const isPublishOperation = !isUpdate && data?.documentId;
  const needsExclusion = isUpdate || isPublishOperation;

  if (needsExclusion) {
    let currentDocumentId = null;

    // Get the documentId of the current document being updated/published
    if (isUpdate) {
      currentDocumentId = data?.documentId || where?.documentId;
      
      // If still not found, fetch it from the current record
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
    } else if (isPublishOperation) {
      currentDocumentId = data.documentId;
      console.log('Publish operation - current documentId:', currentDocumentId);
    }

    if (currentDocumentId) {
      // Find all records with the same title
      const recordsWithSameTitle = await strapi.db.query('api::benefit.benefit').findMany({
        where: { 
          title,
          ...(locale ? { locale } : {}),
        },
        select: ['id', 'documentId', 'document_id', 'title', 'published_at'],
      });

      console.log('All records with same title:', JSON.stringify(recordsWithSameTitle, null, 2));

      // Check if any of these records have a different documentId
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
        return; // No duplicates from different documents
      }
    } else {
      console.log('WARNING: No documentId found for exclusion - falling back to basic check');
      // Fall back to basic duplicate check without exclusion
    }
  }

  // Basic duplicate check for create operations (no exclusion needed)
  if (!needsExclusion) {
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
}

export default {
  async beforeCreate(event) {
    await validateUniqueTitle(event, false);
  },

  async beforeUpdate(event) {
    await validateUniqueTitle(event, true);
  },
};
