const { z } = require("zod");

const BookSchema = z.object({
  title: z.string().min(1),

  productUrl: z.string().url(),

  price: z.number().finite().nonnegative(),

  availability: z.string().min(1),

  rating: z
    .number()
    .int()
    .min(1)
    .max(5),

  description: z.string().min(1),

  sourceCataloguePage: z.string().url(),
});

const BooksSchema = z.array(BookSchema);

module.exports = {
  BookSchema,
  BooksSchema,
};