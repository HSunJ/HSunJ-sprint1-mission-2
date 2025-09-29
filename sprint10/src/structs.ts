import * as s from 'superstruct';

const Tags = [
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
  'HOUSEHOLD_SUPPLIES',
  'KITCHENWARE'
]
export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 60),
  description: s.optional(s.string()),
  tag: s.optional(s.enums(Tags)),
  price: s.min(s.number(), 0)
});

export const PatchProduct = s.partial(CreateProduct);

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, 60),
  content: s.string(),
});

export const PatchArticle = s.partial(CreateArticle);