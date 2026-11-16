import { defineCollection } from 'astro/content/runtime';
import { sanityLoader } from '@arraypress/sanity-loader-astro';

const navbar = defineCollection({
  loader: sanityLoader({
    type: 'navbar',
    query: `
      *[_type=="navbar" && title=="Site Navigation"] {
        _id,
        items[] {
          label,
          "link": link[0] {
            _type == 'externalLink' => {
              url
            },
            _type == 'internalLink' => {
              "url": "/" + internalReference->slug.current
            }
          }.url,
          openInNewTab
        }
      }

    `,
  }),
});

const page = defineCollection({
  loader: sanityLoader({
    type: 'page',
    query: `
      *[_type == $type && !(_id in path('drafts.**'))] {
        title,
        slug,
        body,
        "image": image.asset->{
          url,
          "dimensions": metadata.dimensions { aspectRatio, width, height },
        },
        actionLinks[] {
          label,
          description,
          "link": link[0] {
            _type == 'externalLink' => {
              url
            },
            _type == 'internalLink' => {
              "url": "/" + internalReference->slug.current
            }
          }.url,
          openInNewTab
        }
      }
    `,
  }),
});

export const collections = { navbar, page };
