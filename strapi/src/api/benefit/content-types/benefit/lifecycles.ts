import { errors } from '@strapi/utils';

const { ApplicationError } = errors;

export default {
  async beforeCreate(event) {
    const { data } = event.params;

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
        title: 'Duplicate title'
      });
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    const rawTitle = data?.title;
    if (!rawTitle || typeof rawTitle !== 'string') {
      return;
    }

    const title = rawTitle.trim();
    if (!title) {
      return;
    }

    const id = (where?.id ?? data?.id) as string | number | undefined;

    let locale = data?.locale as string | undefined;
    if (!locale && id) {
      const current = await strapi.db.query('api::benefit.benefit').findOne({
        where: { id },
        select: ['locale'],
      });
      locale = current?.locale;
    }

    const existing = await strapi.db.query('api::benefit.benefit').findOne({
      where: {
        title,
        ...(locale ? { locale } : {}),
        ...(id ? { id: { $ne: id } } : {}),
      },
      select: ['id'],
    });

    if (existing) {
      const message = `A benefit with the title "${title}" already exists. Please choose a different title.`;
      throw new ApplicationError(message, {
        title: 'Duplicate title'
      });
    }
  },
};
