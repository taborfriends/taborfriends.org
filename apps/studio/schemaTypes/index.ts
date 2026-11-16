import { defineArrayMember, defineField, defineType } from 'sanity';
import { page } from './page';

const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
    }),
    defineField({
      name: 'description',
      type: 'string',
      title: 'Description',
      description:
        'Used for page action links only. Not used for site navigation.',
    }),
    defineField({
      name: 'link',
      type: 'array',
      validation: (rule) => rule.max(1).required(),
      of: [
        defineArrayMember({
          name: 'internalLink',
          type: 'object',
          title: 'Internal Link',
          fields: [
            defineField({
              name: 'internalReference',
              type: 'reference',
              to: [{ type: 'page' }],
            }),
          ],
          preview: {
            select: {
              title: 'internalReference.title',
              slug: 'internalReference.slug.current',
            },
            prepare({ title, slug }) {
              return {
                title,
                subtitle: `/${slug}`,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'externalLink',
          type: 'object',
          title: 'External Link',
          fields: [defineField({ name: 'url', type: 'url' })],
        }),
      ],
    }),
    defineField({
      name: 'openInNewTab',
      type: 'boolean',
      title: 'Open In New Tab',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      linkType: 'link.0._type',
      slug: 'link.0.internalReference.slug.current',
      url: 'link.0.url',
      openInNewTab: 'openInNewTab',
    },
    prepare({ title, linkType, slug, url, openInNewTab }) {
      return {
        title: title + (openInNewTab ? ' (opens in new tab)' : ''),
        subtitle:
          linkType === 'internalLink'
            ? 'Internal: /' + slug
            : 'External: ' + url,
      };
    },
  },
});

const navbar = defineType({
  name: 'navbar',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nav Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Navigation Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'navItem',
        }),
      ],
    }),
  ],
});

export const schemaTypes = [navItem, navbar, page];
